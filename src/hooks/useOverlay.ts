import { useEffect, useRef } from 'react';

/**
 * Module-level counter instead of a plain boolean. Two independent overlays
 * (e.g. the cart drawer and the mobile sidebar) can be open back-to-back;
 * closing one must not clear the lock the other still needs. Each mount
 * increments on open and decrements on close/unmount, and the body is only
 * unlocked when the count returns to zero.
 */
let lockCount = 0;

function lockBodyScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    document.body.style.overflow = 'hidden';
  }
}

function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
  }
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Shared behavior for off-canvas overlays (drawers, modals): locks
 * background scroll without clobbering a sibling overlay's lock, closes on
 * Escape, and traps/returns focus so keyboard and screen-reader users aren't
 * dropped behind the panel.
 */
export function useOverlay(isOpen: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lockBodyScroll();
    triggerRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;

      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      triggerRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return panelRef;
}
