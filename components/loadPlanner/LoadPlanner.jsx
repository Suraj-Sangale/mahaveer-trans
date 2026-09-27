"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "@/styles/loadPlanner.module.css";
import {
  FLEET_CONTAINERS,
  PRESET_CARGO_ITEMS,
  packCargoInContainer,
} from "../../utilities/binPacker3D";

// Dynamically import Three.js viewer with SSR disabled
const ThreeContainerViewer = dynamic(
  () => import("./ThreeContainerViewer"),
  { ssr: false, loading: () => (
    <div style={{ height: "560px", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", background: "#0b1120" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🚛 📦</div>
        <div>Initializing 3D WebGL Load Engine...</div>
      </div>
    </div>
  )}
);

export default function LoadPlanner() {
  const [selectedContainerId, setSelectedContainerId] = useState("eicher-14ft");
  const [customContainer, setCustomContainer] = useState({
    id: "custom-truck",
    name: "Custom Container",
    category: "Custom",
    length: 6000,
    width: 2400,
    height: 2400,
    maxWeight: 10000,
    description: "Custom user-defined vehicle specifications",
  });

  const [cargoList, setCargoList] = useState([
    {
      id: "cargo-1",
      name: "Standard Indian Pallet (Loaded)",
      length: 1200,
      width: 1000,
      height: 1200,
      weight: 350,
      quantity: 4,
      color: "#3b82f6",
      allowRotation: false,
      isFragile: false,
      stackable: true,
    },
    {
      id: "cargo-2",
      name: "Master FMCG Cartons",
      length: 600,
      width: 400,
      height: 400,
      weight: 20,
      quantity: 16,
      color: "#f59e0b",
      allowRotation: true,
      isFragile: false,
      stackable: true,
    },
    {
      id: "cargo-3",
      name: "Fragile Electronics",
      length: 500,
      width: 350,
      height: 300,
      weight: 12,
      quantity: 6,
      color: "#ef4444",
      allowRotation: false,
      isFragile: true,
      stackable: false,
    },
  ]);

  // Visualizer settings
  const [visibleStep, setVisibleStep] = useState(1000);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [showWireframeOnly, setShowWireframeOnly] = useState(false);
  const [showCoG, setShowCoG] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // AI Insights State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Selected container object
  const activeContainer = useMemo(() => {
    if (selectedContainerId === "custom-truck") return customContainer;
    return FLEET_CONTAINERS.find((c) => c.id === selectedContainerId) || FLEET_CONTAINERS[1];
  }, [selectedContainerId, customContainer]);

  // Run Bin Packing Heuristic Engine
  const packingResult = useMemo(() => {
    return packCargoInContainer(activeContainer, cargoList);
  }, [activeContainer, cargoList]);

  // Keep visibleStep aligned
  useEffect(() => {
    setVisibleStep(packingResult.packedItems.length);
  }, [packingResult.packedItems.length]);

  // Auto-play animation for loading sequence
  useEffect(() => {
    let interval;
    if (isPlayingSequence) {
      interval = setInterval(() => {
        setVisibleStep((prev) => {
          if (prev >= packingResult.packedItems.length) {
            setIsPlayingSequence(false);
            return packingResult.packedItems.length;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlayingSequence, packingResult.packedItems.length]);

  // Fetch AI Logistics Insights
  const fetchAiInsights = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/load-planner/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          container: activeContainer,
          stats: packingResult,
          packedItems: packingResult.packedItems,
          unpackedItems: packingResult.unpackedItems,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Failed to fetch AI load insights", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Run AI analysis when container or cargo changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiInsights();
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedContainerId, cargoList.length]);

  // Cargo List Handlers
  const handleAddCargo = () => {
    const newId = `cargo-${Date.now()}`;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
    const randomColor = colors[cargoList.length % colors.length];

    setCargoList([
      ...cargoList,
      {
        id: newId,
        name: `Cargo Box #${cargoList.length + 1}`,
        length: 800,
        width: 600,
        height: 500,
        weight: 30,
        quantity: 5,
        color: randomColor,
        allowRotation: true,
        isFragile: false,
        stackable: true,
      },
    ]);
  };

  const handleApplyPreset = (preset) => {
    const newId = `cargo-${Date.now()}`;
    setCargoList([
      ...cargoList,
      {
        id: newId,
        ...preset,
        quantity: 4,
      },
    ]);
  };

  const handleUpdateCargo = (id, field, value) => {
    setCargoList(
      cargoList.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteCargo = (id) => {
    setCargoList(cargoList.filter((c) => c.id !== id));
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.aiBadge}>
          <span>⚡ AI Intelligent Logistics</span>
          <span>•</span>
          <span>3D Packing Engine</span>
        </div>
        <h1 className={styles.mainTitle}>3D Cargo & Fleet Load Planner</h1>
        <p className={styles.subtitle}>
          Optimize volumetric truck space, eliminate axle weight imbalances, and simulate 3D container packing sequences before dispatch.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.mainGrid}>
        {/* Left Controls Column */}
        <div className={styles.controlsPanel}>
          {/* Vehicle Selection Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>1. Select Fleet Vehicle</span>
              <span style={{ fontSize: "12px", color: "#0284c7" }}>
                {activeContainer.category}
              </span>
            </div>

            <div className={styles.vehicleGrid}>
              {FLEET_CONTAINERS.map((v) => (
                <div
                  key={v.id}
                  className={`${styles.vehicleOption} ${
                    selectedContainerId === v.id ? styles.vehicleActive : ""
                  }`}
                  onClick={() => setSelectedContainerId(v.id)}
                >
                  {v.badge && <span className={styles.vehicleBadge}>{v.badge}</span>}
                  <div className={styles.vehicleName}>{v.name}</div>
                  <div className={styles.vehicleSpecs}>
                    {(v.length / 1000).toFixed(1)}m × {(v.width / 1000).toFixed(1)}m × {(v.height / 1000).toFixed(1)}m
                    <br />
                    Max: {(v.maxWeight / 1000).toFixed(1)} MT
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 0 0" }}>
              💡 {activeContainer.description}
            </p>
          </div>

          {/* Cargo Input List Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>2. Cargo & Consignment Items</span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {cargoList.length} Item Types
              </span>
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Quick Presets:
              </span>
              <div className={styles.presetBar} style={{ marginTop: "6px" }}>
                {PRESET_CARGO_ITEMS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => handleApplyPreset(p)}
                  >
                    + {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo Items List */}
            <div className={styles.cargoList}>
              {cargoList.map((item, idx) => (
                <div key={item.id} className={styles.cargoItemCard}>
                  <div className={styles.cargoItemHeader}>
                    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => handleUpdateCargo(item.id, "color", e.target.value)}
                        style={{ width: "22px", height: "22px", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" }}
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateCargo(item.id, "name", e.target.value)}
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          border: "none",
                          background: "transparent",
                          color: "inherit",
                          width: "80%",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCargo(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>

                  <div className={styles.cargoInputsGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>L (mm)</label>
                      <input
                        type="number"
                        className={styles.numInput}
                        value={item.length}
                        onChange={(e) => handleUpdateCargo(item.id, "length", Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>W (mm)</label>
                      <input
                        type="number"
                        className={styles.numInput}
                        value={item.width}
                        onChange={(e) => handleUpdateCargo(item.id, "width", Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>H (mm)</label>
                      <input
                        type="number"
                        className={styles.numInput}
                        value={item.height}
                        onChange={(e) => handleUpdateCargo(item.id, "height", Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Wt (kg)</label>
                      <input
                        type="number"
                        className={styles.numInput}
                        value={item.weight}
                        onChange={(e) => handleUpdateCargo(item.id, "weight", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <label className={styles.inputLabel}>Qty:</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        className={styles.numInput}
                        style={{ width: "60px", padding: "4px 6px" }}
                        value={item.quantity}
                        onChange={(e) => handleUpdateCargo(item.id, "quantity", Math.max(1, Number(e.target.value)))}
                      />
                    </div>

                    <div className={styles.checkboxRow}>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={item.allowRotation}
                          onChange={(e) => handleUpdateCargo(item.id, "allowRotation", e.target.checked)}
                        />
                        Rotate
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={item.isFragile}
                          onChange={(e) => handleUpdateCargo(item.id, "isFragile", e.target.checked)}
                        />
                        Fragile
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className={styles.addCargoBtn} onClick={handleAddCargo}>
              <span>+ Add Another Cargo Type</span>
            </button>
          </div>
        </div>

        {/* Right 3D Visualizer & AI Metrics Column */}
        <div className={styles.viewerStage}>
          {/* Real-time KPI Cards */}
          <div className={styles.kpiBar}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiTitle}>
                <span>Volume Space Used</span>
                <span>📦</span>
              </div>
              <div className={styles.kpiValue} style={{ color: packingResult.volumeEfficiencyPercent > 85 ? "#10b981" : "#0284c7" }}>
                {packingResult.volumeEfficiencyPercent}%
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {packingResult.totalVolumeUsedM3} m³ of {packingResult.containerVolumeM3} m³
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min(100, packingResult.volumeEfficiencyPercent)}%`,
                    backgroundColor: packingResult.volumeEfficiencyPercent > 85 ? "#10b981" : "#0284c7",
                  }}
                />
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTitle}>
                <span>Payload Weight</span>
                <span>⚖️</span>
              </div>
              <div
                className={styles.kpiValue}
                style={{
                  color: packingResult.weightCapacityPercent > 95 ? "#ef4444" : packingResult.weightCapacityPercent > 75 ? "#f59e0b" : "#0284c7",
                }}
              >
                {packingResult.weightCapacityPercent}%
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {packingResult.totalWeightKg.toLocaleString()} kg / {activeContainer.maxWeight.toLocaleString()} kg
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min(100, packingResult.weightCapacityPercent)}%`,
                    backgroundColor: packingResult.weightCapacityPercent > 95 ? "#ef4444" : "#0284c7",
                  }}
                />
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTitle}>
                <span>Center of Gravity Score</span>
                <span>🎯</span>
              </div>
              <div className={styles.kpiValue} style={{ color: packingResult.balanceScore >= 80 ? "#10b981" : "#f59e0b" }}>
                {packingResult.balanceScore}/100
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Axle: Front {packingResult.weightDistribution.frontAxlePercent}% | Rear {packingResult.weightDistribution.rearAxlePercent}%
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${packingResult.balanceScore}%`,
                    backgroundColor: packingResult.balanceScore >= 80 ? "#10b981" : "#f59e0b",
                  }}
                />
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTitle}>
                <span>Loaded Boxes</span>
                <span>🚛</span>
              </div>
              <div className={styles.kpiValue} style={{ color: packingResult.packedCargoCount === packingResult.totalCargoCount ? "#10b981" : "#ef4444" }}>
                {packingResult.packedCargoCount} / {packingResult.totalCargoCount}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {packingResult.unpackedItems.length > 0 ? (
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>
                    ⚠️ {packingResult.totalCargoCount - packingResult.packedCargoCount} item(s) exceeded capacity
                  </span>
                ) : (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>100% consignment fit</span>
                )}
              </div>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div className={styles.visualizerWrapper}>
            <ThreeContainerViewer
              container={activeContainer}
              packedItems={packingResult.packedItems}
              centerOfGravity={packingResult.centerOfGravity}
              visibleStep={visibleStep}
              showWireframeOnly={showWireframeOnly}
              showCoG={showCoG}
              selectedItemId={selectedItemId}
            />
          </div>

          {/* Step-by-Step Loading Sequence Control Bar */}
          <div className={styles.stepControls}>
            <button
              type="button"
              onClick={() => {
                if (visibleStep >= packingResult.packedItems.length) {
                  setVisibleStep(0);
                }
                setIsPlayingSequence(!isPlayingSequence);
              }}
              style={{
                background: isPlayingSequence ? "#ef4444" : "#0284c7",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{isPlayingSequence ? "⏸ Pause" : "▶ Play Sequence"}</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, color: "#e2e8f0", fontSize: "13px" }}>
              <span>Loading Step:</span>
              <input
                type="range"
                min="0"
                max={packingResult.packedItems.length}
                value={visibleStep}
                onChange={(e) => {
                  setIsPlayingSequence(false);
                  setVisibleStep(Number(e.target.value));
                }}
                className={styles.stepSlider}
              />
              <span style={{ fontWeight: 700, color: "#38bdf8", minWidth: "45px" }}>
                {visibleStep} / {packingResult.packedItems.length}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", color: "#94a3b8", fontSize: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showCoG}
                  onChange={(e) => setShowCoG(e.target.checked)}
                />
                CoG Marker
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showWireframeOnly}
                  onChange={(e) => setShowWireframeOnly(e.target.checked)}
                />
                X-Ray Wireframe
              </label>
            </div>
          </div>

          {/* AI Logistics Safety & Axle Analysis */}
          <div className={styles.aiInsightsBox}>
            <div className={styles.aiHeader}>
              <span>🤖 AI Dispatch & Safety Intelligence</span>
              {isLoadingAi && (
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                  (Analyzing load stability...)
                </span>
              )}
            </div>

            {aiAnalysis && (
              <div className={styles.aiGrid}>
                <div className={styles.aiInsightCard}>
                  <div className={styles.insightLabel}>Axle Weight Balance</div>
                  <div>{aiAnalysis.axleAdvice}</div>
                </div>

                <div className={styles.aiInsightCard}>
                  <div className={styles.insightLabel}>Lateral Stability & Roll-over Risk</div>
                  <div>{aiAnalysis.lateralAdvice}</div>
                </div>

                <div className={styles.aiInsightCard}>
                  <div className={styles.insightLabel}>Optimal Fleet Recommendation</div>
                  <div>{aiAnalysis.recommendedTruck}</div>
                </div>

                <div className={styles.aiInsightCard}>
                  <div className={styles.insightLabel}>Dockworker Loading Tips</div>
                  <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0" }}>
                    {aiAnalysis.loadingTips?.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: "2px" }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className={styles.actionRow}>
            <Link
              href={{
                pathname: "/quote",
                query: {
                  truck: activeContainer.name,
                  weight: packingResult.totalWeightKg,
                  volume: packingResult.totalVolumeUsedM3,
                  boxes: packingResult.packedCargoCount,
                },
              }}
              className={styles.btnPrimary}
            >
              <span>🚚 Book & Get Instant Freight Quote For This Load →</span>
            </Link>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handlePrintManifest}
            >
              <span>📄 Export Loading Manifest (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Loading Sheet (Visible during Print only) */}
      <div className={styles.printableManifest} style={{ display: "none" }}>
        <h2>Mahaveer Trans Solutions — Cargo Loading Manifest</h2>
        <p><strong>Vehicle:</strong> {activeContainer.name} (Max Payload: {activeContainer.maxWeight} kg)</p>
        <p><strong>Total Loaded Weight:</strong> {packingResult.totalWeightKg} kg | <strong>Volume Used:</strong> {packingResult.totalVolumeUsedM3} m³ ({packingResult.volumeEfficiencyPercent}%)</p>
        <p><strong>Axle Distribution:</strong> Front {packingResult.weightDistribution.frontAxlePercent}% / Rear {packingResult.weightDistribution.rearAxlePercent}%</p>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #000", textAlign: "left" }}>
              <th style={{ padding: "6px" }}>Seq #</th>
              <th style={{ padding: "6px" }}>Cargo Name</th>
              <th style={{ padding: "6px" }}>Dimensions (L×W×H mm)</th>
              <th style={{ padding: "6px" }}>Weight (kg)</th>
              <th style={{ padding: "6px" }}>Floor Coordinates (X, Y, Z mm)</th>
            </tr>
          </thead>
          <tbody>
            {packingResult.packedItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "6px" }}>#{item.order}</td>
                <td style={{ padding: "6px" }}>{item.name}</td>
                <td style={{ padding: "6px" }}>{item.dz} × {item.dx} × {item.dy}</td>
                <td style={{ padding: "6px" }}>{item.weight} kg</td>
                <td style={{ padding: "6px" }}>X={item.x}, Y={item.y}, Z={item.z}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
