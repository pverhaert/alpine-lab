import { Check, Download, Share, Smartphone, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Tooltip } from './Tooltip';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress when app is already installed in standalone mode
  if (isInstalled) {
    return (
      <Tooltip content="App running in installed PWA standalone mode" position="bottom" align="end">
        <div
          id="pwa-installed-badge"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-md cursor-default"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Installed</span>
        </div>
      </Tooltip>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <Tooltip
        content="Install Alpine.js Playground to your desktop or device"
        position="bottom"
        align="end"
      >
        <button
          id="pwa-install-btn"
          onClick={install}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#fa6432] hover:bg-[#e25325] active:scale-95 transition-all rounded-md shadow-sm border border-[#ff8559]/30 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      </Tooltip>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Tooltip content="How to install on iOS Safari home screen" position="bottom" align="end">
          <button
            id="pwa-install-ios-btn"
            onClick={() => setShowIOSGuide(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0b384f] hover:bg-[#134661] active:scale-95 transition-all rounded-md border border-[#1b5372] cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#fa6432]" />
            <span>Install on iOS</span>
          </button>
        </Tooltip>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div
              id="ios-pwa-modal"
              className="w-full max-w-sm rounded-xl bg-[#00283c] border border-[#134661] p-6 shadow-2xl text-slate-100 relative"
            >
              <button
                id="close-ios-modal-btn"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#fa6432]/20 border border-[#fa6432]/40 flex items-center justify-center text-[#fa6432]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-300">Run offline with native experience</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-200 bg-[#001c2b] p-3.5 rounded-lg border border-[#134661]/60">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fa6432] text-white flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>
                    Tap the{' '}
                    <strong className="text-white inline-flex items-center gap-1">
                      <Share className="w-3 h-3 text-[#fa6432]" /> Share
                    </strong>{' '}
                    icon in your Safari bottom bar.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fa6432] text-white flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fa6432] text-white flex items-center justify-center text-[11px] font-bold">
                    3
                  </span>
                  <span>
                    Tap <strong className="text-white">Add</strong> in the top right corner.
                  </span>
                </div>
              </div>

              <button
                id="dismiss-ios-guide-btn"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-semibold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
