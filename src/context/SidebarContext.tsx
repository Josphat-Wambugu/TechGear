import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';

const COLLAPSED_KEY = 'techgear-sidebar-collapsed';
const AUTO_COLLAPSE_QUERY = '(max-width: 1024px)';

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
  // Once the person explicitly toggles the sidebar, that choice is saved and
  // wins over the screen-size default forever after — `hasManualOverride`
  // tracks whether that's happened yet, so the resize listener below knows
  // whether it's still allowed to auto-adjust `collapsed`.
  const hasManualOverride = useRef(localStorage.getItem(COLLAPSED_KEY) !== null);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    // First visit: default to the icon rail below desktop width (tablet and down),
    // full labels on larger screens.
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(AUTO_COLLAPSE_QUERY).matches;
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  // Keep the auto-collapse responsive to the viewport actually changing size
  // (resizing a desktop browser window, not just loading on a different
  // device) as long as the person hasn't manually overridden it yet.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(AUTO_COLLAPSE_QUERY);
    const handleChange = (e: MediaQueryListEvent) => {
      if (hasManualOverride.current) return;
      setCollapsed(e.matches);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Body-scroll locking for the open drawer, Escape-to-close, and focus trapping
  // are handled by the `useOverlay` hook in Sidebar.tsx itself (shared with
  // CartDrawer), not here — keeping a second lock/unlock pair in this context
  // risked clobbering the other overlay's lock when both were toggled in the
  // same session.

  const value: SidebarContextValue = {
    collapsed,
    toggleCollapsed: () => {
      hasManualOverride.current = true;
      setCollapsed((v) => !v);
    },
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
    toggleMobile: () => setMobileOpen((v) => !v),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
