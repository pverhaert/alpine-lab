import type { Snippet } from '../types';

export const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: 'lesson-01-counter',
    title: '01. State & Events (x-data, x-on, x-text)',
    description:
      'Learn foundational reactive state, increment/decrement events, and dynamic text output.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    tags: ['x-data', 'x-on', 'x-text', 'Reactivity'],
    isDefault: true,
    createdAt: Date.now() - 100000,
    updatedAt: Date.now() - 100000,
    code: `<!-- 
  ============================================================
  🎓 LESSON 01: STATE & EVENTS IN ALPINE.JS
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Core Directives introduced:
  • x-data  -> Initializes a component and defines reactive data.
  • x-text  -> Dynamically sets the innerText of an element.
  • x-on / @ -> Listens for native browser events (like clicks).
  • x-bind / : -> Dynamically binds HTML attributes or classes.
  ============================================================
-->

<div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-100 font-sans">
  <!-- Header Branding -->
  <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
    <div class="w-10 h-10 rounded-xl bg-[#fa6432]/10 text-[#fa6432] flex items-center justify-center font-bold text-lg">
      TM
    </div>
    <div>
      <h2 class="text-xl font-bold text-[#00283c]">Alpine.js Counter</h2>
      <p class="text-xs text-slate-500">Thomas More Interactive Coding Lab</p>
    </div>
  </div>

  <!--
    [ALPINE DIRECTIVE: x-data]
    • WHAT: Declares a new Alpine.js component scope and initializes reactive state.
    • WHY: Any child element inside this <div> can now read and modify 'count', 'step',
      or call functions like 'increment()' and 'reset()'.
    • HOW: Alpine wraps this object in a JavaScript Proxy. When any property changes,
      Alpine automatically re-renders only the elements that depend on that property.
  -->
  <div 
    x-data="{ 
      count: 0, 
      step: 1, 
      min: 0, 
      max: 20,
      increment() { 
        if (this.count + this.step <= this.max) this.count += this.step; 
      },
      decrement() { 
        if (this.count - this.step >= this.min) this.count -= this.step; 
      },
      reset() { 
        this.count = 0; 
      }
    }" 
    class="mt-6 space-y-6"
  >
    <!-- Counter Display Box -->
    <div class="text-center p-6 bg-slate-50 rounded-xl border border-slate-200/80">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Value</span>
      
      <!--
        [ALPINE DIRECTIVE: :class (shorthand for x-bind:class)]
        • WHAT: Dynamically toggles CSS classes based on a JavaScript expression.
        • WHY: Highlights the number in orange and scales it up when count reaches 15 or higher.

        [ALPINE DIRECTIVE: x-text]
        • WHAT: Safely updates the element's textContent whenever 'count' changes.
        • WHY: Safe against XSS attacks because it sets plain text, not innerHTML.
      -->
      <div 
        class="text-6xl font-black mt-2 transition-transform duration-150"
        :class="count >= 15 ? 'text-[#fa6432] scale-105' : 'text-[#00283c]'"
        x-text="count"
      >
        0
      </div>

      <!--
        [ALPINE DIRECTIVE: x-text with JavaScript Ternary]
        • WHAT: Demonstrates that Alpine expressions accept any standard JavaScript expression.
        • WHY: Displays dynamic status messages ('Start', 'Counting...', 'Max Reached!') in real time.
      -->
      <p class="text-xs mt-2 text-slate-500">
        Status: <span class="font-medium" x-text="count === 0 ? 'Start' : count >= max ? 'Max Reached!' : 'Counting...'"></span>
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="grid grid-cols-3 gap-3">
      <!--
        [ALPINE DIRECTIVE: @click (shorthand for x-on:click)]
        • WHAT: Listens for user click events and executes the decrement() method.

        [ALPINE DIRECTIVE: :disabled (shorthand for x-bind:disabled)]
        • WHAT: Disables the button when count is at or below the minimum limit (0).
        • WHY: Enforces business logic and accessibility directly in the template.
      -->
      <button 
        @click="decrement()"
        :disabled="count <= min"
        class="py-3 px-4 rounded-xl font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-[#00283c] hover:bg-slate-200 active:scale-95 cursor-pointer shadow-xs"
      >
        - <span x-text="step"></span>
      </button>

      <!--
        [ALPINE DIRECTIVE: @click="reset()"]
        • WHAT: Calls the reset() method to set count back to 0.
      -->
      <button 
        @click="reset()"
        class="py-3 px-4 rounded-xl font-semibold text-sm transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 cursor-pointer"
      >
        Reset
      </button>

      <!--
        [ALPINE DIRECTIVE: @click="increment()"]
        • WHAT: Calls increment() to add the current step amount.
        • :disabled prevents incrementing once the maximum (20) is reached.
      -->
      <button 
        @click="increment()"
        :disabled="count >= max"
        class="py-3 px-4 rounded-xl font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#fa6432] text-white hover:bg-[#e25325] active:scale-95 cursor-pointer shadow-md shadow-[#fa6432]/25"
      >
        + <span x-text="step"></span>
      </button>
    </div>

    <!-- Step Selector -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
      <label for="step-select" class="font-medium">Step Increment:</label>
      <div class="flex gap-1.5">
        <!--
          [ALPINE DIRECTIVE: x-for on <template>]
          • WHAT: Loops over an array of numbers [1, 2, 5].
          • RULE: In Alpine, x-for MUST always be placed on a <template> element.
          • SCOPE: The loop variable 's' is available inside the template block.
        -->
        <template x-for="s in [1, 2, 5]">
          <!--
            [ALPINE DIRECTIVE: @click="step = s"]
            • Sets the component's 'step' property to the clicked button's value.
            • :class conditionally gives the active step an accent background.
          -->
          <button 
            @click="step = s" 
            :class="step === s ? 'bg-[#00283c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer"
            x-text="'+' + s"
          ></button>
        </template>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-02-forms',
    title: '02. Two-Way Form Binding (x-model)',
    description: 'Bind input fields, selects, and checkboxes to reactive state in real time.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    tags: ['x-model', 'Forms', 'Input', 'Two-Way Binding'],
    isDefault: true,
    createdAt: Date.now() - 90000,
    updatedAt: Date.now() - 90000,
    code: `<!--
  ============================================================
  🎓 LESSON 02: TWO-WAY DATA BINDING WITH X-MODEL
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Core Directives & Modifiers:
  • x-model -> Syncs input value to variable AND variable to input.
  • .trim   -> Automatically trims leading and trailing whitespace.
  • @submit.prevent -> Prevents default form page reload.
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data]
  Initializes our student registration form state with default properties.
