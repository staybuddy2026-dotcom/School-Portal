import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import { colors } from '@/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  toast: {
    (message: string, options?: { type?: ToastType; description?: string; duration?: number }): void;
    success: (message: string, description?: string, duration?: number) => void;
    error: (message: string, description?: string, duration?: number) => void;
    info: (message: string, description?: string, duration?: number) => void;
    warning: (message: string, description?: string, duration?: number) => void;
  };
  showToast: (message: string, type?: ToastType, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Global trigger that can be called from anywhere in the app (even outside React tree)
 */
export function showToast(message: string, type: ToastType = 'success', description?: string, duration?: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('erp-show-toast', {
        detail: { message, type, description, duration },
      })
    );
  }
}

export const toast = Object.assign(
  (message: string, options?: { type?: ToastType; description?: string; duration?: number }) => {
    showToast(message, options?.type || 'success', options?.description, options?.duration);
  },
  {
    success: (msg: string, desc?: string, dur?: number) => showToast(msg, 'success', desc, dur),
    error: (msg: string, desc?: string, dur?: number) => showToast(msg, 'error', desc, dur),
    info: (msg: string, desc?: string, dur?: number) => showToast(msg, 'info', desc, dur),
    warning: (msg: string, desc?: string, dur?: number) => showToast(msg, 'warning', desc, dur),
  }
);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: showToast,
      removeToast: () => {},
      toast,
      showToast,
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success', description?: string, duration = 3200) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast: ToastItem = { id, message, description, type, duration };

    setToasts(prev => [...prev.slice(-4), newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // Listen to global custom DOM events
  useEffect(() => {
    const handleGlobalToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: ToastType; description?: string; duration?: number }>;
      if (customEvent.detail) {
        const { message, type = 'success', description, duration } = customEvent.detail;
        addToast(message, type, description, duration);
      }
    };

    window.addEventListener('erp-show-toast', handleGlobalToast);
    return () => window.removeEventListener('erp-show-toast', handleGlobalToast);
  }, [addToast]);

  const toastMethods = {
    ...toast,
    success: (msg: string, desc?: string, dur?: number) => addToast(msg, 'success', desc, dur),
    error: (msg: string, desc?: string, dur?: number) => addToast(msg, 'error', desc, dur),
    info: (msg: string, desc?: string, dur?: number) => addToast(msg, 'info', desc, dur),
    warning: (msg: string, desc?: string, dur?: number) => addToast(msg, 'warning', desc, dur),
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        toast: toastMethods as any,
        showToast: (msg, type, desc) => addToast(msg, type, desc),
      }}
    >
      {children}

      {/* Centralized Global Toast Viewport: Fixed Bottom-Right Position with Original Black Design */}
      <div
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[calc(100vw-40px)] sm:max-w-md pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(t => {
          const iconConfig = {
            success: { icon: 'solar:check-circle-linear', color: `text-[${colors.status.success.icon}]` },
            error: { icon: 'solar:danger-triangle-linear', color: `text-[${colors.status.error.main}]` },
            warning: { icon: 'solar:alarm-linear', color: `text-[${colors.status.warning.main}]` },
            info: { icon: 'solar:info-circle-linear', color: `text-[${colors.status.info.skyLight}]` },
          }[t.type] || { icon: 'solar:check-circle-linear', color: `text-[${colors.status.success.icon}]` };

          return (
            <div
              key={t.id}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[${colors.brand.navy}] text-[${colors.text.inverse}] shadow-xl text-[14px] font-medium border border-[${colors.border.dark}] animate-scale-in pointer-events-auto select-none`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Icon name={iconConfig.icon as any} size={18} className={`${iconConfig.color} shrink-0`} />
              <div className="flex-1 min-w-0 pr-1">
                <span className="leading-snug">{t.message}</span>
                {t.description && (
                  <p className={`text-[12px] text-[${colors.text.muted}] mt-0.5 leading-snug`}>{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className={`ml-1 text-[${colors.text.muted}] hover:text-[${colors.text.inverse}] transition-colors cursor-pointer shrink-0`}
                aria-label="Dismiss notification"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
