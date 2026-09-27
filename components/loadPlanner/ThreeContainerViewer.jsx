"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeContainerViewer({
  container,
  packedItems = [],
  centerOfGravity = { x: 0.5, y: 0.1, z: 0.5 },
  visibleStep = packedItems.length,
  showWireframeOnly = false,
  showCoG = true,
  onHoverItem = () => {},
  selectedItemId = null,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const itemsGroupRef = useRef(null);
  const containerGroupRef = useRef(null);
  const cogMeshRef = useRef(null);
  const reqIdRef = useRef(null);

  // Mouse / Orbit controls state
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({
    radius: 12000,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  const [hoveredBox, setHoveredBox] = useState(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const containerEl = mountRef.current;
    if (!containerEl) return;

    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1120"); // Sleek dark slate
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 100, 100000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerEl.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5000, 10000, 7500);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90cdf4, 1.0);
    dirLight2.position.set(-5000, 6000, -7500);
    scene.add(dirLight2);

    const floorLight = new THREE.DirectionalLight(0xffedd5, 0.6);
    floorLight.position.set(0, -3000, 0);
    scene.add(floorLight);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(25000, 50, 0x334155, 0x1e293b);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Groups
    const containerGroup = new THREE.Group();
    scene.add(containerGroup);
    containerGroupRef.current = containerGroup;

    const itemsGroup = new THREE.Group();
    scene.add(itemsGroup);
    itemsGroupRef.current = itemsGroup;

    // CoG Marker
    const cogGeo = new THREE.SphereGeometry(140, 16, 16);
    const cogMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xff0000,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const cogMesh = new THREE.Mesh(cogGeo, cogMat);
    cogMesh.visible = showCoG;
    scene.add(cogMesh);
    cogMeshRef.current = cogMesh;

    // Orbit Camera Update Helper
    const updateCamera = () => {
      const { radius, theta, phi } = sphericalRef.current;
      const x =
        targetRef.current.x +
        radius * Math.sin(phi) * Math.sin(theta);
      const y = targetRef.current.y + radius * Math.cos(phi);
      const z =
        targetRef.current.z +
        radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(x, y, z);
      camera.lookAt(targetRef.current);
    };

    updateCamera();

    // Mouse / Touch Handlers
    const handleMouseDown = (e) => {
      if (e.button === 2 || e.shiftKey) {
        isPanningRef.current = true;
      } else {
        isDraggingRef.current = true;
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseNorm = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      // Raycast for hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseNorm, camera);
      if (itemsGroupRef.current) {
        const intersects = raycaster.intersectObjects(
          itemsGroupRef.current.children,
          true
        );
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.item) {
            setHoveredBox(hit.userData.item);
            onHoverItem(hit.userData.item);
          }
        } else {
          setHoveredBox(null);
          onHoverItem(null);
        }
      }

      if (!isDraggingRef.current && !isPanningRef.current) return;

      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      if (isDraggingRef.current) {
        sphericalRef.current.theta -= deltaX * 0.008;
        sphericalRef.current.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.008)
        );
      } else if (isPanningRef.current) {
        const panSpeed = sphericalRef.current.radius * 0.0008;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

        targetRef.current.addScaledVector(right, -deltaX * panSpeed);
        targetRef.current.y += deltaY * panSpeed;
      }

      updateCamera();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 5;
      sphericalRef.current.radius = Math.max(
        3000,
        Math.min(35000, sphericalRef.current.radius + zoomFactor)
      );
      updateCamera();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    domEl.addEventListener("wheel", handleWheel, { passive: false });
    domEl.addEventListener("contextmenu", (e) => e.preventDefault());

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerEl || !rendererRef.current || !cameraRef.current) return;
      const newW = containerEl.clientWidth;
      const newH = containerEl.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    });
    resizeObserver.observe(containerEl);

    // Animation Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      domEl.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domEl.removeEventListener("wheel", handleWheel);
      if (rendererRef.current && domEl) {
        domEl.remove();
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Container Geometry & Truck Structure
  useEffect(() => {
    if (!container || !containerGroupRef.current) return;
    const group = containerGroupRef.current;

    // Clear old meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    const { width: W, height: H, length: L } = container;

    // Center origin is at container center
    // Container dimensions: X = Width, Y = Height, Z = Length
    const boxGeo = new THREE.BoxGeometry(W, H, L);
    const wireframeGeo = new THREE.EdgesGeometry(boxGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframe.position.set(0, H / 2, 0);
    group.add(wireframe);

    // Transparent walls
    if (!showWireframeOnly) {
      const wallMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.18,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.BackSide,
      });
      const walls = new THREE.Mesh(boxGeo, wallMat);
      walls.position.set(0, H / 2, 0);
      group.add(walls);
    }

    // Floor Platform (Truck Bed)
    const floorGeo = new THREE.BoxGeometry(W + 60, 40, L + 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -20, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Truck Cabin Silhouette at the Front (-Z direction)
    const cabinLength = Math.min(2200, L * 0.35);
    const cabinHeight = Math.min(H * 1.1, 2600);
    const cabinWidth = W * 0.95;
    const cabinGeo = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinLength);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Mahaveer primary blue
      metalness: 0.5,
      roughness: 0.3,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, cabinHeight / 2 - 20, -(L / 2 + cabinLength / 2 + 80));
    group.add(cabin);

    // Truck Windshield
    const glassGeo = new THREE.BoxGeometry(cabinWidth * 0.85, cabinHeight * 0.35, 20);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(
      0,
      cabinHeight * 0.65,
      -(L / 2 + cabinLength + 70)
    );
    group.add(glass);

    // Adjust camera distance to fit container
    const maxDim = Math.max(W, H, L);
    sphericalRef.current.radius = maxDim * 1.8;
    targetRef.current.set(0, H / 2, 0);
  }, [container, showWireframeOnly]);

  // Render Cargo Items
  useEffect(() => {
    if (!itemsGroupRef.current || !container) return;
    const group = itemsGroupRef.current;

    // Clear old cargo meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    const { width: cW, length: cL } = container;

    packedItems.forEach((item) => {
      // Step filter for loading simulation
      if (item.order > visibleStep) return;

      const isSelected = selectedItemId === item.id;
      const isHovered = hoveredBox?.id === item.id;

      // Dimensions
      const boxGeo = new THREE.BoxGeometry(item.dx, item.dy, item.dz);

      // Material
      const color = item.color || "#3b82f6";
      const boxMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xfacc15 : isHovered ? 0x67e8f9 : new THREE.Color(color),
        roughness: 0.4,
        metalness: 0.2,
      });

      const boxMesh = new THREE.Mesh(boxGeo, boxMat);

      // Coordinates mapping:
      // Three.js origin is at center of container (X: -cW/2 .. +cW/2, Y: 0 .. H, Z: -cL/2 .. +cL/2)
      // item.x is 0..cW, item.y is 0..cH, item.z is 0..cL
      const posX = item.x + item.dx / 2 - cW / 2;
      const posY = item.y + item.dy / 2;
      const posZ = item.z + item.dz / 2 - cL / 2;

      boxMesh.position.set(posX, posY, posZ);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      boxMesh.userData = { item };

      // Dark borders for clarity
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffffff : 0x0f172a,
        linewidth: 1.5,
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      boxMesh.add(edges);

      group.add(boxMesh);
    });

    // Update CoG Marker position
    if (cogMeshRef.current && container) {
      cogMeshRef.current.visible = showCoG && packedItems.length > 0;
      if (cogMeshRef.current.visible) {
        const posX = centerOfGravity.x * container.width - container.width / 2;
        const posY = centerOfGravity.y * container.height;
        const posZ = centerOfGravity.z * container.length - container.length / 2;
        cogMeshRef.current.position.set(posX, Math.max(100, posY), posZ);
      }
    }
  }, [
    packedItems,
    container,
    visibleStep,
    selectedItemId,
    hoveredBox,
    centerOfGravity,
    showCoG,
  ]);

  const resetCamera = () => {
    if (!container) return;
    sphericalRef.current = {
      radius: Math.max(container.width, container.length, container.height) * 1.8,
      theta: Math.PI / 4,
      phi: Math.PI / 3.2,
    };
    targetRef.current.set(0, container.height / 2, 0);
  };

  const setTopView = () => {
    if (!container) return;
    sphericalRef.current = {
      radius: Math.max(container.width, container.length) * 1.6,
      theta: 0,
      phi: 0.05,
    };
    targetRef.current.set(0, 0, 0);
  };

  const setSideView = () => {
    if (!container) return;
    sphericalRef.current = {
      radius: container.length * 1.6,
      theta: Math.PI / 2,
      phi: Math.PI / 2.2,
    };
    targetRef.current.set(0, container.height / 2, 0);
  };

  const setRearView = () => {
    if (!container) return;
    sphericalRef.current = {
      radius: container.width * 2.5,
      theta: 0,
      phi: Math.PI / 2.2,
    };
    targetRef.current.set(0, container.height / 2, 0);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "520px" }}>
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "520px",
          borderRadius: "14px",
          overflow: "hidden",
          cursor: "grab",
        }}
      />

      {/* Floating 3D Camera Controls */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <button
          onClick={resetCamera}
          title="Isometric Reset"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#e2e8f0",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🎯</span> Isometric
        </button>
        <button
          onClick={setTopView}
          title="Top Down Floor View"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#e2e8f0",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Top View
        </button>
        <button
          onClick={setSideView}
          title="Side Profile"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#e2e8f0",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Side View
        </button>
        <button
          onClick={setRearView}
          title="Rear Door View"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#e2e8f0",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Rear Door
        </button>
      </div>

      {/* Floating Info Overlay for Hovered Cargo Box */}
      {hoveredBox && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid #38bdf8",
            borderRadius: "10px",
            padding: "10px 14px",
            color: "#fff",
            fontSize: "13px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
            zIndex: 10,
            maxWidth: "280px",
          }}
        >
          <div style={{ fontWeight: 700, color: "#38bdf8", marginBottom: "4px" }}>
            #{hoveredBox.order} {hoveredBox.name}
          </div>
          <div>
            Size: {hoveredBox.dx} × {hoveredBox.dy} × {hoveredBox.dz} mm
          </div>
          <div>Weight: {hoveredBox.weight} kg</div>
          <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px" }}>
            Floor Pos: X={hoveredBox.x}mm, Y={hoveredBox.y}mm, Z={hoveredBox.z}mm
          </div>
        </div>
      )}

      {/* Legend & Instructions */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "11px",
          color: "#94a3b8",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span>🖱️ Drag to Rotate</span>
        <span>•</span>
        <span>Scroll to Zoom</span>
        <span>•</span>
        <span>Shift+Drag to Pan</span>
      </div>
    </div>
  );
}
