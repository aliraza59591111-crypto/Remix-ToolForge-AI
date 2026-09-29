import { MiniTool } from '../types/tool';

export const SAMPLE_TOOLS: MiniTool[] = [
  {
    id: 'sample_split_bill',
    title: 'Smart Split & Tip Calculator',
    tagline: 'Split restaurant bills fairly with custom tips, tax, and per-person breakdown',
    category: 'Finance',
    prompt: 'A mobile-friendly restaurant bill splitter and tip calculator with custom tip buttons, tax calculator, per-person total breakdown, and copy receipt summary.',
    features: [
      'Quick tip presets (10%, 15%, 18%, 20%, custom)',
      'Split by any number of guests with slider',
      'Tax & round-up calculation options',
      'Instant copyable text receipt for group chats',
    ],
    instructions: 'Enter your total bill amount, select your tip percentage, choose how many people are sharing the bill, and view the exact amount each person owes.',
    createdAt: new Date().toISOString(),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Split & Tip Calculator</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-6 font-sans flex items-center justify-center">
  <div class="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
    <div class="flex items-center justify-between pb-4 border-b border-slate-700/70 mb-5">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>🧾</span> Bill Splitter & Tip
        </h1>
        <p class="text-xs text-slate-400">Calculate share and tip in seconds</p>
      </div>
      <button id="resetBtn" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 transition">
        Reset
      </button>
    </div>

    <!-- Bill Amount -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Bill Total ($)</label>
      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
        <input type="number" id="billAmount" value="84.50" step="0.01" min="0" class="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-2.5 pl-8 pr-4 text-white font-semibold text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
      </div>
    </div>

    <!-- Tip Selection -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1.5">
        <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tip Percentage</label>
        <span id="tipLabel" class="text-xs font-bold text-indigo-400">18%</span>
      </div>
      <div class="grid grid-cols-4 gap-2 mb-2">
        <button class="tip-btn py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition" data-tip="10">10%</button>
        <button class="tip-btn py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition" data-tip="15">15%</button>
        <button class="tip-btn py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30" data-tip="18">18%</button>
        <button class="tip-btn py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition" data-tip="20">20%</button>
      </div>
      <div class="flex items-center gap-2">
        <input type="range" id="customTip" min="0" max="40" value="18" class="w-full accent-indigo-500 cursor-pointer">
      </div>
    </div>

    <!-- Number of People -->
    <div class="mb-5">
      <div class="flex justify-between items-center mb-1.5">
        <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Split Between</label>
        <span id="peopleCountLabel" class="text-xs font-bold text-indigo-400">3 People</span>
      </div>
      <div class="flex items-center gap-3">
        <button id="minusPerson" class="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition active:scale-95">-</button>
        <input type="range" id="peopleSlider" min="1" max="20" value="3" class="w-full accent-indigo-500 cursor-pointer">
        <button id="plusPerson" class="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition active:scale-95">+</button>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-800/40 rounded-xl p-4 mb-4">
      <div class="grid grid-cols-2 gap-3 text-center pb-3 border-b border-indigo-900/50 mb-3">
        <div>
          <span class="text-xs text-slate-400 block mb-0.5">Total Tip</span>
          <span id="totalTip" class="text-base font-bold text-emerald-400">$15.21</span>
        </div>
        <div>
          <span class="text-xs text-slate-400 block mb-0.5">Grand Total</span>
          <span id="grandTotal" class="text-base font-bold text-white">$99.71</span>
        </div>
      </div>
      <div class="text-center pt-1">
        <span class="text-xs font-medium text-indigo-300 block mb-1 uppercase tracking-wider">Each Person Pays</span>
        <div class="text-3xl font-extrabold text-white tracking-tight" id="perPersonTotal">$33.24</div>
        <span class="text-[11px] text-slate-400 block mt-1" id="perPersonTipBreakdown">($28.17 bill + $5.07 tip)</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button id="copyReceiptBtn" class="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
        <span id="copyBtnText">Copy Share Summary</span>
      </button>
      <button id="roundBtn" title="Round up total" class="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition">
        .00 ⬆️
      </button>
    </div>
  </div>

  <script>
    const billInput = document.getElementById('billAmount');
    const tipLabel = document.getElementById('tipLabel');
    const customTip = document.getElementById('customTip');
    const peopleSlider = document.getElementById('peopleSlider');
    const peopleCountLabel = document.getElementById('peopleCountLabel');
    const minusPerson = document.getElementById('minusPerson');
    const plusPerson = document.getElementById('plusPerson');
    const tipBtns = document.querySelectorAll('.tip-btn');
    const totalTipEl = document.getElementById('totalTip');
    const grandTotalEl = document.getElementById('grandTotal');
    const perPersonTotalEl = document.getElementById('perPersonTotal');
    const perPersonTipBreakdownEl = document.getElementById('perPersonTipBreakdown');
    const copyReceiptBtn = document.getElementById('copyReceiptBtn');
    const copyBtnText = document.getElementById('copyBtnText');
    const resetBtn = document.getElementById('resetBtn');
    const roundBtn = document.getElementById('roundBtn');

    let currentTip = 18;
    let roundUp = false;

    function calculate() {
      const bill = parseFloat(billInput.value) || 0;
      const people = parseInt(peopleSlider.value) || 1;
      
      let tipAmount = bill * (currentTip / 100);
      let total = bill + tipAmount;

      if (roundUp) {
        total = Math.ceil(total);
        tipAmount = total - bill;
      }

      const perPerson = total / people;
      const billPerPerson = bill / people;
      const tipPerPerson = tipAmount / people;

      tipLabel.textContent = currentTip + '%';
      customTip.value = currentTip;
      peopleCountLabel.textContent = people + (people === 1 ? ' Person' : ' People');

      totalTipEl.textContent = '$' + tipAmount.toFixed(2);
      grandTotalEl.textContent = '$' + total.toFixed(2);
      perPersonTotalEl.textContent = '$' + perPerson.toFixed(2);
      perPersonTipBreakdownEl.textContent = '(' + '$' + billPerPerson.toFixed(2) + ' bill + ' + '$' + tipPerPerson.toFixed(2) + ' tip)';
    }

    function setTip(val) {
      currentTip = Number(val);
      roundUp = false;
      tipBtns.forEach(b => {
        if (Number(b.dataset.tip) === currentTip) {
          b.className = 'tip-btn py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30';
        } else {
          b.className = 'tip-btn py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition';
        }
      });
      calculate();
    }

    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => setTip(btn.dataset.tip));
    });

    customTip.addEventListener('input', (e) => setTip(e.target.value));
    billInput.addEventListener('input', () => { roundUp = false; calculate(); });
    
    peopleSlider.addEventListener('input', calculate);
    minusPerson.addEventListener('click', () => {
      if (peopleSlider.value > 1) {
        peopleSlider.value = Number(peopleSlider.value) - 1;
        calculate();
      }
    });
    plusPerson.addEventListener('click', () => {
      if (peopleSlider.value < 20) {
        peopleSlider.value = Number(peopleSlider.value) + 1;
        calculate();
      }
    });

    roundBtn.addEventListener('click', () => {
      roundUp = !roundUp;
      roundBtn.classList.toggle('bg-emerald-600', roundUp);
      roundBtn.classList.toggle('text-white', roundUp);
      calculate();
    });

    resetBtn.addEventListener('click', () => {
      billInput.value = '50.00';
      peopleSlider.value = '2';
      setTip(15);
      roundUp = false;
      roundBtn.classList.remove('bg-emerald-600', 'text-white');
      calculate();
    });

    copyReceiptBtn.addEventListener('click', () => {
      const bill = parseFloat(billInput.value) || 0;
      const people = peopleSlider.value;
      const tip = totalTipEl.textContent;
      const grandTotal = grandTotalEl.textContent;
      const perPerson = perPersonTotalEl.textContent;

      const summary = [
        '🧾 Bill Split Summary',
        '• Bill: $' + bill.toFixed(2),
        '• Tip (' + currentTip + '%): ' + tip,
        '• Total: ' + grandTotal,
        '• People: ' + people,
        '👉 EACH PERSON PAYS: ' + perPerson,
        '— Created via ToolForge AI'
      ].join('\\n');

      navigator.clipboard.writeText(summary).then(() => {
        copyBtnText.textContent = 'Copied to Clipboard!';
        setTimeout(() => { copyBtnText.textContent = 'Copy Share Summary'; }, 2000);
      }).catch(() => {
        copyBtnText.textContent = 'Copied!';
      });
    });

    calculate();
  </script>
