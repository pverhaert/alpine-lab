import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react';
import {
  AlignLeft,
  Bold,
  Check,
  Code2,
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import type { EditorTheme } from '../types';
import { EMMET_SNIPPET_CATALOG, registerEmmetInMonaco } from '../utils/emmetHelper';
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
  const [fontSize, setFontSize] = useState<number>(16);
  const [isBold, setIsBold] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('alpine_lab_editor_bold');
      if (saved !== null) return saved === 'true';
    } catch (_e) {}
    return true;
  });
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [minimap, setMinimap] = useState<boolean>(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [showSnippetsDrawer, setShowSnippetsDrawer] = useState(false);
  const [snippetSearch, setSnippetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleToggleBold = () => {
    setIsBold((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('alpine_lab_editor_bold', String(next));
      } catch (_e) {}
      if (editorRef.current) {
        editorRef.current.updateOptions({
          fontWeight: next ? 'bold' : 'normal',
        });
      }
      return next;
    });
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    setupMonacoAlpine(monaco);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setupMonacoAlpine(monaco);
    monaco.editor.setTheme(theme);
    editor.updateOptions({
      fontWeight: isBold ? 'bold' : 'normal',
    });

    // Register full Emmet support: Tab key expansion and context menu
    registerEmmetInMonaco(monaco, editor);

    // Add keyboard shortcut: Ctrl+E to toggle Alpine Snippets drawer
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE, () => {
      setShowSnippetsDrawer((prev) => !prev);
    });

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

  // Dedicated handler to toggle the Alpine Snippets drawer
  const handleToggleSnippetsDrawer = () => {
    setShowSnippetsDrawer((prev) => !prev);
  };

  const insertSnippetAtCursor = (snippetText: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const position = editor.getPosition();
    if (!position) return;

    const clean = snippetText.replace(/\$\{\d+:?([^}]*)\}/g, '$1').replace(/\$\d+/g, '');
    editor.executeEdits('alpine-snippet', [
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
    setShowSnippetsDrawer(false);
  };

  const categories = [
    'All',
    'Components',
    'Interactive',
    'Navigation',
    'Forms',
    'Feedback',
    'Plugins',
    'Boilerplate',
  ];

  const filteredSnippets = EMMET_SNIPPET_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = snippetSearch.toLowerCase().trim();
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
          {/* Alpine Snippets Drawer Button */}
          <Tooltip content="Alpine.js Snippets Library (Ctrl+E)" shortcut="Ctrl+E">
            <button
              id="snippets-toolbar-btn"
              onClick={handleToggleSnippetsDrawer}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition active:scale-95 cursor-pointer font-semibold ${
                showSnippetsDrawer
                  ? 'bg-[#fa6432] text-white shadow-sm'
                  : 'bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white border border-[#1b5372]'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${showSnippetsDrawer ? 'text-white' : 'text-[#fa6432]'}`}
              />
              <span className="text-[11px]">
                <span className="hidden sm:inline">Alpine </span>Snippets
              </span>
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
                <option value={20} className="bg-[#00283c]">
                  20px
                </option>
                <option value={22} className="bg-[#00283c]">
                  22px
                </option>
                <option value={24} className="bg-[#00283c]">
                  24px
                </option>
                <option value={26} className="bg-[#00283c]">
                  26px
                </option>
              </select>
            </div>
          </Tooltip>

          {/* Bold Font Toggle */}
          <Tooltip content={`Bold Font: ${isBold ? 'Enabled' : 'Disabled'}`}>
            <button
              id="editor-bold-btn"
              onClick={handleToggleBold}
              className={`p-1 rounded transition cursor-pointer flex items-center justify-center ${
                isBold ? 'text-[#fa6432] bg-[#0b384f]' : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Toggle Bold Font"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
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

      {/* Alpine Snippets Drawer */}
      {showSnippetsDrawer && (
        <div
          id="snippets-drawer"
          className="absolute top-11 right-2 z-40 w-[440px] max-w-[94vw] max-h-[85vh] bg-[#001c2b] border border-[#134661] rounded-2xl shadow-2xl p-4 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col select-text overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#134661] mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#fa6432]/20 border border-[#fa6432]/40 flex items-center justify-center text-[#fa6432]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Alpine.js Snippets</h4>
                <p className="text-[10px] text-slate-400">
                  Select and insert pre-built components into the editor
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSnippetsDrawer(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-2.5 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={snippetSearch}
              onChange={(e) => setSnippetSearch(e.target.value)}
              placeholder="Search Alpine snippets..."
              className="w-full pl-8 pr-7 py-1.5 bg-[#00141f] border border-[#134661] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432]"
            />
            {snippetSearch && (
              <button
                onClick={() => setSnippetSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-2 mb-2 shrink-0">
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1.5 space-y-1.5 max-h-80 text-xs custom-scrollbar">
            {filteredSnippets.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No snippets found matching "{snippetSearch}"
              </div>
            ) : (
              filteredSnippets.map((item) => (
                <div
                  key={item.abbr}
                  className="w-full p-2.5 rounded-xl bg-[#00141f] hover:bg-[#0b384f]/60 border border-[#134661] hover:border-[#fa6432]/60 flex items-center justify-between gap-3 group transition overflow-hidden"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[#fa6432] font-bold text-xs bg-[#fa6432]/10 px-1.5 py-0.5 rounded border border-[#fa6432]/20 shrink-0">
                        {item.abbr}
                      </span>
                      <span className="font-semibold text-slate-200 text-xs truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0b384f] text-sky-300 ml-auto shrink-0 border border-[#134661]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 truncate">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => insertSnippetAtCursor(item.snippet)}
                    className="px-2.5 py-1 rounded-lg bg-[#fa6432] hover:bg-[#ff8559] text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition cursor-pointer shadow-xs"
                    title={`Insert ${item.title}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                </div>
              ))
            )}
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
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            lineHeight: Math.round(fontSize * 1.5),
            fontFamily: "'Fira Code', monospace",
            fontWeight: isBold ? 'bold' : 'normal',
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
          <Tooltip content="Alpine.js Snippets Library (Ctrl+E)" position="top" align="start">
            <button
              onClick={() => setShowSnippetsDrawer((prev) => !prev)}
              className="flex items-center gap-1 text-[#fa6432] hover:text-[#ff8559] hover:underline cursor-pointer font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Snippets: Ctrl+E</span>
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
