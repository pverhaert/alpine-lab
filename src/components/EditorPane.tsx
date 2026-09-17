import Editor, { type OnMount } from '@monaco-editor/react';
import {
  AlignLeft,
  Check,
  Code2,
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Type,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import type { EditorTheme } from '../types';
import {
  EMMET_SNIPPET_CATALOG,
  expandCurrentAbbreviation,
  registerEmmetInMonaco,
} from '../utils/emmetHelper';
import { setupMonacoAlpine } from '../utils/monacoAlpineSetup';
import { Tooltip } from './Tooltip';

interface Props {
  code: string;
  onChange: (value: string) => void;
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
  onSave?: () => void;
  isSavedFeedback?: boolean;
}

export const EditorPane: React.FC<Props> = ({
  code,
  onChange,
  theme,
  onThemeChange,
  onSave,
  isSavedFeedback = false,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [minimap, setMinimap] = useState<boolean>(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [showEmmetHelp, setShowEmmetHelp] = useState(false);
  const [emmetFeedback, setEmmetFeedback] = useState<string | null>(null);
  const [emmetSearch, setEmmetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setupMonacoAlpine(monaco);

    // Register full Emmet support: Tab key expansion, Ctrl+E shortcut, and context menu
    registerEmmetInMonaco(monaco, editor);

    // Add keyboard shortcut: Alt+Shift+F to format document
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      formatCode();
    });

    // Add keyboard shortcut: Ctrl+S to trigger save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave();
      }
    });
  };

  const formatCode = () => {
    if (!editorRef.current) return;
    editorRef.current.getAction('editor.action.formatDocument')?.run();
    setIsFormatted(true);
    setTimeout(() => setIsFormatted(false), 1500);
  };

  // Dedicated handler to toggle the Emmet presets and quick reference drawer
  const handleToggleEmmetDrawer = () => {
    setShowEmmetHelp((prev) => !prev);
  };

  // Manual trigger to expand abbreviation at cursor if user explicitly requests it
  const handleManualExpandAtCursor = () => {
    if (!editorRef.current || !monacoRef.current) return;
    const expanded = expandCurrentAbbreviation(editorRef.current, monacoRef.current);
    if (expanded) {
      setEmmetFeedback('Expanded!');
      setTimeout(() => setEmmetFeedback(null), 1500);
    } else {
      setEmmetFeedback('No abbreviation at cursor');
      setTimeout(() => setEmmetFeedback(null), 1800);
    }
  };

  const insertSnippetAtCursor = (snippetText: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const position = editor.getPosition();
    if (!position) return;

    const clean = snippetText.replace(/\$\{\d+:?([^}]*)\}/g, '$1').replace(/\$\d+/g, '');
    editor.executeEdits('emmet-quick', [
      {
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
        text: clean,
      },
    ]);

    // Position cursor cleanly at the end of the inserted content
    const lines = clean.split('\n');
    const newEndLine = position.lineNumber + lines.length - 1;
    const newEndCol =
      lines.length === 1 ? position.column + lines[0].length : lines[lines.length - 1].length + 1;
    editor.setPosition({ lineNumber: newEndLine, column: newEndCol });

    editor.focus();
    setShowEmmetHelp(false);
  };

  const categories = ['All', 'Interactive', 'Components', 'Navigation', 'Forms', 'Feedback'];

  const filteredSnippets = EMMET_SNIPPET_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = emmetSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.abbr.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full w-full flex flex-col bg-[#001a27] border-r border-[#134661] select-none relative">
      {/* Editor Top Toolbar */}
      <div className="h-10 px-3 bg-[#00141f] border-b border-[#134661] flex items-center justify-between gap-2 text-xs text-slate-300">
        {/* File / Syntax Status */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Code2 className="w-4 h-4 text-[#fa6432]" />
            <span>template.html</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0b384f] text-sky-300 border border-[#134661]">
            Alpine.js 3.x + Tailwind v4
          </span>
        </div>

        {/* Editor Controls Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Emmet Presets & Expansion Drawer Button */}
          <Tooltip content="Emmet Presets & Abbreviations (Tab / Ctrl+E)" shortcut="Ctrl+E">
            <button
              id="emmet-toolbar-btn"
              onClick={handleToggleEmmetDrawer}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition active:scale-95 cursor-pointer font-semibold ${
                showEmmetHelp
                  ? 'bg-[#fa6432] text-white shadow-sm'
                  : 'bg-[#0b384f] hover:bg-[#134661] text-amber-300 hover:text-amber-200 border border-[#1b5372]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px]">{emmetFeedback ? emmetFeedback : 'Emmet'}</span>
            </button>
          </Tooltip>

          {/* Format Code Button */}
          <Tooltip content="Format HTML & Directives" shortcut="Alt+Shift+F">
            <button
              id="format-code-btn"
              onClick={formatCode}
              className="px-2.5 py-1 rounded bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white flex items-center gap-1 transition active:scale-95 cursor-pointer"
            >
              {isFormatted ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Formatted</span>
                </>
              ) : (
                <>
                  <AlignLeft className="w-3.5 h-3.5 text-[#fa6432]" />
                  <span className="text-[11px]">Format</span>
                </>
              )}
            </button>
          </Tooltip>

          {/* Save Button */}
          {onSave && (
            <Tooltip content="Save snippet to My Saved Snippets" shortcut="Ctrl+S">
              <button
                id="editor-save-btn"
                onClick={onSave}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition active:scale-95 cursor-pointer border ${
                  isSavedFeedback
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white border-[#1b5372]'
                }`}
              >
                {isSavedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                    <span className="text-[11px] font-bold">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">Save</span>
                  </>
                )}
              </button>
            </Tooltip>
          )}

          {/* Theme Selector */}
          <div className="flex items-center bg-[#001c2b] rounded p-0.5 border border-[#134661]">
            <Tooltip content="Thomas More Navy Theme">
              <button
                onClick={() => onThemeChange('tm-navy')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  theme === 'tm-navy'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TM
              </button>
            </Tooltip>
            <Tooltip content="VS Code Dark Theme">
              <button
                onClick={() => onThemeChange('vs-dark')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  theme === 'vs-dark'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark
              </button>
            </Tooltip>
            <Tooltip content="VS Code Light Theme">
              <button
                onClick={() => onThemeChange('vs-light')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  theme === 'vs-light'
                    ? 'bg-[#fa6432] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Light
              </button>
            </Tooltip>
          </div>

          {/* Font Size Selector */}
          <Tooltip content="Editor Font Size">
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-[#001c2b] rounded border border-[#134661] text-[11px]">
              <Type className="w-3 h-3 text-slate-400" />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-transparent text-slate-200 text-[11px] focus:outline-none cursor-pointer"
              >
                <option value={12} className="bg-[#00283c]">
                  12px
                </option>
                <option value={14} className="bg-[#00283c]">
                  14px
                </option>
                <option value={16} className="bg-[#00283c]">
                  16px
                </option>
                <option value={18} className="bg-[#00283c]">
                  18px
                </option>
              </select>
            </div>
          </Tooltip>

          {/* Word Wrap Toggle */}
          <Tooltip content={`Word Wrap: ${wordWrap ? 'Enabled' : 'Disabled'}`}>
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className={`p-1 rounded transition cursor-pointer ${
                wordWrap ? 'text-[#fa6432] bg-[#0b384f]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[11px] font-mono px-1">Wrap</span>
            </button>
          </Tooltip>

          {/* Minimap Toggle */}
          <Tooltip content={`Minimap: ${minimap ? 'Shown' : 'Hidden'}`}>
            <button
              onClick={() => setMinimap(!minimap)}
              className={`p-1 rounded transition cursor-pointer ${
                minimap ? 'text-[#fa6432] bg-[#0b384f]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {minimap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Emmet Presets & Reference Drawer */}
      {showEmmetHelp && (
        <div
          id="emmet-help-drawer"
          className="absolute top-11 right-2 z-40 w-[420px] max-w-[94vw] max-h-[85vh] bg-[#001c2b] border border-[#134661] rounded-2xl shadow-2xl p-4 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col select-text"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#134661] mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Emmet & Alpine Snippets
                </h4>
                <p className="text-[10px] text-slate-400">
                  Type abbreviation & press{' '}
                  <kbd className="px-1 bg-[#0b384f] text-amber-300 rounded font-mono text-[9px]">
                    Tab
                  </kbd>{' '}
                  or click to insert
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEmmetHelp(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Manual Expand Button */}
          <div className="mb-3 p-2 bg-[#00141f] rounded-xl border border-[#134661] flex items-center justify-between gap-2 shrink-0">
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-amber-300">Active Abbreviation?</span>
              <p className="text-[10px] text-slate-400">Expand word before cursor</p>
            </div>
            <button
              onClick={handleManualExpandAtCursor}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>Expand at Cursor</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-2.5 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={emmetSearch}
              onChange={(e) => setEmmetSearch(e.target.value)}
              placeholder="Search Alpine & Tailwind snippets..."
              className="w-full pl-8 pr-7 py-1.5 bg-[#00141f] border border-[#134661] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432]"
            />
            {emmetSearch && (
              <button
                onClick={() => setEmmetSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 shrink-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#fa6432] text-white'
                    : 'bg-[#00141f] text-slate-400 hover:text-white border border-[#134661]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Snippets List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-64 text-xs scrollbar-thin">
            {filteredSnippets.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No snippets found matching "{emmetSearch}"
              </div>
            ) : (
              filteredSnippets.map((item) => (
                <div
                  key={item.abbr}
                  className="p-2 rounded-xl bg-[#00141f] hover:bg-[#0b384f]/60 border border-[#134661] hover:border-[#fa6432]/60 flex items-center justify-between gap-3 group transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-amber-300 font-bold text-xs bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                        {item.abbr}
                      </span>
                      <span className="font-semibold text-slate-200 text-xs truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] px-1 rounded bg-[#0b384f] text-sky-300 ml-auto shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                  </div>
                  <button
                    onClick={() => insertSnippetAtCursor(item.snippet)}
                    className="px-2 py-1 rounded-lg bg-[#fa6432] hover:bg-[#ff8559] text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition cursor-pointer shadow-xs"
                    title={`Insert ${item.title}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Collapsible Emmet Syntax Cheat Sheet */}
          <div className="mt-3 pt-2.5 border-t border-[#134661] shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#fa6432] block mb-1.5">
              Standard Emmet Syntax
            </span>
            <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">&gt;</span>{' '}
                <span className="text-slate-400">div&gt;p</span>
              </div>
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">+</span>{' '}
                <span className="text-slate-400">h1+p</span>
              </div>
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">*</span>{' '}
                <span className="text-slate-400">li*3</span>
              </div>
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">.</span>{' '}
                <span className="text-slate-400">div.card</span>
              </div>
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">#</span>{' '}
                <span className="text-slate-400">div#app</span>
              </div>
              <div className="p-1 rounded bg-[#00141f] border border-[#134661] text-center truncate">
                <span className="text-amber-300">&#123;&#125;</span>{' '}
                <span className="text-slate-400">p&#123;text&#125;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language="html"
          theme={theme}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            lineHeight: Math.round(fontSize * 1.5),
            fontFamily: "'Fira Code', monospace",
            fontLigatures: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Editor Bottom Status Bar */}
      <div className="h-6 px-3 bg-[#00141f] border-t border-[#134661] flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live Autocomplete</span>
          </span>
          <Tooltip
            content="Emmet Abbreviation Expansion Active (Tab / Ctrl+E)"
            position="top"
            align="start"
          >
            <button
              onClick={() => setShowEmmetHelp((prev) => !prev)}
              className="flex items-center gap-1 text-amber-300/90 hover:text-amber-300 hover:underline cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Emmet: Tab / Ctrl+E</span>
            </button>
          </Tooltip>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden md:inline">HTML / Alpine</span>
        </div>
        <div>
          <span className="hidden sm:inline text-slate-400">
            Hover directives for tips •{' '}
            <kbd className="px-1 bg-[#0b384f] text-slate-300 rounded text-[10px]">Ctrl+Space</kbd>{' '}
            suggestions
          </span>
        </div>
      </div>
    </div>
  );
};
