import {
  BookOpen,
  Check,
  Columns2,
  Copy,
  Download,
  Folder,
  RotateCcw,
  Rows2,
  Save,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { Snippet, SplitOrientation } from '../types';
import { exportStandaloneHtml } from '../utils/previewBuilder';
import { PWAInstallButton } from './PWAInstallButton';
import { Tooltip } from './Tooltip';

interface Props {
  activeSnippet: Snippet;
  onOpenSnippetsModal: () => void;
  onOpenCheatsheetModal: () => void;
  onResetToCurrentSnippet: () => void;
  code: string;
  orientation: SplitOrientation;
  onToggleOrientation: () => void;
  splitRatio: number;
  onSetSplitRatio: (ratio: number) => void;
  onSave: () => void;
  isSavedFeedback?: boolean;
}

export const Header: React.FC<Props> = ({
  activeSnippet,
  onOpenSnippetsModal,
  onOpenCheatsheetModal,
  onResetToCurrentSnippet,
  code,
  orientation,
  onToggleOrientation,
  splitRatio,
  onSetSplitRatio,
  onSave,
  isSavedFeedback = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const standaloneHtml = exportStandaloneHtml(code, activeSnippet.title);
    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitized =
      activeSnippet.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'alpine-component';
    link.download = `${sanitized}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-12 bg-[#00283c] border-b border-[#134661] px-3 flex items-center justify-between text-slate-100 z-30 select-none shadow-md">
      {/* Left: Thomas More Identity & Playground Title */}
      <div className="flex items-center gap-3">
        {/* School Brand Badge */}
        <Tooltip content="Thomas More Hogeschool Official Website" position="bottom" align="start">
          <a
            href="https://thomasmore.be/nl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#fa6432] text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition">
              TM
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fa6432] block leading-none">
                THOMAS MORE
              </span>
              <span className="text-xs font-bold text-white tracking-tight">Alpine.js Lab</span>
            </div>
          </a>
        </Tooltip>

        <div className="h-5 w-px bg-[#134661] hidden md:block"></div>

        {/* Active Snippet Quick Picker */}
        <div className="flex items-center gap-1.5">
          <Tooltip
            content="Browse all lessons & saved student snippets"
            position="bottom"
            align="start"
          >
            <button
              id="open-snippets-menu-btn"
              onClick={onOpenSnippetsModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#001c2b] hover:bg-[#0b384f] border border-[#134661] text-xs font-medium transition cursor-pointer max-w-[170px] sm:max-w-[240px] truncate text-slate-200"
            >
              <Folder className="w-3.5 h-3.5 text-[#fa6432] flex-shrink-0" />
              <span className="truncate font-semibold">{activeSnippet.title}</span>
            </button>
          </Tooltip>

          <Tooltip content="Reset code to original template" position="bottom">
            <button
              onClick={onResetToCurrentSnippet}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Right Toolbar Tools */}
      <div className="flex items-center gap-1.5">
        {/* Prominent SAVE Button */}
        <Tooltip
          content={
            activeSnippet.isDefault
              ? 'Save custom copy to your snippets'
              : 'Save changes to this snippet'
          }
          shortcut="Ctrl+S"
          position="bottom"
        >
          <button
            id="save-snippet-btn"
            onClick={onSave}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm border ${
              isSavedFeedback
                ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-[#fa6432] hover:bg-[#e25325] text-white border-[#fa6432]/60'
            }`}
          >
            {isSavedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </Tooltip>

        {/* Copy Code Button */}
        <Tooltip content="Copy full HTML code to clipboard" shortcut="Ctrl+C" position="bottom">
          <button
            id="copy-code-btn"
            onClick={handleCopyCode}
            className="px-2.5 py-1 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer border border-[#1b5372]"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#fa6432]" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </Tooltip>

        {/* Download .html */}
        <Tooltip
          content="Download standalone HTML file with Alpine & Tailwind v4"
          position="bottom"
        >
          <button
            id="download-code-btn"
            onClick={handleDownloadHtml}
            className="px-2.5 py-1 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer border border-[#1b5372]"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </Tooltip>

        {/* Alpine Docs / Cheatsheet Guide */}
        <Tooltip content="Alpine.js Directives & Magics Cheatsheet" position="bottom">
          <button
            id="cheatsheet-btn"
            onClick={onOpenCheatsheetModal}
            className="px-2.5 py-1 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer border border-[#1b5372]"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Cheatsheet</span>
          </button>
        </Tooltip>

        {/* Orientation Toggle */}
        <Tooltip
          content={
            orientation === 'horizontal'
              ? 'Switch to Vertical (Stacked) Layout'
              : 'Switch to Horizontal (Side-by-side) Layout'
          }
          position="bottom"
        >
          <button
            id="orientation-toggle-btn"
            onClick={onToggleOrientation}
            className="p-1.5 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white transition cursor-pointer border border-[#1b5372]"
          >
            {orientation === 'horizontal' ? (
              <Columns2 className="w-3.5 h-3.5 text-[#fa6432]" />
            ) : (
              <Rows2 className="w-3.5 h-3.5 text-[#fa6432]" />
            )}
          </button>
        </Tooltip>

        {/* Split Presets Dropdown */}
        <div className="hidden xl:flex items-center bg-[#001c2b] rounded-lg border border-[#134661] p-0.5 text-[11px]">
          <Tooltip content="50% Editor / 50% Preview" position="bottom">
            <button
              onClick={() => onSetSplitRatio(50)}
              className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                Math.round(splitRatio) === 50
                  ? 'bg-[#fa6432] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50:50
            </button>
          </Tooltip>
          <Tooltip content="70% Editor Focus" position="bottom">
            <button
              onClick={() => onSetSplitRatio(70)}
              className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                Math.round(splitRatio) === 70
                  ? 'bg-[#fa6432] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              70:30
            </button>
          </Tooltip>
          <Tooltip content="30% Editor / 70% Preview Focus" position="bottom" align="end">
            <button
              onClick={() => onSetSplitRatio(30)}
              className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                Math.round(splitRatio) === 30
                  ? 'bg-[#fa6432] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30:70
            </button>
          </Tooltip>
        </div>

        {/* PWA In-App Install Button */}
        <PWAInstallButton />
      </div>
    </header>
  );
};
