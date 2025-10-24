# Font Implementation Guide - ElectroLux EMS

## Current Status
- ✅ Inter (imported and active)
- ✅ JetBrains Mono (imported and active)
- ❌ Poppins (mentioned in theme.ts but NOT imported)

---

## Recommended Font System

### Three-Tier Font Hierarchy

```
┌─────────────────────────────────────────┐
│ POPPINS - Display & Large Headings     │
│ (Bold, geometric, energetic)            │
├─────────────────────────────────────────┤
│ INTER - Body Text & UI Elements         │
│ (Clean, readable, neutral)              │
├─────────────────────────────────────────┤
│ JETBRAINS MONO - Code & Technical Data  │
│ (Monospace, clear, professional)        │
└─────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Update layout.tsx

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ... rest of your layout
<body className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} antialiased`}>
```

### Step 2: Update tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
}
```

### Step 3: Update globals.css

```css
/* Add to globals.css */
:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-poppins: 'Poppins', 'Inter', sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-inter);
}

h1, h2, .display-text {
  font-family: var(--font-poppins);
}

code, pre, .mono-text {
  font-family: var(--font-jetbrains-mono);
}
```

---

## Usage Examples

### Headings (Use Poppins)

```tsx
// Large display heading
<h1 className="font-display text-4xl font-bold">
  ElectroLux EMS
</h1>

// Page title
<h2 className="font-display text-3xl font-bold">
  Dashboard
</h2>

// Section heading
<h3 className="font-display text-2xl font-semibold">
  Monthly Overview
</h3>
```

### Body Text (Use Inter - Default)

```tsx
// Regular text (Inter is default, no class needed)
<p className="text-base">
  View your electricity consumption
</p>

// Small text
<span className="text-sm text-gray-600">
  Last updated: 2 hours ago
</span>
```

### Technical/Code Text (Use JetBrains Mono)

```tsx
// Meter number
<span className="font-mono text-lg">
  MTR-2024-00123
</span>

// Account number
<code className="font-mono bg-gray-100 px-2 py-1 rounded">
  ACC-789456123
</code>

// Numbers/Statistics
<div className="font-mono text-3xl font-bold">
  1,234.56 kWh
</div>
```

---

## Font Pairing Rules

### DO ✅

```tsx
// Big heading with Poppins
<h1 className="font-display text-4xl font-bold text-gray-900">
  Total Consumption
</h1>

// Description with Inter
<p className="text-base text-gray-600">
  Track your monthly electricity usage
</p>

// Technical data with JetBrains Mono
<span className="font-mono text-2xl font-semibold">
  2,456 kWh
</span>
```

### DON'T ❌

```tsx
// Don't use monospace for regular text
<p className="font-mono">This looks awkward</p>

// Don't use display font for small text
<span className="font-display text-xs">Too fancy</span>

// Don't mix fonts in same text element
<h1 className="font-display">
  Hello <span className="font-mono">World</span> <!-- Jarring -->
</h1>
```

---

## Component-Specific Guidelines

### Dashboard Cards
```tsx
<div className="card">
  <h3 className="font-display text-xl font-semibold">  {/* Poppins */}
    Energy Usage
  </h3>
  <p className="text-sm text-gray-600">                {/* Inter (default) */}
    This month's consumption
  </p>
  <div className="font-mono text-3xl font-bold">      {/* JetBrains Mono */}
    1,234 kWh
  </div>
</div>
```

### Buttons
```tsx
// Primary buttons - Poppins for impact
<button className="font-display font-semibold">
  View Details
</button>

// Secondary buttons - Inter (default)
<button className="font-medium">
  Cancel
</button>
```

### Tables
```tsx
<table>
  <thead>
    <tr>
      {/* Headers with Poppins */}
      <th className="font-display font-semibold">Date</th>
      <th className="font-display font-semibold">Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      {/* Body with default Inter */}
      <td>Jan 15, 2024</td>
      {/* Numbers with JetBrains Mono */}
      <td className="font-mono">1,234.56</td>
    </tr>
  </tbody>
</table>
```

### Forms
```tsx
<form>
  {/* Label with Inter (default) */}
  <label className="text-sm font-medium">
    Meter Number
  </label>

  {/* Input with JetBrains Mono for technical input */}
  <input
    type="text"
    className="font-mono"
    placeholder="MTR-2024-00000"
  />
</form>
```

---

## Font Weight Scale

### Poppins (Display)
- 400 - Regular (rarely used)
- 500 - Medium (subheadings)
- 600 - SemiBold (main headings)
- 700 - Bold (hero text, brand)

### Inter (Body)
- 400 - Regular (body text)
- 500 - Medium (emphasis, labels)
- 600 - SemiBold (small headings)
- 700 - Bold (strong emphasis)

### JetBrains Mono (Code)
- 400 - Regular (code, IDs)
- 500 - Medium (emphasized data)
- 600 - SemiBold (important numbers)
- 700 - Bold (large statistics)

---

## Accessibility Considerations

### Font Sizes (Minimum)
```
- Body text: 16px (1rem) minimum
- Small text: 14px (0.875rem) minimum
- Code/mono: 14px minimum for readability
```

### Contrast
```
- Dark text on light: Use gray-900 (#111827)
- Light text on dark: Use white or gray-100
- Never use pure black (#000000)
```

### Line Height
```
- Headings: 1.2 - 1.3
- Body: 1.5 - 1.6
- Code: 1.4 - 1.5
```

---

## Alternative Font Combinations

If you want to try something different:

### Option A: Modern Tech
```typescript
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
// Sora for headings (bold, modern)
// Inter for body
// JetBrains Mono for code
```

### Option B: Friendly Professional
```typescript
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
// Plus Jakarta Sans for everything
// JetBrains Mono for code
```

### Option C: Geometric Clean
```typescript
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
// Space Grotesk for headings (geometric)
// Inter for body
// JetBrains Mono for code
```

---

## Performance Tips

1. **Use `display: "swap"`** - Prevents invisible text while loading
2. **Limit font weights** - Only import weights you actually use
3. **Subset fonts** - Use `subsets: ["latin"]` to reduce file size
4. **Variable fonts** - Inter and Poppins support variable fonts for even better performance

---

## Testing Your Fonts

### Quick Test Component

```tsx
export default function FontTest() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold">
          Poppins Display Font
        </h1>
        <p className="text-base mt-2">
          Inter body text for readable content
        </p>
        <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          MTR-2024-00123
        </code>
      </div>

      <div className="space-y-2">
        <p className="font-display font-bold">Poppins Bold</p>
        <p className="font-display font-semibold">Poppins SemiBold</p>
        <p className="font-display font-medium">Poppins Medium</p>
        <p className="font-display font-normal">Poppins Regular</p>
      </div>

      <div className="space-y-2">
        <p className="font-bold">Inter Bold</p>
        <p className="font-semibold">Inter SemiBold</p>
        <p className="font-medium">Inter Medium</p>
        <p className="font-normal">Inter Regular</p>
      </div>

      <div className="space-y-2">
        <p className="font-mono font-bold">JetBrains Mono Bold</p>
        <p className="font-mono">JetBrains Mono Regular</p>
        <p className="font-mono text-xs">1234567890</p>
      </div>
    </div>
  );
}
```

---

**End of Guide**
