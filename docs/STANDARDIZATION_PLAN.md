# Standardization Implementation Plan

> **Goal:** Refactor all form card components to use a dynamic, theme-driven color system rooted in a single configurable `primaryColor`.
> **Prerequisites Completed:** `QuestionCard` visual branching resolved (Video = Primary, Text = Neutral).

---

## 1. Core Architecture Strategy

We will move from **hardcoded Tailwind classes** (e.g., `bg-purple-600`) to **CSS Variables** injected at the root of the form renderer. This allows runtime theming without complex Javascript logic inside every component.

### The CSS Variable System

We will define these variables in `FormRenderer.tsx`:

| CSS Variable | Description | Default (Purple) | Purpose |
|--------------|-------------|------------------|---------|
| `--primary` | Main Brand Color | `#A855F7` | Primary buttons, active states, key icons |
| `--primary-foreground` | Text on Primary | `#FFFFFF` | Text inside filled buttons |
| `--primary-hover` | Darker/Rich shade | `#9333EA` | Hover states for buttons |
| `--primary-alpha-10` | 10% Opacity | `rgba(168, 85, 247, 0.1)` | Subtle backgrounds, tints |
| `--primary-alpha-20` | 20% Opacity | `rgba(168, 85, 247, 0.2)` | Borders, stronger tints |
| `--primary-glow` | Glow Color | `rgba(168, 85, 247, 0.5)` | Box shadows, blurs |

**Why this approach?**
- **Performance:** CSS handles the heavy lifting.
- **Simplicity:** Components just use `bg-[var(--primary)]` or utility classes we define.
- **Consistency:** Changing one hex code updates the entire app instantly.

---

## 2. Implementation Steps

### Step 1: Create Theme Utility Hook
Create `src/hooks/use-form-theme.ts` to generate these CSS variables from the `config.theme.primaryColor` hex code.
- Needs a helper to convert Hex -> RGB for alpha channels.
- Needs a helper to generate hover states (darken by 10%).

### Step 2: Inject Variables in `FormRenderer`
Wrap the main form container in a style block:
```tsx
<div style={{
    '--primary': theme.primaryColor,
    '--primary-hover': darken(theme.primaryColor),
    '--primary-alpha-10': hexToRgba(theme.primaryColor, 0.1),
    // ...etc
} as React.CSSProperties}>
    {/* Form Cards */}
</div>
```

### Step 3: Component Refactoring (The Heavy Lifting)

We will go through each card and replace hardcoded colors.

**1. General Components (Buttons & Inputs)**
- **Buttons:** `bg-purple-600` → `bg-[var(--primary)]`
- **Focus Rings:** `focus:ring-purple-500` → `focus:ring-[var(--primary)]`
- **Input Borders:** `focus:border-purple-500` → `focus:border-[var(--primary)]`

**2. Specific Component Updates**

| Component | Element | Action |
|-----------|---------|--------|
| **WelcomeCard** | Title Gradient | Change from `purple-100` to `var(--primary-alpha-20)` or similar |
| | CTA Button | Use Primary |
| **RatingCard** | Background Glow | Use `var(--primary-glow)` |
| | Selection Text | Use `text-[var(--primary)]` |
| **QuestionCard** | Video Option | Use `border-[var(--primary-alpha-20)]` and `bg-[var(--primary-alpha-10)]` |
| | Icons | Use `text-[var(--primary)]` |
| **AboutYou/Company** | Avatar/Logo Borders | Use `border-[var(--primary-alpha-20)]` |
| **ConsentCard** | Checkbox Active State | Use `bg-[var(--primary)]` |
| **ReadyToSend** | Sparkles/Decorations | Use `text-[var(--primary)]` |
| **ThankYou** | Title Gradient | Tint with Primary |

### Step 4: Font Standardization
- Actually apply the `headingFont` and `bodyFont` from the config to the container's `font-family` style.

---

## 3. Execution Order

1.  **Utilities:** Create `src/lib/theme-utils.ts` (Hex helpers).
2.  **Renderer:** Update `FormRenderer.tsx` to inject variables.
3.  **Global UI:** Update shared components like `AppBar` and `BackButton` if they use accents.
4.  **Cards:** Batch update all cards (Start with QuestionCard & WelcomeCard as they are most visible).

## 4. Risks & Mitigations

- **Risk:** Gradient fidelity. Simple solid colors are easy, but beautiful gradients (like on `WelcomeCard`) usually need 2-3 specific shades.
- **Mitigation:** We will generate `primary-light` and `primary-dark` variants in the utility hook so we can still build rich gradients dynamically.

- **Risk:** Contrast issues (e.g., user picks yellow as primary).
- **Mitigation:** We will force `--primary-foreground` to be black or white based on contrast calculation of the primary color.

---

## 5. Definition of Done

- [ ] All 8 active cards use `var(--primary...)` instead of `purple/blue/lime`.
- [ ] Changing `primaryColor` in `default-form-config.ts` acts as a "skin" that instantly recolors the entire form.
- [ ] No visual regressions in the "Neutral" components (Text input, plain cards).
