import { useEffect } from 'react';

export function useKeyboardNavigation(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Arrow keys for navigation
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
      } else if (e.key === 'Enter' && handlers.select) {
        e.preventDefault();
        handlers.select();
      } else if (e.key === 't' && handlers.today) {
        e.preventDefault();
        handlers.today();
      }
      // View shortcuts (only if not typing in input)
      else if (!['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        if (e.key === 'd' && handlers.dayView) {
          e.preventDefault();
          handlers.dayView();
        } else if (e.key === 'w' && handlers.weekView) {
          e.preventDefault();
          handlers.weekView();
        } else if (e.key === 'm' && handlers.monthView) {
          e.preventDefault();
          handlers.monthView();
        } else if (e.key === 'y' && handlers.yearView) {
          e.preventDefault();
          handlers.yearView();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}