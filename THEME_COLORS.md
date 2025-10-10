# Electrolux EMS - Theme Colors & Design System

## Color Palette

### Primary Colors
- **Background Gradient**: `from-slate-900 via-purple-900 to-slate-900`
- **Brand Gradient**: `from-yellow-400 to-orange-500`
- **Accent Colors**:
  - Yellow: `yellow-400` (#FACC15)
  - Orange: `orange-500` (#F97316)

### UI Colors
- **Glass Morphism**: `bg-white/5` with `backdrop-blur-xl`
- **Borders**: `border-white/10` or `border-white/20`
- **Text Colors**:
  - Primary: `text-white`
  - Secondary: `text-gray-300`
  - Tertiary: `text-gray-400`

### Status Colors
- **Success**: `text-green-400`
- **Error**: `text-red-400`
- **Warning**: `text-yellow-400`

## Typography

### Font Sizes
- **Headings (h1)**: `text-3xl` on desktop
- **Headings (h2)**: `text-2xl`
- **Body**: `text-sm` or `text-base`
- **Labels**: `text-xs`

### Font Weights
- **Bold**: `font-bold`
- **Semibold**: `font-semibold`
- **Regular**: default

## Spacing

### Page Layout
- **Container**: `max-w-6xl` for most pages, `max-w-5xl` for forms
- **Padding**: `py-6 px-4` for main containers
- **Form Spacing**: `space-y-3` between form fields

### Component Spacing
- **Icons**: `w-4 h-4` for small, `w-6 h-6` for medium
- **Buttons**: `py-3` for standard buttons
- **Input Fields**: `py-2` with `px-3`

## Border Radius
- **Large**: `rounded-2xl` or `rounded-3xl` for cards
- **Medium**: `rounded-xl` for feature boxes
- **Small**: `rounded-lg` for inputs and buttons

## Effects

### Background Effects
```jsx
<div className="fixed inset-0 overflow-hidden">
  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
  <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
</div>
```

### Glass Morphism Cards
```jsx
className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
```

### Button Hover Effects
```jsx
className="hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-[1.01]"
```

## Component Patterns

### Two-Column Grid Layout
```jsx
<div className="grid lg:grid-cols-2 gap-8 items-start">
  {/* Left: Info Section */}
  {/* Right: Form/Content */}
</div>
```

### Form Input Pattern
```jsx
<div>
  <label className="text-xs text-gray-300 mb-1 block">Label *</label>
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
    />
  </div>
</div>
```

### Icon with Text Pattern
```jsx
<div className="flex items-center space-x-2">
  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-yellow-400">
    <Icon className="w-4 h-4" />
  </div>
  <span className="text-sm text-gray-300">Text here</span>
</div>
```

## Pages Created

1. **Home Page** (`/`) - Landing page with features and services
2. **Registration Page** (`/register`) - Compact form optimized for laptop screens
3. **Login Page** (`/login`) - Sign in with email and password
4. **Forgot Password Page** (`/forgot-password`) - Password reset flow

## Design Principles

1. **Consistency**: All pages use the same purple/yellow gradient theme
2. **Compact Design**: Optimized to fit on laptop screens without scrolling
3. **Glass Morphism**: Frosted glass effect for modern aesthetic
4. **Responsive**: Mobile-first approach with lg: breakpoints
5. **Accessibility**: Clear labels, error messages, and focus states
6. **Visual Hierarchy**: Proper spacing and typography scale
