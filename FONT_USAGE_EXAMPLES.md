# Font Usage Examples - Quick Reference

## ✅ Fonts Successfully Implemented!

Your project now has 3 fonts properly configured:
- **Poppins** - Display font (headings)
- **Inter** - Body font (default)
- **JetBrains Mono** - Monospace font (technical data)

---

## 🎯 How to Use the Fonts

### 1. Poppins (Large Headings & Brand)

Use `font-display` class:

```tsx
// Page title
<h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white">
  ElectroLux Dashboard
</h1>

// Section heading
<h2 className="font-display text-3xl font-semibold">
  Monthly Overview
</h2>

// Card title
<h3 className="font-display text-xl font-semibold">
  Total Consumption
</h3>

// Brand name
<div className="font-display text-2xl font-bold">
  ElectroLux
</div>
```

---

### 2. Inter (Body Text - Default)

No class needed! Inter is the default font:

```tsx
// Regular text (Inter is automatic)
<p className="text-base text-gray-700 dark:text-gray-300">
  View your electricity consumption details
</p>

// Small text
<span className="text-sm text-gray-600 dark:text-gray-400">
  Last updated: 2 hours ago
</span>

// Button text
<button className="px-4 py-2 bg-blue-500 text-white">
  View Report
</button>
```

---

### 3. JetBrains Mono (Technical/Code)

Use `font-mono` class:

```tsx
// Meter number
<span className="font-mono text-lg font-semibold">
  MTR-2024-00123
</span>

// Account number
<code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
  ACC-789456123
</code>

// Statistics/Numbers
<div className="font-mono text-4xl font-bold">
  1,234.56 kWh
</div>

// Table data (numbers)
<td className="font-mono text-sm">
  2,456
</td>
```

---

## 📊 Complete Dashboard Card Example

```tsx
<div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
  {/* Title - Poppins */}
  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
    Energy Usage
  </h3>

  {/* Description - Inter (default) */}
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
    Current month consumption
  </p>

  {/* Large number - JetBrains Mono */}
  <div className="font-mono text-5xl font-bold text-gray-900 dark:text-white mb-2">
    1,234.56
  </div>

  {/* Unit - Inter (default) */}
  <span className="text-lg text-gray-600 dark:text-gray-400">
    kWh
  </span>

  {/* Meter ID - JetBrains Mono */}
  <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
    Meter: <span className="font-mono">MTR-2024-00123</span>
  </div>
</div>
```

---

## 🔤 Font Weight Guide

### Poppins Weights Available:
- `font-normal` (400) - Rarely used
- `font-medium` (500) - Subheadings
- `font-semibold` (600) - Main headings
- `font-bold` (700) - Hero text, brand

### Inter Weights (Default):
- `font-normal` (400) - Body text
- `font-medium` (500) - Labels, emphasis
- `font-semibold` (600) - Small headings
- `font-bold` (700) - Strong emphasis

### JetBrains Mono:
- `font-normal` (400) - Regular code/data
- `font-semibold` (600) - Important numbers
- `font-bold` (700) - Large statistics

---

## ✨ Real Component Examples

### Login Page Header
```tsx
<div className="text-center">
  <h1 className="font-display text-4xl font-bold text-white mb-2">
    ElectroLux EMS
  </h1>
  <p className="text-white/90">
    Electricity Management System
  </p>
</div>
```

### Statistics Card
```tsx
<div className="bg-white dark:bg-white/5 rounded-xl p-4">
  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
    Total Users
  </div>
  <div className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
    50,234
  </div>
</div>
```

### Table Header
```tsx
<thead>
  <tr>
    <th className="font-display font-semibold text-sm text-gray-700 dark:text-gray-400">
      Date
    </th>
    <th className="font-display font-semibold text-sm text-gray-700 dark:text-gray-400">
      Usage
    </th>
  </tr>
</thead>
```

### Form Input (Technical)
```tsx
<div>
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Meter Number
  </label>
  <input
    type="text"
    className="font-mono w-full px-4 py-2 bg-white dark:bg-white/10 border rounded-lg"
    placeholder="MTR-2024-00000"
  />
</div>
```

### Navigation Link
```tsx
<a className="font-display font-semibold text-gray-900 dark:text-white hover:text-blue-600">
  Dashboard
</a>
```

---

## 🎨 Visual Hierarchy

```
┌─────────────────────────────────────────────┐
│  ELECTROLUX                                 │  ← Poppins Bold (Brand)
├─────────────────────────────────────────────┤
│  Dashboard Overview                         │  ← Poppins SemiBold (H1)
│                                             │
│  Energy Consumption                         │  ← Poppins SemiBold (H2)
│  Track your monthly usage below             │  ← Inter Regular (Body)
│                                             │
│  1,234.56 kWh                              │  ← JetBrains Mono Bold (Number)
│  Meter: MTR-2024-00123                     │  ← JetBrains Mono Regular (ID)
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Tips

1. **Use Poppins for impact** - Large headings, page titles, brand
2. **Use Inter for readability** - All body text, descriptions, UI labels
3. **Use JetBrains Mono for data** - Numbers, IDs, codes, technical info

4. **Default is Inter** - No need to add classes for regular text
5. **Add `font-display`** - For headings you want to stand out
6. **Add `font-mono`** - For technical/numerical data

---

## ✅ No Download Needed!

Next.js automatically downloads and optimizes Google Fonts when you run:

```bash
npm run dev
```

The fonts will be:
- ✅ Downloaded from Google Fonts
- ✅ Optimized for performance
- ✅ Self-hosted on your server
- ✅ Cached for fast loading

---

**That's it! Your fonts are ready to use!** 🎉
