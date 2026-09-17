import type { Monaco } from '@monaco-editor/react';
import expand, { extract } from 'emmet';

export interface EmmetSnippetItem {
  abbr: string;
  title: string;
  category: 'Components' | 'Interactive' | 'Navigation' | 'Forms' | 'Feedback' | 'Boilerplate';
  description: string;
  snippet: string;
}

// Catalog of quick Alpine.js 3.x + Tailwind CSS v4 snippets
export const EMMET_SNIPPET_CATALOG: EmmetSnippetItem[] = [
  {
    abbr: 'xbtn',
    title: 'Primary Button',
    category: 'Interactive',
    description: 'Toggle button with active scaling and Thomas More accent color',
    snippet:
      '<button @click="${1:open = !open}" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white font-medium rounded-lg shadow-sm transition active:scale-95 cursor-pointer">\n\t${2:Click me}\n</button>',
  },
  {
    abbr: 'xbtn:secondary',
    title: 'Secondary Button',
    category: 'Interactive',
    description: 'Ghost outline button with subtle border',
    snippet:
      '<button @click="${1:open = false}" class="px-4 py-2 bg-[#0b384f] hover:bg-[#134661] text-slate-200 hover:text-white font-medium rounded-lg border border-[#134661] transition active:scale-95 cursor-pointer">\n\t${2:Cancel}\n</button>',
  },
  {
    abbr: 'xbtn:loading',
    title: 'Loading Button',
    category: 'Interactive',
    description: 'Button with animated SVG spinner during async actions',
    snippet:
      '<button x-data="{ loading: false }" @click="loading = true; setTimeout(() => loading = false, 2000)" :disabled="loading" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] disabled:opacity-60 text-white font-medium rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer">\n\t<svg x-show="loading" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>\n\t<span x-text="loading ? \'Processing...\' : \'Submit Action\'"></span>\n</button>',
  },
  {
    abbr: 'xtoggle',
    title: 'Switch Toggle',
    category: 'Interactive',
    description: 'Accessible boolean toggle switch with smooth animated thumb',
    snippet:
      '<div x-data="{ enabled: false }" class="flex items-center gap-3">\n\t<button @click="enabled = !enabled" type="button" :class="enabled ? \'bg-[#fa6432]\' : \'bg-[#0b384f]\'" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">\n\t\t<span :class="enabled ? \'translate-x-5\' : \'translate-x-0\'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out"></span>\n\t</button>\n\t<span class="text-sm font-medium text-slate-200" x-text="enabled ? \'Enabled\' : \'Disabled\'"></span>\n</div>',
  },
  {
    abbr: 'xcomponent',
    title: 'Interactive Counter Card',
    category: 'Components',
    description: 'Self-contained reactive card with increment, decrement, and reset',
    snippet:
      '<div x-data="{ count: 0 }" class="p-6 bg-[#00283c] border border-[#134661] rounded-2xl text-white shadow-lg space-y-4">\n\t<h3 class="text-lg font-bold text-white">Counter Component</h3>\n\t<p class="text-sm text-slate-300">Current count: <span class="font-bold text-[#fa6432]" x-text="count"></span></p>\n\t<div class="flex items-center gap-2">\n\t\t<button @click="count++" class="px-3 py-1.5 bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold rounded-lg transition active:scale-95 cursor-pointer">+ Increment</button>\n\t\t<button @click="count > 0 ? count-- : 0" class="px-3 py-1.5 bg-[#0b384f] hover:bg-[#134661] text-slate-200 text-sm font-semibold rounded-lg border border-[#134661] transition active:scale-95 cursor-pointer">- Decrement</button>\n\t\t<button @click="count = 0" class="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">Reset</button>\n\t</div>\n</div>',
  },
  {
    abbr: 'xmodal',
    title: 'Dialog Modal',
    category: 'Navigation',
    description: 'Backdrop blur modal with click-outside dismissal and transition',
    snippet:
      '<div x-data="{ open: false }">\n\t<button @click="open = true" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold rounded-lg shadow-sm transition active:scale-95 cursor-pointer">Open Dialog</button>\n\t<div x-show="open" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0">\n\t\t<div @click.outside="open = false" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" class="bg-[#00283c] border border-[#134661] rounded-2xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">\n\t\t\t<div class="flex items-center justify-between">\n\t\t\t\t<h3 class="text-lg font-bold text-white">Modal Title</h3>\n\t\t\t\t<button @click="open = false" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>\n\t\t\t</div>\n\t\t\t<p class="text-slate-300 text-sm">This is an accessible modal component with smooth transitions and click-outside dismissal.</p>\n\t\t\t<div class="flex justify-end gap-2 pt-2">\n\t\t\t\t<button @click="open = false" class="px-3 py-1.5 rounded-lg bg-[#0b384f] hover:bg-[#134661] text-slate-300 text-sm cursor-pointer">Cancel</button>\n\t\t\t\t<button @click="open = false" class="px-3 py-1.5 rounded-lg bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold cursor-pointer">Confirm</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xdropdown',
    title: 'Dropdown Menu',
    category: 'Navigation',
    description: 'Floating menu with chevron animation and click-outside closing',
    snippet:
      '<div x-data="{ open: false }" class="relative inline-block">\n\t<button @click="open = !open" class="px-4 py-2 bg-[#0b384f] hover:bg-[#134661] border border-[#134661] rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer transition">\n\t\t<span>Options Menu</span>\n\t\t<span :class="open ? \'rotate-180\' : \'\'" class="transition-transform duration-200 text-xs">▼</span>\n\t</button>\n\t<div x-show="open" @click.outside="open = false" x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" class="absolute left-0 mt-2 w-52 rounded-xl bg-[#001c2b] border border-[#134661] shadow-2xl p-1.5 z-20">\n\t\t<a href="#" class="block px-3 py-2 text-sm text-slate-200 hover:bg-[#0b384f] hover:text-white rounded-lg transition">Edit Profile</a>\n\t\t<a href="#" class="block px-3 py-2 text-sm text-slate-200 hover:bg-[#0b384f] hover:text-white rounded-lg transition">Workspace Settings</a>\n\t\t<div class="my-1 border-t border-[#134661]"></div>\n\t\t<a href="#" class="block px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">Sign Out</a>\n\t</div>\n</div>',
  },
  {
    abbr: 'xtabs',
    title: 'Tabbed Panels',
    category: 'Navigation',
    description: 'Multi-tab content switcher with active line indicators',
    snippet:
      '<div x-data="{ tab: \'overview\' }" class="w-full max-w-md bg-[#00283c] border border-[#134661] rounded-2xl p-4 text-white">\n\t<div class="flex border-b border-[#134661] gap-2 pb-2">\n\t\t<button @click="tab = \'overview\'" :class="tab === \'overview\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-400 hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Overview</button>\n\t\t<button @click="tab = \'features\'" :class="tab === \'features\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-400 hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Features</button>\n\t\t<button @click="tab = \'settings\'" :class="tab === \'settings\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-400 hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Settings</button>\n\t</div>\n\t<div class="pt-4 text-sm text-slate-300 min-h-[70px]">\n\t\t<div x-show="tab === \'overview\'" x-transition>Explore component stats and general metrics here.</div>\n\t\t<div x-show="tab === \'features\'" x-transition>Check out the full list of Alpine.js features.</div>\n\t\t<div x-show="tab === \'settings\'" x-transition>Customize your layout and preferences.</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xaccordion',
    title: 'Accordion / FAQ',
    category: 'Navigation',
    description: 'Expandable FAQ accordion item with smooth collapse',
    snippet:
      '<div x-data="{ active: null }" class="space-y-2 max-w-md">\n\t<div class="border border-[#134661] rounded-xl overflow-hidden bg-[#00283c]">\n\t\t<button @click="active = (active === 1 ? null : 1)" class="w-full px-4 py-3 text-left font-semibold text-sm text-white flex items-center justify-between hover:bg-[#0b384f] transition cursor-pointer">\n\t\t\t<span>What is Alpine.js?</span>\n\t\t\t<span :class="active === 1 ? \'rotate-180\' : \'\'" class="transition-transform duration-200 text-xs">▼</span>\n\t\t</button>\n\t\t<div x-show="active === 1" x-transition class="px-4 pb-3 pt-1 text-xs text-slate-300 border-t border-[#134661]/40">\n\t\t\tAlpine is a rugged, minimal tool for composing behavior directly in your HTML.\n\t\t</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xtodo',
    title: 'Todo List App',
    category: 'Components',
    description: 'Full reactive todo app with add, strike-through, and remove features',
    snippet:
      '<div x-data="{ tasks: [{ id: 1, text: \'Master Alpine directives\', done: true }, { id: 2, text: \'Style with Tailwind v4\', done: false }], newTask: \'\' }" class="max-w-md bg-[#00283c] border border-[#134661] rounded-2xl p-5 text-white space-y-4">\n\t<h3 class="font-bold text-base">Alpine Todo List</h3>\n\t<form @submit.prevent="if (newTask.trim()) { tasks.push({ id: Date.now(), text: newTask.trim(), done: false }); newTask = \'\'; }" class="flex gap-2">\n\t\t<input x-model="newTask" placeholder="Add a new task..." class="flex-1 px-3 py-1.5 text-xs bg-[#001c2b] border border-[#134661] rounded-lg text-white focus:outline-none focus:border-[#fa6432]" />\n\t\t<button type="submit" class="px-3 py-1.5 bg-[#fa6432] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#ff8559] transition">Add</button>\n\t</form>\n\t<ul class="space-y-1.5 max-h-48 overflow-y-auto">\n\t\t<template x-for="task in tasks" :key="task.id">\n\t\t\t<li class="flex items-center justify-between p-2 rounded-lg bg-[#001c2b] border border-[#134661] text-xs">\n\t\t\t\t<label class="flex items-center gap-2 cursor-pointer">\n\t\t\t\t\t<input type="checkbox" x-model="task.done" class="accent-[#fa6432] rounded" />\n\t\t\t\t\t<span :class="task.done ? \'line-through text-slate-500\' : \'text-slate-200\'" x-text="task.text"></span>\n\t\t\t\t</label>\n\t\t\t\t<button @click="tasks = tasks.filter(t => t.id !== task.id)" class="text-slate-500 hover:text-red-400 cursor-pointer">&times;</button>\n\t\t\t</li>\n\t\t</template>\n\t</ul>\n</div>',
  },
  {
    abbr: 'xfor:cards',
    title: 'Card Grid (x-for)',
    category: 'Components',
    description: 'Responsive multi-column card grid populated via template loop',
    snippet:
      '<div x-data="{ items: [{ id: 1, title: \'Alpine.js\', tag: \'JS\' }, { id: 2, title: \'Tailwind v4\', tag: \'CSS\' }, { id: 3, title: \'Thomas More\', tag: \'Campus\' }] }">\n\t<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">\n\t\t<template x-for="item in items" :key="item.id">\n\t\t\t<div class="p-4 bg-[#00283c] border border-[#134661] rounded-xl hover:border-[#fa6432] transition">\n\t\t\t\t<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fa6432]/20 text-[#fa6432]" x-text="item.tag"></span>\n\t\t\t\t<h4 class="text-sm font-bold text-white mt-2" x-text="item.title"></h4>\n\t\t\t</div>\n\t\t</template>\n\t</div>\n</div>',
  },
  {
    abbr: 'xinput',
    title: 'Form Input (x-model)',
    category: 'Forms',
    description: 'Accessible labeled input field with two-way data binding',
    snippet:
      '<div class="space-y-1 max-w-sm">\n\t<label class="block text-xs font-semibold text-slate-300">${1:Label}</label>\n\t<input type="${2:text}" x-model="${3:query}" placeholder="${4:Enter value...}" class="w-full px-3 py-2 rounded-lg bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] text-sm transition" />\n</div>',
  },
  {
    abbr: 'xsearch',
    title: 'Search Bar with Clear',
    category: 'Forms',
    description: 'Search input with search icon and instant clear button',
    snippet:
      '<div x-data="{ query: \'\' }" class="relative max-w-sm">\n\t<input type="text" x-model="query" placeholder="Search..." class="w-full pl-9 pr-8 py-2 rounded-xl bg-[#001c2b] border border-[#134661] text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] text-sm" />\n\t<span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>\n\t<button x-show="query.length > 0" @click="query = \'\'" class="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs cursor-pointer">&times;</button>\n</div>',
  },
  {
    abbr: 'xalert',
    title: 'Dismissible Alert',
    category: 'Feedback',
    description: 'Alert message banner with dismissal animation',
    snippet:
      '<div x-data="{ show: true }" x-show="show" x-transition class="p-3.5 rounded-xl bg-[#fa6432]/15 border border-[#fa6432]/40 text-slate-100 flex items-center justify-between text-xs">\n\t<div class="flex items-center gap-2">\n\t\t<span class="text-[#fa6432] font-bold">● Alert:</span>\n\t\t<span>${1:Operation finished successfully!}</span>\n\t</div>\n\t<button @click="show = false" class="text-slate-400 hover:text-white cursor-pointer font-bold px-1">&times;</button>\n</div>',
  },
  {
    abbr: 'xclipboard',
    title: 'Copy to Clipboard',
    category: 'Feedback',
    description: 'One-click copy button with timed success feedback indicator',
    snippet:
      '<div x-data="{ copied: false, text: \'https://thomasmore.be\' }" class="flex items-center gap-2 max-w-sm">\n\t<input type="text" x-model="text" readonly class="flex-1 px-3 py-1.5 bg-[#001c2b] border border-[#134661] rounded-lg text-xs text-slate-300 font-mono" />\n\t<button @click="navigator.clipboard.writeText(text); copied = true; setTimeout(() => copied = false, 2000)" class="px-3 py-1.5 bg-[#fa6432] hover:bg-[#ff8559] text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer">\n\t\t<span x-text="copied ? \'✓ Copied!\' : \'Copy\'"></span>\n\t</button>\n</div>',
  },
  {
    abbr: 'xfor',
    title: 'x-for Loop',
    category: 'Components',
    description: 'Standard Alpine template loop syntax with key attribute',
    snippet:
      '<template x-for="(${1:item}, ${2:index}) in ${3:items}" :key="${4:item.id}">\n\t<div x-text="${5:item.name}"></div>\n</template>',
  },
  {
    abbr: 'xdiv',
    title: 'x-data Wrapper',
    category: 'Components',
    description: 'Basic element wrapper with state object',
    snippet: '<div x-data="${1:{ open: false }}">\n\t${0}\n</div>',
  },
  {
    abbr: 'xboilerplate',
    title: 'HTML5 Starter Boilerplate',
    category: 'Boilerplate',
    description: 'Complete HTML document loaded with Tailwind v4 and Alpine.js',
    snippet:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8" />\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t<title>${1:Alpine App}</title>\n\t<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n\t<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>\n</head>\n<body class="bg-[#00141f] text-slate-100 min-h-screen p-6 font-sans">\n\t<div x-data="{ count: 0 }" class="max-w-md mx-auto p-6 bg-[#00283c] border border-[#134661] rounded-2xl shadow-xl text-center space-y-4">\n\t\t<h1 class="text-2xl font-black text-white mb-2">${2:Welcome to Alpine.js}</h1>\n\t\t<button @click="count++" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white font-bold rounded-xl transition active:scale-95 cursor-pointer">\n\t\t\tCount is: <span x-text="count"></span>\n\t\t</button>\n\t</div>\n</body>\n</html>',
  },
];

// Map of custom abbreviations for quick lookup
export const customEmmetSnippets: Record<string, string> = EMMET_SNIPPET_CATALOG.reduce(
  (acc, item) => {
    acc[item.abbr] = item.snippet;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Expand an Emmet abbreviation string into snippet-formatted HTML
 */
export function expandEmmetAbbreviation(abbr: string, asSnippet = true): string | null {
  // Check custom snippets first
  if (customEmmetSnippets[abbr]) {
    return customEmmetSnippets[abbr];
  }

  try {
    const config = asSnippet
      ? {
          options: {
            'output.indent': '  ',
            'output.newline': '\n',
            'output.field': (index: number, placeholder?: string) =>
              placeholder ? `\${${index}:${placeholder}}` : `\${${index}}`,
          },
        }
      : {
          options: {
            'output.indent': '  ',
            'output.newline': '\n',
          },
        };

    const expanded = expand(abbr, config);
    if (expanded && expanded !== abbr) {
      return expanded;
    }
  } catch (_err) {
    // Not a valid emmet abbreviation
    return null;
  }
  return null;
}

/**
 * Extract an abbreviation from a line at a given column.
 * Strictly guards against expanding inside existing tags, closing tags (</...), or after '>'.
 */
export function extractEmmetFromLine(
  line: string,
  column: number,
): { abbr: string; start: number; end: number } | null {
  const textBeforePos = line.slice(0, column);

  // 1. Don't expand if cursor is immediately after a closing tag '>' or '/>'
  if (textBeforePos.trim().endsWith('>') || textBeforePos.trim().endsWith('/>')) {
    return null;
  }

  // 2. Don't expand if cursor is inside an HTML attribute value (unmatched quotes)
  const quoteMatches = textBeforePos.match(/["']/g);
  if (quoteMatches && quoteMatches.length % 2 !== 0) {
    return null;
  }

  // 3. Don't expand if cursor is inside an opening tag or closing tag (<... or </...)
  // If the last '<' has no corresponding '>' before cursor position
  const lastOpen = textBeforePos.lastIndexOf('<');
  const lastClose = textBeforePos.lastIndexOf('>');
  if (lastOpen !== -1 && lastOpen > lastClose) {
    return null;
  }

  // 4. Try standard Emmet extraction
  try {
    const res = extract(line, column, { lookAhead: false, type: 'markup' });
    if (res?.abbreviation) {
      // Guard: abbreviation must not be preceded by '<' or '/' or '>'
      if (res.start > 0) {
        const charBefore = line[res.start - 1];
        if (charBefore === '<' || charBefore === '/' || charBefore === '>') {
          return null;
        }
      }
      return {
        abbr: res.abbreviation,
        start: res.start,
        end: res.end,
      };
    }
  } catch {
    // extraction failure
  }

  // 5. Fallback regex extraction for simple tags/classes like `div.flex>p*2` or `xbtn`
  const match = textBeforePos.match(/([a-zA-Z0-9_\-.:$#+*>[\]{}!@]+)$/);
  if (match?.[1]) {
    const abbr = match[1];
    const start = textBeforePos.length - abbr.length;
    // Guard: abbreviation must not be preceded by '<' or '/' or '>'
    if (start > 0) {
      const charBefore = textBeforePos[start - 1];
      if (charBefore === '<' || charBefore === '/' || charBefore === '>') {
        return null;
      }
    }
    return {
      abbr,
      start,
      end: textBeforePos.length,
    };
  }

  return null;
}

/**
 * Register Emmet completions and Tab key expansion in Monaco
 */
export function registerEmmetInMonaco(monaco: Monaco, editor: any) {
  // 1. Register Action for "Emmet: Expand Abbreviation"
  editor.addAction({
    id: 'emmet.expandAbbreviation',
    label: 'Emmet: Expand Abbreviation',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE],
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 1.5,
    run: (ed: any) => {
      expandCurrentAbbreviation(ed, monaco);
    },
  });

  // 2. Tab key integration: expand Emmet if cursor is directly after an abbreviation
  // Only trigger when suggest widget is NOT visible
  editor.addCommand(
    monaco.KeyCode.Tab,
    () => {
      const expanded = expandCurrentAbbreviation(editor, monaco);
      if (!expanded) {
        // Fallback: standard tab indentation
        editor.trigger('keyboard', 'tab', null);
      }
    },
    '!suggestWidgetVisible && !inSnippetMode',
  );
}

/**
 * Executes expansion of abbreviation right before cursor in editor
 */
export function expandCurrentAbbreviation(editor: any, monaco: Monaco): boolean {
  if (!editor) return false;

  const position = editor.getPosition();
  if (!position) return false;

  const model = editor.getModel();
  if (!model) return false;

  const selection = editor.getSelection();
  // Don't expand if user has a non-empty selection range
  if (selection && !selection.isEmpty()) {
    return false;
  }

  const lineContent = model.getLineContent(position.lineNumber);
  const extracted = extractEmmetFromLine(lineContent, position.column - 1);
  if (!extracted) return false;

  const expandedSnippet = expandEmmetAbbreviation(extracted.abbr, true);
  if (!expandedSnippet) return false;

  // Replace abbreviation with expanded snippet
  const range = new monaco.Range(
    position.lineNumber,
    extracted.start + 1,
    position.lineNumber,
    extracted.end + 1,
  );

  // Use Monaco's snippet controller to insert with full tabstop navigation!
  const snippetController = editor.getContribution('snippetController2');
  if (snippetController && typeof snippetController.insert === 'function') {
    editor.executeEdits('emmet', [{ range, text: '' }]);
    snippetController.insert(expandedSnippet);
  } else {
    // Fallback if snippetController not directly exposed
    editor.executeEdits('emmet', [
      { range, text: expandedSnippet.replace(/\$\{\d+:?([^}]*)\}/g, '$1').replace(/\$\d+/g, '') },
    ]);
  }

  return true;
}
