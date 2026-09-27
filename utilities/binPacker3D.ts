/**
 * 3D Bin Packing Algorithm & Logistics Heuristics Engine
 * Optimized for freight containers, trucks, and multi-pallet configurations.
 */

export interface ContainerSpec {
  id: string;
  name: string;
  category: "Mini Truck" | "Medium Freight" | "Heavy Container" | "Custom";
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  maxWeight: number; // kg
  description: string;
  badge?: string;
}

export interface CargoItem {
  id: string;
  name: string;
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  weight: number; // kg per unit
  quantity: number;
  color: string;
  allowRotation: boolean;
  isFragile: boolean;
  stackable: boolean;
}

export interface PackedItem {
  id: string;
  cargoId: string;
  name: string;
  x: number; // mm
  y: number; // mm (height from floor)
  z: number; // mm (length from front)
  dx: number; // dimension along X
  dy: number; // dimension along Y
  dz: number; // dimension along Z
  weight: number;
  color: string;
  isFragile: boolean;
  order: number;
}

export interface PackingResult {
  packedItems: PackedItem[];
  unpackedItems: { item: CargoItem; count: number; reason: string }[];
  container: ContainerSpec;
  totalVolumeUsedM3: number;
  containerVolumeM3: number;
  volumeEfficiencyPercent: number;
  totalWeightKg: number;
  weightCapacityPercent: number;
  centerOfGravity: { x: number; y: number; z: number }; // normalized 0..1 (0.5 is ideal center)
  balanceScore: number; // 0-100 (100 is perfectly balanced)
  weightDistribution: {
    frontAxlePercent: number;
    rearAxlePercent: number;
    leftSidePercent: number;
    rightSidePercent: number;
  };
  totalCargoCount: number;
  packedCargoCount: number;
}

export const FLEET_CONTAINERS: ContainerSpec[] = [
  {
    id: "tata-ace",
    name: "Tata Ace (Chhota Hathi)",
    category: "Mini Truck",
    length: 2200,
    width: 1500,
    height: 1400,
    maxWeight: 950,
    description: "Ideal for city deliveries, intra-city courier, & quick small parcels in Mumbai & MMR.",
    badge: "City Express",
  },
  {
    id: "eicher-14ft",
    name: "14ft Eicher Container (11.10)",
    category: "Medium Freight",
    length: 4300,
    width: 2000,
    height: 2100,
    maxWeight: 4500,
    description: "Standard for regional FMCG, e-commerce, pharma distribution, and industrial parts.",
    badge: "Popular Regional",
  },
  {
    id: "container-20ft",
    name: "20ft Standard ISO Container",
    category: "Heavy Container",
    length: 5900,
    width: 2350,
    height: 2390,
    maxWeight: 12000,
    description: "Heavy machinery, steel coils, bulk pallets, and inter-state full truckload transit.",
    badge: "Heavy Duty",
  },
  {
    id: "sxl-32ft",
    name: "32ft SXL (Single Axle)",
    category: "Heavy Container",
    length: 9750,
    width: 2440,
    height: 2440,
    maxWeight: 7500,
    description: "Volumetric goods, white goods, appliances, automotive parts, and e-commerce linehauls.",
    badge: "High Volume",
  },
  {
    id: "mxl-32ft",
    name: "32ft MXL (Multi Axle)",
    category: "Heavy Container",
    length: 9750,
    width: 2440,
    height: 2600,
    maxWeight: 15000,
    description: "Flagship heavy freight workhorse for all-India long-haul routes with maximum payload.",
    badge: "All-India Flagship",
  },
  {
    id: "container-40ft-hc",
    name: "40ft High Cube Container",
    category: "Heavy Container",
    length: 12030,
    width: 2350,
    height: 2690,
    maxWeight: 28000,
    description: "Maximum international and domestic intermodal volume for ultra-large bulk consignments.",
    badge: "Max Capacity",
  },
];

export const PRESET_CARGO_ITEMS: Omit<CargoItem, "id" | "quantity">[] = [
  {
    name: "Standard Indian Pallet (Loaded)",
    length: 1200,
    width: 1000,
    height: 1200,
    weight: 350,
    color: "#3b82f6",
    allowRotation: false,
    isFragile: false,
    stackable: true,
  },
  {
    name: "Euro Pallet (EUR 1)",
    length: 1200,
    width: 800,
    height: 1100,
    weight: 280,
    color: "#10b981",
    allowRotation: true,
    isFragile: false,
    stackable: true,
  },
  {
    name: "Master Carton (Large FMCG)",
    length: 600,
    width: 400,
    height: 400,
    weight: 22,
    color: "#f59e0b",
    allowRotation: true,
    isFragile: false,
    stackable: true,
  },
  {
    name: "Electronics / Fragile Box",
    length: 500,
    width: 350,
    height: 300,
    weight: 14,
    color: "#ef4444",
    allowRotation: false,
    isFragile: true,
    stackable: false,
  },
  {
    name: "Textile Bale / Polybagged Goods",
    length: 800,
    width: 600,
    height: 500,
    weight: 45,
    color: "#8b5cf6",
    allowRotation: true,
    isFragile: false,
    stackable: true,
  },
  {
    name: "Heavy Industrial Crate",
    length: 1000,
    width: 1000,
    height: 800,
    weight: 500,
    color: "#64748b",
    allowRotation: false,
    isFragile: false,
    stackable: false,
  },
];

