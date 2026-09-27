import { Metadata } from "next";
import LoadPlanner from "@/components/loadPlanner/LoadPlanner";

export const metadata: Metadata = {
  title: "3D AI Cargo & Load Optimization Planner — Mahaveer Trans Solutions",
  description:
    "Interactive 3D container & truck load optimization tool. Calculate volumetric efficiency, axle weight balance, and 3D packing sequences for your freight consignments.",
  keywords: [
    "3D cargo planner",
    "truck load optimization",
    "bin packing algorithm",
    "container loading simulator",
    "Mahaveer Trans logistics",
    "freight volume calculator",
  ],
};

export default function LoadPlannerPage() {
  return <LoadPlanner />;
}
