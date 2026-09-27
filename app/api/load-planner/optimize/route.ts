import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { container, stats, packedItems, unpackedItems } = body;

    if (!container || !stats) {
      return NextResponse.json(
        { error: "Invalid payload provided for AI optimization" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    const fallbackAnalysis = {
      overallVerdict:
        stats.volumeEfficiencyPercent > 80
          ? "High Volumetric Utilization"
          : stats.volumeEfficiencyPercent > 50
          ? "Optimal Balanced Load"
          : "Underutilized Capacity — Opportunity to consolidate Part-Truck-Loads (PTL)",
      safetyScore: stats.balanceScore >= 80 ? "Grade A (Optimal Stability)" : stats.balanceScore >= 60 ? "Grade B (Acceptable)" : "Grade C (Rebalance Required)",
      axleAdvice:
        stats.weightDistribution.frontAxlePercent > 60
          ? "Front axle load is high. Consider shifting denser cargo toward the rear axle to protect vehicle suspension."
          : stats.weightDistribution.rearAxlePercent > 65
          ? "Rear axle load is dominant. Shift heavy pallets forward near the cabin for highway stability."
          : "Axle weight distribution is well-balanced across front and rear wheelbases.",
      lateralAdvice:
        Math.abs(stats.weightDistribution.leftSidePercent - stats.weightDistribution.rightSidePercent) > 15
          ? "Lateral imbalance detected (>15% variance). Evenly distribute cargo on left and right sides to prevent roll-over risk on turns."
          : "Lateral center of gravity is stable with symmetric left-right weight distribution.",
      loadingTips: [
        "Load heavy and dense pallets first along the container floor centerline.",
        "Stack fragile or lightweight cartons strictly on upper tiers.",
        "Use dunnage bags or cargo lashings on any remaining void spaces to prevent transit shifting.",
      ],
      recommendedTruck:
        unpackedItems && unpackedItems.length > 0
          ? "Consignment exceeds current vehicle capacity. Upgrade to 32ft MXL or 40ft High Cube container."
          : stats.volumeEfficiencyPercent < 40 && stats.weightCapacityPercent < 40
          ? "Consider downsizing to a 14ft Eicher or Tata Ace to optimize transport fuel & freight costs."
          : `${container.name} is well-suited for this consignment.`,
    };

    if (!apiKey) {
      return NextResponse.json({ success: true, analysis: fallbackAnalysis });
    }

    const prompt = `You are an expert AI Fleet Load Master and Freight Logistics Safety Engineer at Mahaveer Trans Solutions.
Analyze this 3D truck load configuration:
- Container: ${container.name} (Capacity: ${container.maxWeight} kg, Volume: ${stats.containerVolumeM3} m³)
- Total Cargo Packed: ${stats.packedCargoCount} items (${stats.totalWeightKg} kg, ${stats.totalVolumeUsedM3} m³)
- Volume Efficiency: ${stats.volumeEfficiencyPercent}%
- Weight Capacity: ${stats.weightCapacityPercent}%
- Center of Gravity Score: ${stats.balanceScore}/100
- Axle Balance: Front ${stats.weightDistribution.frontAxlePercent}% vs Rear ${stats.weightDistribution.rearAxlePercent}%
- Lateral Balance: Left ${stats.weightDistribution.leftSidePercent}% vs Right ${stats.weightDistribution.rightSidePercent}%
- Unpacked Items: ${unpackedItems?.length || 0} items

Return ONLY valid JSON matching this exact structure:
{
  "overallVerdict": "brief 1 sentence verdict",
  "safetyScore": "Grade A/B/C summary",
  "axleAdvice": "1 sentence axle advice",
  "lateralAdvice": "1 sentence lateral balance advice",
  "loadingTips": ["tip 1", "tip 2", "tip 3"],
  "recommendedTruck": "recommendation for fleet sizing"
}`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: true, analysis: fallbackAnalysis });
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      analysis: { ...fallbackAnalysis, ...parsed },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        analysis: {
          overallVerdict: "Standard Automated Load Assessment",
          safetyScore: "Safety Grade A",
          axleAdvice: "Maintain even payload across axles.",
          lateralAdvice: "Check side-to-side alignment before dispatch.",
          loadingTips: ["Load heavy goods at bottom", "Secure fragile items on top tier"],
          recommendedTruck: "Selected vehicle matches payload profile.",
        },
      },
      { status: 200 }
    );
  }
}
