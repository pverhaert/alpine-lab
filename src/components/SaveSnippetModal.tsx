import { AlertCircle, Check, Code, Copy, Save, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Snippet } from '../types';
import { Tooltip } from './Tooltip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    category: Snippet['category'],
    tags: string[],
    saveAsNew: boolean,
  ) => void;
  activeSnippet: Snippet;
  currentCode: string;
}

export const SaveSnippetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  activeSnippet,
  currentCode,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Snippet['category']>('My Saved');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isExistingCustom = !activeSnippet.isDefault;

  // Prepopulate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (isExistingCustom) {
        setTitle(activeSnippet.title);
        setDescription(activeSnippet.description || '');
        setCategory(activeSnippet.category || 'My Saved');
        setTags(activeSnippet.tags ? activeSnippet.tags.join(', ') : 'alpine, custom');
      } else {
        // Pre-fill clean suggested name for a default lesson
        const cleanBase = activeSnippet.title.replace(/^Lesson\s*\d+:\s*/i, '');
        setTitle(`My ${cleanBase}`);
        setDescription(activeSnippet.description || 'Custom Alpine component created in Tech Lab');
        setCategory('My Saved');
        setTags(
          activeSnippet.tags
            ? [...activeSnippet.tags, 'custom'].join(', ')
            : 'x-data, tailwind, alpine',
        );
      }

      // Autofocus input
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
          titleInputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, activeSnippet, isExistingCustom]);

  if (!isOpen) return null;

  // Code inspection stats
  const lineCount = currentCode.split('\n').length;
  const charCount = currentCode.length;
  const hasAlpineData = /x-data/i.test(currentCode);
  const hasTailwind = /class=["'][^"']*["']/i.test(currentCode);

  const handleFormSubmit = (e: React.FormEvent, saveAsNew = false) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please provide a snippet title');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (tagsArray.length === 0) {
      tagsArray.push('alpine', 'saved');
    }

    onSave(trimmedTitle, description.trim(), category, tagsArray, saveAsNew);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="save-snippet-modal"
        className="w-full max-w-lg rounded-2xl bg-[#00283c] border border-[#134661] text-slate-100 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Close Button */}
        <Tooltip content="Close (Esc)" side="left">
          <button
            id="close-save-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#fa6432]/20 border border-[#fa6432]/40 flex items-center justify-center text-[#fa6432] flex-shrink-0">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Save to My Saved Snippets
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fa6432] text-white uppercase tracking-wider">
                Local Storage
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {isExistingCustom
                ? `Update "${activeSnippet.title}" or save as a new snippet copy`
                : 'Give your custom Alpine component a name and description'}
            </p>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Save Form */}
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-4">
          {/* Snippet Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Snippet Name <span className="text-[#fa6432]">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Animated Accordion Component"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] focus:ring-1 focus:ring-[#fa6432] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this Alpine.js component does..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] focus:ring-1 focus:ring-[#fa6432] transition resize-none"
            />
          </div>

          {/* Category & Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Snippet['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#001c2b] border border-[#134661] text-white focus:outline-none focus:border-[#fa6432] focus:ring-1 focus:ring-[#fa6432] transition cursor-pointer"
              >
                <option value="My Saved">My Saved (Default)</option>
                <option value="Components">Components</option>
                <option value="Fundamentals">Fundamentals</option>
                <option value="Advanced">Advanced</option>
                <option value="Projects">Projects</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="x-data, tailwind, counter"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] focus:ring-1 focus:ring-[#fa6432] transition"
              />
            </div>
          </div>

          {/* Quick Code Summary Info Box */}
          <div className="p-3 rounded-xl bg-[#001a27] border border-[#134661] flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-[#fa6432]" />
                <strong>{lineCount}</strong> lines ({charCount} chars)
              </span>
              {hasAlpineData && (
                <span className="px-1.5 py-0.5 rounded bg-[#fa6432]/20 text-[#fa6432] font-semibold text-[10px]">
                  x-data detected
                </span>
              )}
              {hasTailwind && (
                <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-semibold text-[10px]">
                  Tailwind v4
                </span>
              )}
            </div>
            <span className="text-slate-400 text-[10px]">Local Browser Storage</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#134661]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>

            {isExistingCustom ? (
              <>
                <button
                  type="button"
                  onClick={(e) => handleFormSubmit(e, true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0b384f] hover:bg-[#134661] border border-[#1b5372] text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#fa6432]" />
                  <span>Save as New Copy</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Snippet</span>
                </button>
              </>
            ) : (
              <button
                type="submit"
                id="confirm-save-snippet-btn"
                className="px-5 py-2 rounded-xl bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to My Saved Snippets</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