-->
<div 
  x-data="{
    studentName: 'Alex Janssen',
    studyTrack: 'Applied Informatics',
    campus: 'Geel',
    isNewsletter: true,
    skillLevel: 'Beginner',
    bio: 'Excited to build dynamic web applications with Alpine and Tailwind!',
    submitted: false
  }"
  class="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 font-sans"
>
  <div class="flex items-center justify-between pb-4 border-b border-slate-100">
    <div>
      <span class="text-[11px] font-bold text-[#fa6432] uppercase tracking-wider">Thomas More University</span>
      <h2 class="text-xl font-bold text-[#00283c]">Student Registration Badge</h2>
    </div>
    <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#00283c] text-white">Live Form</span>
  </div>

  <!--
    [ALPINE DIRECTIVE: @submit.prevent]
    • WHAT: The '.prevent' event modifier calls event.preventDefault() automatically.
    • WHY: Prevents the browser from reloading the page when the user presses Enter or clicks Submit.
  -->
  <form @submit.prevent="submitted = true" class="mt-5 space-y-4">
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
      <!--
        [ALPINE DIRECTIVE: x-model.trim]
        • WHAT: Two-way binds the input's text value to 'studentName'.
        • MODIFIER: '.trim' strips whitespace automatically as the user types.
        • RESULT: Type here and watch the student card below update instantly!
      -->
      <input 
        type="text" 
        x-model.trim="studentName"
        placeholder="Enter student name..." 
        class="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#fa6432] focus:border-transparent transition"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Study Track</label>
        <!--
          [ALPINE DIRECTIVE: x-model on <select>]
          • WHAT: Binds the selected <option> value to 'studyTrack'.
          • HOW: When a student picks a different track, 'studyTrack' updates immediately.
        -->
        <select 
          x-model="studyTrack"
          class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#fa6432] bg-white cursor-pointer"
        >
          <option>Applied Informatics</option>
          <option>Digital Experience Design</option>
          <option>Cybersecurity</option>
          <option>Artificial Intelligence</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Campus</label>
        <!--
          [ALPINE DIRECTIVE: x-model on Campus dropdown]
          • WHAT: Synchronizes the chosen campus location with state.
        -->
        <select 
          x-model="campus"
          class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#fa6432] bg-white cursor-pointer"
        >
          <option>Geel</option>
          <option>Sint-Katelijne-Waver</option>
          <option>Mechelen</option>
          <option>Antwerpen</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
      <!--
        [ALPINE DIRECTIVE: x-model on Radio Buttons]
        • WHAT: When multiple radio inputs share the same x-model ('skillLevel'),
          Alpine automatically checks the radio whose 'value' matches 'skillLevel'.
        • Selecting one sets 'skillLevel' to that option's value.
      -->
      <div class="flex gap-4 text-xs">
        <label class="flex items-center gap-1.5 cursor-pointer text-slate-700">
          <input type="radio" x-model="skillLevel" value="Beginner" class="accent-[#fa6432]"> Beginner
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer text-slate-700">
          <input type="radio" x-model="skillLevel" value="Intermediate" class="accent-[#fa6432]"> Intermediate
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer text-slate-700">
          <input type="radio" x-model="skillLevel" value="Advanced" class="accent-[#fa6432]"> Advanced
        </label>
      </div>
    </div>

    <div>
      <!--
        [ALPINE DIRECTIVE: x-model on Checkbox]
        • WHAT: Binds directly to the boolean property 'isNewsletter'.
        • Checked = true, Unchecked = false.
      -->
      <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
        <input type="checkbox" x-model="isNewsletter" class="w-4 h-4 rounded accent-[#fa6432]">
        <span>Receive Thomas More Tech Lab Workshop Updates</span>
      </label>
    </div>
  </form>

  <!-- Live Student Card Preview -->
  <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#00283c] to-[#0b384f] text-white shadow-md relative overflow-hidden">
    <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#fa6432]/20 blur-xl"></div>
    <div class="flex justify-between items-start">
      <div>
        <span class="text-[10px] tracking-widest text-[#fa6432] uppercase font-bold">Thomas More ID</span>
        <!--
          [ALPINE DIRECTIVE: x-text with Fallback Expression]
          • Uses JavaScript logical OR (||) to show 'Anonymous Student' if name is empty.
        -->
        <h3 class="text-lg font-bold text-white mt-0.5" x-text="studentName || 'Anonymous Student'"></h3>
        <!--
          [ALPINE DIRECTIVE: x-text with String Concatenation]
          • Shows how track and campus are combined dynamically into a single subtitle.
        -->
        <p class="text-xs text-slate-300" x-text="studyTrack + ' • Campus ' + campus"></p>
      </div>
      <!--
        [ALPINE DIRECTIVE: x-text on Badge]
        • Dynamically displays Beginner, Intermediate, or Advanced from radio button choice.
      -->
      <span 
        class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#fa6432] text-white uppercase tracking-wider"
        x-text="skillLevel"
      ></span>
    </div>
    
    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
      <span>Status: <strong class="text-emerald-400">Enrolled</strong></span>
      <!--
        [ALPINE DIRECTIVE: x-text with Boolean Ternary]
        • Reactively reflects the checkbox status in human-readable text.
      -->
      <span x-text="isNewsletter ? '✉️ Subscribed to Updates' : 'No newsletter'"></span>
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-03-conditionals',
    title: '03. Conditionals & Cloak (x-show, x-if, x-cloak)',
    description:
      'Toggle DOM visibility with x-show and mount/unmount DOM nodes with template x-if.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    tags: ['x-show', 'x-if', 'x-cloak', 'Tabs'],
    isDefault: true,
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 80000,
    code: `<!--
  ============================================================
  🎓 LESSON 03: CONDITIONALS & TOGGLING IN ALPINE.JS
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Key Differences to Understand:
  • x-show: Toggles CSS "display: none". The DOM node stays alive,
    preserving form inputs, cursor position, and component state.
  • x-if: Completely creates or destroys the DOM elements.
    Must be declared on a <template> tag!
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data]
  • Declares 'activeTab' to control which panel is visible.
  • 'viewCount' demonstrates that background state can still mutate.
-->
<div 
  x-data="{ 
    activeTab: 'overview',
    showDetails: true,
    viewCount: 142
  }"
  class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-100 font-sans"
>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-bold text-[#00283c]">Web Frameworks Course</h2>
    <span class="text-xs font-medium px-2 py-0.5 rounded bg-orange-100 text-[#fa6432]">3 ECTS</span>
  </div>

  <!-- Tab Navigation Bar -->
  <div class="flex p-1 bg-slate-100 rounded-xl gap-1">
    <!--
      [ALPINE DIRECTIVE: @click & :class for Tab 1]
      • @click="activeTab = 'overview'" changes the activeTab variable.
      • :class highlights the button when activeTab matches 'overview'.
    -->
    <button 
      @click="activeTab = 'overview'" 
      :class="activeTab === 'overview' ? 'bg-white text-[#00283c] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
      class="flex-1 py-2 text-xs rounded-lg transition-all cursor-pointer text-center"
    >
      Overview
    </button>
    <button 
      @click="activeTab = 'curriculum'" 
      :class="activeTab === 'curriculum' ? 'bg-white text-[#00283c] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
      class="flex-1 py-2 text-xs rounded-lg transition-all cursor-pointer text-center"
    >
      Curriculum
    </button>
    <button 
      @click="activeTab = 'grades'" 
      :class="activeTab === 'grades' ? 'bg-white text-[#00283c] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
      class="flex-1 py-2 text-xs rounded-lg transition-all cursor-pointer text-center"
    >
      Grading
    </button>
  </div>

  <!-- Tab Content Area -->
  <div class="mt-5 min-h-[160px]">
    <!--
      [ALPINE DIRECTIVE: x-show]
      • WHAT: Toggles visibility using CSS display: none.
      • WHY: Perfect for tabs and toggles because the elements remain rendered in the DOM.
      • x-transition: Automatically adds a smooth fade/scale transition when opening!
    -->
    <div x-show="activeTab === 'overview'" x-transition class="space-y-3">
      <h3 class="text-sm font-bold text-slate-800">Why Alpine.js?</h3>
      <p class="text-xs text-slate-600 leading-relaxed">
        Alpine offers the reactive power of Vue and React at a fraction of the cost. No compilation step required — perfect for rapid UI components with Tailwind CSS v4!
      </p>
      <div class="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-xs text-amber-900 flex items-center justify-between">
        <span>💡 Ideal for server-rendered HTML apps</span>
        <!--
          [ALPINE DIRECTIVE: @click="viewCount++"]
          • Increments the counter directly inside the template.
        -->
        <button @click="viewCount++" class="text-[11px] underline font-semibold cursor-pointer">
          Views: <span x-text="viewCount"></span>
        </button>
      </div>
    </div>

    <!--
      [ALPINE DIRECTIVE: x-if on <template>]
      • WHAT: Conditionally adds or completely removes elements from the DOM tree.
      • RULE: Must be on a <template> tag that contains a single root element.
      • WHEN TO USE: When content is resource-heavy or should be completely unmounted when hidden.
    -->
    <template x-if="activeTab === 'curriculum'">
      <div class="space-y-2">
        <h3 class="text-sm font-bold text-slate-800">Syllabus Breakdown</h3>
        <ul class="text-xs space-y-1.5 text-slate-600">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#fa6432]"></span>
            Week 1: Declarative Rendering & Directives
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#fa6432]"></span>
            Week 2: Two-way Data Binding & Form Handling
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#fa6432]"></span>
            Week 3: Custom Events, Plugins, & Tailwind v4
          </li>
        </ul>
      </div>
    </template>

    <!--
      [ALPINE DIRECTIVE: x-show on Grading Tab]
      • Smoothly fades into view when activeTab === 'grades'.
    -->
    <div x-show="activeTab === 'grades'" x-transition class="space-y-3">
      <h3 class="text-sm font-bold text-slate-800">Evaluation Scheme</h3>
      <div class="space-y-1 text-xs">
        <div class="flex justify-between py-1 border-b border-slate-100">
          <span class="text-slate-600">Weekly Lab Exercises</span>
          <span class="font-bold text-[#00283c]">30%</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-100">
          <span class="text-slate-600">PWA Alpine Project</span>
          <span class="font-bold text-[#fa6432]">40%</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-600">Practical Exam</span>
          <span class="font-bold text-[#00283c]">30%</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-04-lists',
    title: '04. Lists & Dynamic Arrays (x-for)',
    description:
      'Render repeating items, add new items, delete, and filter with Alpine x-for template.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    tags: ['x-for', 'Arrays', 'Lists', 'Todo'],
    isDefault: true,
    createdAt: Date.now() - 70000,
    updatedAt: Date.now() - 70000,
    code: `<!--
  ============================================================
  🎓 LESSON 04: REPEATING LISTS & ARRAYS WITH X-FOR
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Key Concepts:
  • x-for: Loops over arrays to render dynamic HTML templates.
  • :key: Crucial for Alpine to track individual items during
    additions, deletions, and reordering.
  • Getters: JavaScript 'get propertyName()' functions act as
    reactive computed properties in Alpine!
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data with Array & Computed Getters]
  • 'todos' array stores individual task items.
  • 'filteredTodos' getter reactively recalculates when 'filter' or 'todos' changes.
  • 'remainingCount' getter computes how many tasks are pending.
