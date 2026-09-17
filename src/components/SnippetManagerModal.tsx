import {
  ArrowRight,
  Clock,
  Download,
  Folder,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { Snippet } from '../types';
import { Tooltip } from './Tooltip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  snippets: Snippet[];
  activeSnippetId: string;
  onSelectSnippet: (snippet: Snippet) => void;
  onSaveCurrentSnippet: (
    title: string,
    description: string,
    category: Snippet['category'],
    tags: string[],
  ) => void;
  onDeleteSnippet: (id: string) => void;
  onResetDefaults: () => void;
  onImportSnippets: (imported: Snippet[]) => void;
}

export const SnippetManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  snippets,
  activeSnippetId,
  onSelectSnippet,
  onSaveCurrentSnippet,
  onDeleteSnippet,
  onResetDefaults,
  onImportSnippets,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New snippet form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Snippet['category']>('My Saved');
  const [newTags, setNewTags] = useState('x-data, Alpine');

  if (!isOpen) return null;

  const categories = ['All', 'Fundamentals', 'Components', 'Advanced', 'Projects', 'My Saved'];

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSaveCurrentSnippet(newTitle.trim(), newDesc.trim(), newCategory, tagsArray);
    setIsCreatingNew(false);
    setSelectedCategory('My Saved');
    setNewTitle('');
    setNewDesc('');
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alpine-snippets-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportSnippets(parsed);
        }
      } catch (_err) {
        alert('Invalid JSON snippet format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        id="snippet-manager-modal"
        className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-[#00283c] border border-[#134661] text-slate-100 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#134661] flex items-center justify-between bg-[#001c2b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fa6432]/20 border border-[#fa6432]/40 flex items-center justify-center text-[#fa6432]">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Snippet Library & Lessons
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#fa6432] text-white">
                  {snippets.length} Items
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Browse tutorials, saved student components, and export collections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="create-new-snippet-btn"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="px-3 py-1.5 rounded-lg bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingNew ? 'Cancel' : 'Save Current Code'}</span>
            </button>
            <button
              id="close-snippets-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save New Snippet Form Drawer (Collapsible) */}
        {isCreatingNew && (
          <form
            onSubmit={handleSaveSubmit}
            className="p-4 bg-[#001a27] border-b border-[#134661] animate-in slide-in-from-top duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fa6432]" />
                Save Current Editor Code to Local Browser
              </span>
              <span className="text-[11px] text-slate-400">Stored in browser localStorage</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Snippet Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., My Interactive Shopping Cart"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#002233] border border-[#134661] text-white focus:outline-none focus:border-[#fa6432]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Snippet['category'])}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#002233] border border-[#134661] text-white focus:outline-none focus:border-[#fa6432]"
                >
                  <option value="My Saved">My Saved</option>
                  <option value="Fundamentals">Fundamentals</option>
                  <option value="Components">Components</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Projects">Projects</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="x-data, forms, tailwind"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#002233] border border-[#134661] text-white focus:outline-none focus:border-[#fa6432]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief note about what this Alpine component does..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#002233] border border-[#134661] text-white focus:outline-none focus:border-[#fa6432]"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-semibold cursor-pointer"
              >
                Save Snippet
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter Controls */}
        <div className="px-6 py-3 border-b border-[#134661]/60 bg-[#002233] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, or Alpine directive..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432]"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#fa6432] text-white shadow-xs'
                    : 'bg-[#001c2b] text-slate-300 hover:text-white hover:bg-[#0b384f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnippets.map((snippet) => {
            const isActive = snippet.id === activeSnippetId;
            return (
              <div
                key={snippet.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0b384f] border-[#fa6432] ring-1 ring-[#fa6432]'
                    : 'bg-[#001c2b] border-[#134661] hover:border-[#1b5372] hover:bg-[#002233]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {snippet.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#fa6432] text-white">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {!snippet.isDefault && (
                      <Tooltip content="Delete custom snippet">
                        <button
                          onClick={() => onDeleteSnippet(snippet.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">{snippet.description}</p>
                </div>

                <div>
                  {/* Tags & Category */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00283c] text-[#fa6432] border border-[#134661]">
                      {snippet.category}
                    </span>
                    {snippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-[#134661]/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(snippet.updatedAt).toLocaleDateString()}</span>
                    </span>

                    <button
                      onClick={() => {
                        onSelectSnippet(snippet);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-lg bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                    >
                      <span>Load into Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSnippets.length === 0 && (
            <div className="col-span-2 text-center py-12 px-4 rounded-xl border border-dashed border-[#134661] bg-[#001c2b]/50">
              {selectedCategory === 'My Saved' ? (
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#fa6432]/10 border border-[#fa6432]/30 flex items-center justify-center text-[#fa6432]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Saved Snippets Yet</h4>
                  <p className="text-xs text-slate-300">
                    Save your custom Alpine.js components locally to your browser so you can load or
                    modify them anytime.
                  </p>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Current Editor Code</span>
                  </button>
                </div>
              ) : (
                <div className="text-slate-400 text-xs py-4">
                  No snippets found matching your search or filters.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Tools */}
        <div className="px-6 py-3 bg-[#001c2b] border-t border-[#134661] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Tooltip content="Export all saved snippets as a JSON file">
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export JSON</span>
              </button>
            </Tooltip>

            <label className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <Tooltip content="Restore standard Thomas More lesson snippets">
              <button
                onClick={() => {
                  if (confirm('Reset default lessons? Your saved snippets will be preserved.')) {
                    onResetDefaults();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-orange-300 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default Lessons</span>
              </button>
            </Tooltip>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
