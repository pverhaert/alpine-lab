import { GripHorizontal, GripVertical } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { SplitOrientation } from '../types';
import { Tooltip } from './Tooltip';

interface Props {
  onSplitChange: (ratio: number) => void;
  orientation: SplitOrientation;
}

export const ResizableSplitter: React.FC<Props> = ({ onSplitChange, orientation }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((_e: React.TouchEvent) => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    // Prevent text selection across the whole document and set cursor while dragging
    const originalUserSelect = document.body.style.userSelect;
    const originalCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = orientation === 'horizontal' ? 'col-resize' : 'row-resize';

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('main');
      const rect = container?.getBoundingClientRect();

      if (rect) {
        if (orientation === 'horizontal') {
          const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        } else {
          const newRatio = ((e.clientY - rect.top) / rect.height) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        }
      } else {
        if (orientation === 'horizontal') {
          const totalWidth = window.innerWidth;
          const newRatio = (e.clientX / totalWidth) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        } else {
          const headerOffset = 56;
          const totalHeight = window.innerHeight - headerOffset;
          const newRatio = ((e.clientY - headerOffset) / totalHeight) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const container = document.querySelector('main');
      const rect = container?.getBoundingClientRect();

      if (rect) {
        if (orientation === 'horizontal') {
          const newRatio = ((touch.clientX - rect.left) / rect.width) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        } else {
          const newRatio = ((touch.clientY - rect.top) / rect.height) * 100;
          onSplitChange(Math.max(15, Math.min(85, newRatio)));
        }
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      document.body.style.userSelect = originalUserSelect;
      document.body.style.cursor = originalCursor;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, orientation, onSplitChange]);

  return (
    <>
      {/* Transparent overlay capturing all pointer events during drag so iframe cannot intercept */}
      {isDragging && (
        <div
          className={`fixed inset-0 z-50 select-none ${
            orientation === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'
          }`}
          style={{ background: 'transparent' }}
        />
      )}
      <Tooltip
        content="Drag to resize editor and preview panes"
        position={orientation === 'horizontal' ? 'right' : 'bottom'}
      >
        <div
          id="resizable-splitter"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`relative flex items-center justify-center bg-[#001c2b] hover:bg-[#fa6432] transition-colors z-20 select-none group cursor-pointer ${
            orientation === 'horizontal'
              ? 'w-2 h-full cursor-col-resize hover:w-2.5'
              : 'h-2 w-full cursor-row-resize hover:h-2.5'
          } ${isDragging ? 'bg-[#fa6432] ring-2 ring-[#fa6432]/50' : 'border-[#134661]'}`}
        >
          <div className="absolute p-0.5 rounded bg-[#00283c] border border-[#134661] text-slate-400 group-hover:text-white group-hover:border-[#fa6432] transition pointer-events-none">
            {orientation === 'horizontal' ? (
              <GripVertical className="w-3 h-3" />
            ) : (
              <GripHorizontal className="w-3 h-3" />
            )}
          </div>
        </div>
      </Tooltip>
    </>
  );
};