-->
<div 
  x-data="{
    newTodo: '',
    filter: 'all',
    todos: [
      { id: 1, text: 'Review Alpine.js x-data syntax', completed: true },
      { id: 2, text: 'Build a Thomas More student project', completed: false },
      { id: 3, text: 'Style with modern Tailwind v4 utilities', completed: false }
    ],
    addTodo() {
      if (!this.newTodo.trim()) return;
      this.todos.push({
        id: Date.now(),
        text: this.newTodo.trim(),
        completed: false
      });
      this.newTodo = '';
    },
    removeTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
    },
    get filteredTodos() {
      if (this.filter === 'active') return this.todos.filter(t => !t.completed);
      if (this.filter === 'completed') return this.todos.filter(t => t.completed);
      return this.todos;
    },
    get remainingCount() {
      return this.todos.filter(t => !t.completed).length;
    }
  }"
  class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 font-sans"
>
  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
    <div>
      <h2 class="text-lg font-bold text-[#00283c]">Alpine Task Board</h2>
      <p class="text-xs text-slate-500">Managing dynamic collections</p>
    </div>
    <!--
      [ALPINE DIRECTIVE: x-text displaying Computed Getter]
      • Automatically updates as items are checked or added!
    -->
    <span 
      class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00283c] text-white"
      x-text="remainingCount + ' remaining'"
    ></span>
  </div>

  <!--
    [ALPINE DIRECTIVE: @submit.prevent="addTodo()"]
    • Intercepts form submission and adds the new task to the reactive array.
  -->
  <form @submit.prevent="addTodo()" class="mt-4 flex gap-2">
    <!--
      [ALPINE DIRECTIVE: x-model="newTodo"]
      • Two-way binds input field to 'newTodo'.
    -->
    <input 
      type="text" 
      x-model="newTodo"
      placeholder="Add a new assignment..."
      class="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#fa6432]"
    />
    <button 
      type="submit"
      class="px-4 py-2 bg-[#fa6432] hover:bg-[#e25325] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
    >
      Add
    </button>
  </form>

  <!-- Filter Pills -->
  <div class="flex gap-2 my-4 text-xs">
    <!--
      [ALPINE DIRECTIVES: @click & :class on Filter Buttons]
      • Sets 'filter' to 'all', 'active', or 'completed'.
      • Shows reactive counts using x-text.
    -->
    <button 
      @click="filter = 'all'" 
      :class="filter === 'all' ? 'bg-[#00283c] text-white font-bold' : 'bg-slate-100 text-slate-600'"
      class="px-2.5 py-1 rounded-lg transition cursor-pointer"
    >
      All (<span x-text="todos.length"></span>)
    </button>
    <button 
      @click="filter = 'active'" 
      :class="filter === 'active' ? 'bg-[#00283c] text-white font-bold' : 'bg-slate-100 text-slate-600'"
      class="px-2.5 py-1 rounded-lg transition cursor-pointer"
    >
      Pending (<span x-text="remainingCount"></span>)
    </button>
    <button 
      @click="filter = 'completed'" 
      :class="filter === 'completed' ? 'bg-[#00283c] text-white font-bold' : 'bg-slate-100 text-slate-600'"
      class="px-2.5 py-1 rounded-lg transition cursor-pointer"
    >
      Done (<span x-text="todos.length - remainingCount"></span>)
    </button>
  </div>

  <!-- Todo List -->
  <ul class="space-y-2 max-h-60 overflow-y-auto">
    <!--
      [ALPINE DIRECTIVE: x-for on <template>]
      • WHAT: Loops over 'filteredTodos' computed property.
      • RULE: Must be on <template>.
      • :key="todo.id": ESSENTIAL! Identifies each list item so Alpine only mutates
        the exact DOM node that changed instead of rebuilding the entire list.
    -->
    <template x-for="todo in filteredTodos" :key="todo.id">
      <li class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition group border border-slate-200/70">
        <label class="flex items-center gap-2.5 cursor-pointer flex-1">
          <!--
            [ALPINE DIRECTIVE: x-model="todo.completed"]
            • Two-way binds directly into the individual todo object inside the array!
          -->
          <input 
            type="checkbox" 
            x-model="todo.completed"
            class="w-4 h-4 rounded accent-[#fa6432]"
          />
          <!--
            [ALPINE DIRECTIVE: :class & x-text]
            • Strikes through text when todo.completed is true.
            • x-text renders the task title safely.
          -->
          <span 
            :class="todo.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'"
            class="text-xs transition-colors"
            x-text="todo.text"
          ></span>
        </label>
        <!--
          [ALPINE DIRECTIVE: @click="removeTodo(todo.id)"]
          • Passes the current todo's id to removeTodo() to filter it out of state.
        -->
        <button 
          @click="removeTodo(todo.id)"
          class="text-slate-400 hover:text-red-500 text-xs px-2 py-1 rounded transition opacity-60 group-hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      </li>
    </template>
  </ul>
