import type { Monaco } from '@monaco-editor/react';
import { emmetHTML } from 'emmet-monaco-es';
import { customEmmetSnippets, expandEmmetAbbreviation, extractEmmetFromLine } from './emmetHelper';

let isConfigured = false;

const PALETTE_COLORS = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];
const PALETTE_SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const COLOR_CLASSES: string[] = [
  'bg-white',
  'bg-black',
  'bg-transparent',
  'bg-current',
  'bg-inherit',
  'bg-[#00283c]',
  'bg-[#001c2b]',
  'bg-[#0b384f]',
  'bg-[#134661]',
  'bg-[#fa6432]',
  'bg-[#e25325]',
  'text-white',
  'text-black',
  'text-transparent',
  'text-current',
  'text-inherit',
  'text-[#00283c]',
  'text-[#fa6432]',
  'text-[#e25325]',
  'border-transparent',
  'border-white',
  'border-black',
  'border-current',
  'border-[#134661]',
  'border-[#fa6432]',
  'ring-transparent',
  'ring-white',
  'ring-black',
  'ring-[#fa6432]',
];

for (const color of PALETTE_COLORS) {
  for (const shade of PALETTE_SHADES) {
    COLOR_CLASSES.push(`bg-${color}-${shade}`);
    COLOR_CLASSES.push(`text-${color}-${shade}`);
    COLOR_CLASSES.push(`border-${color}-${shade}`);
    COLOR_CLASSES.push(`ring-${color}-${shade}`);
  }
}

const BASE_TAILWIND_CLASSES = Array.from(
  new Set([
    // Layout & Display
    'flex',
    'inline-flex',
    'grid',
    'hidden',
    'block',
    'inline-block',
    'inline',
    'items-center',
    'items-start',
    'items-end',
    'items-baseline',
    'items-stretch',
    'justify-between',
    'justify-center',
    'justify-end',
    'justify-start',
    'justify-around',
    'justify-evenly',
    'flex-col',
    'flex-row',
    'flex-col-reverse',
    'flex-row-reverse',
    'flex-wrap',
    'flex-nowrap',
    'flex-1',
    'flex-auto',
    'flex-none',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-12',
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-6',
    'col-span-full',
    'gap-0.5',
    'gap-1',
    'gap-1.5',
    'gap-2',
    'gap-2.5',
    'gap-3',
    'gap-4',
    'gap-5',
    'gap-6',
    'gap-8',
    'gap-10',
    'gap-12',
    // Positioning
    'relative',
    'absolute',
    'fixed',
    'sticky',
    'inset-0',
    'top-0',
    'bottom-0',
    'left-0',
    'right-0',
    'z-10',
    'z-20',
    'z-30',
    'z-40',
    'z-50',
    // Sizing
    'w-full',
    'w-auto',
    'w-screen',
    'w-fit',
    'w-1/2',
    'w-1/3',
    'w-2/3',
    'w-1/4',
    'w-3/4',
    'w-4',
    'w-5',
    'w-6',
    'w-8',
    'w-10',
    'w-12',
    'w-16',
    'w-20',
    'w-24',
    'w-32',
    'w-48',
    'w-64',
    'max-w-xs',
    'max-w-sm',
    'max-w-md',
    'max-w-lg',
    'max-w-xl',
    'max-w-2xl',
    'max-w-3xl',
    'max-w-4xl',
    'max-w-5xl',
    'max-w-6xl',
    'max-w-7xl',
    'max-w-full',
    'h-full',
    'h-screen',
    'h-auto',
    'h-fit',
    'h-4',
    'h-5',
    'h-6',
    'h-8',
    'h-10',
    'h-12',
    'h-16',
    'h-20',
    'h-24',
    'h-32',
    'min-h-[200px]',
    'min-h-[300px]',
    'min-h-screen',
    'min-w-0',
    // Spacing (Padding & Margin)
    'p-1',
    'p-1.5',
    'p-2',
    'p-2.5',
    'p-3',
    'p-3.5',
    'p-4',
    'p-5',
    'p-6',
    'p-8',
    'p-10',
    'p-12',
    'px-2',
    'px-2.5',
    'px-3',
    'px-3.5',
    'px-4',
    'px-5',
    'px-6',
    'px-8',
    'py-0.5',
    'py-1',
    'py-1.5',
    'py-2',
    'py-2.5',
    'py-3',
    'py-4',
    'py-6',
    'm-auto',
    'mx-auto',
    'my-2',
    'my-4',
    'mt-1',
    'mt-2',
    'mt-3',
    'mt-4',
    'mt-6',
    'mt-8',
    'mb-1',
    'mb-2',
    'mb-3',
    'mb-4',
    'mb-6',
    'space-y-1',
    'space-y-2',
    'space-y-3',
    'space-y-4',
    'space-y-6',
    'space-x-1',
    'space-x-2',
    'space-x-3',
    'space-x-4',
    // Borders, Outlines & Rings
    'border',
    'border-2',
    'border-4',
    'border-t',
    'border-b',
    'border-l',
    'border-r',
    'rounded-none',
    'rounded-xs',
    'rounded-sm',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-full',
    'ring-1',
    'ring-2',
    'ring-4',
    'ring-offset-2',
    'outline-none',
    // Shadows & Effects
    'shadow-xs',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-none',
    'opacity-0',
    'opacity-25',
    'opacity-50',
    'opacity-75',
    'opacity-100',
    'backdrop-blur-xs',
    'backdrop-blur-sm',
    'backdrop-blur-md',
    // Typography
    'font-sans',
    'font-mono',
    'font-serif',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-extrabold',
    'font-black',
    'text-[10px]',
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
    'leading-none',
    'leading-tight',
    'leading-snug',
    'leading-normal',
    'leading-relaxed',
    'uppercase',
    'lowercase',
    'capitalize',
    'truncate',
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
    // Transitions & Transforms
    'transition',
    'transition-all',
    'transition-colors',
    'transition-opacity',
    'transition-transform',
    'duration-75',
    'duration-100',
    'duration-150',
    'duration-200',
    'duration-300',
    'duration-500',
    'duration-700',
    'duration-1000',
    'ease-linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'scale-90',
    'scale-95',
    'scale-100',
    'scale-105',
    'scale-110',
    'rotate-0',
    'rotate-45',
    'rotate-90',
    'rotate-180',
    'cursor-pointer',
    'cursor-not-allowed',
    'select-none',
    'overflow-hidden',
    'overflow-y-auto',
    'overflow-x-auto',
    // Tailwind v4 Features
    '@container',
    '@variant',
    'bg-linear-to-r',
    'bg-linear-to-b',
    'grid-cols-subgrid',
    ...COLOR_CLASSES,
  ]),
);

