import { WifiOff } from 'lucide-react';
import type React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#fa6432] px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-white/20 animate-bounce"
    >
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Cached playground is running offline</span>
    </div>
  );
};
