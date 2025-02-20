// Next.js API route for analyzing colors

import { NextResponse } from "next/server";

// This is a simplified version of color season analysis
// In a real application, you would want a more sophisticated algorithm
function analyzeColors(colors: { hair: string; eyes: string; skin: string }) {
  // Convert hex to RGB for analysis
  const hexToRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const hair = hexToRGB(colors.hair);
  const eyes = hexToRGB(colors.eyes);
  const skin = hexToRGB(colors.skin);

  // Calculate warmth (simplified)
  const isWarm = (rgb: { r: number; g: number; b: number }) => {
    return rgb.r > rgb.b; // Simple warm/cool check
  };

  // Calculate brightness
  const getBrightness = (rgb: { r: number; g: number; b: number }) => {
    return (rgb.r + rgb.g + rgb.b) / 3;
  };

  // Count warm colors
  const warmCount = [hair, eyes, skin].filter(isWarm).length;
  
  // Calculate overall brightness
  const avgBrightness = [hair, eyes, skin].reduce((sum, color) => sum + getBrightness(color), 0) / 3;

  // Determine season based on warmth and brightness
  if (warmCount >= 2) {
    if (avgBrightness > 128) {
      return {
        season: "Spring",
        description: "You have warm and bright coloring. Your best colors are warm and clear, like coral, golden yellow, and warm green.",
        colors: ["#FF6B35", "#FFD700", "#4CAF50", "#FF8C69", "#98FB98"]
      };
    } else {
      return {
        season: "Autumn",
        description: "You have warm and deep coloring. Your best colors are warm and muted, like rust, olive, and golden brown.",
        colors: ["#8B4513", "#556B2F", "#CD853F", "#A0522D", "#DAA520"]
      };
    }
  } else {
    if (avgBrightness > 128) {
      return {
        season: "Summer",
        description: "You have cool and soft coloring. Your best colors are cool and muted, like soft pink, powder blue, and sage green.",
        colors: ["#DDA0DD", "#B0C4DE", "#98FB98", "#DEB887", "#FFB6C1"]
      };
    } else {
      return {
        season: "Winter",
        description: "You have cool and deep coloring. Your best colors are cool and clear, like true red, royal blue, and pure white.",
        colors: ["#DC143C", "#4169E1", "#FFFFFF", "#000000", "#800080"]
      };
    }
  }
}

export async function POST(req: Request) {
  try {
    const colors = await req.json();
    
    if (!colors.hair || !colors.eyes || !colors.skin) {
      return NextResponse.json(
        { error: "Missing required color values" },
        { status: 400 }
      );
    }

    const analysis = analyzeColors(colors);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Color analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze colors" },
      { status: 500 }
    );
  }
}
