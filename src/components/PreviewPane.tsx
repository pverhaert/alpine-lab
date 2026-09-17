import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  RotateCw,
  Smartphone,
  Sun,
  Tablet,
  Terminal,
  Trash2,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ConsoleMessage, ViewportDevice } from '../types';
import { generatePreviewHtml } from '../utils/previewBuilder';
import { Tooltip } from './Tooltip';

interface Props {
  code: string;
  onTriggerRefresh: () => void;
  refreshTrigger: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const PreviewPane: React.FC<Props> = ({
  code,
  onTriggerRefresh,
  refreshTrigger,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [viewport, setViewport] = useState<ViewportDevice>('full');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'log' | 'warn' | 'error'>('all');
  const [errorCount, setErrorCount] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [renderedHtml, setRenderedHtml] = useState('');

  // Debounced preview generation (always live and running)
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderedHtml(generatePreviewHtml(code, previewTheme));
    }, 200);

    return () => clearTimeout(timer);
  }, [code, previewTheme]);

  // Listen to postMessages from preview iframe console interceptor and Escape events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'ALPINE_PLAYGROUND_CONSOLE') {
        const { level, message, timestamp } = event.data;
        const newLog: ConsoleMessage = {
          id: Math.random().toString(36).substring(2, 9),
          type:
            level === 'error'
              ? 'error'
              : level === 'warn'
                ? 'warn'
                : level === 'info'
                  ? 'info'
                  : 'log',
          message: String(message),
          timestamp: timestamp || new Date().toLocaleTimeString(),
        };

        setConsoleLogs((prev) => [...prev.slice(-150), newLog]); // keep last 150 logs
        if (newLog.type === 'error') {
          setErrorCount((c) => c + 1);
        }
      }

      if (event.data.type === 'ALPINE_PLAYGROUND_ESCAPE') {
        if (isFullscreen && onToggleFullscreen) {
          onToggleFullscreen();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isFullscreen, onToggleFullscreen]);

  // Handle Escape key directly in the parent window
  useEffect(() => {
    if (!isFullscreen || !onToggleFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);

  const clearConsole = () => {
    setConsoleLogs([]);
    setErrorCount(0);
  };

  const openInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(generatePreviewHtml(code, previewTheme));
      newWindow.document.close();
    }
  };

  const filteredLogs = consoleLogs.filter((log) => {
    if (consoleFilter === 'all') return true;
    return log.type === consoleFilter;
  });

  return (
    <div className="h-full w-full flex flex-col bg-[#00141f] select-none">
      {/* Preview Top Toolbar */}
      <div className="h-10 px-3 bg-[#001c2b] border-b border-[#134661] flex items-center justify-between gap-2 text-xs text-slate-300">
        {/* Viewport Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-white mr-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Preview</span>
          </span>

          {isFullscreen && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fa6432]/20 border border-[#fa6432]/40 text-[#fa6432] text-[10px] font-bold">
              <span>Fullscreen View</span>
              <span className="text-[9px] text-slate-400 font-normal hidden md:inline">
                (Esc to exit)
              </span>
            </span>
          )}

          <div className="flex items-center bg-[#00141f] rounded p-0.5 border border-[#134661]">
            <Tooltip content="Responsive Desktop Viewport (100%)">
              <button
                onClick={() => setViewport('full')}
                className={`p-1 rounded transition cursor-pointer ${
                  viewport === 'full'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip content="Tablet Viewport (768px)">
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1 rounded transition cursor-pointer ${
                  viewport === 'tablet'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip content="Mobile Viewport (375px)">
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1 rounded transition cursor-pointer ${
                  viewport === 'mobile'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Preview Actions */}
        <div className="flex items-center gap-1.5">
          {/* Dedicated Fullscreen Mode Toggle */}
          {onToggleFullscreen && (
            <Tooltip
              content={
                isFullscreen
                  ? 'Exit Fullscreen Mode'
                  : 'Dedicated Fullscreen Mode (Focus on Result)'
              }
              shortcut="Esc"
            >
              <button
                id="toggle-preview-fullscreen-btn"
                onClick={onToggleFullscreen}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition active:scale-95 cursor-pointer border ${
                  isFullscreen
                    ? 'bg-[#fa6432] text-white border-[#fa6432] shadow-sm font-semibold'
                    : 'bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white border-[#1b5372]'
                }`}
                aria-label={isFullscreen ? 'Exit Fullscreen Mode' : 'Dedicated Fullscreen Mode'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-[11px] font-bold">Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
                    <span className="text-[11px] hidden sm:inline">Fullscreen</span>
                  </>
                )}
              </button>
            </Tooltip>
          )}

          {/* Background Theme Toggle */}
          <Tooltip
            content={`Toggle Preview Background (${previewTheme === 'light' ? 'Dark' : 'Light'} Canvas)`}
          >
            <button
              onClick={() => setPreviewTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="p-1.5 rounded bg-[#0b384f] hover:bg-[#134661] text-slate-300 hover:text-white transition cursor-pointer"
            >
              {previewTheme === 'light' ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>
          </Tooltip>

          {/* Refresh Preview */}
          <Tooltip content="Reload Preview Sandbox">
            <button
              id="refresh-preview-btn"
              onClick={onTriggerRefresh}
              className="p-1.5 rounded bg-[#0b384f] hover:bg-[#134661] text-slate-300 hover:text-white transition cursor-pointer active:rotate-180"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Open in New Tab */}
          <Tooltip content="Open Live Preview in New Window">
            <button
              id="open-new-tab-btn"
              onClick={openInNewTab}
              className="p-1.5 rounded bg-[#0b384f] hover:bg-[#134661] text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Console Toggle Button with Badge */}
          <Tooltip content="Toggle Runtime Console & Logs">
            <button
              id="toggle-console-btn"
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition cursor-pointer ${
                isConsoleOpen
                  ? 'bg-[#fa6432] text-white font-semibold'
                  : 'bg-[#0b384f] hover:bg-[#134661] text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[11px]">Console</span>
              {errorCount > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black">
                  {errorCount}
                </span>
              )}
              {isConsoleOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Iframe Content Area */}
      <div className="flex-1 w-full relative overflow-hidden bg-[#001018] flex items-center justify-center p-2">
        <div
          className={`h-full transition-all duration-300 rounded-lg overflow-hidden shadow-2xl ${
            viewport === 'mobile'
              ? `w-[375px] border-4 border-[#134661] ${previewTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`
              : viewport === 'tablet'
                ? `w-[768px] border-4 border-[#134661] ${previewTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`
                : 'w-full bg-transparent border-0'
          }`}
        >
          <iframe
            key={refreshTrigger}
            ref={iframeRef}
            srcDoc={renderedHtml}
            title="Alpine Live Playground"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            className="w-full h-full border-0 bg-transparent block"
          />
        </div>
      </div>

      {/* Console Drawer (Bottom) */}
      {isConsoleOpen && (
        <div
          id="console-drawer"
          className="h-48 border-t border-[#134661] bg-[#00141f] flex flex-col animate-in slide-in-from-bottom duration-200"
        >
          {/* Console Header */}
          <div className="h-8 px-3 bg-[#001c2b] border-b border-[#134661] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#fa6432]" />
                <span>Playground Console</span>
              </span>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 ml-2">
                {(['all', 'log', 'warn', 'error'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setConsoleFilter(f)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition cursor-pointer ${
                      consoleFilter === f
                        ? 'bg-[#fa6432] text-white'
                        : 'bg-[#00141f] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{filteredLogs.length} logs</span>
              <Tooltip content="Clear Console Output">
                <button
                  onClick={clearConsole}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
              <Tooltip content="Close Console">
                <button
                  onClick={() => setIsConsoleOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Console Message Feed */}
          <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] space-y-1 select-text">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-1.5 rounded flex items-start gap-2 border leading-relaxed ${
                  log.type === 'error'
                    ? 'bg-red-950/40 border-red-800/60 text-red-300'
                    : log.type === 'warn'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : log.type === 'info'
                        ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                        : 'bg-[#001c2b] border-[#134661]/60 text-slate-300'
                }`}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {log.type === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                  {log.type === 'warn' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {log.type === 'info' && <Info className="w-3 h-3 text-sky-400" />}
                  {log.type === 'log' && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
                </span>
                <span className="text-[10px] text-slate-500 select-none flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <pre className="flex-1 whitespace-pre-wrap break-all font-mono m-0">
                  {log.message}
                </pre>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-[11px] italic">
                Console is empty. Log messages with console.log() in your Alpine components.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
