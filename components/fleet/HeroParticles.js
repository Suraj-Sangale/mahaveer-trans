"use client";
import { useEffect, useRef } from "react";
import styles from "@/styles/fleet.module.css";

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const W = () => parent.clientWidth;
    const H = () => parent.clientHeight;
    canvas.width = W();
    canvas.height = H();

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vsrc = `
      attribute vec3 pos;
      attribute float size;
      attribute float opacity;
      uniform mat4 proj;
      uniform mat4 view;
      varying float vOpacity;
      void main(){
        vOpacity = opacity;
        vec4 mvPos = view * vec4(pos,1.0);
        gl_PointSize = size * (300.0 / -mvPos.z);
        gl_Position = proj * mvPos;
      }`;
    const fsrc = `
      precision mediump float;
      varying float vOpacity;
      void main(){
        float d = length(gl_PointCoord - vec2(.5));
        if(d > .5) discard;
        gl_FragColor = vec4(0.054,0.647,0.914, vOpacity*(1.0-d*1.6));
      }`;

    function compileShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const N = 1200;
    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const opacities = new Float32Array(N);
    const speeds = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
      sizes[i] = Math.random() * 2.5 + 0.5;
      opacities[i] = Math.random() * 0.6 + 0.1;
      speeds[i] = Math.random() * 0.015 + 0.004;
    }

    const posLoc = gl.getAttribLocation(prog, "pos");
    const sizeLoc = gl.getAttribLocation(prog, "size");
    const opLoc = gl.getAttribLocation(prog, "opacity");
    const projLoc = gl.getUniformLocation(prog, "proj");
    const viewLoc = gl.getUniformLocation(prog, "view");

    const posBuf = gl.createBuffer();
    const szBuf = gl.createBuffer();
    const opBuf = gl.createBuffer();

    function mat4Persp(fov, asp, near, far) {
      const f = 1 / Math.tan(fov / 2),
        r = 1 / (near - far);
      return new Float32Array([
        f / asp,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (near + far) * r,
        -1,
        0,
        0,
        near * far * r * 2,
        0,
      ]);
    }
    function mat4Id() {
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    let raf;
    function frame() {
      canvas.width = W();
      canvas.height = H();
      gl.viewport(0, 0, W(), H());
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      for (let i = 0; i < N; i++) {
        positions[i * 3 + 2] += speeds[i];
        if (positions[i * 3 + 2] > 20) positions[i * 3 + 2] = -60;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, szBuf);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, opBuf);
      gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(opLoc);
      gl.vertexAttribPointer(opLoc, 1, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(
        projLoc,
        false,
        mat4Persp(Math.PI / 3, W() / H(), 0.1, 200),
      );
      gl.uniformMatrix4fv(viewLoc, false, mat4Id());
      gl.drawArrays(gl.POINTS, 0, N);
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
