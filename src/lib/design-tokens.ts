export const designTokens = {
  typography: {
    heading: {
      name: "Space Grotesk",
      stack: "'Space Grotesk', sans-serif",
    },
    body: {
      name: "Inter",
      stack: "'Inter', sans-serif",
    },
    monospace: {
      name: "JetBrains Mono",
      stack: "'JetBrains Mono', monospace",
    },
  },
  palette: {
    primary: {
      studioBlack: {
        name: "Studio Black",
        hex: "#09090B",
        description: "The Room — Primary dark background (Zinc-950)",
      },
      glassGray: {
        name: "Glass Gray",
        hex: "#27272A",
        description: "The Tools — Navigation, footer, surfaces (Zinc-800)",
      },
      mistWhite: {
        name: "Mist White",
        hex: "#E4E4E7",
        description: "The Content — Body text (Zinc-200)",
      },
      canvasWhite: {
        name: "Canvas White",
        hex: "#FFFFFF",
        description: "The Pivot — ONLY for testimonial card backgrounds",
      },
    },
    accent: {
      electricLime: {
        name: "Electric Lime",
        hex: "#BFFF00",
        description: "The Trust Seal — Verified badge, primary CTA, logo icon ONLY",
      },
    },
    feedback: {
      infoBlue: {
        name: "Info Blue",
        hex: "#3B82F6",
        description: "Informational messages (Blue-500)",
      },
      warningAmber: {
        name: "Warning Amber",
        hex: "#F59E0B",
        description: "Non-critical warnings (Amber-500)",
      },
      dangerRed: {
        name: "Danger Red",
        hex: "#EF4444",
        description: "Errors and destructive actions (Red-500)",
      },
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