</div>`,
  },
  {
    id: 'lesson-05-transitions',
    title: '05. Transitions & Modals (x-transition)',
    description:
      'Create smooth animations, accessible backdrop blur modals, and click-outside dismissal.',
    category: 'Components',
    difficulty: 'Intermediate',
    tags: ['x-transition', 'Modal', 'Animations', 'Events'],
    isDefault: true,
    createdAt: Date.now() - 60000,
    updatedAt: Date.now() - 60000,
    code: `<!--
  ============================================================
  🎓 LESSON 05: TRANSITIONS & MODALS IN ALPINE.JS
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Key Directives & Modifiers:
  • x-transition: Automatically coordinates CSS transition stages:
    enter, enter-start, enter-end, leave, leave-start, leave-end.
  • @click.outside: Fires when user clicks anywhere OUTSIDE the element.
  • @keydown.escape.window: Listens on the global window object for Escape.
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data & Window Event Listener]
  • 'isOpen' controls whether the modal dialog is open or closed.
  • @keydown.escape.window="isOpen = false":
    The '.window' modifier attaches the listener to window instead of just this div,
    enabling global accessibility: press ESC anywhere to dismiss!
-->
<div 
  x-data="{ isOpen: false }"
  @keydown.escape.window="isOpen = false"
  class="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg border border-slate-100 font-sans"
