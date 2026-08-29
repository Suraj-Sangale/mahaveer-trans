"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icon paths broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Tile layer configs ── */
const TILE_LAYERS = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    label: "🛰 Satellite",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "",
    maxZoom: 19,
    label: "🗺 Street",
  },
};

/* ── Approximate lat/lng centres for each region ── */
const REGION_COORDS = {
  Maharashtra: [19.7515, 75.7139],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Bangalore: [12.9716, 77.5946],
  Vijayawada: [16.5062, 80.648],
  Visakhapatnam: [17.6868, 83.2185],
  "Tamil Nadu": [11.1271, 78.6569],
  Karnataka: [15.3173, 75.7139],
};

/* ── Google Maps-style teardrop SVG pin ── */
function makePinIcon(color, isActive) {
  const size = isActive ? 36 : 28;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.4}" viewBox="0 0 40 56">
      <filter id="shadow" x="-30%" y="-10%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
      </filter>
      <path
        d="M20 0C9 0 0 9 0 20C0 35 20 56 20 56C20 56 40 35 40 20C40 9 31 0 20 0Z"
        fill="${color}"
        filter="url(#shadow)"
      />
      <circle cx="20" cy="20" r="8" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [size, size * 1.4],
    iconAnchor: [size / 2, size * 1.4],
    popupAnchor: [0, -(size * 1.4)],
  });
}

/* ── Inner controller: flies map to selectedRegion and opens its popup ── */
function MapController({ selectedRegion, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedRegion) return;
    const coords = REGION_COORDS[selectedRegion];
    if (!coords) return;

    map.flyTo(coords, 8, { duration: 1.2, easeLinearity: 0.25 });

    // Open the popup after the fly animation finishes
    const timeout = setTimeout(() => {
      const marker = markerRefs.current[selectedRegion];
      if (marker) marker.openPopup();
    }, 1300);

    return () => clearTimeout(timeout);
  }, [selectedRegion, map, markerRefs]);

  return null;
}

/* ── Force map to recalculate size after mount ── */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

/* ── Toggle button ── */
function LayerToggle({ mode, onToggle }) {
  return (
    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>
      <button
        onClick={onToggle}
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: "8px",
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          color: "#1e2530",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.92)")}
      >
        {TILE_LAYERS[mode].label}
      </button>
    </div>
  );
}

export default function IndiaMap({ regions, selectedRegion, mode, onToggleMode }) {
  const layer = TILE_LAYERS[mode];
  const markerRefs = useRef({});
  const indiaCentre = [20.5937, 78.9629];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={indiaCentre}
        zoom={5}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
        attributionControl={false}
      >
        <TileLayer
          key={mode}
          url={layer.url}
          subdomains={layer.subdomains}
          maxZoom={layer.maxZoom}
        />

        {regions.map((r) => {
          const coords = REGION_COORDS[r.name];
          if (!coords) return null;
          const isActive = selectedRegion === r.name;
          return (
            <Marker
              key={r.name}
              position={coords}
              icon={makePinIcon(r.dot, isActive)}
              ref={(ref) => {
                if (ref) markerRefs.current[r.name] = ref;
              }}
              zIndexOffset={isActive ? 1000 : 0}
            >
              <Popup>
                <div style={{ minWidth: "120px" }}>
                  <strong style={{ color: r.dot, fontSize: "14px" }}>{r.name}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "#666" }}>Active logistics hub</span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController selectedRegion={selectedRegion} markerRefs={markerRefs} />
        <MapResizer />
      </MapContainer>

      <LayerToggle mode={mode} onToggle={onToggleMode} />
    </div>
  );
}