const TAILWIND_VARIANTS = [
  { prefix: 'dark:', detail: 'Dark mode variant' },
  { prefix: 'hover:', detail: 'Hover state variant' },
  { prefix: 'focus:', detail: 'Focus state variant' },
  { prefix: 'focus-within:', detail: 'Focus within variant' },
  { prefix: 'focus-visible:', detail: 'Focus visible variant' },
  { prefix: 'active:', detail: 'Active state variant' },
  { prefix: 'disabled:', detail: 'Disabled state variant' },
  { prefix: 'group-hover:', detail: 'Group hover variant' },
  { prefix: 'peer-focus:', detail: 'Peer focus variant' },
  { prefix: 'sm:', detail: 'Responsive small breakpoint (>= 640px)' },
  { prefix: 'md:', detail: 'Responsive medium breakpoint (>= 768px)' },
  { prefix: 'lg:', detail: 'Responsive large breakpoint (>= 1024px)' },
  { prefix: 'xl:', detail: 'Responsive extra large breakpoint (>= 1280px)' },
  { prefix: '2xl:', detail: 'Responsive 2x large breakpoint (>= 1536px)' },
  { prefix: 'first:', detail: 'First child variant' },
  { prefix: 'last:', detail: 'Last child variant' },
  { prefix: 'odd:', detail: 'Odd child variant' },
  { prefix: 'even:', detail: 'Even child variant' },
];

const COMMON_DARK_CLASSES = [
  'bg-slate-800',
  'bg-slate-900',
  'bg-slate-950',
  'bg-gray-800',
  'bg-gray-900',
  'bg-zinc-800',
  'bg-zinc-900',
  'text-white',
  'text-slate-100',
  'text-slate-200',
  'text-slate-300',
  'text-slate-400',
  'text-gray-100',
  'text-gray-200',
  'text-gray-300',
  'border-slate-700',
  'border-slate-800',
  'border-gray-700',
  'border-gray-800',
  'border-zinc-700',
  'border-zinc-800',
];

