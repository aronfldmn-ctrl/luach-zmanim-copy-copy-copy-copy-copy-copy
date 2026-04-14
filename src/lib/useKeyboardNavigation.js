import { useEffect } from 'react';

export function useKeyboardNavigation(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Arrow keys for navigation (D-pad)
      if (e.key === 'ArrowUp' && handlers.up) {
        e.preventDefault();
        handlers.up();
      } else if (e.key === 'ArrowDown' && handlers.down) {
        e.preventDefault();
        handlers.down();
      } else if (e.key === 'ArrowLeft' && handlers.left) {
        e.preventDefault();
        handlers.left();
      } else if (e.key === 'ArrowRight' && handlers.right) {
        e.preventDefault();
        handlers.right();
      } else if ((e.key === 'Enter' || e.key === '5') && handlers.select) {
        e.preventDefault();
        handlers.select();
      }
      // Numeric keypad shortcuts (works on both numeric and QWERTY keyboards)
      else if (!['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        if (e.key === '0' && handlers.today) {
          e.preventDefault();
          handlers.today();
        } else if (e.key === '1' && handlers.dayView) {
          e.preventDefault();
          handlers.dayView();
        } else if (e.key === '2' && handlers.weekView) {
          e.preventDefault();
          handlers.weekView();
        } else if (e.key === '3' && handlers.monthView) {
          e.preventDefault();
          handlers.monthView();
        } else if (e.key === '4' && handlers.yearView) {
          e.preventDefault();
          handlers.yearView();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}