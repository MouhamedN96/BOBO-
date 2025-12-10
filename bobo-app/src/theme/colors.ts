/**
 * BOBO Color Palette
 * Based on NJOOBA's "Sunset Over Dakar" design system
 * Adapted for React Native
 */

export const colors = {
  // Primary Palette
  terracotta: {
    primary: '#E07856',
    semantic: 'warmth_energy_cta',
  },
  indigo: {
    deep: '#2D3561',
    semantic: 'depth_trust_sophistication',
  },
  savanna: {
    gold: '#F2A541',
    semantic: 'value_premium_celebration',
  },
  forest: {
    green: '#1B4D3E',
    semantic: 'growth_life_progress',
  },

  // Supporting Palette
  sand: {
    neutral: '#E8D7C3',
  },
  charcoal: {
    base: '#1F1F1F',
  },
  clay: {
    white: '#FAF8F5',
  },
  rust: {
    accent: '#B8563E',
  },

  // Semantic Colors (for common use cases)
  primary: '#E07856',      // Terracotta - CTAs, buttons
  secondary: '#F2A541',    // Savanna Gold - Premium, featured
  success: '#1B4D3E',      // Forest Green - Success states
  error: '#B8563E',        // Rust - Error states
  warning: '#F2A541',      // Savanna Gold - Warnings
  info: '#2D3561',         // Indigo - Info states

  // Text Colors
  text: {
    primary: '#1F1F1F',    // Charcoal
    secondary: '#4A5568',  // Gray
    tertiary: '#A0AEC0',   // Light gray
    inverse: '#FAF8F5',    // Clay white
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAF8F5',  // Clay white
    tertiary: '#E8D7C3',   // Sand neutral
    dark: '#1F1F1F',       // Charcoal
  },

  // Border Colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E0',
    dark: '#A0AEC0',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
} as const

// Category Colors (for product categories)
export const categoryColors = {
  fashion: colors.terracotta.primary,
  electronics: colors.indigo.deep,
  beauty: colors.savanna.gold,
  food: colors.forest.green,
  home: colors.rust.accent,
  other: colors.sand.neutral,
} as const

// Level Colors (for gamification)
export const levelColors = {
  newcomer: colors.forest.green,     // Level 1-5
  shopper: colors.terracotta.primary, // Level 6-10
  seller: colors.savanna.gold,       // Level 11-20
  merchant: colors.indigo.deep,      // Level 21-35
  mogul: colors.savanna.gold,        // Level 36-50
  leader: colors.terracotta.primary, // Level 51+
} as const
