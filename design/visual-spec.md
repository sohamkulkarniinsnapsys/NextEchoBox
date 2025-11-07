# NextEchoBox Visual Specification
## Cinematic Premium Theme

**Version:** 1.0.0  
**Last Updated:** November 2024  
**Design System:** Fancy Glass Aesthetic

---

## Overview

This document defines the visual language, design tokens, component anatomy, and interaction patterns for the NextEchoBox premium frontend reskin. The design direction is **cinematic and deliberately fancy**—featuring animated gradients, glassmorphism, depth, micro-interactions, and ambient motion—while remaining tasteful, performant, and fully accessible.

---

## Color Palette

### Primary Gradient (Violet → Aqua)
- **Start:** `oklch(0.65 0.25 280)` - Deep violet
- **Mid:** `oklch(0.70 0.22 260)` - Purple-blue
- **End:** `oklch(0.75 0.18 220)` - Aqua blue

**Usage:** Primary buttons, brand elements, hero gradients, accent ribs

### Accent Colors
- **Warm (Coral):** `oklch(0.72 0.20 35)` → `oklch(0.80 0.15 85)`
- **Gold (Sun):** `oklch(0.80 0.15 85)` → `oklch(0.85 0.12 75)`
- **Mint (Green):** `oklch(0.78 0.16 165)` → `oklch(0.75 0.18 180)`

**Usage:** Secondary CTAs, status indicators, KPI cards

### Background Colors
- **Deep:** `oklch(0.12 0.04 265)` - Base background
- **Surface:** `oklch(0.18 0.03 265)` - Elevated surfaces
- **Elevated:** `oklch(0.22 0.03 265)` - Modals, popovers

### Text Colors
- **Primary:** `oklch(0.98 0.01 265)` - Near white, main text
- **Secondary:** `oklch(0.75 0.05 265)` - Muted light, descriptions
- **Tertiary:** `oklch(0.55 0.05 265)` - Subtle, metadata
- **Inverse:** `oklch(0.15 0.04 265)` - Dark text on light

---

## Typography

### Font Stack
- **Display & Body:** Geist, Inter, system-ui, sans-serif
- **Monospace:** Geist Mono, Fira Code, monospace

### Scale
| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 0.75rem (12px) | Captions, metadata |
| `--text-sm` | 0.875rem (14px) | Helper text, labels |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Subheadings |
| `--text-xl` | 1.25rem (20px) | Card titles |
| `--text-2xl` | 1.5rem (24px) | Section headings |
| `--text-3xl` | 1.875rem (30px) | Page titles |
| `--text-4xl` | 2.25rem (36px) | Hero headings |
| `--text-5xl` | 3rem (48px) | Landing hero |

### Weights
- **Normal:** 400 - Body text
- **Medium:** 500 - Emphasized text
- **Semibold:** 600 - Subheadings
- **Bold:** 700 - Headings, CTAs

### Line Heights
- **Tight:** 1.25 - Headings
- **Normal:** 1.5 - Body text
- **Relaxed:** 1.75 - Long-form content

---

## Spacing & Layout

### Spacing Scale
```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
```

### Container Widths
- **Max Width:** 1280px (7xl)
- **Content Width:** 1024px (6xl)
- **Form Width:** 448px (md)
- **Composer Width:** 672px (2xl)

### Grid System
- **Mobile:** 1 column, 16px gutters
- **Tablet:** 2 columns, 24px gutters
- **Desktop:** 3 columns, 32px gutters

---

## Glassmorphism & Effects

### Glass Variants
| Variant | Background Alpha | Border Alpha | Blur |
|---------|------------------|--------------|------|
| Subtle | 0.05 | 0.08 | 8px |
| Medium | 0.08 | 0.12 | 16px |
| Strong | 0.12 | 0.15 | 32px |

### Blur Intensities
- **Subtle:** 8px - Inputs, cards
- **Medium:** 16px - Modals, dropdowns
- **Strong:** 32px - Navbar, overlays
- **Extreme:** 64px - Backdrop blur

### Elevation & Shadows
```css
--shadow-elev-1: 0 2px 8px oklch(0 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.12);
--shadow-elev-2: 0 4px 16px oklch(0 0 0 / 0.12), 0 2px 4px oklch(0 0 0 / 0.16);
--shadow-elev-3: 0 8px 32px oklch(0 0 0 / 0.16), 0 4px 8px oklch(0 0 0 / 0.20);
--shadow-glow: 0 0 24px oklch(0.65 0.25 280 / 0.3), 0 0 48px oklch(0.75 0.18 220 / 0.2);
```

---

## Border Radii

```
--ui-radius-sm: 8px    // Small elements, chips
--ui-radius-md: 12px   // Inputs, buttons
--ui-radius-lg: 16px   // Cards, panels
--ui-radius-xl: 24px   // Modals, large cards
--ui-radius-full: 9999px // Avatars, pills
```

---

## Motion & Animation

### Timing
- **Instant:** 0ms - Power saver mode
- **Fast:** 150ms - Micro-interactions (hover, focus)
- **Medium:** 320ms - Component transitions
- **Slow:** 520ms - Entrances, exits
- **Page:** 800ms - Route transitions

