# Sadvidhya International School ERP — Centralized Design System

This directory houses the single source of truth for all design tokens (colors, typography, font sizing, and theme integrations) across the entire ERP portal.

---

## 1. Directory Structure

```text
src/theme/
├── colors.ts      # Centralized color palette & semantic design tokens (Single Source of Truth)
├── typography.ts  # Centralized typography system strictly defined in PIXELS (px)
├── muiTheme.ts    # Centralized Material UI (MUI) Theme integrated with Poppins & Brand Palette
├── index.ts       # Unified barrel export for theme tokens and utilities
└── README.md      # Developer guide & token reference
```

---

## 2. Core Brand Identity (Strict HEX Format)

| Token Name | HEX Code | CSS Variable | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `colors.brand.primary` / `gold` | `#7C612A` | `--color-brand-gold` | Royal Gold — Primary buttons, active tabs, brand accents |
| `colors.brand.secondary` / `burgundy` | `#560110` | `--color-brand-burgundy` | Deep Burgundy — Primary hover states, headers |
| `colors.brand.navy` | `#17153A` | `--color-brand-navy` | Midnight Navy — Page titles, toast notifications, dark surfaces |
| `colors.brand.goldLight` | `#FAF7F2` | `--color-brand-gold-light` | Light gold warm background for badges, chips, pill tabs |
| `colors.brand.goldBorder` | `#E8DFC8` | `--color-brand-gold-border` | Light gold warm border for badges and cards |

---

## 3. Centralized Typography System (Strict Pixel Scale)

All font sizes across the ERP system **must strictly use pixels (`px`) format**. Never use `rem`, `em`, or unspecified units for text sizes.

### Primary Font Family
- **Poppins** (`FONT_FAMILY_POPPINS`): The mandatory primary and default font family across all modules, pages, forms, buttons, tables, and MUI components.

### Exact Pixel Font Size Scale

| Token | Pixel Size | Line Height | CSS Variable | Common Usage |
| :--- | :--- | :--- | :--- | :--- |
| `3xs` | `10px` | `14px` | `--font-size-3xs` | Micro badges, status indicators, tiny tags |
| `2xs` | `11px` | `14px` | `--font-size-2xs` | Table column headers (uppercase), badges, meta timestamps |
| `xs` | `12px` | `16px` | `--font-size-xs` | Captions, helper text, breadcrumbs, secondary subtitles |
| `compact` | `13px` | `18px` | `--font-size-compact` | Table body cells, standard form labels, dropdown items |
| `sm` | `14px` | `20px` | `--font-size-sm` | Default application body text, form inputs, standard buttons |
| `md` | `15px` | `22px` | `--font-size-md` | Emphasized body text, large action buttons |
| `base` | `16px` | `24px` | `--font-size-base` | Card headers, subsection titles |
| `lg` | `18px` | `26px` | `--font-size-lg` | Modal titles, card section titles |
| `xl` | `20px` | `28px` | `--font-size-xl` | Group section headers, large card titles |
| `2xl` | `24px` | `32px` | `--font-size-2xl` | Main page titles (`h1`), hero metric values |
| `3xl` | `30px` | `36px` | `--font-size-3xl` | Module titles, large counter numbers |
| `4xl` | `36px` | `40px` | `--font-size-4xl` | Display hero headers, public portal hero |
| `5xl` | `48px` | `48px` | `--font-size-5xl` | Hero landing displays |

### Semantic Typography Hierarchy

