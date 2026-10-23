/**
 * ============================================================================
 * Centralized Color Styling System & Design Tokens
 * Sadvidhya International School ERP Portal
 * ============================================================================
 * 
 * Rules & Guidelines:
 * 1. ALWAYS use HEX format (#RRGGBB or #RRGGBBAA) for all colors.
 * 2. Whenever a new color is needed in the future:
 *    - First verify if an existing token in this palette satisfies the requirement.
 *    - If genuinely new, define it here first under the appropriate semantic category
 *      and reference it via token rather than hardcoding arbitrary values in components.
 * 3. Changing a color token here automatically cascades across the entire ERP portal.
 */

// ============================================================================
// 1. Raw Foundation Palette (Core Hex Definitions)
// ============================================================================
export const RAW_COLORS = {
  // Brand Triad (Core School Identity)
  brand: {
    navy: '#17153A',       // Midnight Navy
    burgundy: '#560110',   // Deep Burgundy
    gold: '#7C612A',       // Royal Gold
    // Brand Shades & Variants
    goldDark: '#644C1F',
    goldDeep: '#685223',
    goldLight: '#FAF7F2',
    goldLighter: '#FDF8F0',
    goldLightest: '#FDFBF7',
    goldSoft: '#FBF8F2',
    goldMuted: '#F8EEDD',
    goldCream: '#F4EBD9',
    goldWarm: '#F3E5D0',
    goldBorder: '#E8DFC8',
    goldBorderSubtle: '#EBDCC1',
    burgundyHover: '#45010D',
    burgundyDark: '#40000B',
    navyHover: '#252252',
    navyActive: '#25225C',
  },

  // Neutrals / Ink / Slate (Surfaces, Typography, Borders)
  ink: {
    white: '#FFFFFF',
    offWhite: '#FCFDFE',
    snow: '#FAFAFA',
    50: '#F8FAFC',   // Base application background
    100: '#F1F5F9',  // Subtle track, hover, inactive pill
    200: '#E2E8F0',  // Card borders, row dividers
    300: '#CBD5E1',  // Form borders, scrollbars, separators
    400: '#94A3B8',  // Placeholders, muted icons
    500: '#64748B',  // Meta labels, captions, secondary text
    600: '#475569',  // Subheadings, secondary copy
    700: '#334155',  // Toast borders, dark text
    800: '#1E293B',  // High-contrast text
    900: '#0F172A',  // Dominant headings & dark elements
    950: '#020617',  // Deepest black/slate
  },

  // Success / Emerald / Green
  success: {
    50: '#F0FDF4',
    bgAlt: '#ECFDF5',
    100: '#DCFCE7',
    subtle: '#D1FAE5',
    200: '#BBF7D0',
    borderAlt: '#A7F3D0',
    main: '#16A34A',
    text: '#15803D',
    emerald: '#10B981',
    emeraldDark: '#059669',
    forest: '#047857',
    deep: '#065F46',
    dark: '#166534',
    darkest: '#064E3B',
    bright: '#22C55E',
  },

  // Warning / Amber / Orange
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    main: '#F59E0B',
    text: '#B45309',
    orange: '#D97706',
    dark: '#92400E',
    deep: '#78350F',
  },

  // Error / Danger / Rose / Red
  error: {
    50: '#FFF1F2',
    alt: '#FEF2F2',
    light: '#FEE2E2',
    rose: '#FFE4E6',
    border: '#FECDD3',
    borderAlt: '#FECACA',
    main: '#EF4444',
    text: '#BE123C',
    red: '#DC2626',
    crimson: '#E11D48',
    dark: '#9F1239',
    deep: '#991B1B',
  },

  // Info / Sky / Blue
  info: {
    50: '#EFF6FF',
    sky50: '#F0F9FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    sky200: '#BAE6FD',
    main: '#2563EB',
    text: '#1D4ED8',
    sky: '#0284C7',
    skyMain: '#0EA5E9',
    skyLight: '#38BDF8',
    blueDeep: '#1C42D8',
    blueAccent: '#3B76F6',
  },

  // Accents (Purple, Indigo, Pink, Fuchsia, Cyan, Teal)
  accent: {
    purple50: '#FAF5FF',
    purpleAlt50: '#F5F3FF',
    purpleBorder: '#E9D5FF',
    purpleBorderAlt: '#DDD6FE',
    purpleText: '#7E22CE',
    purpleMain: '#7C3AED',
    purpleLight: '#8B5CF6',
    indigo50: '#EEF2FF',
    indigoAlt50: '#E0E7FF',
    indigoBorder: '#C7D2FE',
    indigoText: '#4F46E5',
    indigoDark: '#4338CA',
    indigoMain: '#6366F1',
    fuchsia50: '#FAE8FF',
    fuchsiaAlt50: '#FDF4FF',
    fuchsiaBorder: '#F0ABFC',
    fuchsiaText: '#C026D3',
    pink50: '#FDF2F8',
    pinkBorder: '#FCE7F3',
    pinkText: '#BE185D',
    cyan50: '#ECFEFF',
    cyanBorder: '#A5F3FC',
    cyanText: '#0891B2',
    tealMain: '#14B8A6',
    tealText: '#0F766E',
  },

  // Shadows & Alphas (HEX with Alpha #RRGGBBAA)
  alpha: {
    black04: '#00000004',
    black06: '#00000006',
    black08: '#00000008',
    black0a: '#0000000A',
    black0f: '#0000000F',
    black10: '#00000010',
    black14: '#00000014',
    black15: '#00000015',
    black18: '#00000018',
    black20: '#00000020',
    black40: '#00000066',
    black50: '#00000080',
    black60: '#00000099',
    overlayBackdrop: '#00000080',
    ink06: '#0F172A06',
    ink08: '#0F172A08',
    ink0a: '#0F172A0A',
    ink12: '#0F172A12',
    ink15: '#0F172A15',
    ink50: '#0F172A80',
  },
} as const;

