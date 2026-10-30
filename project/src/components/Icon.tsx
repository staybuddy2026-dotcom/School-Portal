/**
 * ============================================================================
 * Sadvidhya International School ERP — Centralized Iconify Icon Component
 * Exclusively powered by Iconify with customizable stroke-width outline icons.
 * Smooth, curved edges, clean strokes, and consistent alignment across the ERP.
 * ============================================================================
 */
import React, { memo } from 'react';
import { Icon as IconifyIcon, addCollection, addIcon } from '@iconify/react';
import type { IconifyJSON } from '@iconify/types';
import lucideIcons from '@iconify-json/lucide/icons.json';
import solarIcons from '@iconify-json/solar/icons.json';
import hugeicons from '@iconify-json/hugeicons/icons.json';
import mageIcons from '@iconify-json/mage/icons.json';

// Register complete offline icon collections into Iconify
addCollection(lucideIcons as unknown as IconifyJSON);
addCollection(solarIcons as unknown as IconifyJSON);
addCollection(hugeicons as unknown as IconifyJSON);
addCollection(mageIcons as unknown as IconifyJSON);

// Register Hugeicons calendar-date-1 fallback for high-precision date widgets
addIcon('hugeicons:calendar-date-1', {
  body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16 2v4M8 2v4m-5 4h18m-10.5 8h3M13 4h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172S21 17.771 21 14v-2c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4"/><path d="M12 18v-3.512c0-.875 0-1.313-.207-1.451c-.208-.139-.47.124-.993.649l-.3.3"/></g>',
  width: 24,
  height: 24,
});

/**
 * Standard Iconify Outline Icon Mapping (Adjustable stroke-width, smooth curves)
 * Maps PascalCase/common icon names directly to their optimal Iconify outline counterpart.
 */
const standardIconMap: Record<string, string> = {
  // Navigation & Core Roles
  Dashboard: 'lucide:layout-dashboard',
  LayoutDashboard: 'lucide:layout-dashboard',
  User: 'lucide:user',
  Users: 'lucide:users',
  UserCheck: 'lucide:user-check',
  UserPlus: 'lucide:user-plus',
  CreditCard: 'lucide:credit-card',
  BookOpen: 'lucide:book-open',
  Calendar: 'lucide:calendar',
  Date: 'lucide:calendar',
  CalendarCheck: 'lucide:calendar-check',
  CalendarDays: 'lucide:calendar-days',
  CalendarClock: 'lucide:calendar-clock',
  CalendarPlus: 'lucide:calendar-plus',
  Clock: 'lucide:clock',
  AlarmClock: 'lucide:alarm-clock',
  FileText: 'lucide:file-text',
  FilePlus: 'lucide:file-plus',
  FileSpreadsheet: 'lucide:file-spreadsheet',
  GraduationCap: 'lucide:graduation-cap',
  Scale: 'lucide:scale',
  Trophy: 'lucide:trophy',
  PartyPopper: 'lucide:party-popper',
  Eye: 'lucide:eye',
  EyeOff: 'lucide:eye-off',
  Bus: 'lucide:bus',
  LifeBuoy: 'lucide:life-buoy',
  Helpdesk: 'lucide:circle-help',
  HelpCircle: 'lucide:circle-help',
  Help: 'lucide:circle-help',
  History: 'lucide:history',

  // Controls, Inputs & Actions
  Settings: 'lucide:settings',
  Bell: 'lucide:bell',
  Search: 'lucide:search',
  Menu: 'lucide:menu',
  Repeat: 'lucide:repeat',
  RotateCcw: 'lucide:rotate-ccw',
  ChevronDown: 'lucide:chevron-down',
  ChevronUp: 'lucide:chevron-up',
  ChevronRight: 'lucide:chevron-right',
  ChevronLeft: 'lucide:chevron-left',
  ArrowRight: 'lucide:arrow-right',
  ArrowLeft: 'lucide:arrow-left',
  Download: 'lucide:download',
  Upload: 'lucide:upload',
  Check: 'lucide:check',
  CheckCircle: 'lucide:circle-check',
  X: 'lucide:x',
  XCircle: 'lucide:circle-x',
  Close: 'lucide:x',
  AlertCircle: 'lucide:circle-alert',
  AlertTriangle: 'lucide:triangle-alert',
  LogOut: 'lucide:log-out',
  LogIn: 'lucide:log-in',
  Filter: 'lucide:filter',
  Plus: 'lucide:plus',
  Trash: 'lucide:trash-2',
  Edit: 'lucide:pencil',
  Pencil: 'lucide:pencil',
  Save: 'lucide:save',
  Send: 'lucide:send',

  // Medical, Transport & Activity Modules
  Heart: 'lucide:heart',
  HeartPulse: 'lucide:heart-pulse',
  Pill: 'lucide:pill',
  Stethoscope: 'lucide:stethoscope',
  Shield: 'lucide:shield',
  ShieldCheck: 'lucide:shield-check',
  Mail: 'lucide:mail',
  Phone: 'lucide:phone',
  MapPin: 'lucide:map-pin',
  MapPinned: 'lucide:map-pinned',
  Route: 'lucide:route',
  Coffee: 'lucide:coffee',
  Paperclip: 'lucide:paperclip',
  Lightbulb: 'lucide:lightbulb',
  BarChart3: 'lucide:chart-bar',
  LineChart: 'lucide:chart-line',
  TrendingUp: 'lucide:trending-up',
  Receipt: 'lucide:receipt',
  Banknote: 'lucide:banknote',
  Award: 'lucide:award',
  Target: 'lucide:target',
  Layers: 'lucide:layers',
  Megaphone: 'lucide:megaphone',
  MessageSquare: 'lucide:message-square',
  ClipboardCheck: 'lucide:clipboard-check',
  ClipboardList: 'lucide:clipboard-list',
  ClipboardPlus: 'lucide:clipboard-plus',
  IdCard: 'lucide:id-card',
  Inbox: 'lucide:inbox',
  KeyRound: 'lucide:key-round',
  Percent: 'lucide:percent',
  Globe: 'lucide:globe',
  Play: 'lucide:play',
  Tags: 'lucide:tags',
  ThumbsUp: 'lucide:thumbs-up',
  Music: 'lucide:music',
};

