import { Theme } from '@/types'

export interface ThemeConfig {
  name: string
  description: string
  bg: string
  bg2: string
  surface: string
  border: string
  primary: string
  primaryDark: string
  accent: string
  text: string
  text2: string
  glow: string
  gradHero: string
  gradAccent: string
  gradBtn: string
  scrollBg: string
  scrollBg2: string
  scrollText: string
  scrollAcc: string
  scrollDec: string
  swatchClass: string
}

export const THEMES: Record<Theme, ThemeConfig> = {
  rose: {
    name: 'Rosé Elegante',
    description: 'Delicado, romântico, feminino',
    bg: '#130a10',
    bg2: '#1e1018',
    surface: 'rgba(232,160,180,0.08)',
    border: 'rgba(232,160,180,0.18)',
    primary: '#e8a0b4',
    primaryDark: '#c47b9a',
    accent: '#ff6b9e',
    text: '#fff0f5',
    text2: 'rgba(255,240,245,0.6)',
    glow: 'rgba(232,160,180,0.4)',
    gradHero: 'radial-gradient(ellipse at 30% 40%, #3d1a2a 0%, #130a10 60%)',
    gradAccent: 'linear-gradient(135deg,#e8a0b4,#ff6b9e,#c47b9a)',
    gradBtn: 'linear-gradient(135deg,#e8a0b4,#c47b9a)',
    scrollBg: '#fff5f8',
    scrollBg2: '#ffe8f0',
    scrollText: '#2d1520',
    scrollAcc: '#c47b9a',
    scrollDec: 'rgba(196,123,154,0.2)',
    swatchClass: 'from-rose-300 via-pink-400 to-rose-500',
  },
  gold: {
    name: 'Luxo Minimalista',
    description: 'Sofisticado, exclusivo, dourado',
    bg: '#0d0c09',
    bg2: '#181610',
    surface: 'rgba(212,175,55,0.07)',
    border: 'rgba(212,175,55,0.2)',
    primary: '#d4af37',
    primaryDark: '#b8962c',
    accent: '#f5d060',
    text: '#faf6e8',
    text2: 'rgba(250,246,232,0.6)',
    glow: 'rgba(212,175,55,0.4)',
    gradHero: 'radial-gradient(ellipse at 30% 40%, #2a2400 0%, #0d0c09 60%)',
    gradAccent: 'linear-gradient(135deg,#d4af37,#f5d060,#b8962c)',
    gradBtn: 'linear-gradient(135deg,#d4af37,#b8962c)',
    scrollBg: '#fefcf0',
    scrollBg2: '#faf5d0',
    scrollText: '#1a1500',
    scrollAcc: '#b8962c',
    scrollDec: 'rgba(184,150,44,0.2)',
    swatchClass: 'from-yellow-300 via-amber-400 to-yellow-600',
  },
  floral: {
    name: 'Floral Premium',
    description: 'Natural, delicado, primaveril',
    bg: '#0b1409',
    bg2: '#131e10',
    surface: 'rgba(134,197,120,0.07)',
    border: 'rgba(134,197,120,0.18)',
    primary: '#86c578',
    primaryDark: '#5fa850',
    accent: '#e8a0b4',
    text: '#f0fff0',
    text2: 'rgba(240,255,240,0.6)',
    glow: 'rgba(134,197,120,0.35)',
    gradHero: 'radial-gradient(ellipse at 30% 40%, #1a2e14 0%, #0b1409 60%)',
    gradAccent: 'linear-gradient(135deg,#86c578,#e8a0b4,#5fa850)',
    gradBtn: 'linear-gradient(135deg,#86c578,#5fa850)',
    scrollBg: '#f4fff2',
    scrollBg2: '#e8f5e0',
    scrollText: '#0b1e08',
    scrollAcc: '#5fa850',
    scrollDec: 'rgba(95,168,80,0.2)',
    swatchClass: 'from-green-300 via-emerald-400 to-green-500',
  },
  dark: {
    name: 'Cinema Noir',
    description: 'Cinematográfico, profundo, intenso',
    bg: '#050505',
    bg2: '#0e0e0e',
    surface: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    primary: '#c8c8c8',
    primaryDark: '#909090',
    accent: '#ffffff',
    text: '#f5f5f5',
    text2: 'rgba(245,245,245,0.55)',
    glow: 'rgba(200,200,200,0.3)',
    gradHero: 'radial-gradient(ellipse at 30% 40%, #1a1a1a 0%, #050505 60%)',
    gradAccent: 'linear-gradient(135deg,#c8c8c8,#ffffff,#909090)',
    gradBtn: 'linear-gradient(135deg,#444,#222)',
    scrollBg: '#f8f8f8',
    scrollBg2: '#ebebeb',
    scrollText: '#111',
    scrollAcc: '#333',
    scrollDec: 'rgba(0,0,0,0.15)',
    swatchClass: 'from-gray-500 via-gray-700 to-gray-900',
  },
  parchment: {
    name: 'Pergaminho Clássico',
    description: 'Artesanal, atemporal, nostálgico',
    bg: '#1a1408',
    bg2: '#241c0c',
    surface: 'rgba(205,170,110,0.08)',
    border: 'rgba(205,170,110,0.2)',
    primary: '#cdaa6e',
    primaryDark: '#a8843c',
    accent: '#e8c87a',
    text: '#fdf6e3',
    text2: 'rgba(253,246,227,0.6)',
    glow: 'rgba(205,170,110,0.35)',
    gradHero: 'radial-gradient(ellipse at 30% 40%, #2e2208 0%, #1a1408 60%)',
    gradAccent: 'linear-gradient(135deg,#cdaa6e,#e8c87a,#a8843c)',
    gradBtn: 'linear-gradient(135deg,#cdaa6e,#a8843c)',
    scrollBg: '#fdf6e3',
    scrollBg2: '#f5e8c0',
    scrollText: '#2a1a00',
    scrollAcc: '#a8843c',
    scrollDec: 'rgba(168,132,60,0.2)',
    swatchClass: 'from-amber-200 via-yellow-400 to-amber-500',
  },
}

export function getCSSVars(theme: Theme): Record<string, string> {
  const t = THEMES[theme]
  return {
    '--c-bg': t.bg,
    '--c-bg2': t.bg2,
    '--c-surface': t.surface,
    '--c-border': t.border,
    '--c-primary': t.primary,
    '--c-primary-d': t.primaryDark,
    '--c-accent': t.accent,
    '--c-text': t.text,
    '--c-text2': t.text2,
    '--c-glow': t.glow,
    '--grad-hero': t.gradHero,
    '--grad-accent': t.gradAccent,
    '--grad-btn': t.gradBtn,
    '--scroll-bg': t.scrollBg,
    '--scroll-bg2': t.scrollBg2,
    '--scroll-text': t.scrollText,
    '--scroll-acc': t.scrollAcc,
    '--scroll-dec': t.scrollDec,
  }
}
