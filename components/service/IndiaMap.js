"use client";

import { useEffect } from "react";
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

/* ── Custom coloured circle marker ── */
function makeColorIcon(color) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:18px;height:18px;
        background:${color};
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,.35);
      "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

/* ── Force map to recalculate size after mount ── */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

export default function IndiaMap({ regions }) {
  /* India bounding box – keeps the view centred on India */
  const indiaCentre = [20.5937, 78.9629];

  return (
    <MapContainer
      center={indiaCentre}
      zoom={5}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      attributionControl={false}
    >
      {/* Free OpenStreetMap tiles - no API key required */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        subdomains="abc"
        maxZoom={19}
      />

      {regions.map((r) => {
        const coords = REGION_COORDS[r.name];
        if (!coords) return null;
        return (
          <Marker key={r.name} position={coords} icon={makeColorIcon(r.dot)}>
            <Popup>
              <strong style={{ color: r.dot }}>{r.name}</strong>
              <br />
              Active logistics hub
            </Popup>
          </Marker>
        );
      })}

      <MapResizer />
    </MapContainer>
  );
}
