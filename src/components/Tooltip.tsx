import type React from 'react';
import { useEffect, useRef, useState } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  position?: TooltipPosition;
  align?: TooltipAlign;
  delay?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  position = 'bottom',
  align = 'center',
  delay = 180,
  disabled = false,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Position classes
  let positionClasses = '';
  if (position === 'bottom') {
    if (align === 'start') {
      positionClasses = 'top-full left-0 mt-2';
    } else if (align === 'end') {
      positionClasses = 'top-full right-0 mt-2';
    } else {
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  } else if (position === 'top') {
    if (align === 'start') {
      positionClasses = 'bottom-full left-0 mb-2';
    } else if (align === 'end') {
      positionClasses = 'bottom-full right-0 mb-2';
    } else {
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  } else if (position === 'left') {
    positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
  } else if (position === 'right') {
    positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onClick={hideTooltip}
    >
      {children}

      {isVisible && !disabled && content && (
        <div
          role="tooltip"
          className={`absolute ${positionClasses} z-50 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-100 bg-[#00141f] border border-[#134661] rounded-md shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/40`}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="px-1 py-0.2 bg-[#0b384f] text-[#fa6432] font-mono text-[10px] rounded border border-[#134661]/80 font-semibold tracking-wide">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
};
