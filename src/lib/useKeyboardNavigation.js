import { useEffect } from 'react';

export function useKeyboardNavigation(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // D-pad arrow keys for navigation
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}