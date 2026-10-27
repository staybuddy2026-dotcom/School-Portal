/**
 * ============================================================================
 * Centralized Material UI (MUI) Theme Configuration
 * Integrated with Centralized School Color System & Poppins Font
 * ============================================================================
 */
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography, fontSizes, lineHeights, fontWeights, FONT_FAMILY_POPPINS } from './typography';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.brand.gold,             // '#7C612A'
      light: colors.brand.goldLight,       // '#FAF7F2'
      dark: colors.brand.burgundy,         // '#560110'
      contrastText: colors.text.inverse,   // '#FFFFFF'
    },
    secondary: {
      main: colors.brand.navy,             // '#17153A'
      dark: colors.brand.navyActive,       // '#25225C'
      contrastText: colors.text.inverse,   // '#FFFFFF'
    },
    error: {
      main: colors.status.error.main,      // '#EF4444'
      light: colors.status.error.bg,       // '#FFF1F2'
      dark: colors.status.error.text,      // '#BE123C'
      contrastText: colors.text.inverse,
    },
    warning: {
      main: colors.status.warning.main,    // '#F59E0B'
      light: colors.status.warning.bg,     // '#FFFBEB'
      dark: colors.status.warning.text,    // '#B45309'
      contrastText: colors.text.inverse,
    },
    info: {
      main: colors.status.info.main,       // '#2563EB'
      light: colors.status.info.bg,        // '#EFF6FF'
      dark: colors.status.info.text,       // '#1D4ED8'
      contrastText: colors.text.inverse,
    },
    success: {
      main: colors.status.success.icon,    // '#10B981'
      light: colors.status.success.bg,     // '#F0FDF4'
      dark: colors.status.success.text,    // '#15803D'
      contrastText: colors.text.inverse,
    },
    background: {
      default: colors.surface.app,         // '#F8FAFC'
      paper: colors.surface.card,          // '#FFFFFF'
    },
    text: {
      primary: colors.text.primary,        // '#0F172A'
      secondary: colors.text.secondary,    // '#64748B'
      disabled: colors.text.muted,         // '#94A3B8'
    },
    divider: colors.border.default,        // '#E2E8F0'
  },
  typography: {
    fontFamily: FONT_FAMILY_POPPINS,
    fontSize: 14, // Base font size in px
    htmlFontSize: 16,
    h1: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h1.fontSize, // '24px'
      lineHeight: typography.heading.h1.lineHeight,
      fontWeight: typography.heading.h1.fontWeight,
    },
    h2: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h2.fontSize, // '20px'
      lineHeight: typography.heading.h2.lineHeight,
      fontWeight: typography.heading.h2.fontWeight,
    },
    h3: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h3.fontSize, // '18px'
      lineHeight: typography.heading.h3.lineHeight,
      fontWeight: typography.heading.h3.fontWeight,
    },
    h4: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h4.fontSize, // '16px'
      lineHeight: typography.heading.h4.lineHeight,
      fontWeight: typography.heading.h4.fontWeight,
    },
    h5: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h5.fontSize, // '15px'
      lineHeight: typography.heading.h5.lineHeight,
      fontWeight: typography.heading.h5.fontWeight,
    },
    h6: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: typography.heading.h6.fontSize, // '14px'
      lineHeight: typography.heading.h6.lineHeight,
      fontWeight: typography.heading.h6.fontWeight,
    },
    subtitle1: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.base, // '16px'
      lineHeight: lineHeights['16px'],
      fontWeight: fontWeights.medium,
    },
    subtitle2: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.medium,
    },
    body1: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.sm, // '14px'
      lineHeight: lineHeights['14px'],
      fontWeight: fontWeights.regular,
    },
    body2: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.compact, // '13px'
      lineHeight: lineHeights['13px'],
      fontWeight: fontWeights.regular,
    },
    button: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.compact, // '13px'
      lineHeight: lineHeights['13px'],
      fontWeight: fontWeights.semibold,
      textTransform: 'none',
    },
    caption: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes.xs, // '12px'
      lineHeight: lineHeights['12px'],
      fontWeight: fontWeights.regular,
    },
    overline: {
      fontFamily: FONT_FAMILY_POPPINS,
      fontSize: fontSizes['2xs'], // '11px'
      lineHeight: lineHeights['11px'],
      fontWeight: fontWeights.bold,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    allVariants: {
      fontFamily: FONT_FAMILY_POPPINS,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '14px',
          backgroundColor: colors.surface.app,
          color: colors.text.body,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '13px',
          borderRadius: '12px',
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '13px',
          padding: '12px 16px',
        },
        head: {
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: colors.text.secondary,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '14px',
        },
        input: {
          fontFamily: FONT_FAMILY_POPPINS,
          '&::placeholder': {
            fontFamily: FONT_FAMILY_POPPINS,
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
        },
        input: {
          fontFamily: FONT_FAMILY_POPPINS,
          '&::placeholder': {
            fontFamily: FONT_FAMILY_POPPINS,
            opacity: 1,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '13px',
          fontWeight: 500,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '13px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: '9999px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '11px',
          borderRadius: '8px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY_POPPINS,
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          borderColor: colors.border.default,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: colors.overlay.backdrop, // '#00000080'
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) !important',
        },
        invisible: {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 20px 50px #00000020',
          border: `1px solid ${colors.border.default}`,
        },
      },
    },
  },
});

