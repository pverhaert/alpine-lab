import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type React from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
      <div
        className={`px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 max-w-md ${
          isSuccess
            ? 'bg-[#00283c] border-emerald-500/80 text-white'
            : isError
              ? 'bg-[#2a0d13] border-red-500/80 text-white'
              : 'bg-[#00283c] border-sky-500/80 text-white'
        }`}
      >
        <div className="flex-shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
        </div>

        <div className="text-xs font-medium leading-tight flex-1">{toast.message}</div>

        {toast.actionLabel && toast.onAction && (
          <button
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
            className="text-xs font-bold text-[#fa6432] hover:underline px-1 cursor-pointer flex-shrink-0"
          >
            {toast.actionLabel}
          </button>
        )}

        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