const lucideCollection = lucideIcons as unknown as IconifyJSON;
const solarCollection = solarIcons as unknown as IconifyJSON;

/**
 * Resolves an icon name to a registered Iconify identifier
 */
export function resolveIconName(name: string): string {
  if (!name) return 'lucide:circle';

  // 1. Direct Iconify identifier (e.g. "solar:widget-2-linear", "lucide:bell", "hugeicons:calendar-date-1")
  if (name.includes(':')) {
    return name;
  }

  // 2. Exact match in standard curated outline map
  if (standardIconMap[name]) {
    return standardIconMap[name];
  }

  // 3. Dynamic kebab-case conversion for Lucide outline collection
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  if (lucideCollection.icons[kebab] || lucideCollection.aliases?.[kebab]) {
    return `lucide:${kebab}`;
  }

  // 4. Solar linear outline fallback
  const solarLinear = `${kebab}-linear`;
  if (solarCollection.icons[solarLinear] || solarCollection.aliases?.[solarLinear]) {
    return `solar:${solarLinear}`;
  }

  return `lucide:${kebab}`;
}

export interface IconProps {
  name: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  strokeWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  inline?: boolean;
}

/**
 * Centralized Icon component rendering exclusively through Iconify.
 * Standardized outline-style icons with an exact 1.5px stroke width and smooth curved edges.
 */
function IconBase({
  name,
  size = 20,
  width,
  height,
  strokeWidth = 1.5,
  className = '',
  style,
  color,
  inline = true,
}: IconProps) {
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  const resolvedIcon = resolveIconName(name);
  const strokeVal = typeof strokeWidth === 'number' ? `${strokeWidth}px` : strokeWidth;

  return (
    <IconifyIcon
      icon={resolvedIcon}
      width={finalWidth}
      height={finalHeight}
      inline={inline}
      className={`inline-block shrink-0 align-middle erp-icon ${className}`}
      style={{
        strokeWidth: strokeVal,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        // @ts-expect-error CSS variable for scalable icon stroke-width
        '--erp-icon-stroke': strokeVal,
        ...style,
      }}
      color={color}
    />
  );
}

export const Icon = memo(IconBase);

