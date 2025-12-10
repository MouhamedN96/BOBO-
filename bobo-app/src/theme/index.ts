/**
 * BOBO Theme
 * Central export for all theme-related values
 */

export * from './colors'
export * from './typography'
export * from './spacing'
export * from './adinkra'

// Re-export for convenience
import { colors } from './colors'
import { typography } from './typography'
import { spacing, borderRadius, shadows, zIndex } from './spacing'
import { adinkraSymbols, achievementIcons, trustBadges } from './adinkra'

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  adinkraSymbols,
  achievementIcons,
  trustBadges,
} as const

export default theme