</body>
</html>`
  },
  {
    id: 'sample_pomodoro_hub',
    title: 'FocusForge: Pomodoro & Audio Chime',
    tagline: 'Stay in the zone with interval timers, audio bell cues, task checklist, and streak stats',
    category: 'Productivity',
    prompt: 'A sleek Pomodoro focus timer with 25/5/15 intervals, animated circular progress ring, audio chime synthesized via Web Audio API, daily session counter, and task checklist.',
    features: [
      'Focus (25m), Short Break (5m), and Long Break (15m)',
      'Built-in pleasant synthesized audio chimes (Web Audio API)',
      'Active session counter and completion streak',
      'Quick task checklist with progress tracker',
    ],
    instructions: 'Choose a mode (Focus or Break), click Start, and work uninterrupted until the pleasant audio chime sounds.',
    createdAt: new Date().toISOString(),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FocusForge Pomodoro</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 font-sans flex items-center justify-center">
  <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
        <h1 class="text-lg font-bold text-white tracking-wide">FocusForge Timer</h1>
      </div>
      <div class="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
        🔥 Streak: <span id="streakCount" class="font-bold text-amber-400">3</span>
      </div>
    </div>

    <!-- Mode Selector -->
    <div class="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
      <button class="mode-btn flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white shadow-sm transition" data-mode="focus" data-time="1500">Focus 25m</button>
      <button class="mode-btn flex-1 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition" data-mode="short" data-time="300">Short 5m</button>
      <button class="mode-btn flex-1 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition" data-mode="long" data-time="900">Long 15m</button>
    </div>

    <!-- Timer Ring & Display -->
    <div class="relative flex flex-col items-center justify-center my-4">
      <svg class="w-56 h-56 transform -rotate-90">
        <circle cx="112" cy="112" r="95" stroke="currentColor" stroke-width="8" class="text-slate-800" fill="transparent"/>
        <circle id="progressRing" cx="112" cy="112" r="95" stroke="currentColor" stroke-width="8" class="text-rose-500 transition-all duration-300" stroke-linecap="round" fill="transparent" stroke-dasharray="596.9" stroke-dashoffset="0"/>
      </svg>
      <div class="absolute flex flex-col items-center">
        <div id="timeDisplay" class="text-5xl font-mono font-extrabold text-white tracking-tighter">25:00</div>
        <span id="currentModeLabel" class="text-xs font-semibold uppercase tracking-widest text-rose-400 mt-2">Deep Focus</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-3 mt-6 mb-6">
      <button id="toggleBtn" class="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-rose-600/30 transition flex items-center gap-2">
        <span id="btnIcon">▶</span>
        <span id="btnText">Start Session</span>
      </button>
      <button id="resetTimerBtn" class="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition" title="Reset">
        🔄
      </button>
    </div>

    <!-- Mini Task List -->
    <div class="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
      <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>Current Objective</span>
        <span id="taskDoneCounter" class="text-slate-500">1/3 Completed</span>
      </div>
      <div class="space-y-2" id="taskList">
        <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input type="checkbox" checked class="accent-rose-500 rounded cursor-pointer">
          <span class="line-through text-slate-500">Draft tool prompt & specifications</span>
        </label>
        <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input type="checkbox" class="accent-rose-500 rounded cursor-pointer">
          <span>Review sandboxed preview & mobile UI</span>
        </label>
        <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input type="checkbox" class="accent-rose-500 rounded cursor-pointer">
          <span>Export tool code to offline file</span>
        </label>
      </div>
    </div>
  </div>

  <script>
    let totalSeconds = 1500;
    let remainingSeconds = 1500;
    let timerId = null;
    let isRunning = false;
    let streak = 3;
    let currentMode = 'focus';

    const timeDisplay = document.getElementById('timeDisplay');
    const toggleBtn = document.getElementById('toggleBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const progressRing = document.getElementById('progressRing');
    const currentModeLabel = document.getElementById('currentModeLabel');
    const streakCount = document.getElementById('streakCount');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const circumference = 2 * Math.PI * 95;

    // Web Audio Synthesizer Chime
    function playChime() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.3, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 1.3);
        });
      } catch (e) {
        console.log('Audio not allowed yet:', e);
      }
    }

    function updateDisplay() {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      timeDisplay.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

      const offset = circumference - (remainingSeconds / totalSeconds) * circumference;
      progressRing.style.strokeDashoffset = offset;
    }

    function toggleTimer() {
      if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        btnText.textContent = 'Resume';
        btnIcon.textContent = '▶';
        toggleBtn.classList.replace('bg-amber-600', 'bg-rose-600');
      } else {
        isRunning = true;
        btnText.textContent = 'Pause';
        btnIcon.textContent = '⏸';
        toggleBtn.classList.replace('bg-rose-600', 'bg-amber-600');

        timerId = setInterval(() => {
          if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
          } else {
            clearInterval(timerId);
            isRunning = false;
            btnText.textContent = 'Completed!';
            btnIcon.textContent = '🎉';
            playChime();
            if (currentMode === 'focus') {
              streak++;
              streakCount.textContent = streak;
            }
          }
        }, 1000);
      }
    }

    function setMode(mode, seconds, label, color) {
      clearInterval(timerId);
      isRunning = false;
      currentMode = mode;
      totalSeconds = seconds;
      remainingSeconds = seconds;
      btnText.textContent = 'Start Session';
      btnIcon.textContent = '▶';
      toggleBtn.className = 'px-8 py-3.5 font-bold rounded-2xl text-base shadow-lg transition flex items-center gap-2 text-white bg-' + color + '-600 hover:bg-' + color + '-500';
      progressRing.setAttribute('class', 'text-' + color + '-500 transition-all duration-300');
      currentModeLabel.textContent = label;
      currentModeLabel.className = 'text-xs font-semibold uppercase tracking-widest text-' + color + '-400 mt-2';

      modeBtns.forEach(b => {
        if (b.dataset.mode === mode) {
          b.className = 'mode-btn flex-1 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition bg-' + color + '-600';
        } else {
          b.className = 'mode-btn flex-1 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition';
        }
      });

      updateDisplay();
    }

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        const time = Number(btn.dataset.time);
        if (mode === 'focus') setMode('focus', time, 'Deep Focus', 'rose');
        if (mode === 'short') setMode('short', time, 'Short Rest', 'emerald');
        if (mode === 'long') setMode('long', time, 'Recharge Break', 'indigo');
      });
    });

    toggleBtn.addEventListener('click', toggleTimer);
    resetTimerBtn.addEventListener('click', () => {
      clearInterval(timerId);
      isRunning = false;
      remainingSeconds = totalSeconds;
      btnText.textContent = 'Start Session';
      btnIcon.textContent = '▶';
      updateDisplay();
    });

    // Checkbox counter
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]');
    function updateTasks() {
      const checked = Array.from(checkboxes).filter(c => c.checked).length;
      document.getElementById('taskDoneCounter').textContent = checked + '/' + checkboxes.length + ' Completed';
    }
    checkboxes.forEach(c => c.addEventListener('change', updateTasks));

    updateDisplay();
  </script>
</body>
</html>`
  },
  {
    id: 'sample_regex_tester',
    title: 'Regex Lab: Pattern Tester & Cheat Sheet',
    tagline: 'Test regular expressions in real-time with visual match highlighting, flag toggles, and token explanations',
    category: 'Developer',
    prompt: 'An interactive RegEx tester with regex pattern input, flags selector (g, i, m, s), sample text area with highlighted matches, match count badge, match list, and common regex presets.',
    features: [
      'Real-time live matching with syntax error catching',
      'Interactive flag toggles: Global, Case-Insensitive, Multiline',
      'Color-coded match highlighting in sample text',
      'Common presets (Email, URL, Phone, IPv4, Date, Hex colors)',
    ],
    instructions: 'Enter your regex pattern, select flags, type or paste test text, or pick a preset pattern from the dropdown.',
    createdAt: new Date().toISOString(),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Regex Lab</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-6 font-sans">
  <div class="max-w-2xl mx-auto bg-slate-850 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl bg-slate-800/80">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3 mb-5">
      <div>
        <h1 class="text-lg font-bold text-white flex items-center gap-2">
          <span>🔍</span> Regex Lab & Tester
        </h1>
        <p class="text-xs text-slate-400">Validate regular expressions against test text instantly</p>
      </div>
      <!-- Preset Dropdown -->
      <select id="presetSelect" class="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-medium focus:outline-none focus:border-indigo-500">
        <option value="">⚡ Load Preset Pattern...</option>
        <option value="email">Email Address</option>
        <option value="url">URL (http/https)</option>
        <option value="phone">US Phone Number</option>
        <option value="hex">Hex Color Code</option>
        <option value="date">Date (YYYY-MM-DD)</option>
      </select>
    </div>

    <!-- Regex Input with Flags -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Regular Expression</label>
      <div class="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-500">
        <span class="text-slate-500 font-mono text-base font-bold">/</span>
        <input type="text" id="regexInput" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" class="w-full bg-transparent text-emerald-400 font-mono text-sm px-2 focus:outline-none">
        <span class="text-slate-500 font-mono text-base font-bold">/</span>
        <div class="flex items-center gap-1.5 ml-3 border-l border-slate-700 pl-3">
          <label class="flex items-center gap-1 text-xs text-slate-300 cursor-pointer font-mono"><input type="checkbox" id="flagG" checked class="accent-indigo-500">g</label>
          <label class="flex items-center gap-1 text-xs text-slate-300 cursor-pointer font-mono"><input type="checkbox" id="flagI" checked class="accent-indigo-500">i</label>
          <label class="flex items-center gap-1 text-xs text-slate-300 cursor-pointer font-mono"><input type="checkbox" id="flagM" class="accent-indigo-500">m</label>
        </div>
      </div>
      <div id="errorMsg" class="text-xs text-rose-400 mt-1.5 hidden flex items-center gap-1">⚠️ Invalid pattern</div>
    </div>

    <!-- Test String -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1.5">
        <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Test Text</label>
        <span id="matchBadge" class="text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-0.5 rounded-full">2 Matches</span>
      </div>
      <textarea id="testInput" rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500">Hello team! Send questions to contact@toolforge.ai or reach support@example.com for help. Phone is 555-123-4567.</textarea>
    </div>

    <!-- Highlighted Output Area -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Highlighted Matches</label>
      <div id="highlightBox" class="w-full min-h-[80px] bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-300 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed"></div>
    </div>

    <!-- Match List Summary -->
    <div>
      <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Captured Results</label>
      <div id="matchesList" class="flex flex-wrap gap-2 max-h-36 overflow-y-auto"></div>
    </div>
  </div>

  <script>
    const regexInput = document.getElementById('regexInput');
    const flagG = document.getElementById('flagG');
    const flagI = document.getElementById('flagI');
    const flagM = document.getElementById('flagM');
    const testInput = document.getElementById('testInput');
    const highlightBox = document.getElementById('highlightBox');
    const matchBadge = document.getElementById('matchBadge');
    const matchesList = document.getElementById('matchesList');
    const errorMsg = document.getElementById('errorMsg');
    const presetSelect = document.getElementById('presetSelect');

    const presets = {
      email: { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}', text: 'Send inquiries to hello@company.com or sales@enterprise.org.' },
      url: { pattern: 'https?:\\\\/\\\\/[\\\\w\\\\.-]+\\\\.[a-z]{2,}(\\\\S*)?', text: 'Visit our site at https://toolforge.ai or read docs at https://example.org/guide' },
      phone: { pattern: '\\\\b\\\\d{3}[-.]?\\\\d{3}[-.]?\\\\d{4}\\\\b', text: 'Call us at 415-555-0199 or office number 800.555.0123 today.' },
      hex: { pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\\\b', text: 'Theme colors: #4f46e5 primary, #10b981 accent, and #fff background.' },
      date: { pattern: '\\\\b\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\b', text: 'Milestones: 2026-03-15 kick-off, 2026-06-30 beta release.' }
    };

    function runRegex() {
      const pattern = regexInput.value;
      let flags = '';
      if (flagG.checked) flags += 'g';
      if (flagI.checked) flags += 'i';
      if (flagM.checked) flags += 'm';

      errorMsg.classList.add('hidden');

      if (!pattern) {
        highlightBox.textContent = testInput.value;
        matchBadge.textContent = '0 Matches';
        matchesList.innerHTML = '<span class="text-xs text-slate-500">No pattern entered</span>';
        return;
      }

      try {
        const re = new RegExp(pattern, flags);
        const text = testInput.value;
        
        let match;
        let matches = [];
        let html = '';
        let lastIndex = 0;

        if (flags.includes('g')) {
          while ((match = re.exec(text)) !== null) {
            if (match.index === re.lastIndex) re.lastIndex++;
            matches.push({ text: match[0], index: match.index });
          }
        } else {
          match = re.exec(text);
          if (match) matches.push({ text: match[0], index: match.index });
        }

        matchBadge.textContent = matches.length + (matches.length === 1 ? ' Match' : ' Matches');

        // Build highlighted text safely
        lastIndex = 0;
        matches.forEach(m => {
          const before = text.slice(lastIndex, m.index);
          html += escapeHtml(before);
          html += '<mark class="bg-indigo-500/30 text-indigo-300 font-bold px-1 rounded border border-indigo-400/50">' + escapeHtml(m.text) + '</mark>';
          lastIndex = m.index + m.text.length;
        });
        html += escapeHtml(text.slice(lastIndex));
        highlightBox.innerHTML = html || '<span class="text-slate-500">No text</span>';

        // Captured badges
        if (matches.length > 0) {
          matchesList.innerHTML = matches.map((m, idx) => 
            '<div class="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-1.5"><span class="text-[10px] text-slate-500 font-sans">#' + (idx + 1) + '</span> ' + escapeHtml(m.text) + '</div>'
          ).join('');
        } else {
          matchesList.innerHTML = '<span class="text-xs text-slate-500">No matches found</span>';
        }

      } catch (err) {
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = '⚠️ ' + err.message;
        highlightBox.textContent = testInput.value;
        matchBadge.textContent = 'Error';
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    regexInput.addEventListener('input', runRegex);
    testInput.addEventListener('input', runRegex);
    flagG.addEventListener('change', runRegex);
    flagI.addEventListener('change', runRegex);
    flagM.addEventListener('change', runRegex);

    presetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (presets[val]) {
        regexInput.value = presets[val].pattern;
        testInput.value = presets[val].text;
        runRegex();
      }
    });

    runRegex();
  </script>
</body>
</html>`
  }
];

export const INSPIRATION_PROMPTS = [
  {
    category: 'Finance',
    icon: '💵',
    title: 'Smart Loan & Mortgage Amortization',
    prompt: 'A mortgage and auto loan calculator with loan amount, interest rate, term in years, monthly payment, total interest calculation, and a visual year-by-year amortization table with export to CSV.',
  },
  {
    category: 'Productivity',
    icon: '📋',
    title: 'Markdown to Formatted Table & HTML',
    prompt: 'A live Markdown table converter and editor where you can paste comma/tab/pipe separated text and generate formatted markdown, clean HTML tables, and copy ready-to-use HTML code.',
  },
  {
    category: 'Security',
    icon: '🔐',
    title: 'Secure Passphrase & Password Generator',
    prompt: 'A secure password and memorable passphrase generator with entropy strength meter, custom symbols, phonetic words option, length slider, and instant one-click copy.',
  },
  {
    category: 'Design',
    icon: '🎨',
    title: 'Color Palette & WCAG Contrast Checker',
    prompt: 'A color palette generator with hex/rgb inputs, random palette generator, and real-time WCAG AA / AAA text contrast ratio validator with pass/fail badges.',
  },
  {
    category: 'Utility',
    icon: '⚖️',
    title: 'Cooking & Kitchen Unit Converter',
    prompt: 'A cooking and baking unit converter: cups, tablespoons, teaspoons, grams, ounces, milliliters, Celsius/Fahrenheit with ingredient density presets (flour, sugar, butter, milk).',
  },
  {
    category: 'Developer',
    icon: '📦',
    title: 'JSON to TypeScript Interface Generator',
    prompt: 'A tool that takes any arbitrary JSON object or array, parses it, and generates clean, strongly-typed TypeScript interfaces with optional fields detection and copy button.',
  },
];
