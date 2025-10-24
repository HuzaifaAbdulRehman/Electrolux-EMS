# ElectroLux EMS - Complete Theme & Style Configuration Guide

> **Last Updated:** 2025-10-24
> **Purpose:** Complete reference for all theme settings, fonts, colors, and styling configurations

---

## 📋 Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Component Styles](#component-styles)
4. [Theme Configuration](#theme-configuration)
5. [Gradients & Animations](#gradients--animations)
6. [Responsive Breakpoints](#responsive-breakpoints)

---

## 🎨 Color Palette

### Primary Brand Colors

#### Yellow-Orange Gradient (Primary Accent)
```css
/* Main brand gradient - represents electricity/energy */
from-yellow-400 to-orange-500
from-yellow-500 to-orange-600 (hover state)

Hex Values:
- yellow-400: #FACC15
- yellow-500: #FBBF24
- orange-500: #FB923C
- orange-600: #F97316
```

#### Electric Blue (Alternative Primary)
```javascript
primary: {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',  // Main primary color
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
}
```

#### Secondary - Dark Navy/Slate
```javascript
secondary: {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',  // Main secondary color
  900: '#0F172A',
}
```

#### Amber Accent
```javascript
accent: {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',  // Main accent color
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
}
```

### Semantic Colors

#### Success (Green)
```javascript
success: {
  light: '#D1FAE5',      // Light background
  DEFAULT: '#10B981',    // Main color
  dark: '#065F46',       // Dark variant
}

// Usage in components:
bg-green-100 dark:bg-green-900/30
text-green-800 dark:text-green-400
border-green-300 dark:border-green-700
```

#### Error/Danger (Red)
```javascript
error: {
  light: '#FEE2E2',
  DEFAULT: '#EF4444',
  dark: '#991B1B',
}

// Usage:
bg-red-100 dark:bg-red-900/30
text-red-800 dark:text-red-400
border-red-300 dark:border-red-700
```

#### Warning (Yellow/Amber)
```javascript
warning: {
  light: '#FEF3C7',
  DEFAULT: '#F59E0B',
  dark: '#92400E',
}

// Usage:
bg-yellow-100 dark:bg-yellow-900/30
text-yellow-800 dark:text-yellow-400
border-yellow-300 dark:border-yellow-700
```

#### Info (Blue)
```javascript
info: {
  light: '#DBEAFE',
  DEFAULT: '#3B82F6',
  dark: '#1E40AF',
}

// Usage:
bg-blue-100 dark:bg-blue-900/30
text-blue-800 dark:text-blue-400
border-blue-300 dark:border-blue-700
```

### Neutral Colors (Gray Scale)
```javascript
gray: {
  50: '#F9FAFB',   // Lightest
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',  // Mid gray
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',  // Darkest
}
```

### Background Colors

#### Light Mode
```css
html:not(.dark) body {
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb);
}

/* Specific backgrounds */
background.primary: #FFFFFF (white)
background.secondary: #F8FAFC (very light gray)
background.tertiary: #F1F5F9 (light gray)
```

#### Dark Mode
```css
html.dark body {
  background: linear-gradient(to bottom right, #0f172a, #581c87, #0f172a);
}

/* Dark default */
html { background-color: #0f172a; }
```

### Text Colors

#### Light Mode
```javascript
text: {
  primary: '#1F2937',    // Main text (gray-800)
  secondary: '#6B7280',  // Secondary text (gray-500)
  tertiary: '#9CA3AF',   // Muted text (gray-400)
  inverse: '#FFFFFF',    // White text
}
```

#### Dark Mode
```css
dark:text-white        /* Primary text */
dark:text-gray-300     /* Body text */
dark:text-gray-400     /* Secondary/muted text */
dark:text-gray-500     /* Extra muted */
```

---

## 📝 Typography

### Font Families

#### Primary Font Stack
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  display: ['Poppins', 'Inter', 'sans-serif'],
}

// Implementation in layout.tsx:
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
```

**Font Sources:**
- **Inter** - Main UI font (Google Fonts)
- **JetBrains Mono** - Monospace font for code
- **Poppins** - Display/heading font

### Font Sizes
```javascript
fontSize: {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px (default)
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
}
```

### Font Weights
```javascript
fontWeight: {
  normal: 400,     // Regular text
  medium: 500,     // Slightly bold
  semibold: 600,   // Headings
  bold: 700,       // Strong emphasis
}
```

### Line Heights
```javascript
lineHeight: {
  tight: 1.25,     // Headings
  normal: 1.5,     // Body text
  relaxed: 1.75,   // Comfortable reading
}
```

### Heading Styles
```javascript
text: {
  h1: 'text-3xl font-bold text-gray-900 dark:text-white',
  h2: 'text-2xl font-bold text-gray-900 dark:text-white',
  h3: 'text-xl font-semibold text-gray-900 dark:text-white',
  h4: 'text-lg font-semibold text-gray-800 dark:text-gray-100',
  body: 'text-gray-700 dark:text-gray-300',
  secondary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
  small: 'text-sm text-gray-600 dark:text-gray-400',
  xs: 'text-xs text-gray-500 dark:text-gray-500'
}
```

---

## 🎯 Component Styles

### Cards

#### Base Card Style
```javascript
card: {
  base: 'rounded-2xl p-6 transition-all duration-200',
  light: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
  dark: 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20'
}

// Full combined style:
'bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10'
```

#### Card Variants
```css
/* Hover effect */
hover:border-gray-300 dark:hover:border-white/20

/* Gradient card */
bg-gradient-to-r from-gray-50 to-white dark:from-white/5 dark:to-white/10
```

### Buttons

#### Primary Button
```javascript
primary: {
  base: 'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
  light: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30',
  dark: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
}

// Full class:
'px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all'
```

#### Secondary Button
```javascript
secondary: {
  base: 'px-6 py-3 rounded-lg font-medium transition-all duration-200',
  light: 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200',
  dark: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
}
```

#### Ghost Button
```javascript
ghost: {
  base: 'px-4 py-2 rounded-lg transition-all duration-200',
  light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  dark: 'text-gray-400 hover:text-white hover:bg-white/10'
}
```

### Input Fields

#### Text Input
```javascript
input: {
  base: 'w-full px-4 py-3 rounded-lg transition-colors focus:outline-none',
  light: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  dark: 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
}
```

#### Select Dropdown
```css
px-4 py-2 bg-white dark:bg-white/10
border border-gray-300 dark:border-white/20
rounded-lg text-gray-900 dark:text-white
focus:outline-none
focus:border-blue-500 dark:focus:border-yellow-400
```

### Tables

#### Table Structure
```javascript
table: {
  container: 'overflow-x-auto rounded-lg',
  base: 'w-full',
  header: 'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700',
  headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider',
  body: 'bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700',
  row: 'hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors',
  cell: 'px-6 py-4 text-sm text-gray-900 dark:text-gray-100'
}
```

### Badges

```javascript
badge: {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}
```

### Navigation Items

#### Active Navigation
```javascript
active: {
  light: 'bg-blue-50 text-blue-600 border border-blue-200',
  dark: 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/50'
}
```

#### Inactive Navigation
```javascript
inactive: {
  light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  dark: 'text-gray-300 hover:text-white hover:bg-white/10'
}
```

---

## ⚙️ Theme Configuration

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',  // Uses 'dark' class on <html>
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
```

### Theme Provider Setup
```javascript
// ThemeProvider.tsx
- Checks localStorage for 'theme' preference
- Defaults to 'dark' if no preference saved
- Applies 'dark' class to document.documentElement
- Prevents flash by rendering null until mounted
```

### Theme Persistence
```javascript
// Stored in: localStorage.getItem('theme')
// Values: 'dark' | 'light'
// Default: 'dark'

// HTML class application:
document.documentElement.classList.add('dark')    // Dark mode
document.documentElement.classList.remove('dark') // Light mode
```

---

## 🌈 Gradients & Animations

### Primary Gradients

#### Brand Gradient (Yellow-Orange)
```css
/* Main brand gradient - used for buttons, accents */
bg-gradient-to-r from-yellow-400 to-orange-500

/* Hover state */
hover:from-yellow-500 hover:to-orange-600

/* With shadow */
hover:shadow-lg hover:shadow-orange-500/50
```

#### Blue Gradient (Alternative)
```css
bg-gradient-to-r from-blue-500 to-cyan-500
hover:shadow-lg hover:shadow-blue-500/30
```

#### Purple Gradient (Dark backgrounds)
```css
/* Used in dark mode backgrounds */
from-gray-900 via-purple-900 to-gray-900
from-slate-900 via-purple-900 to-slate-900
```

#### Subtle Card Gradients
```css
/* Light mode */
bg-gradient-to-r from-gray-50 to-white

/* Dark mode */
dark:from-white/5 dark:to-white/10
```

### Scrollbar Styling
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #facc15, #fb923c);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #fbbf24, #f97316);
}
```

### Custom Animations

#### Float Animation
```css
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

#### Blob Animation (Background)
```css
/* Used in login/register pages */
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Blob colors */
bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl
bg-orange-400 rounded-full mix-blend-multiply filter blur-xl
bg-red-400 rounded-full mix-blend-multiply filter blur-xl
```

### Transitions
```javascript
transitions: {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// CSS usage:
transition-all duration-200
transition-colors duration-300
transition: background-color 0.2s ease
```

---

## 📱 Responsive Breakpoints

```javascript
breakpoints: {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large
}

// Usage in Tailwind:
sm:text-sm      // Apply on screens >= 640px
md:grid-cols-2  // Apply on screens >= 768px
lg:px-8         // Apply on screens >= 1024px
xl:max-w-7xl    // Apply on screens >= 1280px
```

---

## 🎨 Spacing & Sizing

### Spacing Scale
```javascript
spacing: {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

### Border Radius
```javascript
borderRadius: {
  none: '0',
  sm: '0.125rem',     // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px - Used for buttons
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px - Used for cards
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Full circle
}

// Common usage:
rounded-lg    // Buttons, inputs
rounded-2xl   // Cards, containers
rounded-full  // Badges, avatars
```

### Box Shadows
```javascript
shadows: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}

