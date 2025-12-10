/**
 * BOBO Typography
 * Based on NJOOBA's typography scale
 * Converted to React Native StyleSheet
 */

import { StyleSheet, TextStyle } from 'react-native'

// Font Families
export const fontFamilies = {
  heading: 'System',  // Will use system font for now, can add custom fonts later
  body: 'System',
  display: 'System',
} as const

// Typography Styles
export const typography = StyleSheet.create({
  // Display (Large hero text)
  display: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 38.4,  // 32 * 1.2
    letterSpacing: -0.32,
  },

  // Headings
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 33.6,  // 28 * 1.2
    letterSpacing: -0.28,
  },

  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 26,  // 20 * 1.3
    letterSpacing: -0.1,
  },

  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22.4,  // 16 * 1.4
    letterSpacing: 0,
  },

  // Body Text
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22.5,  // 15 * 1.5
    letterSpacing: 0,
  },

  bodyBold: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22.5,
    letterSpacing: 0,
  },

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 21,  // 14 * 1.5
    letterSpacing: 0,
  },

  // Caption (Small supporting text)
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 18.2,  // 13 * 1.4
    letterSpacing: 0,
  },

  captionBold: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 18.2,
    letterSpacing: 0,
  },

  // Micro (Tiny text, timestamps, labels)
  micro: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 14.3,  // 11 * 1.3
    letterSpacing: 0.5,
  },

  // Button Text
  button: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  buttonSmall: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  // Link Text
  link: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 22.5,
    textDecorationLine: 'underline' as TextStyle['textDecorationLine'],
  },

  // Price Text
  price: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0,
  },

  priceLarge: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
    letterSpacing: -0.28,
  },
})

// Helper function to combine typography with custom styles
export const combineTextStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles)
}
