import type { Monaco } from '@monaco-editor/react';
import expand, { extract } from 'emmet';

export interface EmmetSnippetItem {
  abbr: string;
  title: string;
  category:
    | 'Components'
    | 'Interactive'
    | 'Navigation'
    | 'Forms'
    | 'Feedback'
    | 'Plugins'
    | 'Boilerplate';
  description: string;
  snippet: string;
}

// Catalog of curated Alpine.js 3.x + Tailwind CSS v4 snippets
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
    description: 'Ghost outline button with subtle border and dark mode support',
    snippet:
      '<button @click="${1:open = false}" class="px-4 py-2 bg-slate-100 dark:bg-[#0b384f] hover:bg-slate-200 dark:hover:bg-[#134661] text-slate-700 dark:text-slate-200 font-medium rounded-lg border border-slate-200 dark:border-[#134661] transition active:scale-95 cursor-pointer">\n\t${2:Cancel}\n</button>',
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
    description: 'Accessible boolean toggle switch with animated thumb',
    snippet:
      '<div x-data="{ enabled: false }" class="flex items-center gap-3">\n\t<button @click="enabled = !enabled" type="button" :class="enabled ? \'bg-[#fa6432]\' : \'bg-slate-300 dark:bg-[#0b384f]\'" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">\n\t\t<span :class="enabled ? \'translate-x-5\' : \'translate-x-0\'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out"></span>\n\t</button>\n\t<span class="text-sm font-medium text-slate-700 dark:text-slate-200" x-text="enabled ? \'Enabled\' : \'Disabled\'"></span>\n</div>',
  },
  {
    abbr: 'xdarkmode',
    title: 'Dark Mode Switcher',
    category: 'Interactive',
    description: 'Toggle dark class on document root element',
    snippet:
      '<div x-data="{ dark: document.documentElement.classList.contains(\'dark\') }">\n\t<button @click="dark = !dark; document.documentElement.classList.toggle(\'dark\', dark)" class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer">\n\t\t<span x-text="dark ? \'Switch to Light Mode\' : \'Switch to Dark Mode\'"></span>\n\t</button>\n</div>',
  },
  {
    abbr: 'xcounter',
    title: 'Interactive Counter Card',
    category: 'Components',
    description: 'Self-contained reactive card with increment, decrement, and reset',
    snippet:
      '<div x-data="{ count: 0 }" class="p-6 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl shadow-lg space-y-4 max-w-sm font-sans">\n\t<h3 class="text-lg font-bold text-slate-900 dark:text-white">Counter Component</h3>\n\t<p class="text-sm text-slate-600 dark:text-slate-300">Current count: <span class="font-bold text-[#fa6432]" x-text="count"></span></p>\n\t<div class="flex items-center gap-2">\n\t\t<button @click="count++" class="px-3 py-1.5 bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold rounded-lg transition active:scale-95 cursor-pointer">+ Increment</button>\n\t\t<button @click="if (count > 0) count--" class="px-3 py-1.5 bg-slate-100 dark:bg-[#0b384f] hover:bg-slate-200 dark:hover:bg-[#134661] text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg border border-slate-200 dark:border-[#134661] transition active:scale-95 cursor-pointer">- Decrement</button>\n\t\t<button @click="count = 0" class="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer">Reset</button>\n\t</div>\n</div>',
  },
  {
    abbr: 'xmodal',
    title: 'Dialog Modal',
    category: 'Navigation',
    description: 'Backdrop blur modal with click-outside dismissal and transition',
    snippet:
      '<div x-data="{ open: false }">\n\t<button @click="open = true" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold rounded-lg shadow-sm transition active:scale-95 cursor-pointer">Open Dialog</button>\n\t<div x-show="open" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0">\n\t\t<div @click.outside="open = false" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" class="bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">\n\t\t\t<div class="flex items-center justify-between">\n\t\t\t\t<h3 class="text-lg font-bold text-slate-900 dark:text-white">Modal Title</h3>\n\t\t\t\t<button @click="open = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg cursor-pointer">&times;</button>\n\t\t\t</div>\n\t\t\t<p class="text-slate-600 dark:text-slate-300 text-sm">This is an accessible modal component with smooth transitions and click-outside dismissal.</p>\n\t\t\t<div class="flex justify-end gap-2 pt-2">\n\t\t\t\t<button @click="open = false" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0b384f] text-slate-700 dark:text-slate-300 text-sm cursor-pointer">Cancel</button>\n\t\t\t\t<button @click="open = false" class="px-3 py-1.5 rounded-lg bg-[#fa6432] hover:bg-[#ff8559] text-white text-sm font-semibold cursor-pointer">Confirm</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xdropdown',
    title: 'Dropdown Menu',
    category: 'Navigation',
    description: 'Floating menu with chevron animation and click-outside closing',
    snippet:
      '<div x-data="{ open: false }" class="relative inline-block">\n\t<button @click="open = !open" class="px-4 py-2 bg-slate-100 dark:bg-[#0b384f] hover:bg-slate-200 dark:hover:bg-[#134661] border border-slate-200 dark:border-[#134661] rounded-lg text-slate-800 dark:text-white text-sm font-medium flex items-center gap-2 cursor-pointer transition">\n\t\t<span>Options Menu</span>\n\t\t<span :class="open ? \'rotate-180\' : \'\'" class="transition-transform duration-200 text-xs">&#9662;</span>\n\t</button>\n\t<div x-show="open" @click.outside="open = false" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" class="absolute left-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] shadow-2xl p-1.5 z-20">\n\t\t<a href="#" class="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0b384f] rounded-lg transition">Edit Profile</a>\n\t\t<a href="#" class="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0b384f] rounded-lg transition">Workspace Settings</a>\n\t\t<div class="my-1 border-t border-slate-200 dark:border-[#134661]"></div>\n\t\t<a href="#" class="block px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">Sign Out</a>\n\t</div>\n</div>',
  },
  {
    abbr: 'xtabs',
    title: 'Tabbed Panels',
    category: 'Navigation',
    description: 'Multi-tab content switcher with active line indicators',
    snippet:
      '<div x-data="{ tab: \'overview\' }" class="w-full max-w-md bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl p-4 shadow-sm">\n\t<div class="flex border-b border-slate-200 dark:border-[#134661] gap-2 pb-2">\n\t\t<button @click="tab = \'overview\'" :class="tab === \'overview\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Overview</button>\n\t\t<button @click="tab = \'features\'" :class="tab === \'features\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Features</button>\n\t\t<button @click="tab = \'settings\'" :class="tab === \'settings\' ? \'border-[#fa6432] text-[#fa6432]\' : \'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white\'" class="px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer">Settings</button>\n\t</div>\n\t<div class="pt-4 text-sm text-slate-600 dark:text-slate-300 min-h-[70px]">\n\t\t<div x-show="tab === \'overview\'" x-transition>Explore component stats and general metrics here.</div>\n\t\t<div x-show="tab === \'features\'" x-transition>Check out the full list of Alpine.js features.</div>\n\t\t<div x-show="tab === \'settings\'" x-transition>Customize your layout and preferences.</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xaccordion',
    title: 'Accordion / FAQ',
    category: 'Navigation',
    description: 'Expandable FAQ accordion item with smooth collapse',
    snippet:
      '<div x-data="{ active: null }" class="space-y-2 max-w-md">\n\t<div class="border border-slate-200 dark:border-[#134661] rounded-xl overflow-hidden bg-white dark:bg-[#00283c]">\n\t\t<button @click="active = (active === 1 ? null : 1)" class="w-full px-4 py-3 text-left font-semibold text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#0b384f] transition cursor-pointer">\n\t\t\t<span>What is Alpine.js?</span>\n\t\t\t<span :class="active === 1 ? \'rotate-180\' : \'\'" class="transition-transform duration-200 text-xs">&#9662;</span>\n\t\t</button>\n\t\t<div x-show="active === 1" x-collapse class="px-4 pb-3 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-[#134661]/40">\n\t\t\tAlpine is a rugged, minimal tool for composing behavior directly in your HTML.\n\t\t</div>\n\t</div>\n</div>',
  },
  {
    abbr: 'xtodo',
    title: 'Todo List App',
    category: 'Components',
    description: 'Full reactive todo app with add, strike-through, and remove features',
    snippet:
      '<div x-data="{ tasks: [{ id: 1, text: \'Master Alpine directives\', done: true }, { id: 2, text: \'Style with Tailwind v4\', done: false }], newTask: \'\' }" class="max-w-md bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl p-5 shadow-lg space-y-4">\n\t<h3 class="font-bold text-base text-slate-900 dark:text-white">Alpine Todo List</h3>\n\t<form @submit.prevent="if (newTask.trim()) { tasks.push({ id: Date.now(), text: newTask.trim(), done: false }); newTask = \'\'; }" class="flex gap-2">\n\t\t<input x-model="newTask" placeholder="Add a new task..." class="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#fa6432]" />\n\t\t<button type="submit" class="px-3 py-1.5 bg-[#fa6432] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#ff8559] transition">Add</button>\n\t</form>\n\t<ul class="space-y-1.5 max-h-48 overflow-y-auto">\n\t\t<template x-for="task in tasks" :key="task.id">\n\t\t\t<li class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#001c2b] border border-slate-100 dark:border-[#134661] text-xs">\n\t\t\t\t<label class="flex items-center gap-2 cursor-pointer">\n\t\t\t\t\t<input type="checkbox" x-model="task.done" class="accent-[#fa6432] rounded" />\n\t\t\t\t\t<span :class="task.done ? \'line-through text-slate-400\' : \'text-slate-700 dark:text-slate-200\'" x-text="task.text"></span>\n\t\t\t\t</label>\n\t\t\t\t<button @click="tasks = tasks.filter(t => t.id !== task.id)" class="text-slate-400 hover:text-red-500 cursor-pointer font-bold px-1">&times;</button>\n\t\t\t</li>\n\t\t</template>\n\t</ul>\n</div>',
  },
  {
    abbr: 'xfor:cards',
    title: 'Card Grid (x-for)',
    category: 'Components',
    description: 'Responsive multi-column card grid populated via template loop',
    snippet:
      '<div x-data="{ items: [{ id: 1, title: \'Alpine.js\', tag: \'JS\' }, { id: 2, title: \'Tailwind v4\', tag: \'CSS\' }, { id: 3, title: \'Thomas More\', tag: \'Lab\' }] }">\n\t<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">\n\t\t<template x-for="item in items" :key="item.id">\n\t\t\t<div class="p-4 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-xl hover:border-[#fa6432] transition shadow-xs">\n\t\t\t\t<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fa6432]/10 text-[#fa6432]" x-text="item.tag"></span>\n\t\t\t\t<h4 class="text-sm font-bold text-slate-900 dark:text-white mt-2" x-text="item.title"></h4>\n\t\t\t</div>\n\t\t</template>\n\t</div>\n</div>',
  },
  {
    abbr: 'xfilter',
    title: 'Live Search Filter',
    category: 'Components',
    description: 'Search input filtering an array of items in real time',
    snippet:
      '<div x-data="{ search: \'\', items: [\'Alpine.js\', \'Tailwind CSS\', \'Vite\', \'TypeScript\', \'HTML5\', \'PostCSS\'] }" class="max-w-sm p-4 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl space-y-3 font-sans">\n\t<input type="text" x-model="search" placeholder="Filter technologies..." class="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#fa6432]" />\n\t<ul class="space-y-1 max-h-40 overflow-y-auto">\n\t\t<template x-for="item in items.filter(i => i.toLowerCase().includes(search.toLowerCase()))" :key="item">\n\t\t\t<li class="p-2 rounded-lg bg-slate-50 dark:bg-[#001c2b] text-xs text-slate-800 dark:text-slate-200" x-text="item"></li>\n\t\t</template>\n\t</ul>\n</div>',
  },
  {
    abbr: 'xfetch',
    title: 'Async API Request',
    category: 'Components',
    description: 'Async data fetch with loading, error, and resolved states',
    snippet:
      '<div x-data="{ user: null, loading: false, error: null, async fetchUser() { this.loading = true; this.error = null; try { const res = await fetch(\'https://jsonplaceholder.typicode.com/users/1\'); this.user = await res.json(); } catch(e) { this.error = \'Failed to load user\'; } finally { this.loading = false; } } }" x-init="fetchUser()" class="p-5 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl max-w-sm text-xs space-y-3 font-sans">\n\t<div class="flex items-center justify-between">\n\t\t<span class="font-bold text-slate-900 dark:text-white text-sm">Async User Data</span>\n\t\t<button @click="fetchUser()" class="px-2.5 py-1 bg-[#fa6432] hover:bg-[#ff8559] text-white rounded-lg font-semibold cursor-pointer transition">Reload</button>\n\t</div>\n\t<div x-show="loading" class="text-slate-500">Loading user data...</div>\n\t<div x-show="error" class="text-red-500" x-text="error"></div>\n\t<div x-show="user && !loading" class="space-y-1">\n\t\t<p class="font-bold text-slate-800 dark:text-slate-100" x-text="user?.name"></p>\n\t\t<p class="text-slate-500 dark:text-slate-400" x-text="user?.email"></p>\n\t\t<p class="text-slate-500 dark:text-slate-400" x-text="user?.company?.name"></p>\n\t</div>\n</div>',
  },
  {
    abbr: 'xinput',
    title: 'Form Input (x-model)',
    category: 'Forms',
    description: 'Accessible labeled input field with two-way data binding',
    snippet:
      '<div class="space-y-1 max-w-sm font-sans">\n\t<label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">${1:Label}</label>\n\t<input type="${2:text}" x-model="${3:query}" placeholder="${4:Enter value...}" class="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#001c2b] border border-slate-300 dark:border-[#134661] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] text-sm transition" />\n</div>',
  },
  {
    abbr: 'xsearch',
    title: 'Search Bar with Clear',
    category: 'Forms',
    description: 'Search input with instant clear button',
    snippet:
      '<div x-data="{ query: \'\' }" class="relative max-w-sm font-sans">\n\t<input type="text" x-model="query" placeholder="Search..." class="w-full pl-4 pr-8 py-2 rounded-xl bg-white dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#fa6432] text-sm" />\n\t<button x-show="query.length > 0" @click="query = \'\'" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer font-bold px-1">&times;</button>\n</div>',
  },
  {
    abbr: 'xrating',
    title: 'Star Rating Input',
    category: 'Forms',
    description: 'Interactive 5-star rating control with hover feedback',
    snippet:
      '<div x-data="{ rating: 3, hover: 0 }" class="flex items-center gap-1 font-sans">\n\t<template x-for="star in [1, 2, 3, 4, 5]" :key="star">\n\t\t<button @click="rating = star" @mouseenter="hover = star" @mouseleave="hover = 0" class="text-xl transition cursor-pointer" :class="(hover || rating) >= star ? \'text-amber-400\' : \'text-slate-300 dark:text-slate-600\'">\n\t\t\t&#9733;\n\t\t</button>\n\t</template>\n\t<span class="ml-2 text-xs font-bold text-slate-600 dark:text-slate-300" x-text="rating + \' / 5\'"></span>\n</div>',
  },
  {
    abbr: 'xalert',
    title: 'Dismissible Alert',
    category: 'Feedback',
    description: 'Alert message banner with dismissal animation',
    snippet:
      '<div x-data="{ show: true }" x-show="show" x-transition class="p-3.5 rounded-xl bg-[#fa6432]/10 border border-[#fa6432]/30 text-slate-800 dark:text-slate-100 flex items-center justify-between text-xs font-sans">\n\t<div class="flex items-center gap-2">\n\t\t<span class="text-[#fa6432] font-bold">Alert:</span>\n\t\t<span>${1:Operation finished successfully!}</span>\n\t</div>\n\t<button @click="show = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer font-bold px-1">&times;</button>\n</div>',
  },
  {
    abbr: 'xclipboard',
    title: 'Copy to Clipboard',
    category: 'Feedback',
    description: 'One-click copy button with timed success feedback indicator',
    snippet:
      '<div x-data="{ copied: false, text: \'https://thomasmore.be\' }" class="flex items-center gap-2 max-w-sm font-sans">\n\t<input type="text" x-model="text" readonly class="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] rounded-lg text-xs text-slate-800 dark:text-slate-300 font-mono" />\n\t<button @click="navigator.clipboard.writeText(text); copied = true; setTimeout(() => copied = false, 2000)" class="px-3 py-1.5 bg-[#fa6432] hover:bg-[#ff8559] text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer">\n\t\t<span x-text="copied ? \'Copied!\' : \'Copy\'"></span>\n\t</button>\n</div>',
  },
  {
    abbr: 'xtoast',
    title: 'Toast Notification',
    category: 'Feedback',
    description: 'Timed bottom notification toast pop-up',
    snippet:
      '<div x-data="{ show: false, message: \'\' }" class="font-sans">\n\t<button @click="message = \'Action saved successfully!\'; show = true; setTimeout(() => show = false, 3000)" class="px-3.5 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white rounded-lg text-xs font-semibold cursor-pointer transition">Show Toast</button>\n\t<div x-show="show" x-cloak x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4" x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-4" class="fixed bottom-4 right-4 z-50 p-3 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl text-xs flex items-center gap-2">\n\t\t<span class="w-2 h-2 rounded-full bg-emerald-400"></span>\n\t\t<span x-text="message"></span>\n\t</div>\n</div>',
  },
  {
    abbr: 'xcollapse',
    title: 'Collapse Panel (@alpinejs/collapse)',
    category: 'Plugins',
    description: 'Smooth height transition using the official collapse plugin',
    snippet:
      '<div x-data="{ expanded: false }" class="max-w-sm p-4 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl font-sans">\n\t<button @click="expanded = !expanded" class="w-full text-left font-bold text-xs text-slate-900 dark:text-white flex justify-between items-center cursor-pointer">\n\t\t<span>Toggle Details</span>\n\t\t<span x-text="expanded ? \'-\' : \'+\'"></span>\n\t</button>\n\t<div x-show="expanded" x-collapse class="pt-3 text-xs text-slate-600 dark:text-slate-300">\n\t\tSmooth height transition powered by the official @alpinejs/collapse plugin.\n\t</div>\n</div>',
  },
  {
    abbr: 'xpersist',
    title: 'Persistent State (@alpinejs/persist)',
    category: 'Plugins',
    description: 'Auto-sync component state to browser localStorage',
    snippet:
      '<div x-data="{ count: $persist(0) }" class="p-4 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl max-w-sm space-y-2 text-xs font-sans">\n\t<h4 class="font-bold text-slate-900 dark:text-white">Persistent Counter</h4>\n\t<p class="text-slate-600 dark:text-slate-300">Saved in localStorage: <span class="font-bold text-[#fa6432]" x-text="count"></span></p>\n\t<button @click="count++" class="px-3 py-1.5 bg-[#fa6432] hover:bg-[#ff8559] text-white rounded font-semibold cursor-pointer transition">Increment & Save</button>\n</div>',
  },
  {
    abbr: 'xmask',
    title: 'Input Mask (@alpinejs/mask)',
    category: 'Plugins',
    description: 'Formatted input masking for telephone numbers or dates',
    snippet:
      '<div x-data="{ phone: \'\' }" class="space-y-1 max-w-xs text-xs font-sans">\n\t<label class="font-semibold text-slate-700 dark:text-slate-300">Mobile Phone</label>\n\t<input x-model="phone" x-mask="+32 499 99 99 99" placeholder="+32 4xx xx xx xx" class="w-full px-3 py-2 bg-white dark:bg-[#001c2b] border border-slate-200 dark:border-[#134661] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#fa6432]" />\n</div>',
  },
  {
    abbr: 'xintersect',
    title: 'Viewport Inview (@alpinejs/intersect)',
    category: 'Plugins',
    description: 'Trigger actions when an element enters the viewport',
    snippet:
      '<div x-data="{ shown: false }" x-intersect.once="shown = true" class="p-6 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl text-center space-y-2 font-sans">\n\t<h4 class="font-bold text-slate-900 dark:text-white">Intersect Trigger</h4>\n\t<p :class="shown ? \'text-emerald-500 font-bold\' : \'text-slate-400\'" class="text-xs" x-text="shown ? \'Element is visible in viewport!\' : \'Scroll into view to trigger...\'"></p>\n</div>',
  },
  {
    abbr: 'xboilerplate',
    title: 'HTML5 Starter Boilerplate',
    category: 'Boilerplate',
    description: 'Complete HTML document loaded with Tailwind v4 and Alpine.js',
    snippet:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8" />\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t<title>${1:Alpine App}</title>\n\t<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n\t<style type="text/tailwindcss">\n\t\t@custom-variant dark (&:where(.dark, .dark *));\n\t</style>\n\t<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>\n</head>\n<body class="bg-slate-50 dark:bg-[#00141f] text-slate-900 dark:text-slate-100 min-h-screen p-6 font-sans">\n\t<div x-data="{ count: 0 }" class="max-w-md mx-auto p-6 bg-white dark:bg-[#00283c] border border-slate-200 dark:border-[#134661] rounded-2xl shadow-xl text-center space-y-4">\n\t\t<h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">${2:Welcome to Alpine.js}</h1>\n\t\t<button @click="count++" class="px-4 py-2 bg-[#fa6432] hover:bg-[#ff8559] text-white font-bold rounded-xl transition active:scale-95 cursor-pointer">\n\t\t\tCount is: <span x-text="count"></span>\n\t\t</button>\n\t</div>\n</body>\n</html>',
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
  // 1. Register Action for "Emmet: Expand Abbreviation" in context menu
  editor.addAction({
    id: 'emmet.expandAbbreviation',
    label: 'Emmet: Expand Abbreviation',
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
function expandCurrentAbbreviation(editor: any, monaco: Monaco): boolean {
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