export function setupMonacoAlpine(monaco: Monaco) {
  if (isConfigured) return;
  isConfigured = true;

  // Initialize emmet-monaco-es integration safely
  try {
    emmetHTML(monaco as any, ['html']);
  } catch (err) {
    console.warn('emmet-monaco-es init fallback:', err);
  }

  // Ensure HTML5 suggestions are enabled in Monaco
  try {
    if ((monaco.languages as any).html?.htmlDefaults) {
      (monaco.languages as any).html.htmlDefaults.setOptions({
        suggest: { html5: true },
      });
    }
  } catch (_err) {
    // optional
  }

  // Define custom Thomas More Monaco Theme
  monaco.editor.defineTheme('tm-navy', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'tag', foreground: 'fa6432', fontStyle: 'bold' },
      { token: 'attribute.name', foreground: 'ff8559' },
      { token: 'attribute.value', foreground: '7dd3fc' },
      { token: 'string', foreground: '86efac' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'delimiter', foreground: '94a3b8' },
    ],
    colors: {
      'editor.background': '#001a27',
      'editor.foreground': '#f1f5f9',
      'editorCursor.foreground': '#fa6432',
      'editor.lineHighlightBackground': '#0b384f55',
      'editorLineNumber.foreground': '#33627a',
      'editorLineNumber.activeForeground': '#fa6432',
      'editorIndentGuide.background': '#0b384f',
      'editorIndentGuide.activeBackground': '#134661',
      'editor.selectionBackground': '#fa643233',
    },
  });

  // Alpine directive hover hints documentation
  const alpineDirectives: Record<string, { desc: string; example: string }> = {
    'x-data': {
      desc: 'Declares a new Alpine component scope and provides reactive data.',
      example: '<div x-data="{ count: 0, open: false }">...</div>',
    },
    'x-init': {
      desc: 'Executes JavaScript expressions as soon as Alpine initializes the component.',
      example: '<div x-data x-init="console.log(\'Component loaded!\')">...</div>',
    },
    'x-show': {
      desc: 'Toggles the element visibility using CSS display: none without unmounting.',
      example: '<div x-show="open" x-transition>Content appears when open is true</div>',
    },
    'x-bind': {
      desc: 'Sets HTML attributes dynamically. Shorthand syntax is `:` (e.g. :class, :disabled).',
      example:
        '<button :disabled="isLoading" :class="isActive ? \'bg-orange-500\' : \'bg-slate-200\'">Submit</button>',
    },
    'x-on': {
      desc: 'Attaches an event listener to the element. Shorthand is `@` (e.g. @click, @keydown).',
      example: '<button @click="count++" @click.outside="open = false">Click me</button>',
    },
    'x-text': {
      desc: 'Sets the inner text content of an element reactively.',
      example: '<span x-text="studentName"></span>',
    },
    'x-html': {
      desc: 'Sets the inner HTML of an element reactively. Use with caution for trusted content.',
      example: '<div x-html="renderedMarkdown"></div>',
    },
    'x-model': {
      desc: 'Two-way binds form inputs (text, select, checkbox, radio) to a reactive variable.',
      example: '<input type="text" x-model="searchQuery" />',
    },
    'x-for': {
      desc: 'Loops over an array of items. Must be declared on a <template> tag with a :key.',
      example:
        '<template x-for="(item, index) in items" :key="item.id">\n  <li x-text="item.name"></li>\n</template>',
    },
    'x-transition': {
      desc: 'Applies smooth enter and leave transitions using CSS classes or duration modifiers.',
      example:
        '<div x-show="open"\n  x-transition:enter="transition ease-out duration-300"\n  x-transition:enter-start="opacity-0 scale-90"\n  x-transition:enter-end="opacity-100 scale-100">\n</div>',
    },
    'x-effect': {
      desc: 'Runs a reactive callback whenever any dependencies inside it change.',
      example: '<div x-effect="console.log(\'Counter changed to:\', count)"></div>',
    },
    'x-ref': {
      desc: 'Marks a DOM element so it can be referenced inside the component via $refs.name.',
      example:
        '<input x-ref="usernameInput" />\n<button @click="$refs.usernameInput.focus()">Focus</button>',
    },
    'x-cloak': {
      desc: 'Hides element before Alpine finishes initialization to prevent flickering un-styled DOM.',
      example: '<div x-cloak x-show="open">...</div>',
    },
    'x-teleport': {
      desc: 'Teleports a template content into another target element in the document.',
      example: '<template x-teleport="body"><div class="modal">...</div></template>',
    },
    'x-id': {
      desc: 'Generates scoped unique IDs for accessible form inputs and labels.',
      example:
        '<div x-id="[\'text-input\']">\n  <label :for="$id(\'text-input\')">Email</label>\n  <input :id="$id(\'text-input\')" />\n</div>',
    },
  };

  const alpineMagics: Record<string, { desc: string; example: string }> = {
    $el: {
      desc: 'Retrieves the current component root DOM element.',
      example: 'console.log($el.tagName);',
    },
    $refs: {
      desc: 'Object holding references to all elements marked with x-ref in this component.',
      example: '$refs.myInput.focus();',
    },
    $event: {
      desc: 'The native browser Event object in any x-on listener.',
      example: '@click="handleClick($event)"',
    },
    $dispatch: {
      desc: 'Dispatches a custom browser event that bubbles up the DOM tree.',
      example: "$dispatch('custom-event', { id: 42 })",
    },
    $nextTick: {
      desc: 'Executes a callback function after Alpine has completed DOM re-renders.',
      example: "$nextTick(() => { console.log('DOM updated!'); });",
    },
    $watch: {
      desc: 'Watches a component property and executes a function whenever it changes.',
      example: "$watch('count', value => console.log('New count:', value))",
    },
    $store: {
      desc: "Accesses global shared state stores registered with Alpine.store('name', ...).",
      example: '<span x-text="$store.cart.total"></span>',
    },
    $root: {
      desc: 'Retrieves the root element of the active Alpine component scope.',
      example: 'console.log($root);',
    },
    $data: {
      desc: 'Retrieves the current reactive data object for this Alpine component.',
      example: 'console.log($data);',
    },
  };

  // Register HTML Completion Provider for Alpine, Tailwind & Emmet
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: [
      'x',
      '$',
      '@',
      ':',
      ' ',
      '!',
      '.',
      '>',
      '+',
      '*',
      '^',
      '[',
      '{',
      '-',
      '<',
      '"',
      "'",
      'c',
    ],
    provideCompletionItems: (model, position) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: any[] = [];

      // Check if cursor is typing inside class="..." or :class="..."
      const isInsideClassAttr =
        /(?:^|\s):?class\s*=\s*["'][^"']*$/.test(textUntilPosition) ||
        /:class\s*=\s*["'][^"']*['"][^"']*$/.test(textUntilPosition) ||
        /:class="[^"]*`[^`]*$/.test(textUntilPosition) ||
        /:class="\{[^}]*['"][^'"]*$/.test(textUntilPosition);

      if (isInsideClassAttr) {
        // Extract the specific class token being typed (supports hyphens and modifiers)
        const classTokenMatch = textUntilPosition.match(/([a-zA-Z0-9_\-@:/#![\]]+)$/);
        const currentToken = classTokenMatch ? classTokenMatch[1] : '';
        const classRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: currentToken ? position.column - currentToken.length : position.column,
          endColumn: position.column,
        };

        const lastColonIndex = currentToken.lastIndexOf(':');

        if (lastColonIndex !== -1) {
          // Token includes a variant prefix (e.g. 'dark:', 'dark:text-', 'hover:', 'md:')
          const variantPrefix = currentToken.substring(0, lastColonIndex + 1);

          BASE_TAILWIND_CLASSES.forEach((cls) => {
            if (cls.includes(':')) return;
            const fullClass = `${variantPrefix}${cls}`;
            suggestions.push({
              label: fullClass,
              kind: monaco.languages.CompletionItemKind.Value,
              detail: `${variantPrefix} Tailwind CSS v4 class`,
              documentation: `Tailwind CSS v4 utility class: \`${fullClass}\``,
              insertText: fullClass,
              range: classRange,
              sortText: `00_${cls}`,
              filterText: fullClass,
            });
          });
        } else {
          // No colon typed yet: offer variant prefixes, base classes, and dark: preview classes
          TAILWIND_VARIANTS.forEach((v, idx) => {
            suggestions.push({
              label: v.prefix,
              kind: monaco.languages.CompletionItemKind.Keyword,
              detail: v.detail,
              documentation: `Tailwind CSS variant prefix: \`${v.prefix}\`\n\nType \`${v.prefix}\` followed by any utility class.`,
              insertText: v.prefix,
              range: classRange,
              sortText: `0000_${String(idx).padStart(2, '0')}_${v.prefix}`,
              filterText: v.prefix,
              command: { id: 'editor.action.triggerSuggest', title: 'Trigger Suggest' },
            });
          });

          // High frequency dark mode classes for direct typing without colon
          COMMON_DARK_CLASSES.forEach((cls) => {
            const darkCls = `dark:${cls}`;
            suggestions.push({
              label: darkCls,
              kind: monaco.languages.CompletionItemKind.Value,
              detail: 'Tailwind CSS v4 dark mode class',
              documentation: `Tailwind CSS v4 utility class: \`${darkCls}\``,
              insertText: darkCls,
              range: classRange,
              sortText: `0050_${darkCls}`,
              filterText: darkCls,
            });
          });

          BASE_TAILWIND_CLASSES.forEach((cls) => {
            suggestions.push({
              label: cls,
              kind: monaco.languages.CompletionItemKind.Value,
              detail: 'Tailwind CSS v4 class',
              documentation: `Tailwind CSS v4 utility class: \`${cls}\``,
              insertText: cls,
              range: classRange,
              sortText: `0100_${cls}`,
              filterText: cls,
            });
          });
        }

        return { suggestions };
      }

      // Check character immediately before current word
      const charBefore = word.startColumn > 1 ? lineContent.charAt(word.startColumn - 2) : '';

      // 1. STANDARD HTML ATTRIBUTES (With Top Priority for 'class')
      const standardHtmlAttributes = [
        {
          name: 'class',
          detail: 'class="" (Tailwind CSS classes)',
          desc: 'Primary HTML class attribute. Use with Tailwind CSS utility classes.',
          insert: 'class="$1"',
          sortText: '0000_class', // Highest priority so typing 'cl' matches class first!
          filterText: 'class',
        },
        {
          name: ':class',
          detail: 'Alpine dynamic :class binding',
          desc: 'Dynamically toggle or evaluate CSS classes with Alpine expressions (:class="...").',
          insert: charBefore === ':' ? 'class="$1"' : ':class="$1"',
          sortText: '0001_:class',
          filterText: ':class class',
        },
        {
          name: 'id',
          detail: 'Unique element identifier',
          desc: 'Standard HTML id attribute.',
          insert: 'id="$1"',
          sortText: '0010_id',
        },
        {
          name: ':id',
          detail: 'Alpine dynamic :id binding',
          desc: 'Dynamically bind element ID.',
          insert: charBefore === ':' ? 'id="$1"' : ':id="$1"',
          sortText: '0011_:id',
        },
        {
          name: 'style',
          detail: 'Inline CSS styling',
          desc: 'Standard HTML inline style attribute.',
          insert: 'style="$1"',
          sortText: '0012_style',
        },
        {
          name: ':style',
          detail: 'Alpine dynamic :style binding',
          desc: "Dynamically bind CSS style expressions (e.g. :style=\"'width:' + pct + '%'\").",
          insert: charBefore === ':' ? 'style="$1"' : ':style="$1"',
          sortText: '0013_:style',
        },
        {
          name: ':key',
          detail: 'Alpine list item key (for x-for)',
          desc: 'Unique key attribute required for Alpine x-for template items.',
          insert: charBefore === ':' ? 'key="$1"' : ':key="$1"',
          sortText: '0014_:key',
        },
        {
          name: 'type',
          detail: 'Input or button type',
          desc: 'HTML element type (e.g., button, text, checkbox, submit).',
          insert: 'type="$1"',
          sortText: '0015_type',
        },
        {
          name: 'placeholder',
          detail: 'Input placeholder text',
          desc: 'Short hint that describes the expected value of an input field.',
          insert: 'placeholder="$1"',
          sortText: '0016_placeholder',
        },
        {
          name: 'name',
          detail: 'Form control name',
          desc: 'Name of the form control used when submitting forms.',
          insert: 'name="$1"',
          sortText: '0017_name',
        },
        {
          name: 'value',
          detail: 'Element value attribute',
          desc: 'Value of an input, option, or button.',
          insert: 'value="$1"',
          sortText: '0018_value',
        },
        {
          name: ':value',
          detail: 'Alpine dynamic value binding',
          desc: 'Binds dynamic value expression.',
          insert: charBefore === ':' ? 'value="$1"' : ':value="$1"',
          sortText: '0019_:value',
        },
        {
          name: 'href',
          detail: 'Hyperlink destination',
          desc: 'URL or anchor target for links.',
          insert: 'href="$1"',
          sortText: '0020_href',
        },
        {
          name: ':href',
          detail: 'Alpine dynamic href binding',
          desc: 'Dynamic URL destination.',
          insert: charBefore === ':' ? 'href="$1"' : ':href="$1"',
          sortText: '0021_:href',
        },
        {
          name: 'src',
          detail: 'Media resource URL',
          desc: 'Source address of an image or audio/video element.',
          insert: 'src="$1"',
          sortText: '0022_src',
        },
        {
          name: ':src',
          detail: 'Alpine dynamic src binding',
          desc: 'Dynamic image or media source URL.',
          insert: charBefore === ':' ? 'src="$1"' : ':src="$1"',
          sortText: '0023_:src',
        },
        {
          name: 'alt',
          detail: 'Alternative text description',
          desc: 'Accessible text description for images.',
          insert: 'alt="$1"',
          sortText: '0024_alt',
        },
        {
          name: 'title',
          detail: 'Advisory title text',
          desc: 'Title tooltip text for elements.',
          insert: 'title="$1"',
          sortText: '0025_title',
        },
        {
          name: 'disabled',
          detail: 'Disables user interaction',
          desc: 'Standard HTML disabled boolean attribute.',
          insert: 'disabled',
          sortText: '0026_disabled',
        },
        {
          name: ':disabled',
          detail: 'Alpine dynamic disabled state',
          desc: 'Conditionally disable buttons or inputs (:disabled="isLoading").',
          insert: charBefore === ':' ? 'disabled="$1"' : ':disabled="$1"',
          sortText: '0027_:disabled',
        },
        {
          name: 'required',
          detail: 'Requires input value before submit',
          desc: 'HTML required boolean attribute.',
          insert: 'required',
          sortText: '0028_required',
        },
        {
          name: 'checked',
          detail: 'Checkbox or radio checked state',
          desc: 'Standard checked attribute.',
          insert: 'checked',
          sortText: '0029_checked',
        },
        {
          name: 'role',
          detail: 'ARIA accessibility role',
          desc: 'Defines purpose of an element (e.g., button, dialog, alert).',
          insert: 'role="$1"',
          sortText: '0030_role',
        },
        {
          name: 'aria-label',
          detail: 'ARIA accessibility label',
          desc: 'Accessible label for screen readers.',
          insert: 'aria-label="$1"',
          sortText: '0031_aria-label',
        },
      ];

      standardHtmlAttributes.forEach((attr) => {
        suggestions.push({
          label: attr.name,
          kind: monaco.languages.CompletionItemKind.Property,
          detail: attr.detail,
          documentation: {
            value: `**${attr.name}**\n\n${attr.desc}`,
          },
          insertText: attr.insert,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: attr.sortText,
          filterText: attr.filterText || attr.name,
        });
      });

      // 2. Emmet Abbreviation Expansion suggestion
      const extracted = extractEmmetFromLine(lineContent, position.column - 1);
      if (extracted && extracted.abbr.trim().length > 0) {
        const expandedSnippet = expandEmmetAbbreviation(extracted.abbr, true);
        if (expandedSnippet) {
          const cleanPreview = expandedSnippet
            .replace(/\$\{\d+:?([^}]*)\}/g, '$1')
            .replace(/\$\d+/g, '');

          suggestions.push({
            label: extracted.abbr,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: 'Emmet Abbreviation (Tab to expand)',
            documentation: {
              value: `**Emmet Abbreviation**\n\n\`\`\`html\n${cleanPreview}\n\`\`\``,
            },
            insertText: expandedSnippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: extracted.start + 1,
              endColumn: extracted.end + 1,
            },
            sortText: '0005',
          });
        }
      }

      // 3. Custom Alpine Snippets
      Object.entries(customEmmetSnippets).forEach(([abbr, snippet]) => {
        const cleanPreview = snippet.replace(/\$\{\d+:?([^}]*)\}/g, '$1').replace(/\$\d+/g, '');
        suggestions.push({
          label: abbr,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: 'Alpine Snippet',
          documentation: {
            value: `**Alpine Snippet (\`${abbr}\`)**\n\n\`\`\`html\n${cleanPreview}\n\`\`\``,
          },
          insertText: snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: '0006',
        });
      });

      // 4. Alpine Directives
      Object.entries(alpineDirectives).forEach(([name, data]) => {
        // x-cloak has lower sortText so it never overrides 'class' when typing 'cl'
        const directiveSort = name === 'x-cloak' ? '0200_x-cloak' : `0100_${name}`;
        suggestions.push({
          label: name,
          kind: monaco.languages.CompletionItemKind.Property,
          detail: 'Alpine.js Directive',
          documentation: {
            value: `**${name}**\n\n${data.desc}\n\n\`\`\`html\n${data.example}\n\`\`\``,
          },
          insertText: `${name}="$1"`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: directiveSort,
          filterText: name,
        });
      });

      // 5. Shorthand Events (@click, @keydown, etc.)
      const commonEvents = [
        'click',
        'click.outside',
        'click.prevent',
        'click.stop',
        'input',
        'change',
        'submit.prevent',
        'keydown.escape',
        'keydown.enter',
        'keydown.arrow-up',
        'keydown.arrow-down',
        'scroll.window',
        'resize.window',
      ];
      commonEvents.forEach((evt) => {
        suggestions.push({
          label: `@${evt}`,
          kind: monaco.languages.CompletionItemKind.Event,
          detail: `Alpine @${evt} event listener`,
          documentation: `Shorthand for x-on:${evt}`,
          insertText: charBefore === '@' ? `${evt}="$1"` : `@${evt}="$1"`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: `0150_@${evt}`,
        });
      });

      // 6. Alpine Magics ($refs, $dispatch, etc.)
      Object.entries(alpineMagics).forEach(([magic, data]) => {
        suggestions.push({
          label: magic,
          kind: monaco.languages.CompletionItemKind.Variable,
          detail: 'Alpine.js Magic Property',
          documentation: {
            value: `**${magic}**\n\n${data.desc}\n\n\`\`\`js\n${data.example}\n\`\`\``,
          },
          insertText: magic,
          range,
          sortText: `0300_${magic}`,
        });
      });

      return { suggestions };
    },
  });

  // Register Hover Documentation Provider
  monaco.languages.registerHoverProvider('html', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const lineContent = model.getLineContent(position.lineNumber);
      const text = word.word;

      // Check for x-* directives
      for (const [dir, data] of Object.entries(alpineDirectives)) {
        if (lineContent.includes(dir) && (text === dir || lineContent.includes(`${dir}="`))) {
          const colIndex = lineContent.indexOf(dir);
          if (position.column >= colIndex && position.column <= colIndex + dir.length + 2) {
            return {
              range: new monaco.Range(
                position.lineNumber,
                colIndex + 1,
                position.lineNumber,
                colIndex + dir.length + 1,
              ),
              contents: [
                { value: `**Alpine.js: \`${dir}\`**` },
                { value: data.desc },
                { value: `\`\`\`html\n${data.example}\n\`\`\`` },
              ],
            };
          }
        }
      }

      // Check for $ magics
      for (const [magic, data] of Object.entries(alpineMagics)) {
        if (text === magic.replace('$', '') || lineContent.includes(magic)) {
          const colIndex = lineContent.indexOf(magic);
          if (
            colIndex !== -1 &&
            position.column >= colIndex &&
            position.column <= colIndex + magic.length + 2
          ) {
            return {
              range: new monaco.Range(
                position.lineNumber,
                colIndex + 1,
                position.lineNumber,
                colIndex + magic.length + 1,
              ),
              contents: [
                { value: `**Alpine Magic: \`${magic}\`**` },
                { value: data.desc },
                { value: `\`\`\`javascript\n${data.example}\n\`\`\`` },
              ],
            };
          }
        }
      }

      return null;
    },
  });
}
