import { BookOpen, Check, Copy, ExternalLink, PlusCircle, Search, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Tooltip } from './Tooltip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode: (code: string) => void;
}

interface CheatsheetItem {
  name: string;
  type: 'directive' | 'magic' | 'modifier' | 'plugin' | 'emmet';
  summary: string;
  syntax: string;
  snippet: string;
}

const CHEATSHEET_ITEMS: CheatsheetItem[] = [
  {
    name: 'x-data',
    type: 'directive',
    summary: 'Declares a new component scope and initializes reactive state.',
    syntax: '<div x-data="{ count: 0, open: false }">',
    snippet: `<div x-data="{ count: 0 }">
  <button @click="count++" class="px-3 py-1 bg-[#fa6432] text-white rounded-md text-xs font-bold">
    Count: <span x-text="count"></span>
  </button>
</div>`,
  },
  {
    name: 'x-on (@)',
    type: 'directive',
    summary: 'Attaches an event listener to the element. Shorthand is @click, @keydown, etc.',
    syntax: '<button @click="handleClick" @keydown.escape="close">',
    snippet: `<button @click="alert('Hello from Thomas More Alpine!')" class="px-3 py-1.5 bg-[#00283c] text-white rounded-lg text-xs font-semibold">
  Click Event
</button>`,
  },
  {
    name: 'x-bind (:)',
    type: 'directive',
    summary:
      'Binds HTML attributes dynamically based on JS state. Shorthand is :class, :disabled, :style.',
    syntax:
      '<button :disabled="isLoading" :class="isActive ? \'bg-orange-500\' : \'bg-slate-200\'">',
    snippet: `<button :class="count > 5 ? 'bg-[#fa6432] text-white' : 'bg-slate-200 text-slate-700'" class="px-4 py-2 rounded-lg font-bold text-xs transition">
  Dynamic Styled Button
</button>`,
  },
  {
    name: 'x-text',
    type: 'directive',
    summary: 'Updates the inner text content of an element dynamically.',
    syntax: '<span x-text="username"></span>',
    snippet:
      '<span class="text-sm font-bold text-[#00283c]" x-text="\'Student score: \' + score"></span>',
  },
  {
    name: 'x-model',
    type: 'directive',
    summary: 'Creates two-way binding between an input/select/textarea and reactive state.',
    syntax: '<input type="text" x-model.trim="username">',
    snippet: `<div class="space-y-1">
  <input type="text" x-model="studentQuery" placeholder="Type here..." class="px-3 py-1.5 border rounded-lg text-xs w-full" />
  <p class="text-xs text-slate-500">Live: <strong x-text="studentQuery"></strong></p>
</div>`,
  },
  {
    name: 'x-show',
    type: 'directive',
    summary: 'Toggles element visibility using CSS display: none. Keeps component DOM intact.',
    syntax: '<div x-show="isOpen" x-transition>',
    snippet: `<div x-show="isOpen" x-transition class="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900">
  This message smoothly appears and disappears!
</div>`,
  },
  {
    name: 'x-if',
    type: 'directive',
    summary:
      'Conditionally adds or removes an element from the DOM. Must be used on a <template> tag.',
    syntax: '<template x-if="isLoggedIn"><div>...</div></template>',
    snippet: `<template x-if="isAdmin">
  <div class="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-semibold">
    Admin Dashboard Controls Active
  </div>
</template>`,
  },
  {
    name: 'x-for',
    type: 'directive',
    summary: 'Loops over an array of items. Must be declared on a <template> tag with a :key.',
    syntax: '<template x-for="(item, index) in items" :key="item.id">',
    snippet: `<ul class="space-y-1">
  <template x-for="tech in ['Alpine.js', 'Tailwind CSS v4', 'PWA']" :key="tech">
    <li class="px-2.5 py-1 bg-slate-100 rounded text-xs text-slate-700 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[#fa6432]"></span>
      <span x-text="tech"></span>
    </li>
  </template>
</ul>`,
  },
  {
    name: 'x-transition',
    type: 'directive',
    summary: 'Applies enter and leave CSS transitions with ease and duration helpers.',
    syntax: '<div x-show="open" x-transition.duration.300ms.scale.90>',
    snippet: `<div 
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 translate-y-2"
  x-transition:enter-end="opacity-100 translate-y-0"
  class="p-4 bg-white shadow-xl rounded-2xl border"
>
  Smooth animated card content
</div>`,
  },
  {
    name: 'x-ref & $refs',
    type: 'directive',
    summary: 'Marks a DOM element to be accessed directly via the $refs magic property.',
    syntax: '<input x-ref="searchField"> ... <button @click="$refs.searchField.focus()">',
    snippet: `<input x-ref="myInput" type="text" class="px-3 py-1.5 border rounded-lg text-xs" />
<button @click="$refs.myInput.focus()" class="px-3 py-1.5 bg-slate-200 text-xs rounded-lg font-semibold">
  Focus Input
</button>`,
  },
  {
    name: '$dispatch',
    type: 'magic',
    summary: 'Emits a browser CustomEvent with a custom detail payload that bubbles up.',
    syntax: "$dispatch('event-name', { value: 123 })",
    snippet:
      '<button @click="$dispatch(\'notify\', { message: \'Saved successfully!\' })" class="px-3 py-1.5 bg-[#fa6432] text-white rounded text-xs font-bold">Send Notification</button>',
  },
  {
    name: '$watch',
    type: 'magic',
    summary: 'Watches a reactive property and executes a callback whenever it changes.',
    syntax: "$watch('count', (value, oldValue) => console.log(value))",
    snippet: "<div x-init=\"$watch('count', val => console.log('Count changed to:', val))\"></div>",
  },
  {
    name: '$nextTick',
    type: 'magic',
    summary: 'Executes a callback only after Alpine has completed DOM reactivity updates.',
    syntax: '$nextTick(() => { /* DOM is updated */ })',
    snippet:
      "<button @click=\"items.push('New'); $nextTick(() => { console.log('Item added and rendered!'); })\">Add & Scroll</button>",
  },
  {
    name: 'Alpine.store',
    type: 'plugin',
    summary: 'Shared global reactive store accessible anywhere with $store.name.',
    syntax: "Alpine.store('user', { name: 'Alex', isAuth: true })",
    snippet: `<script>
  document.addEventListener('alpine:init', () => {
    Alpine.store('theme', {
      dark: false,
      toggle() { this.dark = !this.dark; }
    });
  });
</script>`,
  },
  {
    name: 'Emmet: Child (>) & Sibling (+)',
    type: 'emmet',
    summary: 'Nests child elements or groups siblings together. Expand with Tab or Ctrl+E.',
    syntax: 'nav>ul>li*3>a or h1+p',
    snippet: `<nav>
  <ul>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
  </ul>
</nav>`,
  },
  {
    name: 'Emmet: Classes (.) & ID (#)',
    type: 'emmet',
    summary: 'Quickly adds Tailwind utility classes and element IDs.',
    syntax: 'div.flex.items-center.justify-between#header',
    snippet: `<div class="flex items-center justify-between" id="header">
  
</div>`,
  },
  {
    name: 'Emmet: Multiplication (*)',
    type: 'emmet',
    summary: 'Multiplies elements and adds index counter with $.',
    syntax: 'ul>li.item-$*3{Item $}',
    snippet: `<ul>
  <li class="item-1">Item 1</li>
  <li class="item-2">Item 2</li>
  <li class="item-3">Item 3</li>
</ul>`,
  },
  {
    name: 'Emmet: Alpine Component (xcomponent / xdiv)',
    type: 'emmet',
    summary: 'Expands a full reactive Alpine.js component card styled with Tailwind.',
    syntax: 'xcomponent or xdiv',
    snippet: `<div x-data="{ count: 0 }" class="p-6 bg-[#00283c] border border-[#134661] rounded-2xl text-white">
  <button @click="count++" class="px-4 py-2 bg-[#fa6432] text-white rounded-lg">
    Count is: <span x-text="count"></span>
  </button>
</div>`,
  },
  {
    name: 'Emmet: Alpine Modal (xmodal)',
    type: 'emmet',
    summary:
      'Generates a ready-to-use accessible Alpine modal dialog with transitions and outside click.',
    syntax: 'xmodal',
    snippet: `<div x-data="{ open: false }">
  <button @click="open = true" class="px-4 py-2 bg-[#fa6432] text-white rounded-lg font-medium">Open Modal</button>
  <div x-show="open" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" x-transition>
    <div @click.outside="open = false" class="bg-[#00283c] border border-[#134661] rounded-2xl p-6 max-w-md w-full text-white shadow-2xl">
      <h3 class="text-lg font-bold mb-2">Modal Title</h3>
      <p class="text-slate-300 text-sm mb-4">Modal body content with smooth Alpine transitions.</p>
      <div class="flex justify-end gap-2">
        <button @click="open = false" class="px-3 py-1.5 rounded-lg bg-[#0b384f] text-slate-300 hover:text-white">Close</button>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    name: 'Emmet: Form with Inputs & Submit',
    type: 'emmet',
    summary: 'Builds a complete HTML form with styled Tailwind input and submit button.',
    syntax: 'form:post>input:text+button:submit',
    snippet: `<form action="" method="post" class="space-y-3">
  <input type="text" name="" id="" class="w-full px-3 py-2 rounded-lg bg-[#001c2b] border border-[#134661] text-white" />
  <button type="submit" class="px-4 py-2 bg-[#fa6432] text-white font-medium rounded-lg">Submit</button>
</form>`,
  },
];

export const AlpineCheatsheetModal: React.FC<Props> = ({ isOpen, onClose, onInsertCode }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredItems = CHEATSHEET_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.syntax.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        id="alpine-cheatsheet-modal"
        className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-[#00283c] border border-[#134661] text-slate-100 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#134661] flex items-center justify-between bg-[#001c2b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fa6432]/20 border border-[#fa6432]/40 flex items-center justify-center text-[#fa6432]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Alpine.js Directive & API Guide
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#fa6432] text-white">
                  Student Reference
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Quick syntax, documentation, and ready-to-use snippets
              </p>
            </div>
          </div>
          <button
            id="close-cheatsheet-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-[#134661]/60 bg-[#002233] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search directives, events, magics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'directive', 'magic', 'plugin', 'emmet'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition ${
                  filterType === type
                    ? 'bg-[#fa6432] text-white'
                    : 'bg-[#001c2b] text-slate-300 hover:text-white'
                }`}
              >
                {type === 'emmet' ? '⚡ Emmet' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Cheatsheet Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-[#001c2b] border border-[#134661] hover:border-[#fa6432]/60 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#fa6432]">{item.name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#0b384f] text-slate-300 border border-[#134661]">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{item.summary}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Tooltip content="Copy code snippet to clipboard">
                    <button
                      onClick={() => handleCopy(item.snippet, idx)}
                      className="p-1.5 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-300 hover:text-white text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </Tooltip>

                  <Tooltip content="Insert directly into active editor">
                    <button
                      onClick={() => {
                        onInsertCode(item.snippet);
                        onClose();
                      }}
                      className="p-1.5 px-2.5 rounded-lg bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Insert</span>
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Syntax & Snippet Preview */}
              <div className="bg-[#00141f] rounded-lg p-3 font-mono text-xs border border-[#134661]/60 text-slate-200 overflow-x-auto">
                <div className="text-[11px] text-slate-400 mb-1 font-sans font-semibold">
                  Syntax:
                </div>
                <div className="text-sky-300">{item.syntax}</div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching directives found for "{search}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#001c2b] border-t border-[#134661] flex items-center justify-between text-xs text-slate-400">
          <span>Official documentation: alpinejs.dev</span>
          <a
            href="https://alpinejs.dev/start-here"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fa6432] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Visit Alpine Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
