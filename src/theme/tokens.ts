/**
 * GenSentiel — Cybernetic Kinetic Design Tokens
 *
 * OLED-optimized dark theme with neon lime primary,
 * violet secondary, and cyan tertiary accents.
 */

export const Colors = {
  // ── Core Backgrounds (OLED-optimized) ──────────────────────────
  black: '#000000',
  surface: '#121414',
  surfaceDim: '#121414',
  surfaceBright: '#38393a',
  surfaceContainerLowest: '#0c0f0f',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainer: '#1e2020',
  surfaceContainerHigh: '#282a2b',
  surfaceContainerHighest: '#333535',
  surfaceVariant: '#333535',

  // ── Text ───────────────────────────────────────────────────────
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  textPrimary: '#ffffff',
  textMuted: '#8e9379',

  // ── Primary (Neon Lime) ────────────────────────────────────────
  primary: '#ffffff',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  onPrimary: '#283500',
  onPrimaryContainer: '#556d00',

  // ── Secondary (Violet) ─────────────────────────────────────────
  secondary: '#dcb8ff',
  secondaryContainer: '#7701d0',
  secondaryFixedDim: '#dcb8ff',
  onSecondary: '#480081',
  onSecondaryContainer: '#dcb7ff',

  // ── Tertiary (Cyan) ────────────────────────────────────────────
  tertiary: '#ffffff',
  tertiaryContainer: '#9cf0ff',
  tertiaryFixedDim: '#00daf3',
  onTertiary: '#00363d',
  onTertiaryContainer: '#006f7c',

  // ── Semantic ───────────────────────────────────────────────────
  error: '#ffb4ab',
  errorContainer: '#93000a',
  success: '#22C55E',
  warning: '#F59E0B',

  // ── Borders ────────────────────────────────────────────────────
  outline: '#8e9379',
  outlineVariant: '#444933',

  // ── Glassmorphism ──────────────────────────────────────────────
  glassViolet: 'rgba(138, 43, 226, 0.08)',
  glassBorder: 'rgba(138, 43, 226, 0.3)',
  neonGlow: 'rgba(171, 214, 0, 0.4)',
} as const;

// ── Font Families ──────────────────────────────────────────────────
export const FontFamily = {
  display: 'SpaceGrotesk_700Bold',
  headline: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyBold: 'Inter_600SemiBold',
} as const;

// ── Typography Scale ───────────────────────────────────────────────
export const Typography = {
  /** Large timer / hero numbers — 48px Space Grotesk Bold */
  displayTimer: {
    fontFamily: FontFamily.display,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.5,
  },

  /** Desktop headline — 32px Space Grotesk SemiBold */
  headlineLg: {
    fontFamily: FontFamily.headline,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.25,
  },

  /** Section title — 24px Space Grotesk SemiBold */
  headlineMd: {
    fontFamily: FontFamily.headline,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },

  /** Mobile headline — 28px Space Grotesk SemiBold */
  headlineLgMobile: {
    fontFamily: FontFamily.headline,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.25,
  },

  /** Body large — 18px Inter Regular */
  bodyLg: {
    fontFamily: FontFamily.body,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
  },

  /** Body medium (default) — 16px Inter Regular */
  bodyMd: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /** Body medium bold — 16px Inter SemiBold */
  bodyMdBold: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /** Body small — 14px Inter Regular */
  bodySm: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  /** Uppercase label — 12px Inter SemiBold, tracked */
  labelCaps: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

// ── Spacing (4-point grid) ─────────────────────────────────────────
export const Spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 16,
  marginMobile: 20,
} as const;

// ── Border Radii ───────────────────────────────────────────────────
export const Radius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ── Shadow presets ─────────────────────────────────────────────────
export const Shadows = {
  /** Subtle elevation for cards */
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  /** Neon lime glow for primary-accented elements */
  neonGlow: {
    shadowColor: Colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  /** Violet glow for glass/secondary elements */
  violetGlow: {
    shadowColor: Colors.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