```tsx
import { typography } from '@/theme';

// Heading tokens
typography.heading.h1 // { fontSize: '24px', lineHeight: '32px', fontWeight: 700 }
typography.heading.h2 // { fontSize: '20px', lineHeight: '28px', fontWeight: 700 }
typography.heading.h3 // { fontSize: '18px', lineHeight: '26px', fontWeight: 600 }
typography.heading.h4 // { fontSize: '16px', lineHeight: '24px', fontWeight: 600 }
typography.heading.h5 // { fontSize: '15px', lineHeight: '22px', fontWeight: 600 }
typography.heading.h6 // { fontSize: '14px', lineHeight: '20px', fontWeight: 600 }

// Body tokens
typography.body.base    // { fontSize: '14px', lineHeight: '20px', fontWeight: 400 }
typography.body.compact // { fontSize: '13px', lineHeight: '18px', fontWeight: 400 }
typography.body.sm      // { fontSize: '12px', lineHeight: '16px', fontWeight: 400 }
typography.body.xs      // { fontSize: '11px', lineHeight: '14px', fontWeight: 400 }

// Form Labels & Table tokens
typography.label.base  // { fontSize: '13px', lineHeight: '18px', fontWeight: 500 }
typography.table.head  // { fontSize: '11px', lineHeight: '14px', fontWeight: 700, textTransform: 'uppercase' }
typography.table.cell  // { fontSize: '13px', lineHeight: '18px', fontWeight: 400 }

// Buttons & Badges
typography.button.base // { fontSize: '13px', lineHeight: '18px', fontWeight: 600 }
typography.badge.sm    // { fontSize: '11px', lineHeight: '14px', fontWeight: 600 }
```

---

## 4. Semantic Color Tokens

### Surfaces & Backgrounds
- `colors.surface.app` (`#F8FAFC` / `--color-surface-app` / `bg-surface-app`): Application main canvas background.
- `colors.surface.card` (`#FFFFFF` / `--color-surface-card` / `bg-surface-card`): Cards, modals, sheets, popovers.
- `colors.surface.subtle` (`#F1F5F9` / `--color-surface-subtle` / `bg-surface-subtle`): Progress bar tracks, muted tabs.
- `colors.surface.hover` (`#F8FAFC` / `--color-surface-hover` / `bg-surface-hover`): Table row and item hover states.
- `colors.surface.dark` (`#17153A` / `--color-surface-dark` / `bg-surface-dark`): Toast notifications, dark headers.

### Typography & Text Colors
- `colors.text.primary` (`#0F172A` / `--color-text-primary` / `text-text-primary`): Primary card titles, values, strong text.
- `colors.text.heading` (`#17153A` / `--color-text-heading` / `text-text-heading`): Brand titles, module headers.
- `colors.text.body` (`#475569` / `--color-text-body` / `text-text-body`): Body copy, table body content.
- `colors.text.secondary` (`#64748B` / `--color-text-secondary` / `text-text-secondary`): Descriptions, captions, table headers.
- `colors.text.muted` (`#94A3B8` / `--color-text-muted` / `text-text-muted`): Placeholder text, disabled icons.
- `colors.text.inverse` (`#FFFFFF` / `--color-text-inverse` / `text-text-inverse`): White text for dark surfaces & buttons.

### Borders & Dividers
- `colors.border.default` (`#E2E8F0` / `--color-border-default` / `border-border-default`): Standard card & table borders.
- `colors.border.subtle` (`#F1F5F9` / `--color-border-subtle` / `border-border-subtle`): Soft dividers.
- `colors.border.medium` (`#CBD5E1` / `--color-border-medium` / `border-border-medium`): Form inputs & scrollbar thumbs.
- `colors.border.dark` (`#334155` / `--color-border-dark` / `border-border-dark`): Dark toast & modal borders.
- `colors.border.brand` (`#E8DFC8` / `--color-border-brand` / `border-border-brand`): Warm gold accent borders.

### Feedback & Status Themes
- **Success**: Bg: `#F0FDF4`, Border: `#BBF7D0`, Text: `#15803D`, Icon/Dot: `#10B981`
- **Warning**: Bg: `#FFFBEB`, Border: `#FDE68A`, Text: `#B45309`, Dot: `#D97706`
- **Error / Danger**: Bg: `#FFF1F2`, Border: `#FECDD3`, Text: `#BE123C`, Icon: `#EF4444`
- **Info**: Bg: `#EFF6FF`, Border: `#BFDBFE`, Text: `#1D4ED8`, Icon: `#2563EB`

---

## 5. Developer Guide & Usage Examples

### In React / TypeScript Components
```tsx
import { colors, typography, fontSizes } from '@/theme';

// Example: Using typography and color tokens directly
<div style={{ backgroundColor: colors.surface.card, borderColor: colors.border.default }}>
  <h1 style={{ ...typography.heading.h1, color: colors.brand.navy }}>
    Student Roster
  </h1>
  <p style={{ ...typography.body.compact, color: colors.text.secondary }}>
    Viewing all enrolled students
  </p>
</div>
```