>
  <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#fa6432]/10 text-[#fa6432] flex items-center justify-center text-2xl font-bold">
    ⚡
  </div>

  <h2 class="text-xl font-bold text-[#00283c]">Alpine Transition Workshop</h2>
  <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
    Discover how effortless smooth transitions and accessibility can be with Alpine.js!
  </p>

  <!--
    [ALPINE DIRECTIVE: @click="isOpen = true"]
    • Sets isOpen to true, triggering the x-show and transitions below.
  -->
  <button 
    @click="isOpen = true"
    class="mt-6 px-5 py-2.5 rounded-xl bg-[#00283c] hover:bg-[#0b384f] text-white text-xs font-bold transition shadow-md cursor-pointer active:scale-95"
  >
    Open Course Information Modal
  </button>

  <!--
    [ALPINE DIRECTIVE: Modal Backdrop with Granular x-transition]
    • x-show="isOpen": Controls backdrop visibility.
    • x-transition:enter / enter-start / enter-end: Defines fade-in animation using Tailwind classes.
    • x-transition:leave / leave-start / leave-end: Defines fade-out animation when closing.
  -->
  <div 
    x-show="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00283c]/60 backdrop-blur-xs"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    style="display: none;"
  >
    <!--
      [ALPINE DIRECTIVE: Modal Card with @click.outside & Scale Animation]
      • @click.outside="isOpen = false": Closes the modal if user clicks on the backdrop!
      • x-transition:enter-start="opacity-0 scale-95 translate-y-4": Creates a smooth pop-in zoom effect.
      • x-transition:enter-end="opacity-100 scale-100 translate-y-0": Renders fully visible.
    -->
    <div 
      @click.outside="isOpen = false"
      x-show="isOpen"
      x-transition:enter="transition ease-out duration-300 transform"
      x-transition:enter-start="opacity-0 scale-95 translate-y-4"
      x-transition:enter-end="opacity-100 scale-100 translate-y-0"
      x-transition:leave="transition ease-in duration-200 transform"
      x-transition:leave-start="opacity-100 scale-100 translate-y-0"
      x-transition:leave-end="opacity-0 scale-95 translate-y-4"
      class="w-full max-w-sm bg-white rounded-2xl p-6 text-left shadow-2xl border border-slate-200 relative"
    >
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <span class="text-xs font-bold text-[#fa6432] uppercase">Thomas More Notice</span>
        <!--
          [ALPINE DIRECTIVE: @click="isOpen = false"]
          • Close button dismisses dialog immediately.
        -->
        <button @click="isOpen = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
      </div>

      <div class="mt-4 space-y-2 text-xs text-slate-600">
        <p class="font-semibold text-slate-800 text-sm">Exam Registration Open</p>
        <p>Students can now register their Alpine.js + Tailwind v4 project prototypes via the student portal.</p>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
          💡 Keyboard tip: Press <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-slate-700">ESC</kbd> to close this dialog anytime.
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button 
          @click="isOpen = false" 
          class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          Dismiss
        </button>
        <button 
          @click="isOpen = false" 
          class="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#fa6432] hover:bg-[#e25325] cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-06-events-refs',
    title: '06. Events & Refs ($dispatch, $refs)',
    description:
      'Dispatch custom bubble events across components and control DOM elements with $refs.',
    category: 'Components',
    difficulty: 'Intermediate',
    tags: ['$dispatch', '$refs', 'Custom Events'],
    isDefault: true,
    createdAt: Date.now() - 50000,
    updatedAt: Date.now() - 50000,
    code: `<!--
  ============================================================
  🎓 LESSON 06: EVENTS & REFS ($dispatch, $refs)
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Magic Properties explained:
  • $dispatch('name', detail): Dispatches a standard browser CustomEvent
    that bubbles up the DOM tree, allowing sibling or parent components
    to communicate cleanly.
  • $refs: Provides direct references to DOM elements marked with x-ref,
    without needing document.getElementById or querySelector.
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data with Custom Event Listener]
  • Maintains a reactive 'notifications' list.
  • @student-alert.window: Listens for the custom 'student-alert' event
    fired anywhere in the browser window!
  • $event.detail: Contains the payload passed into $dispatch.
-->
<div 
  x-data="{ 
    notifications: [],
    addToast(msg, type = 'info') {
      const id = Date.now();
      this.notifications.push({ id, msg, type });
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 3500);
    }
  }"
  @student-alert.window="addToast($event.detail.text, $event.detail.type)"
  class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 font-sans relative"
>
  <h2 class="text-lg font-bold text-[#00283c]">Event Dispatcher & $refs</h2>
  <p class="text-xs text-slate-500">Cross-component communication and direct DOM control</p>

  <!--
    [ALPINE DIRECTIVE: x-ref on Input Field]
    • x-ref="searchField" tags this element in the component's $refs object.
    • This allows Alpine to directly call native browser methods like .focus() or .select().
  -->
  <div x-data="{ query: '' }" class="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Direct Focus with $refs</label>
    <div class="flex gap-2">
      <input 
        x-ref="searchField"
        x-model="query"
        type="text" 
        placeholder="Type a student query..."
        class="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00283c]"
      />
      <!--
        [ALPINE MAGIC PROPERTY: $refs]
        • $refs.searchField.focus() triggers input focus immediately on click.
      -->
      <button 
        @click="$refs.searchField.focus(); $refs.searchField.select();"
        class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition cursor-pointer"
      >
        Focus
      </button>
    </div>
  </div>

  <!-- Dispatcher Buttons -->
  <div class="mt-5 space-y-2">
    <span class="text-xs font-semibold text-slate-700">Emit Custom Events:</span>
    <div class="grid grid-cols-2 gap-2">
      <!--
        [ALPINE MAGIC PROPERTY: $dispatch]
        • WHAT: Dispatches a CustomEvent named 'student-alert' with a data payload.
        • HOW: The parent listener @student-alert.window catches it and displays the toast!
      -->
      <button 
        @click="$dispatch('student-alert', { text: 'Lab submission verified on GitHub!', type: 'success' })"
        class="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
      >
        Send Success Toast
      </button>
      <button 
        @click="$dispatch('student-alert', { text: 'Reminder: Deadline tomorrow at 23:59', type: 'warning' })"
        class="p-2.5 bg-[#fa6432] hover:bg-[#e25325] text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
      >
        Send Alert Toast
      </button>
    </div>
  </div>

  <!-- Notification Stack -->
  <div class="mt-6 space-y-2">
    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Toast Feed:</span>
    <!--
      [ALPINE DIRECTIVE: x-for with x-transition & :class]
      • Automatically animates toasts in and out when added or removed.
      • :class dynamically styles each toast as green (success) or orange (warning).
    -->
    <template x-for="note in notifications" :key="note.id">
      <div 
        x-transition
        :class="note.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-orange-50 border-orange-300 text-orange-900'"
        class="p-3 rounded-xl border text-xs font-medium flex items-center justify-between shadow-xs"
      >
        <span x-text="note.msg"></span>
        <span class="text-[10px] opacity-70">Just now</span>
      </div>
    </template>
    <!--
      [ALPINE DIRECTIVE: x-show for Empty State]
      • Appears whenever no active toasts are present.
    -->
    <div x-show="notifications.length === 0" class="text-xs text-slate-400 italic py-2 text-center">
      No notifications right now. Click a button above!
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-07-store',
    title: '07. Global Store (Alpine.store)',
    description: 'Manage shared global state across different components without prop drilling.',
    category: 'Advanced',
    difficulty: 'Advanced',
    tags: ['Alpine.store', 'Global State', 'Cart'],
    isDefault: true,
    createdAt: Date.now() - 40000,
    updatedAt: Date.now() - 40000,
    code: `<!--
  ============================================================
  🎓 LESSON 07: GLOBAL SHARED STATE WITH ALPINE.STORE
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  Core Principles:
  • Alpine.store(name, object): Creates a reactive store accessible
    from ANY component on the page via the '$store.name' magic property.
  • No prop drilling, no event bubbling needed for shared application state!
  • Getters in stores reactively re-evaluate across all listening components.
  ============================================================
