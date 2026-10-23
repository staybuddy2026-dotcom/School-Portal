# Project Rules & Style Guidelines

## Centralized Color System Rule (Mandatory)
- **All colors must be defined and referenced through the Centralized Color System**:
  - Central Source of Truth: `src/theme/colors.ts` and `src/theme/index.ts`
  - CSS Custom Properties: Defined in `:root` in `src/index.css` (`--color-...`)
  - Tailwind Semantic Tokens: Integrated in `tailwind.config.js` (`brand-...`, `surface-...`, `text-...`, `border-...`, `status-...`)
  - Material UI (MUI): Integrated via centralized `muiTheme` in `src/theme/muiTheme.ts`
  - Reusable UI Components: `src/components/ui.tsx` and `ToastContext.tsx`
- **Always use HEX format (`#RRGGBB` or `#RRGGBBAA`)** when defining color values in `src/theme/colors.ts`.
- **Do NOT use other formats**:
  - Do NOT use `rgba(...)`, `rgb(...)`, or `hsl(...)`.
  - Do NOT use Tailwind preset color names (e.g., `text-blue-700`, `bg-rose-50`, `border-emerald-200`).
- **Do NOT use arbitrary hardcoded color values across component or page files.**
  - Instead, use the centralized design tokens (e.g., `text-brand-navy`, `bg-surface-card`, `border-border-default`, `text-text-secondary`, `bg-brand-goldLight`, `border-brand-goldBorder`, `colors.brand.primary`, `colors.status.success.text`).
- **Core School Brand HEX Colors**:
  - Royal Gold: `#7C612A` (`colors.brand.gold` / `--color-brand-gold`)
  - Deep Burgundy: `#560110` (`colors.brand.burgundy` / `--color-brand-burgundy`)
  - Midnight Navy: `#17153A` (`colors.brand.navy` / `--color-brand-navy`)
- **Adding New Colors**:
  - Whenever a new color is required in the future, first check whether an existing token in `src/theme/colors.ts` can be reused.
  - If a genuinely new color is needed, add it to `src/theme/colors.ts` under the appropriate semantic category and use it through the designated token instead of writing a hardcoded color value.

## Typography & Font Size Rule (Mandatory)
- **Always use Pixel (`px`) format** for all text / font sizes across the entire project.
- **Do NOT use `rem` or `em` units** for font sizes anywhere in the project.
- All Tailwind font scale utilities (`text-3xs`, `text-2xs`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, etc.) are configured to compile to exact `px` values.
- When using arbitrary font size classes or inline styling, always use explicit pixel values (e.g., `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[14px]`, `text-[15px]`, `text-[16px]`, `text-[26px]`, `text-[28px]`), never `rem`.
- Any new components, pages, or modifications created in the future must strictly adhere to pixel (`px`) typography.

## Primary Font Family Rule (Mandatory)
- **Always use Poppins as the primary and default font family** across the entire ERP portal.
- All components, pages, dashboards, forms, tables, buttons, cards, modals, dropdowns, navigation menus, and third-party library components (including Material UI / MUI) must inherit and use Poppins.
- Never use or introduce other font families (such as Inter, Roboto, Arial, Times New Roman, or default system fonts).

## Teacher Profile Avatar Rule (Mandatory)
- **Always display the teacher's profile picture / avatar (`TeacherAvatar`)** wherever a teacher's name or detail is displayed across the ERP (Timetables, Dashboard, Subject Lists, Teacher Announcements/Updates, Mentor Cards, PTMs, Appointments, etc.).
- Never display naked names or plain initials-only badges when representing teachers; always use their designated profile photo with rounded styling and initials fallback.

## Centralized Toast Notification Rule (Mandatory)
- **Always use the centralized Toast system (`toast` / `showToast` from `@/components/ui`)** for all user notifications, alerts, and feedback across all portals and roles.
- **Fixed Position**: Toasts must exclusively appear in the fixed bottom-right viewport position (`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999]`). Never render custom or ad-hoc local toast boxes in top-right, center, or top-left locations.
- **Consistent UI**: All toasts must follow the original sleek dark design system with `#17153A` background, `#334155` border, rounded-xl corners, white Poppins typography, status icon (`#10B981` green checkmark for success), and subtle dismissal cross.

## Centralized Icon System Rule (Mandatory)
- **Always use Iconify icons exclusively** through the centralized `<Icon name="..." />` component from `@/components/Icon`.
- **Do NOT import from `lucide-react`, `react-icons`, `@heroicons`, or other third-party icon packages directly.** All icons are rendered via `@iconify/react` using pre-bundled offline icon collections (`@iconify-json/lucide`, `@iconify-json/solar`, `@iconify-json/hugeicons`).
- **Outline-Style with Smooth Curves**: All icons must use clean outline-style icons with smooth curved edges (`stroke-linecap="round" stroke-linejoin="round"`) and adjustable stroke thickness.
- **Consistent Sizing & Stroke Thickness**: Default stroke width is `1.75` (adjustable via `strokeWidth` prop). Use standard icon sizes: `size={13}`/`size={14}` for table actions & inputs, `size={15}`/`size={16}` for buttons & badges, `size={18}`/`size={20}` for headers & navigation, `size={24}` for large metrics & banners.
- **Semantic Icon Accuracy**: Always choose icons that accurately represent their intended actions (e.g. `Search`, `Calendar`, `User`, `Check`, `CheckCircle`, `X`, `XCircle`, `AlertCircle`, `AlertTriangle`, `Trash`, `Edit`/`Pencil`, `Download`, `Upload`, `LogOut`, `Filter`, `Plus`).