### Easing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### Animation Principles
1. **Opacity + Transform Only:** Avoid animating layout properties
2. **GPU Acceleration:** Use `transform3d` and `will-change` sparingly
3. **Reduced Motion:** All animations respect `prefers-reduced-motion`
4. **Power Saver:** Heavy effects disabled when `data-power-saver="true"`

---

## Component Anatomy

### GlassCard
```tsx
<GlassCard 
  variant="medium"        // subtle | medium | strong
  accentEdge="left"       // none | left | top | right | bottom
  accentColor="primary"   // primary | warm | gold | mint
  hoverable               // Enables hover lift effect
  blur="medium"           // subtle | medium | strong
>
  {children}
</GlassCard>
```

**States:**
- **Default:** Semi-transparent with border
- **Hover:** Scale 1.02, increased opacity, deeper shadow
- **Focus:** Visible focus ring

### FancyButton
```tsx
<FancyButton 
  variant="solid"    // solid | outline | ghost | warm
  size="md"          // sm | md | lg | xl
  loading={false}    // Shows spinner, disables interaction
>
  Button Text
</FancyButton>
```

**Variants:**
- **Solid:** Primary gradient background, white text
- **Outline:** Transparent with gradient border
- **Ghost:** Transparent, glass on hover
- **Warm:** Coral gradient background

**Interactions:**
- Hover: Scale 1.02, glow shadow
- Active: Scale 0.98
- Focus: 2px ring with offset

### GlassInput
```tsx
<GlassInput 
  label="Field Label"
  error="Error message"
  helperText="Helper text"
  type="text"
/>
```

**Features:**
- Floating label animation
- Glass aesthetic with subtle blur
- Focus glow effect
- Inline error messages with slide-in animation

### AnimatedAvatar
```tsx
<AnimatedAvatar 
  src="/avatar.jpg"
  alt="User Name"
  size="md"    // sm | md | lg | xl
  fallback="UN"
/>
```

**Features:**
- Breathing halo ring (3s ease-in-out infinite)
- Pauses animation when page loses focus
- Gradient fallback with initials

---

## Interaction Patterns

### Hover States
- **Cards:** Lift with scale 1.02, shadow deepens
- **Buttons:** Scale 1.02, glow appears
- **Links:** Color shift, underline appears
- **Icons:** Rotate or bounce subtly

### Focus States
- **All Interactive Elements:** 2px ring, offset 2px
- **Ring Color:** `oklch(0.70 0.22 260)` with 50% opacity
- **Visible on Keyboard Navigation:** Always visible
- **Mouse Click:** Brief flash, then removed

### Loading States
- **Buttons:** Spinner replaces icon, text remains
- **Cards:** Shimmer skeleton with pulse
- **Lists:** Staggered skeleton cards

### Empty States
- **Icon:** Large gradient circle with icon
- **Heading:** Bold, primary text
- **Description:** Secondary text
- **CTA:** Primary button

---

## Accessibility Requirements

### Contrast
- **Minimum:** WCAG AA (4.5:1 for text, 3:1 for large text)
- **High Contrast Mode:** Boosts to AAA when enabled
- **Color Independence:** Never rely solely on color

### Focus Management
- **Visible Rings:** Always present on keyboard navigation
- **Logical Tab Order:** Follows visual hierarchy
- **Skip Links:** Provided for main content
- **Focus Trapping:** In modals and dialogs

### ARIA
- **Landmarks:** `<nav>`, `<main>`, `<header>`, `<footer>`
- **Labels:** All icon-only buttons have `aria-label`
- **Live Regions:** `aria-live="polite"` for toasts
- **States:** `aria-expanded`, `aria-controls`, `aria-hidden`

### Screen Readers
- **Decorative Elements:** `aria-hidden="true"`
- **Semantic HTML:** Proper heading hierarchy
- **Alt Text:** Descriptive for images
- **Form Labels:** Explicit associations

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Adaptations
- **Navbar:** Collapses to bottom dock
- **Cards:** Full width, reduced padding
- **Typography:** Scales down one step
- **Spacing:** Reduced by 25%

---

## Performance Guidelines

### Bundle Size
- **Core UI:** < 50KB gzipped
- **Animations:** Lazy loaded, < 20KB
- **Total JS:** < 200KB initial load

### Rendering
- **CLS:** < 0.1
- **LCP:** < 2.5s
- **FID:** < 100ms

### Optimization
- **Images:** Next/Image with blur placeholders
- **Fonts:** Preload critical weights only
- **Code Splitting:** Route-based chunks
- **Tree Shaking:** Remove unused exports

---

## How to Extend

### Adding New Colors
1. Define in `styles/tokens.css` as CSS custom property
2. Use OKLCH format for perceptual uniformity
3. Test contrast ratios with WebAIM tool
4. Document in this spec

### Creating New Components
1. Use existing primitives (GlassCard, FancyButton)
2. Follow naming convention: `PascalCase.tsx`
3. Include TypeScript types and JSDoc
4. Add to Storybook with all states
5. Test keyboard navigation and screen readers

### Modifying Motion
1. Update timing in `styles/tokens.css`
2. Ensure `prefers-reduced-motion` is respected
3. Test on low-end devices
4. Verify Power Saver mode disables correctly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2024 | Initial cinematic premium theme |

---

**Maintained by:** NextEchoBox Design Team  
**Questions?** Refer to component source files for implementation details.