// ============================================================================
// 2. Semantic Design Tokens (High-Level Tokens for App Developers)
// ============================================================================
export const colors = {
  // Brand Identity
  brand: {
    primary: RAW_COLORS.brand.gold,            // '#7C612A'
    secondary: RAW_COLORS.brand.burgundy,      // '#560110'
    navy: RAW_COLORS.brand.navy,                // '#17153A'
    gold: RAW_COLORS.brand.gold,                // '#7C612A'
    goldDark: RAW_COLORS.brand.goldDark,        // '#644C1F'
    goldLight: RAW_COLORS.brand.goldLight,      // '#FAF7F2'
    goldLighter: RAW_COLORS.brand.goldLighter,  // '#FDF8F0'
    goldLightest: RAW_COLORS.brand.goldLightest,// '#FDFBF7'
    goldBorder: RAW_COLORS.brand.goldBorder,    // '#E8DFC8'
    goldBorderSubtle: RAW_COLORS.brand.goldBorderSubtle, // '#EBDCC1'
    burgundy: RAW_COLORS.brand.burgundy,        // '#560110'
    burgundyHover: RAW_COLORS.brand.burgundyHover, // '#45010D'
    burgundyDark: RAW_COLORS.brand.burgundyDark,// '#40000B'
    navyHover: RAW_COLORS.brand.navyHover,      // '#252252'
    navyActive: RAW_COLORS.brand.navyActive,    // '#25225C'
  },

  // Surfaces & Backgrounds
  surface: {
    app: RAW_COLORS.ink[50],          // '#F8FAFC' (App canvas)
    card: RAW_COLORS.ink.white,       // '#FFFFFF' (Cards, panels, sheets)
    subtle: RAW_COLORS.ink[100],      // '#F1F5F9' (Tabs, inactive rows, chips)
    hover: RAW_COLORS.ink[50],        // '#F8FAFC' (Row hover state)
    offWhite: RAW_COLORS.ink.offWhite,// '#FCFDFE'
    snow: RAW_COLORS.ink.snow,        // '#FAFAFA'
    dark: RAW_COLORS.brand.navy,      // '#17153A' (Toasts, dark headers)
    goldWarm: RAW_COLORS.brand.goldWarm, // '#F3E5D0'
  },

  // Typography & Text
  text: {
    primary: RAW_COLORS.ink[900],     // '#0F172A' (Headings, primary values)
    heading: RAW_COLORS.brand.navy,   // '#17153A' (Brand page headers)
    body: RAW_COLORS.ink[600],        // '#475569' (Body copy)
    secondary: RAW_COLORS.ink[500],   // '#64748B' (Captions, subtitles, labels)
    muted: RAW_COLORS.ink[400],       // '#94A3B8' (Placeholders, inactive text)
    dark: RAW_COLORS.ink[800],        // '#1E293B'
    slateDark: RAW_COLORS.ink[700],   // '#334155'
    inverse: RAW_COLORS.ink.white,    // '#FFFFFF' (White text on dark elements)
    brandGold: RAW_COLORS.brand.gold, // '#7C612A'
    brandBurgundy: RAW_COLORS.brand.burgundy, // '#560110'
  },

  // Borders & Dividers
  border: {
    default: RAW_COLORS.ink[200],     // '#E2E8F0' (Card & table borders)
    subtle: RAW_COLORS.ink[100],      // '#F1F5F9' (Soft row dividers)
    medium: RAW_COLORS.ink[300],      // '#CBD5E1' (Inputs, focus-outlines)
    dark: RAW_COLORS.ink[700],        // '#334155' (Dark toast border)
    brand: RAW_COLORS.brand.goldBorder,// '#E8DFC8' (Warm badge/card border)
    brandSubtle: RAW_COLORS.brand.goldBorderSubtle, // '#EBDCC1'
  },

  // Status & Feedback Themes
  status: {
    success: {
      bg: RAW_COLORS.success[50],            // '#F0FDF4'
      bgAlt: RAW_COLORS.success.bgAlt,       // '#ECFDF5'
      bgLight: RAW_COLORS.success[100],      // '#DCFCE7'
      border: RAW_COLORS.success[200],       // '#BBF7D0'
      borderAlt: RAW_COLORS.success.borderAlt,// '#A7F3D0'
      main: RAW_COLORS.success.main,         // '#16A34A'
      text: RAW_COLORS.success.text,         // '#15803D'
      icon: RAW_COLORS.success.emerald,      // '#10B981'
      dark: RAW_COLORS.success.dark,         // '#166534'
      bright: RAW_COLORS.success.bright,     // '#22C55E'
    },
    warning: {
      bg: RAW_COLORS.warning[50],            // '#FFFBEB'
      bgAlt: RAW_COLORS.warning[100],        // '#FEF3C7'
      border: RAW_COLORS.warning[200],       // '#FDE68A'
      main: RAW_COLORS.warning.main,         // '#F59E0B'
      text: RAW_COLORS.warning.text,         // '#B45309'
      orange: RAW_COLORS.warning.orange,     // '#D97706'
      dark: RAW_COLORS.warning.dark,         // '#92400E'
      deep: RAW_COLORS.warning.deep,         // '#78350F'
    },
    error: {
      bg: RAW_COLORS.error[50],              // '#FFF1F2'
      bgAlt: RAW_COLORS.error.alt,           // '#FEF2F2'
      bgLight: RAW_COLORS.error.light,       // '#FEE2E2'
      bgRose: RAW_COLORS.error.rose,         // '#FFE4E6'
      border: RAW_COLORS.error.border,       // '#FECDD3'
      borderAlt: RAW_COLORS.error.borderAlt, // '#FECACA'
      main: RAW_COLORS.error.main,           // '#EF4444'
      text: RAW_COLORS.error.text,           // '#BE123C'
      red: RAW_COLORS.error.red,             // '#DC2626'
      crimson: RAW_COLORS.error.crimson,     // '#E11D48'
      dark: RAW_COLORS.error.dark,           // '#9F1239'
      deep: RAW_COLORS.error.deep,           // '#991B1B'
    },
    info: {
      bg: RAW_COLORS.info[50],               // '#EFF6FF'
      bgAlt: RAW_COLORS.info.sky50,          // '#F0F9FF'
      border: RAW_COLORS.info[200],          // '#BFDBFE'
      borderAlt: RAW_COLORS.info[100],       // '#DBEAFE'
      borderSky: RAW_COLORS.info.sky200,     // '#BAE6FD'
      main: RAW_COLORS.info.main,            // '#2563EB'
      text: RAW_COLORS.info.text,            // '#1D4ED8'
      sky: RAW_COLORS.info.sky,              // '#0284C7'
      skyMain: RAW_COLORS.info.skyMain,      // '#0EA5E9'
      skyLight: RAW_COLORS.info.skyLight,    // '#38BDF8'
      blueDeep: RAW_COLORS.info.blueDeep,    // '#1C42D8'
      blueAccent: RAW_COLORS.info.blueAccent,// '#3B76F6'
    },
  },

  // Specialized Subject & Feature Accents
  accent: {
    purple: {
      bg: RAW_COLORS.accent.purple50,        // '#FAF5FF'
      bgAlt: RAW_COLORS.accent.purpleAlt50,  // '#F5F3FF'
      border: RAW_COLORS.accent.purpleBorder,// '#E9D5FF'
      borderAlt: RAW_COLORS.accent.purpleBorderAlt, // '#DDD6FE'
      text: RAW_COLORS.accent.purpleText,    // '#7E22CE'
      main: RAW_COLORS.accent.purpleMain,    // '#7C3AED'
      light: RAW_COLORS.accent.purpleLight,  // '#8B5CF6'
    },
    indigo: {
      bg: RAW_COLORS.accent.indigo50,        // '#EEF2FF'
      bgAlt: RAW_COLORS.accent.indigoAlt50,  // '#E0E7FF'
      border: RAW_COLORS.accent.indigoBorder,// '#C7D2FE'
      text: RAW_COLORS.accent.indigoText,    // '#4F46E5'
      dark: RAW_COLORS.accent.indigoDark,    // '#4338CA'
      main: RAW_COLORS.accent.indigoMain,    // '#6366F1'
    },
    fuchsia: {
      bg: RAW_COLORS.accent.fuchsia50,       // '#FAE8FF'
      bgAlt: RAW_COLORS.accent.fuchsiaAlt50, // '#FDF4FF'
      border: RAW_COLORS.accent.fuchsiaBorder,// '#F0ABFC'
      text: RAW_COLORS.accent.fuchsiaText,   // '#C026D3'
    },
    pink: {
      bg: RAW_COLORS.accent.pink50,          // '#FDF2F8'
      border: RAW_COLORS.accent.pinkBorder,  // '#FCE7F3'
      text: RAW_COLORS.accent.pinkText,      // '#BE185D'
    },
    cyan: {
      bg: RAW_COLORS.accent.cyan50,          // '#ECFEFF'
      border: RAW_COLORS.accent.cyanBorder,  // '#A5F3FC'
      text: RAW_COLORS.accent.cyanText,      // '#0891B2'
      teal: RAW_COLORS.accent.tealMain,      // '#14B8A6'
      tealDark: RAW_COLORS.accent.tealText,  // '#0F766E'
    },
  },

  // Shadows & Alphas
  shadow: {
    card: RAW_COLORS.alpha.black04,          // '#00000004'
    subtle: RAW_COLORS.alpha.black06,        // '#00000006'
    soft: RAW_COLORS.alpha.black08,          // '#00000008'
    pop: RAW_COLORS.alpha.black10,           // '#00000010'
    overlay: RAW_COLORS.alpha.black20,       // '#00000020'
  },

  // Backdrop & Modal Overlays (Semi-transparent black overlay for popups, modals, dialogs, drawers)
  overlay: {
    backdrop: RAW_COLORS.alpha.overlayBackdrop, // '#00000080' (Semi-transparent black 50% opacity)
    scrim: RAW_COLORS.alpha.black60,            // '#00000099' (Semi-transparent black 60% opacity)
    subtle: RAW_COLORS.alpha.black40,           // '#00000066' (Semi-transparent black 40% opacity)
  },
} as const;

// Types for theme consumption
export type ThemeColors = typeof colors;
export type RawPalette = typeof RAW_COLORS;

/**
 * Returns a typed color token safely with fallback.
 */
export function getColor<K1 extends keyof typeof colors, K2 extends keyof (typeof colors)[K1]>(
  category: K1,
  token: K2
): string {
  const cat = colors[category];
  if (cat && typeof cat === 'object' && token in cat) {
    return (cat as Record<string, any>)[token as string];
  }
  return '#17153A';
}
