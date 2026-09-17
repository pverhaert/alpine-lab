import { useCallback, useEffect, useState } from 'react';
import { AlpineCheatsheetModal } from './components/AlpineCheatsheetModal';
import { EditorPane } from './components/EditorPane';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PreviewPane } from './components/PreviewPane';
import { ResizableSplitter } from './components/ResizableSplitter';
import { SaveSnippetModal } from './components/SaveSnippetModal';
import { SnippetManagerModal } from './components/SnippetManagerModal';
import { Toast, type ToastMessage } from './components/Toast';
import { DEFAULT_SNIPPETS } from './data/defaultSnippets';
import type { EditorTheme, Snippet, SplitOrientation } from './types';

const STORAGE_KEYS = {
  SNIPPETS: 'tm_alpine_snippets_v1',
  ACTIVE_ID: 'tm_alpine_active_id',
  DRAFT_CODE: 'tm_alpine_draft_code',
  ORIENTATION: 'tm_alpine_orientation',
  SPLIT: 'tm_alpine_split_ratio',
  THEME: 'tm_alpine_theme',
};

export default function App() {
  // Load snippets from localStorage or defaults
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved snippets:', e);
    }
    return DEFAULT_SNIPPETS;
  });

  // Active Snippet selection
  const [activeSnippetId, setActiveSnippetId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (savedId) return savedId;
    } catch (_e) {}
    return DEFAULT_SNIPPETS[0].id;
  });

  // Current code in editor
  const [code, setCode] = useState<string>(() => {
    // Check if URL hash has shared code: #code=...
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const sharedCode = params.get('code');
        if (sharedCode) {
          return decodeURIComponent(sharedCode);
        }
      } catch (e) {
        console.warn('Failed to parse URL hash code:', e);
      }
    }

    // Check draft or active snippet
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEYS.DRAFT_CODE);
      if (savedDraft) return savedDraft;
    } catch (_e) {}

    return DEFAULT_SNIPPETS[0].code;
  });

  // Layout & Settings State
  const [orientation, setOrientation] = useState<SplitOrientation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORIENTATION);
      if (saved === 'vertical' || saved === 'horizontal') return saved;
    } catch (_e) {}
    return 'horizontal';
  });

  const [splitRatio, setSplitRatio] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPLIT);
      if (saved) return Number(saved);
    } catch (_e) {}
    return 50;
  });

  const [editorTheme, setEditorTheme] = useState<EditorTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'vs-dark' || saved === 'vs-light' || saved === 'tm-navy') return saved;
    } catch (_e) {}
    return 'tm-navy';
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals state
  const [isSnippetsModalOpen, setIsSnippetsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCheatsheetModalOpen, setIsCheatsheetModalOpen] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Save feedback state & Toast
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'info' | 'error' = 'success',
      actionLabel?: string,
      onAction?: () => void,
    ) => {
      const id = String(Date.now());
      setToast({ id, message, type, actionLabel, onAction });
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 4500);
    },
    [],
  );

  const handleToggleFullscreenPreview = useCallback(() => {
    setIsFullscreenPreview((prev) => {
      const next = !prev;
      if (next) {
        try {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch (_e) {}
      } else {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch (_e) {}
      }
      return next;
    });
  }, []);

  // Listen for browser fullscreen exit or Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenPreview) {
        setIsFullscreenPreview(false);
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch (_e) {}
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreenPreview) {
        setIsFullscreenPreview(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreenPreview]);

  // Active Snippet object
  const activeSnippet =
    snippets.find((s) => s.id === activeSnippetId) || snippets[0] || DEFAULT_SNIPPETS[0];

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
    } catch (_e) {}
  }, [snippets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeSnippetId);
    } catch (_e) {}
  }, [activeSnippetId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_CODE, code);
    } catch (_e) {}
  }, [code]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORIENTATION, orientation);
    } catch (_e) {}
  }, [orientation]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPLIT, String(splitRatio));
    } catch (_e) {}
  }, [splitRatio]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, editorTheme);
    } catch (_e) {}
  }, [editorTheme]);

  // Handle keyboard shortcuts (Ctrl/Cmd+S to save snippet)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setIsSaveModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSelectSnippet = useCallback((snippet: Snippet) => {
    setActiveSnippetId(snippet.id);
    setCode(snippet.code);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleResetToCurrentSnippet = useCallback(() => {
    if (confirm(`Reset current editor code back to the original '${activeSnippet.title}' code?`)) {
      setCode(activeSnippet.code);
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [activeSnippet]);

  // Full Save Handler with Update vs New Copy capability
  const handleSaveSnippet = useCallback(
    (
      title: string,
      description: string,
      category: Snippet['category'],
      tags: string[],
      saveAsNew: boolean,
    ) => {
      const now = Date.now();

      // If currently on an existing custom snippet and NOT explicitly requested to save as new copy: update in place!
      if (!activeSnippet.isDefault && !saveAsNew) {
        setSnippets((prev) =>
          prev.map((s) => {
            if (s.id === activeSnippet.id) {
              return {
                ...s,
                title,
                description,
                category,
                tags,
                code,
                updatedAt: now,
              };
            }
            return s;
          }),
        );

        setIsSavedFeedback(true);
        setTimeout(() => setIsSavedFeedback(false), 2500);

        showToast(`Updated "${title}" in My Saved Snippets`, 'success', 'Open Library', () =>
          setIsSnippetsModalOpen(true),
        );
      } else {
        // Create fresh custom snippet
        const newSnippet: Snippet = {
          id: `custom-${now}`,
          title,
          description,
          category: category || 'My Saved',
          tags,
          code,
          isDefault: false,
          createdAt: now,
          updatedAt: now,
        };

        setSnippets((prev) => [newSnippet, ...prev]);
        setActiveSnippetId(newSnippet.id);

        setIsSavedFeedback(true);
        setTimeout(() => setIsSavedFeedback(false), 2500);

        showToast(`Saved "${title}" to My Saved Snippets!`, 'success', 'Open Library', () =>
          setIsSnippetsModalOpen(true),
        );
      }
    },
    [activeSnippet, code, showToast],
  );

  const handleSaveCurrentSnippet = useCallback(
    (title: string, description: string, category: Snippet['category'], tags: string[]) => {
      handleSaveSnippet(title, description, category, tags, true);
    },
    [handleSaveSnippet],
  );

  const handleDeleteSnippet = useCallback(
    (id: string) => {
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      if (activeSnippetId === id) {
        const remaining = snippets.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          setActiveSnippetId(remaining[0].id);
          setCode(remaining[0].code);
        }
      }
    },
    [activeSnippetId, snippets],
  );

  const handleResetDefaults = useCallback(() => {
    // Preserve custom snippets, restore defaults
    const custom = snippets.filter((s) => !s.isDefault);
    const merged = [...DEFAULT_SNIPPETS, ...custom];
    setSnippets(merged);
    setActiveSnippetId(DEFAULT_SNIPPETS[0].id);
    setCode(DEFAULT_SNIPPETS[0].code);
  }, [snippets]);

  const handleImportSnippets = useCallback(
    (imported: Snippet[]) => {
      setSnippets((prev) => [...imported, ...prev]);
      if (imported.length > 0) {
        handleSelectSnippet(imported[0]);
      }
    },
    [handleSelectSnippet],
  );

  const handleInsertCodeAtCursor = useCallback((snippetCode: string) => {
    setCode((prev) => `${prev}\n\n<!-- Inserted Alpine Component -->\n${snippetCode}`);
    setRefreshTrigger((p) => p + 1);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#00283c] font-sans antialiased text-slate-100">
      {/* Main Application Header with School Branding (hidden in dedicated fullscreen preview mode) */}
      {!isFullscreenPreview && (
        <Header
          activeSnippet={activeSnippet}
          onOpenSnippetsModal={() => setIsSnippetsModalOpen(true)}
          onOpenCheatsheetModal={() => setIsCheatsheetModalOpen(true)}
          onResetToCurrentSnippet={handleResetToCurrentSnippet}
          code={code}
          orientation={orientation}
          onToggleOrientation={() =>
            setOrientation((o) => (o === 'horizontal' ? 'vertical' : 'horizontal'))
          }
          splitRatio={splitRatio}
          onSetSplitRatio={setSplitRatio}
          onSave={() => setIsSaveModalOpen(true)}
          isSavedFeedback={isSavedFeedback}
        />
      )}

      {/* Split-Pane Workspace or Fullscreen View */}
      <main
        className={`flex-1 flex overflow-hidden ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}`}
      >
        {!isFullscreenPreview && (
          <>
            {/* Editor Pane */}
            <div
              style={{
                flexBasis: `${splitRatio}%`,
                width: orientation === 'horizontal' ? `${splitRatio}%` : '100%',
                height: orientation === 'vertical' ? `${splitRatio}%` : '100%',
              }}
              className="overflow-hidden flex-shrink-0"
            >
              <EditorPane
                code={code}
                onChange={setCode}
                theme={editorTheme}
                onThemeChange={setEditorTheme}
                onSave={() => setIsSaveModalOpen(true)}
                isSavedFeedback={isSavedFeedback}
              />
            </div>

            {/* Draggable Resizable Splitter Handle */}
            <ResizableSplitter onSplitChange={setSplitRatio} orientation={orientation} />
          </>
        )}

        {/* Live Preview Pane */}
        <div
          style={{
            flexBasis: isFullscreenPreview ? '100%' : `${100 - splitRatio}%`,
            width:
              isFullscreenPreview || orientation === 'horizontal'
                ? isFullscreenPreview
                  ? '100%'
                  : `${100 - splitRatio}%`
                : '100%',
            height:
              isFullscreenPreview || orientation === 'vertical'
                ? isFullscreenPreview
                  ? '100%'
                  : `${100 - splitRatio}%`
                : '100%',
          }}
          className="overflow-hidden flex-1 w-full h-full"
        >
          <PreviewPane
            code={code}
            onTriggerRefresh={() => setRefreshTrigger((v) => v + 1)}
            refreshTrigger={refreshTrigger}
            isFullscreen={isFullscreenPreview}
            onToggleFullscreen={handleToggleFullscreenPreview}
          />
        </div>
      </main>

      {/* Dedicated Save Snippet Modal (Title, Description, Category, Tags) */}
      <SaveSnippetModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveSnippet}
        activeSnippet={activeSnippet}
        currentCode={code}
      />

      {/* Snippet Manager & Lesson Browser Modal */}
      <SnippetManagerModal
        isOpen={isSnippetsModalOpen}
        onClose={() => setIsSnippetsModalOpen(false)}
        snippets={snippets}
        activeSnippetId={activeSnippetId}
        onSelectSnippet={handleSelectSnippet}
        onSaveCurrentSnippet={handleSaveCurrentSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        onResetDefaults={handleResetDefaults}
        onImportSnippets={handleImportSnippets}
      />

      {/* Alpine.js Directives & API Cheatsheet Modal */}
      <AlpineCheatsheetModal
        isOpen={isCheatsheetModalOpen}
        onClose={() => setIsCheatsheetModalOpen(false)}
        onInsertCode={handleInsertCodeAtCursor}
      />

      {/* In-app Offline Connectivity Status Banner */}
      <OfflineIndicator />

      {/* Toast Notification Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