// Hover shadows with color:
hover:shadow-lg hover:shadow-orange-500/50
hover:shadow-lg hover:shadow-blue-500/30
```

---

## 🎯 Special Effects

### Backdrop Blur
```css
backdrop-blur-xl    /* Used for glassmorphism cards */
backdrop-blur-sm    /* Subtle blur for overlays */

/* Combined with opacity */
bg-white/5 backdrop-blur-xl           /* Dark mode */
bg-white/10 backdrop-blur-sm          /* Light mode */
```

### Opacity Scale
```css
/* Background opacity (used with dark mode) */
bg-white/5     /* 5% */
bg-white/10    /* 10% */
bg-white/20    /* 20% */
bg-black/50    /* 50% */
bg-black/80    /* 80% */

/* Text opacity */
text-white/80
text-black/60
```

### Checkbox Styling
```css
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
}

input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #facc15, #fb923c);
  border-color: #facc15;
}

input[type="checkbox"]:focus {
  outline: 2px solid #facc15;
  outline-offset: 2px;
}
```

---

## 📊 Chart Configuration

### Chart Theme (Dark Mode)
```javascript
getChartConfig(isDark: boolean) {
  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
  titleColor: isDark ? '#ffffff' : '#111827',
  bodyColor: isDark ? '#ffffff' : '#111827',
  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(209, 213, 219, 0.5)',

  // Grid colors
  gridColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(156, 163, 175, 0.15)',

  // Tick colors
  tickColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(55, 65, 81, 0.9)',
}
```

---

## 🔧 Utility Classes

### Common Combinations

#### Container/Page Wrapper
```css
min-h-screen transition-colors duration-300
```

#### Content Spacing
```css
space-y-6     /* Vertical spacing between elements */
space-x-4     /* Horizontal spacing */
gap-4         /* Grid/flex gap */
```

#### Hover Effects
```css
hover:scale-[1.01]           /* Slight scale up */
hover:shadow-lg              /* Elevate on hover */
transition-all duration-300  /* Smooth transitions */
```

#### Glassmorphism
```css
bg-white/5 backdrop-blur-xl border border-white/10
```

---

## 📝 File Locations

```
Project Structure:
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles & animations
│   │   └── layout.tsx            # Font imports
│   ├── components/
│   │   └── ThemeProvider.tsx     # Theme switching logic
│   ├── styles/
│   │   └── theme.ts              # Complete design tokens
│   └── utils/
│       ├── themeStyles.ts        # Component style utilities
│       └── themeClasses.ts       # Reusable class combinations
└── tailwind.config.js            # Tailwind configuration
```

---

## 💡 Usage Guidelines

### For Light Mode
- Use blue gradients (`from-blue-500 to-cyan-500`)
- White backgrounds with subtle shadows
- Dark text on light backgrounds
- Border colors: `border-gray-300`

### For Dark Mode
- Use yellow-orange gradients (`from-yellow-400 to-orange-500`)
- Semi-transparent backgrounds with blur (`bg-white/5 backdrop-blur-xl`)
- Light text on dark backgrounds
- Border colors: `border-white/10` to `border-white/20`

### Theme-Aware Classes Pattern
```css
/* Always write both states */
bg-white dark:bg-white/5
text-gray-900 dark:text-white
border-gray-200 dark:border-white/10
hover:bg-gray-100 dark:hover:bg-white/20
```

---

## 🎨 Brand Identity Summary

**Primary Colors:** Yellow (#FACC15) → Orange (#FB923C)
**Secondary:** Dark Navy/Slate (#0F172A - #1E293B)
**Accent:** Electric Blue (#3B82F6) or Amber (#F59E0B)

**Fonts:**
- Headings: Poppins / Inter Bold
- Body: Inter Regular/Medium
- Code: JetBrains Mono

**Design Style:**
- Modern glassmorphism (dark mode)
- Clean minimalism (light mode)
- Smooth gradients and transitions
- Energy/electricity theme with yellow-orange accent

---

**End of Style Guide**