-->

<div class="max-w-lg mx-auto space-y-6 font-sans">
  <!--
    [ALPINE STORE INITIALIZATION]
    • The 'alpine:init' event fires right before Alpine boots.
    • We register the global 'library' store with books, toggle action, and getter.
  -->
  <script>
    document.addEventListener('alpine:init', () => {
      Alpine.store('library', {
        books: [
          { id: 1, title: 'Clean Code in JavaScript', author: 'Robert Martin', borrowed: false },
          { id: 2, title: 'Alpine.js Up and Running', author: 'Caleb Porzio', borrowed: true },
          { id: 3, title: 'Modern Tailwind CSS v4', author: 'Adam Wathan', borrowed: false }
        ],
        toggleBorrow(id) {
          const book = this.books.find(b => b.id === id);
          if (book) book.borrowed = !book.borrowed;
        },
        get borrowedCount() {
          return this.books.filter(b => b.borrowed).length;
        }
      });
    });
  </script>

  <!--
    [COMPONENT 1: HEADER & LIVE STATS]
    • Note: 'x-data' without parameters creates an isolated Alpine component.
    • Reads from '$store.library.borrowedCount'.
  -->
  <div x-data class="p-4 bg-[#00283c] text-white rounded-2xl flex items-center justify-between shadow-md">
    <div>
      <span class="text-[10px] text-[#fa6432] uppercase tracking-wider font-bold">Thomas More Campus Library</span>
      <h3 class="text-base font-bold">Global State Store Demo</h3>
    </div>
    <div class="text-right">
      <span class="text-xs text-slate-300 block">Borrowed Books:</span>
      <!--
        [ALPINE MAGIC PROPERTY: $store]
        • $store.library.borrowedCount automatically recalculates when any book is borrowed or returned!
      -->
      <span class="text-xl font-black text-[#fa6432]" x-text="$store.library.borrowedCount"></span>
    </div>
  </div>

  <!--
    [COMPONENT 2: BOOK CATALOG]
    • This is a completely independent DOM tree with its own 'x-data'.
    • Interacts with the same store seamlessly!
  -->
  <div x-data class="p-5 bg-white rounded-2xl shadow-lg border border-slate-100">
    <h4 class="text-sm font-bold text-[#00283c] mb-3">Available Catalog</h4>
    <div class="space-y-2.5">
      <!--
        [ALPINE DIRECTIVE: x-for iterating $store collection]
        • Loops over $store.library.books reactively.
      -->
      <template x-for="book in $store.library.books" :key="book.id">
        <div class="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-300 transition">
          <div>
            <h5 class="text-xs font-bold text-slate-800" x-text="book.title"></h5>
            <p class="text-[11px] text-slate-500" x-text="book.author"></p>
          </div>
          <!--
            [ALPINE DIRECTIVES: @click, :class, & x-text on Store Action]
            • Calls $store.library.toggleBorrow(book.id) when clicked.
            • Reactively updates button label and color based on book.borrowed.
          -->
          <button 
            @click="$store.library.toggleBorrow(book.id)"
            :class="book.borrowed ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#fa6432] text-white hover:bg-[#e25325]'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            x-text="book.borrowed ? 'Return Book' : 'Borrow'"
          ></button>
        </div>
      </template>
    </div>
  </div>
