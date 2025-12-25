# 🎨 Design Specifications

> **The definitive guide for building consistent, beautiful form cards and UI components in Praise Garden.**

This document establishes the visual standards for all form cards, edit panels, and future widgets. All contributors should follow these specifications to maintain consistency across the product.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Units & Scaling Strategy](#units--scaling-strategy)
3. [Screen Contexts](#screen-contexts)
4. [Typography](#typography)
5. [Spacing](#spacing)
6. [Interactive Elements](#interactive-elements)
7. [Icons](#icons)
8. [Colors](#colors)
9. [Layout Patterns](#layout-patterns)
10. [Card Component Standards](#card-component-standards)
11. [Quick Reference Cheatsheet](#quick-reference-cheatsheet)

---

## Philosophy

### Core Principles

1. **Simplicity over complexity** - Use standard Tailwind classes
2. **Consistency is king** - Same element = same styling everywhere
3. **Accessibility first** - Touch targets ≥44px, readable font sizes
4. **Progressive enhancement** - Mobile-first, enhance for larger screens

### Why Tailwind Classes?

- ✅ No learning curve for contributors
- ✅ Industry standard, well-documented
- ✅ Easy to read and understand
- ✅ No custom variables to remember

---

## Units & Scaling Strategy

### The REM Advantage

We use **rem** units (via Tailwind) for all sizing. Here's why:

| Unit | Behavior | Use Case |
|------|----------|----------|
| `px` | Fixed, doesn't scale | Borders only (`border`, `border-2`) |
| `rem` | Scales with root font size | **Everything else** |
| `em` | Scales with parent font | Avoided (unpredictable) |
| `%` / `vw` / `vh` | Relative to viewport/parent | Layout containers only |

### How Tailwind Uses REM

Tailwind's spacing and typography scales are **rem-based**:

```
Tailwind Class → CSS → Pixels (at default 16px root)
─────────────────────────────────────────────────────
text-xs        → 0.75rem    → 12px
text-sm        → 0.875rem   → 14px
text-base      → 1rem       → 16px
text-lg        → 1.125rem   → 18px
text-xl        → 1.25rem    → 20px
text-2xl       → 1.5rem     → 24px
text-3xl       → 1.875rem   → 30px

p-4            → 1rem       → 16px
p-6            → 1.5rem     → 24px
p-8            → 2rem       → 32px
```

### Scaling for Accessibility

If a user sets their browser's base font size to 20px (for accessibility), all our rem-based sizing scales proportionally:

```
At 16px root: text-2xl = 24px, p-6 = 24px
At 20px root: text-2xl = 30px, p-6 = 30px ← Automatically larger!
```

This is why we **never use arbitrary pixel values** like `text-[24px]`.

---

## Screen Contexts

### The Challenge

Our form cards render in **three distinct contexts**:

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONTEXT 1: Form Builder (Editor View)                               │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                     │
│  ┌─────────────────────────────────────┐  ┌────────────────────┐   │
│  │                                     │  │   SIDEBAR          │   │
│  │         CARD CONTAINER              │  │   (Pages/Edit)     │   │
│  │         ~800-1000px                 │  │   ~380px           │   │
│  │                                     │  │                    │   │
│  └─────────────────────────────────────┘  └────────────────────┘   │
│                                                                     │
│  The card lives in a bounded container, NOT full width              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CONTEXT 2: Preview Mode (Full Screen Modal)                         │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │                    FULL VIEWPORT                            │   │
│  │                    (100vw × 100vh)                          │   │
│  │                                                             │   │
│  │                    Card content centered                    │   │
│  │                    with max-width constraint                │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CONTEXT 3: Public Form (/t/[id]) - Various Devices                  │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                     │
│  Mobile (375px)    Tablet (768px)    Desktop (1440px)              │
│  ┌─────────┐       ┌───────────┐     ┌─────────────────┐           │
│  │         │       │           │     │                 │           │
│  │  Full   │       │  Full     │     │     Full        │           │
│  │  width  │       │  width    │     │     width       │           │
│  │         │       │           │     │                 │           │
│  └─────────┘       └───────────┘     └─────────────────┘           │
│                                                                     │
│  Content constrained to max-w-xl (576px) and centered               │
└─────────────────────────────────────────────────────────────────────┘
```

### The Solution: Content Max-Width

**Rule**: Card content should ALWAYS be constrained to `max-w-xl` (576px) regardless of context.

```tsx
// ✅ CORRECT - Content is constrained, container is flexible
<div className="w-full h-full flex items-center justify-center">
  <div className="w-full max-w-xl px-6">
    {/* Card content here */}
  </div>
</div>

// ❌ WRONG - Content stretches to fill container
<div className="w-full px-16">
  {/* This will be too wide on large screens */}
</div>
```

### Responsive Breakpoints

Use Tailwind's standard breakpoints:

| Breakpoint | Min Width | Typical Devices |
|------------|-----------|-----------------|
| (default)  | 0px       | Mobile phones |
| `sm:`      | 640px     | Large phones, small tablets |
| `md:`      | 768px     | Tablets |
| `lg:`      | 1024px    | Laptops, Form Builder |
| `xl:`      | 1280px    | Desktops |
| `2xl:`     | 1536px    | Large monitors |

### Responsive Strategy

**Mobile-first**: Write base styles for mobile, then enhance for larger screens.

```tsx
// ✅ CORRECT - Mobile first
<h1 className="text-xl sm:text-2xl font-bold">

// ❌ WRONG - Desktop first (harder to maintain)
<h1 className="text-2xl max-sm:text-xl font-bold">
```

---

## Typography

### Card Typography Standards

| Element | Mobile | Desktop (sm:) | Classes |
|---------|--------|---------------|---------|
| **Card Title** | 20px | 24px | `text-xl sm:text-2xl font-bold leading-tight` |
| **Card Description** | 14px | 14px | `text-sm text-gray-400 leading-relaxed` |
| **Section Header** | 12px | 12px | `text-xs font-semibold uppercase tracking-wider text-gray-500` |
| **Form Label** | 12px | 12px | `text-xs font-medium text-gray-400` |
| **Input Text** | 16px | 14px | `text-base sm:text-sm` |
| **Button Text** | 14px | 14px | `text-sm font-semibold` |
| **Helper Text** | 11px | 11px | `text-[11px] text-gray-500` |

### Why Input Text is 16px on Mobile?

iOS Safari **auto-zooms** the page when an input with font-size < 16px is focused. This creates a jarring UX. Solution: Always use `text-base` (16px) for inputs on mobile.

```tsx
// ✅ CORRECT - Prevents iOS zoom
<input className="text-base sm:text-sm ..." />

// ❌ WRONG - Will cause iOS zoom on focus
<input className="text-sm ..." />
```

### Typography Examples

```tsx
// Card Title
<h1 className="text-xl sm:text-2xl font-bold leading-tight text-white">
  Leave us a testimonial
</h1>

// Card Description
<p className="text-sm text-gray-400 leading-relaxed mt-3">
  Your feedback helps us improve and grow.
</p>

// Section Header
<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
  Choose your option
</h3>

// Form Label
<label className="text-xs font-medium text-gray-400 mb-1.5 block">
  Full Name <span className="text-red-500">*</span>
</label>

// Helper Text
<p className="text-[11px] text-gray-500 mt-1.5">
  This will be displayed on your testimonial
</p>
```

---

## Spacing

### Spacing Scale Reference

| Class | Value | Use Case |
|-------|-------|----------|
| `gap-1` / `space-y-1` | 4px | Tight grouping (icon + text) |
| `gap-2` / `space-y-2` | 8px | Related items (label + input) |
| `gap-3` / `space-y-3` | 12px | Between form fields |
| `gap-4` / `space-y-4` | 16px | **Standard field spacing** |
| `gap-6` / `space-y-6` | 24px | Between sections |
| `gap-8` / `space-y-8` | 32px | **Major sections / card padding** |

### Standard Spacing Patterns

```tsx
// Between title and description
<h1>Title</h1>
<p className="mt-3">Description</p>  // 12px gap

// Between description and content
<p>Description</p>
<div className="mt-6">Content</div>  // 24px gap

// Between form fields
<div className="space-y-4">  // 16px between each
  <FormField />
  <FormField />
  <FormField />
</div>

// Between sections
<div className="space-y-8">  // 32px between each
  <Section />
  <Section />
</div>

// Card padding
<div className="px-6 sm:px-8 py-8">  // 24-32px horizontal, 32px vertical
```

### Content Container Standard

```tsx
// Standard content wrapper for all cards
<div className="w-full max-w-xl mx-auto px-6 sm:px-8">
  {/* All card content */}
</div>
```

---

## Interactive Elements

### Input Fields

**Standard Input Specifications:**

| Property | Value | Tailwind Classes |
|----------|-------|------------------|
| Height | 44px | `h-11` |
| Font Size | 16px mobile, 14px desktop | `text-base sm:text-sm` |
| Background | Dark gray | `bg-gray-900` or `bg-[#1E1E1E]` |
| Border | 1px gray | `border border-gray-700` |
| Border Radius | 8px | `rounded-lg` |
| Padding | 12px horizontal | `px-3` |
| Focus | Purple ring | `focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500` |

```tsx
// Standard Input
<input
  type="text"
  placeholder="Enter your name"
  className="w-full h-11 px-3 text-base sm:text-sm text-white placeholder-gray-500 
             bg-gray-900 border border-gray-700 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
             transition-all duration-200"
/>

// Standard Textarea
<textarea
  placeholder="Share your experience..."
  rows={4}
  className="w-full px-3 py-3 text-base sm:text-sm text-white placeholder-gray-500
             bg-gray-900 border border-gray-700 rounded-lg resize-none
             focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
             transition-all duration-200"
/>
```

### Buttons

**Primary Button (Main CTA):**

| Property | Value | Tailwind Classes |
|----------|-------|------------------|
| Height | 44px | `h-11` or `py-3` |
| Font Size | 14px | `text-sm` |
| Font Weight | 600 | `font-semibold` |
| Background | Purple gradient | `bg-purple-600 hover:bg-purple-700` |
| Border Radius | 12px | `rounded-xl` |
| Width | Full | `w-full` |

```tsx
// Primary Button (Full Width CTA)
<button
  className="w-full h-11 px-6 text-sm font-semibold text-white
             bg-purple-600 hover:bg-purple-700 rounded-xl
             transition-all duration-200 
             shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
>
  Continue
</button>

// Secondary Button
<button
  className="w-full h-10 px-4 text-sm font-medium text-gray-300
             bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg
             transition-all duration-200"
>
  Skip
</button>

// Ghost Button
<button
  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white
             hover:bg-gray-800 rounded-lg transition-all duration-200"
>
  Cancel
</button>
```

### Touch Targets

**Minimum touch target: 44×44px** (Apple Human Interface Guidelines)

```tsx
// ✅ CORRECT - Large enough touch target
<button className="p-3 rounded-lg">  // 48px total
  <Icon className="w-6 h-6" />
</button>

// ❌ WRONG - Too small
<button className="p-1">  // Only 32px total
  <Icon className="w-6 h-6" />
</button>
```

---

## Icons

### Icon Size Standards

| Context | Size | Tailwind Class |
|---------|------|----------------|
| Inline with text | 16px | `w-4 h-4` |
| Inside buttons | 16-18px | `w-4 h-4` or `w-[18px] h-[18px]` |
| Form field prefix | 20px | `w-5 h-5` |
| Feature/Option icon | 24-28px | `w-6 h-6` or `w-7 h-7` |
| Decorative (hero) | 32-48px | `w-8 h-8` to `w-12 h-12` |

### Icon Usage Examples

```tsx
// Inline with text (helper messages)
<div className="flex items-center gap-2 text-gray-500">
  <ClockIcon className="w-4 h-4" />
  <span className="text-xs">Takes less than 3 minutes</span>
</div>

// Inside buttons
<button className="flex items-center gap-2">
  <ArrowRightIcon className="w-4 h-4" />
  <span>Continue</span>
</button>

// Feature option icons
<div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
  <VideoIcon className="w-6 h-6 text-purple-400" />
</div>

// Decorative hero icons
<div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
  <CheckIcon className="w-8 h-8 text-green-400" />
</div>
```

---

## Colors

### Color Palette (Reference Only)

We use the colors defined in `globals.css`. Key colors:

| Purpose | Color | Tailwind |
|---------|-------|----------|
| Background | `#09090B` | `bg-gray-950` |
| Surface | `#1E1E1E` or `#27272A` | `bg-gray-900` / `bg-gray-800` |
| Text Primary | `#FFFFFF` | `text-white` |
| Text Secondary | `#9CA3AF` | `text-gray-400` |
| Text Muted | `#6B7280` | `text-gray-500` |
| Border | `#374151` | `border-gray-700` |
| Primary Accent | `#A855F7` | `bg-purple-500` |
| Success/CTA | `#22C55E` | `bg-green-500` |
| Warning | `#F59E0B` | `bg-amber-500` |
| Error | `#EF4444` | `bg-red-500` |

### Color Usage Guidelines

```tsx
// Primary text (titles, important content)
<h1 className="text-white">

// Secondary text (descriptions, body)
<p className="text-gray-400">

// Muted text (helper text, labels)
<span className="text-gray-500">

// Interactive elements highlight
<button className="bg-purple-600 hover:bg-purple-700">

// Success states
<div className="text-green-500">

// Error states  
<span className="text-red-500">
```

---

## Layout Patterns

### Standard Card Layout

Every card should follow this structure:

```tsx
<FormCard {...props}>
  <div className="flex-grow flex flex-col overflow-hidden relative">
    
    {/* Back Button (when applicable) */}
    {props.onPrevious && <BackButton onClick={props.onPrevious} />}
    
    {/* App Bar with Logo */}
    <div className="flex-shrink-0">
      <AppBar logoUrl={theme?.logoUrl} />
    </div>
    
    {/* Scrollable Content Area */}
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-xl mx-auto px-6 sm:px-8 py-8">
        
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {config.props.title}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-3">
            {config.props.description}
          </p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-4">
          {/* Form fields, options, etc. */}
        </div>
        
        {/* Primary Action */}
        <div className="mt-8">
          <button className="w-full h-11 ...">
            {config.props.buttonText}
          </button>
        </div>
        
      </div>
    </div>
    
  </div>
</FormCard>
```

### Split Layout (Two Columns)

For cards like QuestionCard that have two panels:

```tsx
<FormCard {...props}>
  <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
    
    {/* Left Panel - Question/Info */}
    <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      <AppBar logoUrl={theme?.logoUrl} />
      <div className="flex-grow px-6 lg:px-10 py-8">
        <div className="max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {config.props.question}
          </h1>
          <p className="text-sm text-gray-400 mt-3">
            {config.props.description}
          </p>
        </div>
      </div>
    </div>
    
    {/* Right Panel - Action/Input */}
    <div className="w-full lg:w-1/2 flex flex-col bg-gray-950">
      <div className="flex-grow flex items-center justify-center p-6 lg:p-10">
        {/* Options, inputs, video recorder, etc. */}
      </div>
    </div>
    
  </div>
</FormCard>
```

---

## Card Component Standards

### Summary Table

| Card | Layout | Title Size | Has Form Fields | Primary Button |
|------|--------|------------|-----------------|----------------|
| WelcomeCard | Centered | `text-2xl sm:text-3xl` | No | Yes (Continue) |
| RatingCard | Centered | `text-xl sm:text-2xl` | No (Stars only) | Auto-advances |
| QuestionCard | Split (lg:) | `text-xl sm:text-2xl` | Textarea | Yes |
| NegativeFeedbackCard | Split (md:) | `text-xl sm:text-2xl` | Textarea | Yes |
| PrivateFeedbackCard | Centered | `text-lg sm:text-xl` | Textarea | Yes |
| ConsentCard | Centered | `text-xl sm:text-2xl` | Radio options | Yes |
| AboutYouCard | Centered | `text-xl sm:text-2xl` | Yes (name, email, etc.) | Yes |
| AboutCompanyCard | Centered | `text-xl sm:text-2xl` | Yes (title, company, etc.) | Yes |
| ReadyToSendCard | Centered | `text-2xl sm:text-3xl` | No (preview only) | Yes (Submit) |
| ThankYouCard | Split (lg:) | `text-xl sm:text-2xl` | No | Optional (socials) |

### WelcomeCard Exception

WelcomeCard is the "hero" card and can use slightly larger typography:

```tsx
// WelcomeCard only - larger title
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">

// All other cards - standard title
<h1 className="text-xl sm:text-2xl font-bold">
```

---

## Quick Reference Cheatsheet

### Copy-Paste Classes

```tsx
// ═══════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════

// Card Title (standard)
"text-xl sm:text-2xl font-bold leading-tight text-white"

// Card Title (hero - WelcomeCard only)
"text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white"

// Card Description
"text-sm text-gray-400 leading-relaxed mt-3"

// Section Header
"text-xs font-semibold uppercase tracking-wider text-gray-500"

// Form Label
"text-xs font-medium text-gray-400 mb-1.5 block"

// Helper Text
"text-[11px] text-gray-500 mt-1.5"


// ═══════════════════════════════════════════════
// INPUTS
// ═══════════════════════════════════════════════

// Text Input
"w-full h-11 px-3 text-base sm:text-sm text-white placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"

// Textarea
"w-full px-3 py-3 text-base sm:text-sm text-white placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"


// ═══════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════

// Primary Button (Full Width)
"w-full h-11 px-6 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"

// Secondary Button
"w-full h-10 px-4 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all"

// Ghost Button
"px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"


// ═══════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════

// Content Container
"w-full max-w-xl mx-auto px-6 sm:px-8"

// Form Field Spacing
"space-y-4"

// Section Spacing
"space-y-8"

// Card Vertical Padding
"py-8"


// ═══════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════

// Inline with text
"w-4 h-4"

// Feature/Option icon
"w-6 h-6"

// Hero/Decorative icon
"w-8 h-8"
```

---

## Implementation Checklist

When creating or updating a card, verify:

- [ ] Title uses `text-xl sm:text-2xl font-bold`
- [ ] Description uses `text-sm text-gray-400`
- [ ] Content container has `max-w-xl mx-auto px-6 sm:px-8`
- [ ] Form fields have `h-11` height
- [ ] Form fields have `text-base sm:text-sm` for iOS compatibility
- [ ] Primary button has `h-11` height
- [ ] Form field gaps use `space-y-4`
- [ ] Section gaps use `space-y-8` or `mt-8`
- [ ] Icons follow the size guide
- [ ] Touch targets are ≥44px

---

## Questions?

If you're unsure about any specification, check existing cards for reference or open a discussion. Consistency is more important than perfection — when in doubt, match what's already there.

---

*Last updated: December 24, 2024*
