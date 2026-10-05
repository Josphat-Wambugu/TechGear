import { createContext, useEffect, useState, type ReactNode } from 'react';

const COLLAPSED_KEY = 'techgear-sidebar-collapsed';

interface SidebarContextValue {
  /** Persistent desktop/tablet state: icon-rail vs full width. */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Ephemeral mobile state: off-canvas drawer open/closed. */
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    // First visit: default to the icon rail below desktop width (tablet and down),
    // full labels on larger screens.
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(max-width: 1024px)').matches;
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const value: SidebarContextValue = {
    collapsed,
    toggleCollapsed: () => setCollapsed((v) => !v),
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
    toggleMobile: () => setMobileOpen((v) => !v),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