</div>`,
  },
  {
    id: 'lesson-08-quiz-app',
    title: '08. Student Project: Alpine Quiz App',
    description:
      'Full interactive quiz with question progression, score tracking, and result screen.',
    category: 'Projects',
    difficulty: 'Intermediate',
    tags: ['Project', 'Quiz', 'Full Component', 'Tailwind v4'],
    isDefault: true,
    createdAt: Date.now() - 30000,
    updatedAt: Date.now() - 30000,
    code: `<!--
  ============================================================
  🎓 LESSON 08: CAPSTONE STUDENT QUIZ APPLICATION
  Thomas More Applied Informatics / Tech Lab
  ------------------------------------------------------------
  This real-world project unifies:
  • x-data: State machine managing steps, score, questions & answers.
  • x-show & x-transition: Phase switches between question view and results.
  • x-for: Dynamic choice buttons with computed classes.
  • :style: Dynamic width calculation for animated progress bar.
  • Conditional styling: Highlights correct (green) and incorrect (red) choices.
  ============================================================
-->

<!--
  [ALPINE DIRECTIVE: x-data State Machine]
  • 'currentStep': Index of the current question.
  • 'score': Running tally of correct answers.
  • 'selectedAnswer': Index picked by the student.
  • 'isAnswered': Locks options after an answer is chosen.
-->
<div 
  x-data="{
    currentStep: 0,
    score: 0,
    selectedAnswer: null,
    isAnswered: false,
    questions: [
      {
        question: 'Which Alpine.js directive is used to declare reactive component state?',
        options: ['x-model', 'x-data', 'x-state', 'x-init'],
        correctIndex: 1,
        explanation: 'x-data defines the scope and reactive object properties for that DOM node.'
      },
      {
        question: 'What is the shorthand syntax for x-on:click in Alpine?',
        options: [':click', '#click', '@click', '$click'],
        correctIndex: 2,
        explanation: '@ is the convenient shorthand for the x-on directive.'
      },
      {
        question: 'Which magic property is used to dispatch custom events?',
        options: ['$dispatch', '$emit', '$trigger', '$broadcast'],
        correctIndex: 0,
        explanation: '$dispatch triggers browser CustomEvents that bubble up the DOM tree.'
      }
    ],
    selectOption(index) {
      if (this.isAnswered) return;
      this.selectedAnswer = index;
      this.isAnswered = true;
      if (index === this.questions[this.currentStep].correctIndex) {
        this.score++;
      }
    },
    nextQuestion() {
      this.selectedAnswer = null;
      this.isAnswered = false;
      this.currentStep++;
    },
    restart() {
      this.currentStep = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isAnswered = false;
    }
  }"
  class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 font-sans"
