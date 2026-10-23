/**
 * ============================================================================
 * Sadvidhya International School ERP — Centralized Typography System
 * All text and font sizes strictly defined in PIXELS (px) format.
 * Single Source of Truth for Typography Tokens across the ERP application.
 * ============================================================================
 */

/**
 * Primary Font Family Rule: Always Poppins across the entire ERP portal.
 */
export const FONT_FAMILY_POPPINS = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * Strict Pixel Font Size Scale
 * All values are explicit string representations with 'px' units.
 */
export const FONT_SIZES_PX = {
  '3xs': '10px',
  '2xs': '11px',
  'xs': '12px',
  'compact': '13px',
  'sm': '14px',
  'md': '15px',
  'base': '16px',
  'lg': '18px',
  'xl': '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '60px',
  '7xl': '72px',
  '8xl': '96px',
  '9xl': '128px',
} as const;

export type FontSizeToken = keyof typeof FONT_SIZES_PX;
export const fontSizes = FONT_SIZES_PX;

/**
 * Strict Pixel Line Heights
 * Matched to proportional pixel font sizes for clear reading rhythm and balance.
 */
export const lineHeights = {
  '10px': '14px',
  '11px': '14px',
  '12px': '16px',
  '13px': '18px',
  '14px': '20px',
  '15px': '22px',
  '16px': '24px',
  '18px': '26px',
  '20px': '28px',
  '24px': '32px',
  '30px': '36px',
  '36px': '40px',
  '48px': '48px',
  '60px': '60px',
  '72px': '72px',
  '96px': '96px',
  '128px': '128px',
} as const;

/**
 * Standard Font Weights
 */
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export interface TypographyVariantStyle {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  fontFamily: string;
}

/**
 * Centralized Semantic Typography System
 * Reusable design tokens for all ERP modules, pages, and components.
 */
export const typography = {
  // Display / Hero Variants
  display: {
    hero: {
      fontSize: FONT_SIZES_PX['5xl'], // '48px'
      lineHeight: lineHeights['48px'],
      fontWeight: fontWeights.extrabold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xxl: {
      fontSize: FONT_SIZES_PX['4xl'], // '36px'
      lineHeight: lineHeights['36px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xl: {
      fontSize: FONT_SIZES_PX['3xl'], // '30px'
      lineHeight: lineHeights['30px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Heading Variants
  heading: {
    h1: {
      fontSize: FONT_SIZES_PX['2xl'], // '24px' (page title)
      lineHeight: lineHeights['24px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    h2: {
      fontSize: FONT_SIZES_PX.xl, // '20px' (section title)
      lineHeight: lineHeights['20px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    h3: {
      fontSize: FONT_SIZES_PX.lg, // '18px' (card / modal title)
      lineHeight: lineHeights['18px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    h4: {
      fontSize: FONT_SIZES_PX.base, // '16px' (subsection title)
      lineHeight: lineHeights['16px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    h5: {
      fontSize: FONT_SIZES_PX.base, // '16px' (standard card subheader)
      lineHeight: lineHeights['16px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    h6: {
      fontSize: FONT_SIZES_PX.sm, // '14px' (sub-item header)
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Body Variants (Standardized to Figma 14px Default / 12px Secondary)
  body: {
    lg: {
      fontSize: FONT_SIZES_PX.base, // '16px'
      lineHeight: lineHeights['16px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    base: {
      fontSize: FONT_SIZES_PX.sm, // '14px' (standard primary body text)
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    compact: {
      fontSize: FONT_SIZES_PX.sm, // '14px' (standard compact body text)
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    sm: {
      fontSize: FONT_SIZES_PX.xs, // '12px' (descriptions, helper, subtitles)
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xs: {
      fontSize: FONT_SIZES_PX.xs, // '12px' (meta & footnotes)
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Form & UI Labels
  label: {
    lg: {
      fontSize: FONT_SIZES_PX.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    base: {
      fontSize: FONT_SIZES_PX.sm, // '14px' (standard form field labels)
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.medium,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    sm: {
      fontSize: FONT_SIZES_PX.xs, // '12px' (sub-labels / input captions)
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.medium,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xs: {
      fontSize: FONT_SIZES_PX.xs, // '12px' (table headers, uppercase badges)
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.bold,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    micro: {
      fontSize: FONT_SIZES_PX['3xs'], // '10px'
      lineHeight: lineHeights['10px'],
      fontWeight: fontWeights.bold,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Button Typography
  button: {
    lg: {
      fontSize: FONT_SIZES_PX.base, // '16px'
      lineHeight: lineHeights['16px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    base: {
      fontSize: FONT_SIZES_PX.sm, // '14px' (standard primary button)
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    sm: {
      fontSize: FONT_SIZES_PX.xs, // '12px' (compact table/action button)
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xs: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Captions & Helper Text
  caption: {
    base: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    sm: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  helper: {
    fontSize: FONT_SIZES_PX.xs, // '12px'
    lineHeight: lineHeights['12px'],
    fontWeight: fontWeights.regular,
    fontFamily: FONT_FAMILY_POPPINS,
  },

  // Badges & Chips
  badge: {
    base: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    sm: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    xs: {
      fontSize: FONT_SIZES_PX['3xs'], // '10px'
      lineHeight: lineHeights['10px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Tables (Standardized to Figma 12px Header / 14px Cell)
  table: {
    head: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.bold,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    cell: {
      fontSize: FONT_SIZES_PX.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    cellBold: {
      fontSize: FONT_SIZES_PX.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.semibold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Modal
  modal: {
    title: {
      fontSize: FONT_SIZES_PX.lg, // '18px'
      lineHeight: lineHeights['18px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    subtitle: {
      fontSize: FONT_SIZES_PX.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Toast Notifications
  toast: {
    message: {
      fontSize: FONT_SIZES_PX.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.medium,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    description: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },

  // Metric & Stat Cards
  metric: {
    value: {
      fontSize: FONT_SIZES_PX['2xl'], // '24px'
      lineHeight: lineHeights['24px'],
      fontWeight: fontWeights.bold,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    label: {
      fontSize: FONT_SIZES_PX.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.medium,
      fontFamily: FONT_FAMILY_POPPINS,
    },
    subtext: {
      fontSize: FONT_SIZES_PX['2xs'], // '11px'
      lineHeight: lineHeights['11px'],
      fontWeight: fontWeights.medium,
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },
} as const;

/**
 * Helper function to retrieve a pixel font size by token
 */
export function getFontSize(token: FontSizeToken): string {
  return FONT_SIZES_PX[token];
}

export type TypographySystem = typeof typography;
