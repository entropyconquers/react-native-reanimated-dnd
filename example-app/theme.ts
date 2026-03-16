// Design System: "Kinetic Studio"
// A sophisticated creative studio aesthetic with dark glassmorphism,
// warm undertones, and category-specific color personalities.

export const colors = {
  // Backgrounds
  bg: "#08090E",
  surface: "#12141C",
  surfaceElevated: "#1A1C26",
  surfacePressed: "#1F2130",

  // Borders
  border: "#1E2028",
  borderSubtle: "rgba(255,255,255,0.06)",

  // Glass
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHighlight: "rgba(255,255,255,0.12)",

  // Primary & Accents
  primary: "#FF3B30",
  primaryMuted: "rgba(255, 59, 48, 0.15)",
  accent: "#FF6B6B",
  accentMuted: "rgba(255, 107, 107, 0.15)",

  // Text
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textDim: "#475569",

  // Semantic
  success: "#2DD4BF",
  warning: "#FBBF24",
  error: "#FF6B6B",
};

export const fonts = {
  displayExtraBold: "Syne_800ExtraBold",
  displayBold: "Syne_700Bold",
  displaySemiBold: "Syne_600SemiBold",
  displayMedium: "Syne_500Medium",
  displayRegular: "Syne_400Regular",

  bodyBold: "Outfit_700Bold",
  bodySemiBold: "Outfit_600SemiBold",
  bodyMedium: "Outfit_500Medium",
  bodyRegular: "Outfit_400Regular",
  bodyLight: "Outfit_300Light",
};

export const categoryColors = {
  sortable: {
    color: "#818CF8",
    bg: "rgba(129, 140, 248, 0.22)",
    glow: "rgba(129, 140, 248, 0.18)",
    border: "rgba(129, 140, 248, 0.25)",
    gradient: ["#6366F1", "#818CF8"] as const,
  },
  gettingStarted: {
    color: "#FB7185",
    bg: "rgba(251, 113, 133, 0.22)",
    glow: "rgba(251, 113, 133, 0.18)",
    border: "rgba(251, 113, 133, 0.25)",
    gradient: ["#F43F5E", "#FB7185"] as const,
  },
  motionStyle: {
    color: "#FCD34D",
    bg: "rgba(252, 211, 77, 0.18)",
    glow: "rgba(252, 211, 77, 0.14)",
    border: "rgba(252, 211, 77, 0.22)",
    gradient: ["#F59E0B", "#FCD34D"] as const,
  },
  constraints: {
    color: "#5EEAD4",
    bg: "rgba(94, 234, 212, 0.18)",
    glow: "rgba(94, 234, 212, 0.15)",
    border: "rgba(94, 234, 212, 0.22)",
    gradient: ["#14B8A6", "#5EEAD4"] as const,
  },
  dropZones: {
    color: "#6EE7B7",
    bg: "rgba(110, 231, 183, 0.18)",
    glow: "rgba(110, 231, 183, 0.15)",
    border: "rgba(110, 231, 183, 0.22)",
    gradient: ["#10B981", "#6EE7B7"] as const,
  },
  advanced: {
    color: "#C084FC",
    bg: "rgba(192, 132, 252, 0.22)",
    glow: "rgba(192, 132, 252, 0.18)",
    border: "rgba(192, 132, 252, 0.25)",
    gradient: ["#9333EA", "#C084FC"] as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
