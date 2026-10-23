import { type ReactNode, type ButtonHTMLAttributes, useState, useEffect, useRef } from 'react';
import { studentPhotos, getTeacherAvatar } from '@/data';
import { colors } from '@/theme';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: `bg-[${colors.brand.primary}] text-[${colors.text.inverse}] hover:bg-[${colors.brand.secondary}] active:bg-[${colors.brand.burgundyHover}] shadow-xs`,
  secondary: `bg-[${colors.brand.navy}] text-[${colors.text.inverse}] hover:bg-[${colors.brand.navyActive}] shadow-xs`,
  outline: `border border-[${colors.border.medium}] bg-[${colors.surface.card}] text-[${colors.text.primary}] hover:bg-[${colors.surface.hover}]`,
  ghost: `text-[${colors.text.body}] hover:bg-[${colors.surface.subtle}] hover:text-[${colors.text.primary}]`,
  destructive: `bg-[${colors.status.error.text}] text-[${colors.text.inverse}] hover:bg-[${colors.status.error.dark}] shadow-xs`,
  success: `bg-[${colors.status.success.text}] text-[${colors.text.inverse}] hover:bg-[${colors.status.success.dark}] shadow-xs`,
};

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-[12px] rounded-lg gap-1',
  sm: 'h-8 px-3 text-[12px] rounded-xl gap-1.5',
  md: 'h-10 px-4 text-[14px] rounded-xl gap-2',
  lg: 'h-12 px-6 text-[14px] rounded-xl gap-2',
};

export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
  size?: 'xs' | 'sm';
  className?: string;
}

const badgeVariants = {
  default: `bg-[${colors.surface.hover}] text-[${colors.text.secondary}] border border-[${colors.border.default}]`,
  success: `bg-[${colors.status.success.bg}] text-[${colors.status.success.text}] border border-[${colors.status.success.border}]`,
  warning: `bg-[${colors.status.warning.bg}] text-[${colors.status.warning.text}] border border-[${colors.status.warning.border}]`,
  error: `bg-[${colors.status.error.bg}] text-[${colors.status.error.text}] border border-[${colors.status.error.border}]`,
  info: `bg-[${colors.status.info.bg}] text-[${colors.status.info.text}] border border-[${colors.status.info.border}]`,
  neutral: `bg-[${colors.surface.hover}] text-[${colors.text.secondary}] border border-[${colors.border.default}]`,
  primary: `bg-[${colors.brand.goldLight}] text-[${colors.brand.primary}] border border-[${colors.brand.goldBorder}]`,
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[12px]'} ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export interface StatusBadgeProps {
  status: string;
  variant?: 'auto' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
  size?: 'xs' | 'sm';
  dot?: boolean;
  className?: string;
}

const statusBadgeDotColors = {
  success: `bg-[${colors.status.success.main}]`,
  warning: `bg-[${colors.status.warning.orange}]`,
  error: `bg-[${colors.status.error.crimson}]`,
  info: `bg-[${colors.status.info.main}]`,
  brand: `bg-[${colors.brand.primary}]`,
  neutral: `bg-[${colors.text.muted}]`,
};

