export const designTokens = {
  typography: {
    primary: {
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
      paperWhite: {
        name: "Paper White",
        hex: "#F8F9FA",
        description: "Light mode background",
      },
      lightGray: {
        name: "Light Gray",
        hex: "#E9ECEF",
        description: "Borders, dividers",
      },
      charcoal: {
        name: "Charcoal",
        hex: "#212529",
        description: "Primary text",
      },
      deepCharcoal: {
        name: "Deep Charcoal",
        hex: "#121212",
        description: "Dark mode background",
      },
    },
    accent: {
      praiseGreen: {
        name: "Praise Green",
        hex: "#22c55e",
        description: "The signature brand color for buttons, links, and highlights",
      },
    },
    feedback: {
      infoBlue: {
        name: "Info Blue",
        hex: "#0D6EFD",
        description: "Informational messages",
      },
      warningYellow: {
        name: "Warning Yellow",
        hex: "#FFC107",
        description: "Non-critical warnings",
      },
      dangerRed: {
        name: "Danger Red",
        hex: "#DC3545",
        description: "Errors and destructive actions",
      },
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
