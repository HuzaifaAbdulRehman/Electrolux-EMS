# ElectroLux EMS - Modern Dark Theme Configuration
## Electric Noir Theme - 2025 Edition

### 🎨 Theme Overview
A sophisticated dark theme combining deep blacks with electric yellow/amber accents, inspired by electricity and modern UI trends. This theme removes the excessive colorfulness while maintaining visual interest through strategic use of electric glow effects.

---

## 🌑 Color Palette

### Primary Dark Colors (Background Layers)
Based on Material Design dark theme elevation system:

```css
/* Base Dark Colors - Using dark grays instead of pure black for better eye comfort */
--dark-base: #0A0A0A;        /* Near-black base (97% black) */
--dark-surface-0: #121212;   /* Default surface (Material Design recommendation) */
--dark-surface-1: #1E1E1E;   /* Elevated surface 1dp */
--dark-surface-2: #232323;   /* Elevated surface 2dp */
--dark-surface-3: #252525;   /* Elevated surface 3dp */
--dark-surface-4: #272727;   /* Elevated surface 4dp */
--dark-surface-6: #2C2C2C;   /* Elevated surface 6dp */
--dark-surface-8: #2E2E2E;   /* Elevated surface 8dp */
--dark-surface-12: #333333;  /* Elevated surface 12dp */
--dark-surface-16: #363636;  /* Elevated surface 16dp */
--dark-surface-24: #383838;  /* Elevated surface 24dp */
```

### Electric Accent Colors (Energy Theme)
```css
/* Primary Electric Yellow/Amber - Represents electricity */
--electric-primary: #FFB800;     /* Main electric amber */
--electric-glow: #FFC933;        /* Lighter glow effect */
--electric-bright: #FFD54F;      /* Bright highlights */
--electric-dim: #F59E0B;         /* Dimmed electric */
--electric-dark: #D97706;        /* Dark amber */

/* Secondary Electric Blue - High voltage */
--voltage-blue: #0EA5E9;         /* Electric cyan blue */
--voltage-bright: #38BDF8;       /* Bright voltage */
--voltage-glow: #7DD3FC;         /* Blue glow effect */
--voltage-dim: #0284C7;          /* Dimmed blue */
--voltage-dark: #0369A1;         /* Dark blue */

/* Accent Colors - Minimal use */
--accent-success: #10B981;       /* Green for success */
--accent-warning: #F59E0B;       /* Amber for warnings */
--accent-danger: #EF4444;        /* Red for danger/errors */
--accent-info: #3B82F6;          /* Blue for information */
```

### Text Colors (High Contrast)
```css
/* Text hierarchy with proper contrast ratios */
--text-primary: rgba(255, 255, 255, 0.95);    /* 95% white */
--text-secondary: rgba(255, 255, 255, 0.70);  /* 70% white */
--text-tertiary: rgba(255, 255, 255, 0.50);   /* 50% white */
--text-disabled: rgba(255, 255, 255, 0.30);   /* 30% white */
--text-electric: #FFB800;                      /* Electric text */
```

### Glass Morphism Effects
```css
/* Modern glassmorphism with subtle effects */
--glass-surface: rgba(255, 255, 255, 0.03);   /* 3% white */
--glass-hover: rgba(255, 255, 255, 0.05);     /* 5% white */
--glass-active: rgba(255, 255, 255, 0.08);    /* 8% white */
--glass-border: rgba(255, 255, 255, 0.10);    /* 10% white */
--glass-border-hover: rgba(255, 255, 255, 0.15); /* 15% white */
```

---

## 🎯 Component Styles

### Background Gradient (Subtle Dark)
```css
/* Remove purple tint, use subtle dark gradient */
html.dark body {
  background: linear-gradient(135deg, #0A0A0A 0%, #121212 50%, #0A0A0A 100%);
  /* Alternative with subtle electric glow */
  /* background: radial-gradient(ellipse at top, #1a1a1a 0%, #0A0A0A 50%), 
               linear-gradient(135deg, #0A0A0A 0%, #121212 100%); */
}
```

### Primary Buttons (Electric Glow)
```css
.btn-primary {
  background: linear-gradient(135deg, #F59E0B 0%, #FFB800 100%);
  color: #0A0A0A;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(255, 184, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #FFB800 0%, #FFC933 100%);
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.5);
  transform: translateY(-1px);
}
```

### Secondary Buttons (Glass Effect)
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 184, 0, 0.2);
  color: #FFB800;
}

.btn-secondary:hover {
  background: rgba(255, 184, 0, 0.1);
  border-color: rgba(255, 184, 0, 0.4);
}
```

### Cards (Modern Glass)
```css
.card {
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.card:hover {
  border-color: rgba(255, 184, 0, 0.1);
  box-shadow: 0 8px 40px rgba(255, 184, 0, 0.05);
}
```

### Navigation (Subtle Electric)
```css
.nav-item {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 184, 0, 0.05);
}

.nav-item.active {
  color: #FFB800;
  background: rgba(255, 184, 0, 0.1);
  border-left: 3px solid #FFB800;
  box-shadow: inset 0 0 20px rgba(255, 184, 0, 0.1);
}
```

### Input Fields (Electric Focus)
```css
.input-field {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}