interface Space {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

/**
 * 3D Guillotine / Maximum-Surface-Contact Bin Packing
 */
export function packCargoInContainer(
  container: ContainerSpec,
  cargoList: CargoItem[]
): PackingResult {
  const containerVolM3 =
    (container.length / 1000) * (container.width / 1000) * (container.height / 1000);

  // Expand all cargo items by quantity
  interface SingleItem {
    id: string;
    cargoId: string;
    name: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    color: string;
    allowRotation: boolean;
    isFragile: boolean;
    stackable: boolean;
  }

  const itemsToPack: SingleItem[] = [];
  let totalInputCount = 0;

  cargoList.forEach((c) => {
    for (let q = 0; q < Math.max(0, c.quantity); q++) {
      totalInputCount++;
      itemsToPack.push({
        id: `${c.id}-${q + 1}`,
        cargoId: c.id,
        name: c.name,
        length: c.length,
        width: c.width,
        height: c.height,
        weight: c.weight,
        color: c.color,
        allowRotation: c.allowRotation,
        isFragile: c.isFragile,
        stackable: c.stackable,
      });
    }
  });

  // Heuristic sort: Non-fragile first, then heaviest, then largest footprint, then tallest
  itemsToPack.sort((a, b) => {
    if (a.isFragile !== b.isFragile) return a.isFragile ? 1 : -1;
    if (b.weight !== a.weight) return b.weight - a.weight;
    const footA = a.length * a.width;
    const footB = b.length * b.width;
    if (footB !== footA) return footB - footA;
    return b.height - a.height;
  });

  const packed: PackedItem[] = [];
  const unpacked: { item: CargoItem; count: number; reason: string }[] = [];
  const unpackedMap = new Map<string, { item: CargoItem; count: number; reason: string }>();

  let freeSpaces: Space[] = [
    {
      x: 0,
      y: 0,
      z: 0,
      dx: container.width,
      dy: container.height,
      dz: container.length,
    },
  ];

  let currentWeight = 0;

  for (let idx = 0; idx < itemsToPack.length; idx++) {
    const item = itemsToPack[idx];

    // Weight limit check
    if (currentWeight + item.weight > container.maxWeight) {
      const orig = cargoList.find((c) => c.id === item.cargoId)!;
      const prev = unpackedMap.get(item.cargoId) || { item: orig, count: 0, reason: "Exceeds max vehicle weight payload" };
      prev.count++;
      unpackedMap.set(item.cargoId, prev);
      continue;
    }

    // Orientations to test
    const orientations: [number, number, number][] = [
      [item.width, item.height, item.length],
    ];

    if (item.allowRotation) {
      orientations.push(
        [item.length, item.height, item.width],
        [item.width, item.length, item.height],
        [item.length, item.width, item.height]
      );
    }

    let bestSpaceIdx = -1;
    let bestOrientation: [number, number, number] | null = null;
    let bestScore = Infinity; // lowest score = best (closest to floor & back)

    for (let s = 0; s < freeSpaces.length; s++) {
      const space = freeSpaces[s];

      for (const [ox, oy, oz] of orientations) {
        if (ox <= space.dx && oy <= space.dy && oz <= space.dz) {
          // Check collision with already packed items
          const candidateX = space.x;
          const candidateY = space.y;
          const candidateZ = space.z;

          // Score by Y (bottom first), then Z (back/front stability), then X
          const score = candidateY * 100000 + candidateZ * 1000 + candidateX;

          if (score < bestScore) {
            bestScore = score;
            bestSpaceIdx = s;
            bestOrientation = [ox, oy, oz];
          }
        }
      }
    }

    if (bestSpaceIdx !== -1 && bestOrientation) {
      const chosenSpace = freeSpaces[bestSpaceIdx];
      const [ox, oy, oz] = bestOrientation;

      const packedItem: PackedItem = {
        id: item.id,
        cargoId: item.cargoId,
        name: item.name,
        x: chosenSpace.x,
        y: chosenSpace.y,
        z: chosenSpace.z,
        dx: ox,
        dy: oy,
        dz: oz,
        weight: item.weight,
        color: item.color,
        isFragile: item.isFragile,
        order: packed.length + 1,
      };

      packed.push(packedItem);
      currentWeight += item.weight;

      // Guillotine subdivision of remaining space
      const newSpaces: Space[] = [];

      // Space to the Right (+X)
      if (chosenSpace.dx - ox > 50) {
        newSpaces.push({
          x: chosenSpace.x + ox,
          y: chosenSpace.y,
          z: chosenSpace.z,
          dx: chosenSpace.dx - ox,
          dy: oy,
          dz: oz,
        });
      }

      // Space on Top (+Y) (only if item is stackable and not fragile)
      if (item.stackable && !item.isFragile && chosenSpace.dy - oy > 50) {
        newSpaces.push({
          x: chosenSpace.x,
          y: chosenSpace.y + oy,
          z: chosenSpace.z,
          dx: ox,
          dy: chosenSpace.dy - oy,
          dz: oz,
        });
      }

      // Space in Deep / Forward (+Z)
      if (chosenSpace.dz - oz > 50) {
        newSpaces.push({
          x: chosenSpace.x,
          y: chosenSpace.y,
          z: chosenSpace.z + oz,
          dx: chosenSpace.dx,
          dy: chosenSpace.dy,
          dz: chosenSpace.dz - oz,
        });
      }

      // Remove chosen space and insert split spaces
      freeSpaces.splice(bestSpaceIdx, 1);
      freeSpaces.push(...newSpaces);

      // Consolidate & prune invalid spaces
      freeSpaces = freeSpaces.filter(
        (sp) => sp.dx >= 100 && sp.dy >= 100 && sp.dz >= 100
      );
    } else {
      const orig = cargoList.find((c) => c.id === item.cargoId)!;
      const prev = unpackedMap.get(item.cargoId) || { item: orig, count: 0, reason: "Container volumetric capacity full" };
      prev.count++;
      unpackedMap.set(item.cargoId, prev);
    }
  }

  unpackedMap.forEach((val) => unpacked.push(val));

  // Volumetric stats
  let totalPackedVolM3 = 0;
  let weightedX = 0;
  let weightedY = 0;
  let weightedZ = 0;
  let totalWeight = 0;

  let leftSideWeight = 0;
  let rightSideWeight = 0;
  let frontAxleWeight = 0;
  let rearAxleWeight = 0;

  const halfWidth = container.width / 2;
  const halfLength = container.length / 2;

  packed.forEach((p) => {
    const vol = (p.dx / 1000) * (p.dy / 1000) * (p.dz / 1000);
    totalPackedVolM3 += vol;

    const centerX = p.x + p.dx / 2;
    const centerY = p.y + p.dy / 2;
    const centerZ = p.z + p.dz / 2;

    weightedX += centerX * p.weight;
    weightedY += centerY * p.weight;
    weightedZ += centerZ * p.weight;
    totalWeight += p.weight;

    if (centerX < halfWidth) leftSideWeight += p.weight;
    else rightSideWeight += p.weight;

    if (centerZ < halfLength) frontAxleWeight += p.weight;
    else rearAxleWeight += p.weight;
  });

  const cogX = totalWeight > 0 ? weightedX / totalWeight / container.width : 0.5;
  const cogY = totalWeight > 0 ? weightedY / totalWeight / container.height : 0.1;
  const cogZ = totalWeight > 0 ? weightedZ / totalWeight / container.length : 0.5;

  // Balance calculation
  const lateralDeviation = Math.abs(cogX - 0.5); // 0 is ideal
  const longitudinalDeviation = Math.abs(cogZ - 0.5); // 0 is ideal
  const balancePenalty = (lateralDeviation * 100 + longitudinalDeviation * 50) * 1.5;
  const balanceScore = Math.max(10, Math.min(100, Math.round(100 - balancePenalty)));

  const volEff = containerVolM3 > 0 ? Math.min(100, (totalPackedVolM3 / containerVolM3) * 100) : 0;
  const weightCap = container.maxWeight > 0 ? Math.min(100, (totalWeight / container.maxWeight) * 100) : 0;

  const totalSide = leftSideWeight + rightSideWeight || 1;
  const totalAxle = frontAxleWeight + rearAxleWeight || 1;

  return {
    packedItems: packed,
    unpackedItems: unpacked,
    container,
    totalVolumeUsedM3: parseFloat(totalPackedVolM3.toFixed(2)),
    containerVolumeM3: parseFloat(containerVolM3.toFixed(2)),
    volumeEfficiencyPercent: parseFloat(volEff.toFixed(1)),
    totalWeightKg: totalWeight,
    weightCapacityPercent: parseFloat(weightCap.toFixed(1)),
    centerOfGravity: {
      x: parseFloat(cogX.toFixed(3)),
      y: parseFloat(cogY.toFixed(3)),
      z: parseFloat(cogZ.toFixed(3)),
    },
    balanceScore,
    weightDistribution: {
      frontAxlePercent: Math.round((frontAxleWeight / totalAxle) * 100),
      rearAxlePercent: Math.round((rearAxleWeight / totalAxle) * 100),
      leftSidePercent: Math.round((leftSideWeight / totalSide) * 100),
      rightSidePercent: Math.round((rightSideWeight / totalSide) * 100),
    },
    totalCargoCount: totalInputCount,
    packedCargoCount: packed.length,
  };
}