>
  <!-- Quiz Header -->
  <div class="flex items-center justify-between pb-4 border-b border-slate-100">
    <div>
      <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#fa6432]">Thomas More Tech Lab</span>
      <h2 class="text-lg font-bold text-[#00283c]">Alpine Knowledge Check</h2>
    </div>
    <!--
      [ALPINE DIRECTIVE: x-show & x-text]
      • Shows current step indicator only while questions remain.
    -->
    <div x-show="currentStep < questions.length" class="text-right">
      <span class="text-xs font-semibold text-slate-500">
        Question <span x-text="currentStep + 1"></span> of <span x-text="questions.length"></span>
      </span>
    </div>
  </div>

  <!--
    [ACTIVE QUESTION VIEW: x-show="currentStep < questions.length"]
    • Visible while the quiz is in progress.
  -->
  <div x-show="currentStep < questions.length" class="mt-5 space-y-4">
    <!-- Progress Bar with :style calculation -->
    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <!--
        [ALPINE DIRECTIVE: :style]
        • Dynamically calculates the progress percentage and animates width smoothly!
      -->
      <div 
        class="h-full bg-[#fa6432] transition-all duration-300"
        :style="'width: ' + ((currentStep / questions.length) * 100) + '%'"
      ></div>
    </div>

    <!--
      [ALPINE DIRECTIVE: x-text on Question Title]
      • Displays question title from the active step.
    -->
    <h3 class="text-sm font-bold text-slate-800 leading-snug" x-text="questions[currentStep].question"></h3>

    <!-- Options List -->
    <div class="space-y-2">
      <!--
        [ALPINE DIRECTIVE: x-for looping through options]
        • (option, idx) provides both the string and the index.
      -->
      <template x-for="(option, idx) in questions[currentStep].options" :key="idx">
        <!--
          [ALPINE DIRECTIVES: @click, :disabled, & Object-Syntax :class]
          • @click="selectOption(idx)": Handles user choice.
          • :disabled="isAnswered": Prevents selecting a second answer.
          • :class="{ ... }": Toggles green background if correct, red if incorrect!
        -->
        <button 
          @click="selectOption(idx)"
          :disabled="isAnswered"
          :class="{
            'border-slate-200 hover:border-slate-300 hover:bg-slate-50': !isAnswered,
            'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold': isAnswered && idx === questions[currentStep].correctIndex,
            'bg-red-50 border-red-400 text-red-900': isAnswered && selectedAnswer === idx && idx !== questions[currentStep].correctIndex,
            'opacity-50': isAnswered && selectedAnswer !== idx && idx !== questions[currentStep].correctIndex
          }"
          class="w-full text-left p-3 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center justify-between"
        >
          <span x-text="option"></span>
          <span x-show="isAnswered && idx === questions[currentStep].correctIndex">✓</span>
          <span x-show="isAnswered && selectedAnswer === idx && idx !== questions[currentStep].correctIndex">✗</span>
        </button>
      </template>
    </div>

    <!--
      [ALPINE DIRECTIVE: x-show="isAnswered" with x-transition]
      • Reveals educational explanation only after the student makes a choice.
    -->
    <div x-show="isAnswered" x-transition class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
      <p class="font-bold text-[#00283c] mb-1">Explanation:</p>
      <p x-text="questions[currentStep].explanation"></p>
    </div>

    <!--
      [ALPINE DIRECTIVE: Next Question Button]
      • Appears once answered to advance the state machine.
    -->
    <div x-show="isAnswered" class="pt-2 flex justify-end">
      <button 
        @click="nextQuestion()"
        class="px-5 py-2 bg-[#fa6432] hover:bg-[#e25325] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
      >
        <span x-text="currentStep + 1 === questions.length ? 'Show Results' : 'Next Question →'"></span>
      </button>
    </div>
  </div>

  <!--
    [FINAL RESULTS SCREEN: x-show="currentStep >= questions.length"]
    • Fades in when all questions are answered.
  -->
  <div x-show="currentStep >= questions.length" x-transition class="py-8 text-center space-y-4">
    <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
      🏆
    </div>
    <div>
      <h3 class="text-xl font-bold text-[#00283c]">Quiz Completed!</h3>
      <p class="text-xs text-slate-500 mt-1">Here is how you scored on Alpine basics:</p>
    </div>

    <!-- Score Display with dynamic feedback message -->
    <div class="p-4 bg-slate-50 rounded-2xl inline-block border border-slate-200 min-w-[180px]">
      <span class="text-3xl font-black text-[#fa6432]" x-text="score"></span>
      <span class="text-slate-400 font-bold text-lg"> / <span x-text="questions.length"></span></span>
      <p class="text-[11px] font-semibold text-slate-600 mt-1" x-text="score === questions.length ? 'Perfect Score! 🌟' : score >= 2 ? 'Great Job! 👍' : 'Keep Practicing! 💪'"></p>
    </div>

    <!--
      [ALPINE DIRECTIVE: @click="restart()"]
      • Resets state machine back to step 0 and score 0.
    -->
    <div>
      <button 
        @click="restart()"
        class="px-6 py-2.5 bg-[#00283c] hover:bg-[#0b384f] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
      >
        Retake Quiz
      </button>
    </div>
  </div>
</div>`,
  },
];