.input-field:focus {
  border-color: #FFB800;
  box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
  background: rgba(255, 184, 0, 0.02);
}
```

### Dashboard Metrics (Electric Glow)
```css
.metric-card {
  background: linear-gradient(135deg, rgba(18, 18, 18, 0.9), rgba(30, 30, 30, 0.9));
  border: 1px solid rgba(255, 184, 0, 0.1);
}

.metric-value {
  color: #FFB800;
  text-shadow: 0 0 20px rgba(255, 184, 0, 0.5);
}

.metric-icon {
  background: linear-gradient(135deg, #F59E0B, #FFB800);
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.3);
}
```

---

## 🔌 Special Effects

### Electric Glow Animation
```css
@keyframes electric-pulse {
  0% { box-shadow: 0 0 10px rgba(255, 184, 0, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 184, 0, 0.8); }
  100% { box-shadow: 0 0 10px rgba(255, 184, 0, 0.4); }
}

.electric-glow {
  animation: electric-pulse 2s ease-in-out infinite;
}
```

### Voltage Spark Effect
```css
@keyframes voltage-spark {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}

.voltage-indicator::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 10px;
  background: #0EA5E9;
  animation: voltage-spark 1.5s ease-in-out infinite;
}
```

---

## 📦 Recommended Libraries

### 1. **Framer Motion** (for smooth animations)
```bash
npm install framer-motion
```
- Use for page transitions and component animations
- Electric spark effects on interactions

### 2. **React Icons** (for consistent iconography)
```bash
npm install react-icons
```
- Use electricity-themed icons (lightning bolts, power symbols)

### 3. **Chart.js** with custom theme
```bash
npm install chart.js react-chartjs-2
```
- Custom dark theme for charts matching the color palette

### 4. **React Hot Toast** (for notifications)
```bash
npm install react-hot-toast
```
- Styled with electric glow effects

### 5. **Tailwind CSS Plugins**
```bash
npm install @tailwindcss/forms @tailwindcss/typography
```

---

## 🛠 Implementation Guide

### 1. Update `tailwind.config.js`
```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'electric': {
          50: '#FFE4B5',
          100: '#FFD54F',
          200: '#FFC933',
          300: '#FFB800',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        'voltage': {
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#0A3A5E',
        },
        'dark': {
          base: '#0A0A0A',
          surface: {
            0: '#121212',
            1: '#1E1E1E',
            2: '#232323',
            3: '#252525',
            4: '#272727',
            6: '#2C2C2C',
            8: '#2E2E2E',
            12: '#333333',
            16: '#363636',
            24: '#383838',
          }
        }
      },
      boxShadow: {
        'electric': '0 0 30px rgba(255, 184, 0, 0.3)',
        'electric-lg': '0 0 50px rgba(255, 184, 0, 0.5)',
        'voltage': '0 0 30px rgba(14, 165, 233, 0.3)',
      },
      animation: {
        'electric-pulse': 'electric-pulse 2s ease-in-out infinite',
        'voltage-spark': 'voltage-spark 1.5s ease-in-out infinite',
      }
    }
  }
}
```

### 2. Update `globals.css`
```css
/* Dark theme root variables */
html.dark {
  --background: #0A0A0A;
  --foreground: #FAFAFA;
  
  /* Remove all purple/pink gradients */
  /* Use subtle dark backgrounds */
  /* Apply electric accent colors sparingly */
}

/* Custom scrollbar for dark theme */
html.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #2C2C2C, #383838);
  border: 1px solid rgba(255, 184, 0, 0.1);
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #383838, #FFB800);
}
```

### 3. Update Component Files
- Replace all yellow-orange gradients with electric amber (#FFB800)
- Replace purple backgrounds with dark surfaces (#121212)
- Remove excessive gradients, use solid colors
- Add subtle glow effects only on interactive elements

---

## 🎯 Design Principles

1. **Minimalism First**: Less is more - use colors purposefully
2. **Electric Accents**: Yellow/amber only for important actions and active states
3. **Depth Through Elevation**: Use surface colors to create depth, not gradients
4. **High Contrast**: Maintain WCAG AA standards (4.5:1 minimum)
5. **Subtle Animations**: Electric pulse effects should be gentle, not distracting
6. **Consistent Temperature**: Cool dark base with warm electric accents

---

## 📊 Before vs After Comparison

| Element | Before (Colorful) | After (Electric Noir) |
|---------|------------------|----------------------|
| Background | Purple gradient #0f172a → #581c87 | Pure dark #0A0A0A → #121212 |
| Primary Button | Yellow-orange gradient | Electric amber with glow |
| Cards | Multi-color gradients | Dark glass with subtle borders |
| Navigation | Yellow-orange active | Electric amber accent |
| Focus States | Yellow borders | Electric glow effect |
| Icons | Rainbow gradients | Monochrome with electric accent |

---

## 🚀 Quick Start Implementation

1. **Backup current theme files**
2. **Install recommended packages**
3. **Update Tailwind configuration**
4. **Replace color values in globals.css**
5. **Update themeStyles.ts with new color values**
6. **Test across all dashboards**
7. **Fine-tune glow effects and animations**

---

## 📝 Notes

- The electric theme represents energy and power while maintaining professionalism
- Dark backgrounds reduce eye strain during extended use
- Electric amber creates visual hierarchy without being overwhelming
- Glass morphism adds modern depth without excessive decoration
- All colors meet WCAG accessibility standards

This theme transforms ElectroLux EMS into a modern, sophisticated energy management system with a unique electric personality that stands out while remaining functional and professional.