### In Tailwind CSS Classes
All Tailwind text size utilities are mapped to exact pixel values:
- `text-3xs` -> `10px`
- `text-2xs` -> `11px`
- `text-xs` -> `12px`
- `text-compact` or `text-[13px]` -> `13px`
- `text-sm` -> `14px`
- `text-md` or `text-[15px]` -> `15px`
- `text-base` -> `16px`
- `text-lg` -> `18px`
- `text-xl` -> `20px`
- `text-2xl` -> `24px`
- `text-3xl` -> `30px`
- `text-4xl` -> `36px`

```tsx
<div className="bg-surface-card border border-border-default p-5 rounded-2xl shadow-card-soft">
  <h2 className="text-xl font-bold text-brand-navy">Title</h2>
  <p className="text-xs text-text-secondary mt-1">Subtitle</p>
  <table className="w-full mt-4">
    <thead>
      <tr className="text-2xs font-bold text-text-secondary uppercase">
        <th>Student Name</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-compact text-text-body">
        <td>Aarav Sharma</td>
      </tr>
    </tbody>
  </table>
</div>
```

### With Material UI (MUI)
The MUI `ThemeProvider` is globally configured in `src/main.tsx` with `muiTheme` from `@/theme`.
- Typography variants (`h1` through `h6`, `subtitle1`, `body1`, `body2`, `button`, `caption`, `overline`) are configured with exact pixel sizes and Poppins font family.
- Table headers (`MuiTableCell.head`) default to `11px` uppercase bold.
- Table cells (`MuiTableCell.root`) default to `13px`.
- Buttons default to `13px` font size with `font-weight: 600`.

---

## 6. Developer Guidelines for Future Components

1. **Mandatory Pixel Units (`px`)**:
   - Always define font sizes in `px` (e.g. `text-sm`, `text-xs`, `text-compact`, `text-[13px]`, `text-[24px]`).
   - Never use `rem`, `em`, or relative scaling units for typography.
2. **Mandatory Font Family**:
   - Always use Poppins as the primary font family. Never import or use Inter, Roboto, Arial, or system default fonts.
3. **Check Reuse First**:
   - Always inspect `src/theme/typography.ts` and `src/theme/colors.ts` before creating new styles.
4. **Consistency**:
   - Page Titles: `24px` (`text-2xl` / `typography.heading.h1`)
   - Section Titles: `20px` (`text-xl` / `typography.heading.h2`)
   - Card Titles: `18px` (`text-lg` / `typography.heading.h3`)
   - Body Text: `14px` (`text-sm` / `typography.body.base`)
   - Table Cells & Dropdowns: `13px` (`text-compact` / `typography.body.compact`)
   - Captions & Helpers: `12px` (`text-xs` / `typography.caption.base`)
   - Table Headers & Badges: `11px` (`text-2xs` / `typography.table.head`)

---

## 7. Centralized Iconify Icon System

All icons across the ERP are powered exclusively by **Iconify** via `<Icon name="..." />` from `@/components/Icon`.

### Visual Guidelines:
- **Style**: Outline-style with smooth, curved edges and clean strokes (`stroke-linecap="round"` and `stroke-linejoin="round"`).
- **Customizable Stroke Width**: Standardized stroke thickness is **`1.5px`** across the entire ERP portal (customizable via `strokeWidth` prop).
- **Universal Sizing**:
  - `size={13}` / `size={14}`: Table action buttons, input adornments, breadcrumbs.
  - `size={15}` / `size={16}`: Buttons, badges, tab bars, filter triggers.
  - `size={18}` / `size={20}`: Section headers, navigation items, cards.
  - `size={24}`: Top navbar actions, hero icons, modal accents.

### Developer Usage:
```tsx
import { Icon } from '@/components/Icon';

// Using standard curated name (maps to clean Lucide outline)
<Icon name="Calendar" size={16} />
<Icon name="Search" size={14} />
<Icon name="CheckCircle" size={18} className="text-status-success-main" />

// Using direct Iconify identifier (Solar linear, Lucide, or Hugeicons)
<Icon name="lucide:chart-line" size={18} strokeWidth={2} />
<Icon name="solar:bus-linear" size={20} />
```

