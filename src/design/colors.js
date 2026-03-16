/**
 * VOXU Design Token System — Centralized Color Palette
 * =====================================================
 * All color decisions flow from this single file.
 * Components import tokens from here instead of hardcoding hex values.
 *
 * Usage:
 *   import { colors } from '../design/colors'
 *   style={{ background: colors.primary }}
 */

export const colors = {
  // ─── Core Palette ───
  primary:    '#98c21d',   // Lime green — main actions, CTAs
  secondary:  '#2a398e',   // Deep blue  — hover states, links, accents
  background: '#f0f1f0',   // Light gray — page/section backgrounds
  dark:       '#080908',   // Near-black — text, headers, strong contrast

  // ─── Derived / Functional ───
  primaryLight:    '#c8e472',  // Lighter primary for subtle backgrounds
  primaryUltra:    '#f4f9e4',  // Ultra-light primary tint for hover states
  secondaryLight:  '#4a5bb8',  // Lighter secondary for hover transitions
  secondaryUltra:  '#e8eaf6',  // Ultra-light secondary for selected backgrounds

  // ─── Semantic ───
  success:   '#00875a',
  successBright: '#00c97d',
  warning:   '#ff6000',
  error:     '#c62828',
  errorLight:'#f87171',
  info:      '#1244d9',

  // ─── Text ───
  text:        '#080908',
  textMuted:   '#5a5e5a',
  textLight:   '#8a8e8a',
  textSec:     '#3d413d',

  // ─── Surface ───
  card:        '#ffffff',
  darkCard:    '#080908',
  border:      '#dcdedd',
  borderMed:   '#c8cac8',

  // ─── Shadows (as strings for inline use) ───
  shadowSm:   '0 2px 8px rgba(8, 9, 8, 0.07)',
  shadow:     '0 8px 32px rgba(42, 57, 142, 0.10)',
  shadowCard: '0 12px 40px rgba(42, 57, 142, 0.13)',
  shadowHover:'0 20px 50px rgba(42, 57, 142, 0.20)',

  // ─── Gradients ───
  gradPrimary:  'linear-gradient(135deg, #98c21d, #7da318)',
  gradSecondary:'linear-gradient(135deg, #2a398e, #4a5bb8)',
  gradDark:     'linear-gradient(145deg, #0f110f 0%, #080908 50%, #040504 100%)',
  gradBg:       'linear-gradient(170deg, #f0f1f0 0%, #e8eaf6 60%, #f4f9e4 100%)',

  // ─── Status chips / badges ───
  chipPending:   '#e8eaf6',
  chipPendingText:'#2a398e',
  chipPaid:      '#e6f4ec',
  chipPaidText:  '#00875a',
  chipWarning:   '#fff3e0',
  chipWarningText:'#ff6000',
  chipShared:    '#e8eaf6',
  chipSharedText:'#2a398e',

  // ─── Charts ───
  chartIncome:  '#98c21d',
  chartExpense: '#2a398e',
  chartVivienda:'#2a398e',
  chartImpuestos:'#ff6000',
  chartServicios:'#00875a',
  chartSubs:     '#98c21d',

  // ─── Category icon backgrounds ───
  catRed:    '#fce4e4',
  catGreen:  '#e6f4ec',
  catBlue:   '#e8eaf6',
  catPurple: '#f4f9e4',
  catCyan:   '#e0f7fa',
  catYellow: '#fff8e1',
  catOrange: '#fff3e0',
}

/**
 * Dark theme overrides — use with [data-theme="dark"] CSS vars.
 * These are applied via CSS custom properties, not directly imported.
 */
export const darkColors = {
  background:    '#080908',
  card:          '#141614',
  darkCard:      '#1c1e1c',
  text:          '#f0f1f0',
  textMuted:     '#8a8e8a',
  textLight:     '#5a5e5a',
  textSec:       '#c0c2c0',
  border:        '#242624',
  borderMed:     '#2e302e',
  primaryUltra:  '#1a2008',
  secondaryUltra:'#141830',
}