export function StatusBadge({ status, variant = 'auto', size = 'xs', dot = false, className = '' }: StatusBadgeProps) {
  const s = status.toLowerCase();

  let resolvedVariant = variant;
  if (resolvedVariant === 'auto') {
    if (['active', 'approved', 'paid', 'completed', 'treated', 'on route', 'published', 'issued', 'present', 'positive', 'resolved', 'done', 'accepted', 'in stock'].some(k => s.includes(k))) {
      resolvedVariant = 'success';
    } else if (['pending', 'in progress', 'scheduled', 'under observation', 'delayed', 'leave', 'one-time', 'warning', 'maintenance', 'infirmary', 'low stock'].some(k => s.includes(k))) {
      resolvedVariant = 'warning';
    } else if (['overdue', 'absent', 'rejected', 'failed', 'inactive', 'negative', 'error', 'cancelled', 'sent home', 'out of stock'].some(k => s.includes(k))) {
      resolvedVariant = 'error';
    } else if (['online', 'cheque', 'referral', 'exam', 'ptm', 'annual', 'half-yearly'].some(k => s.includes(k))) {
      resolvedVariant = 'info';
    } else if (['cash', 'tuition', 'class teacher', 'super admin', 'admin', 'teacher'].some(k => s.includes(k))) {
      resolvedVariant = 'brand';
    } else {
      resolvedVariant = 'neutral';
    }
  }

  const styles = {
    success: `bg-[${colors.status.success.bg}] text-[${colors.status.success.text}] border-[${colors.status.success.border}]`,
    warning: `bg-[${colors.status.warning.bg}] text-[${colors.status.warning.text}] border-[${colors.status.warning.border}]`,
    error: `bg-[${colors.status.error.bg}] text-[${colors.status.error.text}] border-[${colors.status.error.border}]`,
    info: `bg-[${colors.status.info.bg}] text-[${colors.status.info.text}] border-[${colors.status.info.border}]`,
    brand: `bg-[${colors.brand.goldLight}] text-[${colors.brand.primary}] border-[${colors.brand.goldBorder}]`,
    neutral: `bg-[${colors.surface.hover}] text-[${colors.text.secondary}] border-[${colors.border.default}]`,
  }[resolvedVariant] || `bg-[${colors.surface.hover}] text-[${colors.text.secondary}] border-[${colors.border.default}]`;

  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[12px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border capitalize whitespace-nowrap ${sizeClass} ${styles} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${statusBadgeDotColors[resolvedVariant]} shrink-0`} />}
      {status}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className = '', padded = true }: CardProps) {
  return (
    <div className={`bg-[${colors.surface.card}] rounded-2xl border border-[${colors.border.default}] shadow-card-soft ${padded ? 'p-5 md:p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 className={`text-[16px] font-bold text-[${colors.text.primary}]`}>{title}</h2>
        {subtitle && <p className={`text-[12px] text-[${colors.text.secondary}] mt-0.5`}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: string[];
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className={`flex items-center gap-1.5 text-[12px] text-[${colors.text.secondary}] mb-2 font-medium`}>
        {breadcrumbs.map((b, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className={`text-[${colors.border.medium}]`}>/</span>}
            <span className={i === breadcrumbs.length - 1 ? `text-[${colors.text.primary}] font-semibold` : ''}>{b}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-[24px] font-bold text-[${colors.text.primary}] tracking-tight`}>{title}</h1>
          {subtitle && <p className={`text-[14px] text-[${colors.text.secondary}] mt-1`}>{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'accent';
  className?: string;
}

const statColors = {
  primary: `bg-[${colors.brand.goldLight}] text-[${colors.brand.primary}]`,
  success: `bg-[${colors.status.success.bg}] text-[${colors.status.success.text}]`,
  warning: `bg-[${colors.status.warning.bg}] text-[${colors.status.warning.text}]`,
  error: `bg-[${colors.status.error.bg}] text-[${colors.status.error.text}]`,
  secondary: `bg-[${colors.status.info.bg}] text-[${colors.status.info.text}]`,
  accent: `bg-[${colors.accent.purple.bg}] text-[${colors.accent.purple.text}]`,
};

export function StatCard({ label, value, icon, trend, color = 'primary', className = '' }: StatCardProps) {
  return (
    <div className={`bg-[${colors.surface.card}] border border-[${colors.border.default}] rounded-2xl p-5 shadow-card-soft ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[12px] font-medium text-[${colors.text.secondary}]`}>{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statColors[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className={`text-[24px] font-bold text-[${colors.text.primary}] leading-tight font-mono`}>{value}</p>
      {trend && (
        <p className={`text-[12px] mt-1 font-medium ${trend.positive ? `text-[${colors.status.success.text}]` : `text-[${colors.text.secondary}]`}`}>
          {trend.positive ? '↑ ' : '↓ '} {trend.value}
        </p>
      )}
    </div>
  );
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string | ReactNode;
  trend?: { value: string; positive?: boolean };
  color?: 'brand' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function MetricCard({ label, value, icon, trend, color = 'brand', className = '' }: MetricCardProps) {
  const colorMap = {
    brand: { bg: `bg-[${colors.brand.goldLight}]`, text: `text-[${colors.brand.primary}]`, border: `border-[${colors.brand.goldBorder}]` },
    success: { bg: `bg-[${colors.status.success.bg}]`, text: `text-[${colors.status.success.text}]`, border: `border-[${colors.status.success.border}]` },
    warning: { bg: `bg-[${colors.status.warning.bg}]`, text: `text-[${colors.status.warning.text}]`, border: `border-[${colors.status.warning.border}]` },
    error: { bg: `bg-[${colors.status.error.bg}]`, text: `text-[${colors.status.error.text}]`, border: `border-[${colors.status.error.border}]` },
    info: { bg: `bg-[${colors.status.info.bg}]`, text: `text-[${colors.status.info.text}]`, border: `border-[${colors.status.info.border}]` },
  }[color];

  return (
    <div className={`bg-[${colors.surface.card}] border border-[${colors.border.default}] rounded-2xl p-5 shadow-card-soft ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[12px] font-medium text-[${colors.text.secondary}]`}>{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl ${colorMap.bg} ${colorMap.text} border ${colorMap.border} flex items-center justify-center shrink-0`}>
            {typeof icon === 'string' ? <Icon name={icon as any} size={16} /> : icon}
          </div>
        )}
      </div>
      <p className={`text-[24px] font-bold text-[${colors.text.primary}] font-mono leading-tight`}>{value}</p>
      {trend && (
        <p className={`text-[12px] font-medium mt-1 ${trend.positive ? `text-[${colors.status.success.text}]` : `text-[${colors.text.secondary}]`}`}>
          {trend.value}
        </p>
      )}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'secondary';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const progressColors = {
  primary: `bg-[${colors.brand.primary}]`,
  success: `bg-[${colors.status.success.text}]`,
  warning: `bg-[${colors.status.warning.text}]`,
  error: `bg-[${colors.status.error.text}]`,
  secondary: `bg-[${colors.brand.navy}]`,
};

export function ProgressBar({ value, max, color = 'primary', showLabel, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {showLabel && (
        <div className={`flex justify-between text-[12px] text-[${colors.text.secondary}] mb-1 font-medium`}>
          <span>{value} / {max}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full bg-[${colors.surface.subtle}] rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${progressColors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center animate-fade-in ${className}`}>
      {icon && <div className={`w-14 h-14 rounded-2xl bg-[${colors.brand.goldLight}] border border-[${colors.brand.goldBorder}] text-[${colors.brand.primary}] flex items-center justify-center mb-4`}>{icon}</div>}
      <h3 className={`text-[16px] font-bold text-[${colors.text.primary}]`}>{title}</h3>
      {description && <p className={`text-[14px] text-[${colors.text.secondary}] mt-1 max-w-sm leading-relaxed`}>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarSizes = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-[12px]',
  md: 'w-11 h-11 text-[14px]',
  lg: 'w-16 h-16 text-[18px]',
};

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = (!imgError && (src || studentPhotos[name])) || null;
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  if (photoSrc) {
    return (
      <div className={`${avatarSizes[size]} rounded-full overflow-hidden shrink-0 border border-[${colors.border.default}] bg-[${colors.surface.app}] ${className}`}>
        <img
          src={photoSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  return (
    <div className={`${avatarSizes[size]} rounded-full bg-[${colors.brand.primary}] text-[${colors.text.inverse}] font-semibold flex items-center justify-center shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

export interface TeacherAvatarProps {
  name: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function TeacherAvatar({ name, size = 26, className = '' }: TeacherAvatarProps) {
  const photo = getTeacherAvatar(name);
  const initials = name
    .split(' ')
    .filter(n => !n.includes('.'))
    .map(n => n[0])
    .slice(0, 2)
    .join('') || name.slice(0, 2);

  const teacherAvatarSizes: Record<string, number> = {
    xs: 20,
    sm: 26,
    md: 36,
    lg: 48,
    xl: 64,
  };
  const pixelSize = typeof size === 'number' ? size : (teacherAvatarSizes[size] || 26);

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-[${colors.border.default}] shadow-2xs bg-[${colors.brand.navy}] select-none ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      title={name}
    >
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 text-white flex items-center justify-center font-bold text-[9px] -z-10">
        {initials}
      </div>
    </div>
  );
}

export interface PillTabItem {
  key: string;
  label: string;
  badge?: number | string;
  count?: number | string;
  icon?: string;
}

export interface PillTabsProps {
  tabs: (PillTabItem | string)[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function PillTabs({ tabs, active, onChange, className = '' }: PillTabsProps) {
  return <Tabs tabs={tabs as any} active={active} onChange={onChange} className={className} />;
}

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative flex-1 min-w-[200px] max-w-sm ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-9 pr-3 py-1.5 text-[14px] rounded-xl border border-[${colors.border.medium}] bg-[${colors.surface.card}] text-[${colors.text.primary}] placeholder-[${colors.text.muted}] outline-none focus:border-[${colors.brand.primary}] transition-colors`}
        {...props}
      />
      <Icon name="Search" size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 text-[${colors.text.muted}]`} />
    </div>
  );
}

export interface TableCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TableCard({ title, subtitle, action, children, className = '' }: TableCardProps) {
  return (
    <div className={`bg-[${colors.surface.card}] border border-[${colors.border.default}] rounded-2xl shadow-card-soft overflow-hidden ${className}`}>
      {(title || action) && (
        <div className={`px-5 py-4 border-b border-[${colors.border.default}] bg-[${colors.surface.hover}] flex flex-wrap items-center justify-between gap-3`}>
          <div>
            {title && <h3 className={`font-bold text-[16px] text-[${colors.text.primary}]`}>{title}</h3>}
            {subtitle && <p className={`text-[12px] text-[${colors.text.secondary}] mt-0.5`}>{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="overflow-x-auto scrollbar-thin">
        {children}
      </div>
    </div>
  );
}

export interface TabItem {
  key: string;
  label: string;
  count?: number | string;
  badge?: number | string;
  icon?: string;
}

export interface TabsProps {
  tabs: (TabItem | { label: string; key: string; count?: number | string; badge?: number | string; icon?: string } | string)[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-[${colors.border.default}] gap-2 overflow-x-auto scrollbar-thin ${className}`}>
      {tabs.map(item => {
        const key = typeof item === 'string' ? item : item.key;
        const label = typeof item === 'string' ? item : item.label;
        const count = typeof item === 'string' ? undefined : (item.count ?? (item as any).badge);
        const icon = typeof item === 'string' ? undefined : (item as any).icon;
        const isActive = active === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-4 py-3 text-[14px] font-semibold border-b-2 -mb-px transition-all whitespace-nowrap cursor-pointer ${isActive
              ? `border-[${colors.brand.primary}] text-[${colors.brand.primary}] font-bold`
              : `border-transparent text-[${colors.text.secondary}] hover:text-[${colors.text.primary}] hover:border-[${colors.border.medium}]`
              }`}
          >
            {icon && <Icon name={icon as any} size={16} />}
            <span>{label}</span>
            {count !== undefined && (
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${isActive
                ? `bg-[${colors.brand.goldLight}] text-[${colors.brand.primary}] border border-[${colors.brand.goldBorder}]`
                : `bg-[${colors.surface.subtle}] text-[${colors.text.secondary}]`
                }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  overflowVisible?: boolean;
  className?: string;
  bodyClassName?: string;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, isOpen, onClose, title, children, footer, size = 'md', overflowVisible = false, className = '', bodyClassName = '' }: ModalProps) {
  const isShown = open ?? isOpen ?? false;

  useEffect(() => {
    if (!isShown) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isShown, onClose]);

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent black background overlay (backdrop) with smooth fade-in and backdrop blur */}
      <div
        className="fixed inset-0 bg-overlay-backdrop backdrop-blur-[3px] transition-opacity duration-200 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Active Modal Dialog - clearly visible and interactive above the overlay */}
      <div className={`relative w-full ${modalSizes[size]} bg-[${colors.surface.card}] rounded-2xl shadow-modal border border-[${colors.border.default}] ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} z-10 flex flex-col max-h-[90vh] animate-scale-in ${className}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b border-[${colors.border.default}] bg-[${colors.surface.hover}] ${overflowVisible ? 'rounded-t-2xl' : ''}`}>
          <h3 className={`text-[16px] font-bold text-[${colors.text.primary}]`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg text-[${colors.text.muted}] hover:text-[${colors.text.primary}] hover:bg-[${colors.border.default}] transition-colors cursor-pointer`}>
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className={`p-6 ${overflowVisible ? 'overflow-visible' : 'overflow-y-auto scrollbar-thin'} ${bodyClassName}`}>{children}</div>
        {footer && <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-[${colors.border.default}] bg-[${colors.surface.hover}] ${overflowVisible ? 'rounded-b-2xl' : ''}`}>{footer}</div>}
      </div>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  align?: 'left' | 'right';
}

function CustomDatePicker({ label, error, hint, required, className = '', value, onChange, disabled, name, placeholder = 'Select Date', align = 'left' }: any) {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  const parseDate = (dStr: string) => {
    if (!dStr) return new Date(2026, 9, 1);
    const p = dStr.split('-');
    if (p.length === 3) {
      const y = parseInt(p[0], 10);
      const m = parseInt(p[1], 10) - 1;
      const d = parseInt(p[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, 1);
    }
    return new Date(2026, 9, 1);
  };

  const [calDate, setCalDate] = useState<Date>(() => parseDate(value));

  // Sync state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value || '');
      if (value) {
        setCalDate(parseDate(value));
      }
    }
  }, [value]);

  // Handle outside click & Escape key to guarantee calendar closes automatically
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const calMonth = calDate.getMonth();
  const calYear = calDate.getFullYear();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Monday-start week calculation (ISO / Indian academic standard)
  const rawFirstDay = new Date(calYear, calMonth, 1).getDay();
  const firstDayIndex = (rawFirstDay + 6) % 7; // Monday = 0, Sunday = 6
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  const prevMonthYear = calMonth === 0 ? calYear - 1 : calYear;
  const prevMonthNum = calMonth === 0 ? 12 : calMonth;

  const nextMonthYear = calMonth === 11 ? calYear + 1 : calYear;
  const nextMonthNum = calMonth === 11 ? 1 : calMonth + 2;

  const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => {
    const dayNum = daysInPrevMonth - firstDayIndex + 1 + i;
    const fullDate = `${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { day: dayNum, dateStr: fullDate };
  });

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const fullDate = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { day: dayNum, dateStr: fullDate };
  });

  const remainingCells = (firstDayIndex + daysInMonth) % 7 === 0 ? 0 : 7 - ((firstDayIndex + daysInMonth) % 7);
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => {
    const dayNum = i + 1;
    const fullDate = `${nextMonthYear}-${String(nextMonthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { day: dayNum, dateStr: fullDate };
  });

  // Automatically closes the calendar immediately after selecting a date
  const handleSelectDate = (dateStr: string) => {
    setCurrentValue(dateStr);
    setOpen(false);
    if (dateStr) {
      const p = dateStr.split('-');
      if (p.length === 3) {
        setCalDate(new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, 1));
      }
    }
    if (onChange) {
      onChange({ target: { name: name || '', value: dateStr } });
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className={`block text-[14px] font-semibold text-[${colors.text.slateDark}] mb-1.5`}>
          {label} {required && <span className={`text-[${colors.status.error.text}]`}>*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(prev => !prev);
          }}
          className={`w-full h-10 px-3.5 text-[14px] rounded-xl border bg-[${colors.surface.card}] transition-colors flex items-center justify-between text-left outline-none cursor-pointer ${error ? `border-[${colors.status.error.text}]` : `border-[${colors.border.medium}] hover:border-[${colors.brand.primary}]`
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
          <span className={currentValue ? `text-[${colors.text.primary}] font-medium` : `text-[${colors.text.muted}]`}>
            {formatDateDisplay(currentValue)}
          </span>
          <Icon name="Calendar" size={15} className={`text-[${colors.text.secondary}]`} />
        </button>

        {/* Global transparent backdrop for clean outside click dismissal */}
        {open && (
          <div
            className="fixed inset-0 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
        )}

        {open && (
          <div
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-72 bg-[${colors.surface.card}] border border-[${colors.border.default}] rounded-2xl shadow-popover p-3.5 z-[9999] animate-fade-in select-none`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Month & Year Navigation */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCalDate(new Date(calYear, calMonth - 1, 1));
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[${colors.text.secondary}] hover:text-[${colors.text.primary}] hover:bg-[${colors.surface.subtle}] transition-colors cursor-pointer`}
                title="Previous Month"
              >
                <Icon name="solar:alt-arrow-left-linear" size={15} />
              </button>
              <span className={`text-[14px] font-bold text-[${colors.text.primary}]`}>
                {monthNames[calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCalDate(new Date(calYear, calMonth + 1, 1));
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[${colors.text.secondary}] hover:text-[${colors.text.primary}] hover:bg-[${colors.surface.subtle}] transition-colors cursor-pointer`}
                title="Next Month"
              >
                <Icon name="solar:alt-arrow-right-linear" size={15} />
              </button>
            </div>

            {/* Days of Week Header (Monday to Sunday) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                <span key={d} className={`text-[12px] font-bold text-[${colors.text.muted}]`}>
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Previous Month Days (Clickable) */}
              {prevMonthDays.map(({ day, dateStr }) => (
                <button
                  key={`prev-${dateStr}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDate(dateStr);
                  }}
                  className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-[12px] text-[${colors.border.medium}] hover:bg-[${colors.surface.hover}] hover:text-[${colors.text.secondary}] transition-colors cursor-pointer`}
                  title={dateStr}
                >
                  <span>{day}</span>
                </button>
              ))}

              {/* Current Month Days (Clickable) */}
              {currentMonthDays.map(({ day, dateStr }) => {
                const isSelected = currentValue === dateStr;
                const isToday = dateStr === '2026-10-19';

                return (
                  <button
                    key={`curr-${dateStr}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDate(dateStr);
                    }}
                    className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-[12px] transition-all relative cursor-pointer ${isSelected
                      ? `bg-[${colors.brand.navy}] text-white font-bold shadow-xs`
                      : isToday
                        ? `text-[${colors.brand.primary}] font-bold border border-[${colors.brand.goldBorder}] hover:bg-[${colors.brand.goldLight}]`
                        : `text-[${colors.text.body}] hover:bg-[${colors.surface.hover}]`
                      }`}
                  >
                    <span>{day}</span>
                  </button>
                );
              })}

              {/* Next Month Days (Clickable) */}
              {nextMonthDays.map(({ day, dateStr }) => (
                <button
                  key={`next-${dateStr}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDate(dateStr);
                  }}
                  className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-[12px] text-[${colors.border.medium}] hover:bg-[${colors.surface.hover}] hover:text-[${colors.text.secondary}] transition-colors cursor-pointer`}
                  title={dateStr}
                >
                  <span>{day}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions Footer */}
            <div className={`mt-3 pt-2.5 border-t border-[${colors.border.subtle}] flex items-center justify-between text-[12px] px-1`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectDate('');
                }}
                className={`font-semibold text-[${colors.text.secondary}] hover:text-[${colors.status.error.text}] transition-colors cursor-pointer`}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectDate('2026-10-19');
                }}
                className={`font-bold text-[${colors.brand.primary}] hover:text-[${colors.brand.secondary}] transition-colors cursor-pointer`}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>

      {hint && !error && <p className={`text-[12px] text-[${colors.text.secondary}] mt-1`}>{hint}</p>}
      {error && <p className={`text-[12px] text-[${colors.status.error.text}] mt-1`}>{error}</p>}
    </div>
  );
}

export function Input({ label, error, hint, required, className = '', type, value, onChange, placeholder, disabled, align, ...props }: InputProps) {
  if (type === 'date') {
    return (
      <CustomDatePicker
        label={label}
        error={error}
        hint={hint}
        required={required}
        className={className}
        value={typeof value === 'string' ? value : (props.defaultValue as string) || ''}
        onChange={onChange as any}
        disabled={disabled}
        name={props.name}
        placeholder={placeholder}
        align={align}
      />
    );
  }

  return (
    <div>
      {label && (
        <label className={`block text-[14px] font-semibold text-[${colors.text.slateDark}] mb-1.5`}>
          {label} {required && <span className={`text-[${colors.status.error.text}]`}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          if (type === 'date') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-10 px-3.5 text-[14px] rounded-xl border bg-white transition-colors outline-none focus:outline-none focus:ring-0 placeholder:text-[${colors.text.muted}] ${error ? `border-[${colors.status.error.text}] focus:border-[${colors.status.error.dark}]`
          : `border-[${colors.border.medium}] focus:border-[${colors.brand.primary}]`
          } ${className}`}
        {...props}
      />
      {hint && !error && <p className={`text-[12px] text-[${colors.text.secondary}] mt-1`}>{hint}</p>}
      {error && <p className={`text-[12px] text-[${colors.status.error.text}] mt-1`}>{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ label, error, required, options, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className={`block text-[14px] font-semibold text-[${colors.text.slateDark}] mb-1.5`}>
          {label} {required && <span className={`text-[${colors.status.error.text}]`}>*</span>}
        </label>
      )}
      <select
        className={`w-full h-10 px-3.5 text-[14px] rounded-xl border bg-white transition-colors appearance-none cursor-pointer outline-none focus:outline-none focus:ring-0 ${error ? `border-[${colors.status.error.text}] focus:border-[${colors.status.error.dark}]` : `border-[${colors.border.medium}] focus:border-[${colors.brand.primary}]`
          } ${className}`}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 fill=%22none%22%3E%3Cpath d=%22M1 1l4 4 4-4%22 stroke=%22%2394a3b8%22 stroke-width=%221.5%22 stroke-linecap=%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className={`text-[12px] text-[${colors.status.error.text}] mt-1`}>{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Textarea({ label, error, required, className = '', ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label className={`block text-[14px] font-semibold text-[${colors.text.slateDark}] mb-1.5`}>
          {label} {required && <span className={`text-[${colors.status.error.text}]`}>*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-3.5 py-2.5 text-[14px] rounded-xl border bg-white transition-colors placeholder:text-[${colors.text.muted}] resize-y outline-none focus:outline-none focus:ring-0 ${error ? `border-[${colors.status.error.text}] focus:border-[${colors.status.error.dark}]` : `border-[${colors.border.medium}] focus:border-[${colors.brand.primary}]`
          } ${className}`}
        {...props}
      />
      {error && <p className={`text-[12px] text-[${colors.status.error.text}] mt-1`}>{error}</p>}
    </div>
  );
}

interface TableProps {
  columns: { key: string; label: string; align?: 'left' | 'right' | 'center'; width?: string }[];
  children: ReactNode;
  className?: string;
}

export function Table({ columns, children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto scrollbar-thin ${className}`}>
      <table className="w-full text-[14px] border-collapse text-left">
        <thead>
          <tr className={`bg-[${colors.surface.hover}] border-b border-[${colors.border.default}] text-[12px] font-bold text-[${colors.text.secondary}] uppercase tracking-wider`}>
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-5 py-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.width || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-[${colors.border.subtle}]`}>{children}</tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className={`text-[12px] text-[${colors.text.secondary}]`}>Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className={`h-8 px-3 rounded-lg border border-[${colors.border.medium}] text-[${colors.text.body}] hover:bg-[${colors.surface.hover}] disabled:opacity-40 disabled:cursor-not-allowed text-[12px] font-semibold flex items-center justify-center cursor-pointer`}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${page === p ? `bg-[${colors.brand.primary}] text-white` : `text-[${colors.text.body}] hover:bg-[${colors.surface.subtle}]`}`}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={`h-8 px-3 rounded-lg border border-[${colors.border.medium}] text-[${colors.text.body}] hover:bg-[${colors.surface.hover}] disabled:opacity-40 disabled:cursor-not-allowed text-[12px] font-semibold flex items-center justify-center cursor-pointer`}>Next</button>
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className={`flex items-center gap-1.5 text-[12px] text-[${colors.text.secondary}] mb-2 font-medium`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className={`text-[${colors.border.medium}]`}>/</span>}
          <span className={i === items.length - 1 ? `text-[${colors.text.primary}] font-semibold` : ''}>{item}</span>
        </span>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-32" />
        </div>
        <div className="skeleton h-11 w-11 rounded-xl" />
      </div>
    </Card>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className={`w-4 h-4 rounded border-[${colors.border.medium}] text-[${colors.brand.primary}] focus:ring-0 cursor-pointer`} />
      <span className={`text-[14px] font-medium text-[${colors.text.slateDark}]`}>{label}</span>
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${checked ? `bg-[${colors.brand.primary}]` : `bg-[${colors.border.medium}]`}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
      {label && <span className={`text-[14px] font-medium text-[${colors.text.slateDark}]`}>{label}</span>}
    </label>
  );
}

// Re-export Centralized Toast System
export { ToastProvider, useToast, toast, showToast } from '@/context/ToastContext';
export type { ToastType, ToastItem } from '@/context/ToastContext';
