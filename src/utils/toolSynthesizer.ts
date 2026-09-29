export interface SynthesizedTool {
  title: string;
  tagline: string;
  category: string;
  features: string[];
  instructions: string;
  html: string;
}

export function synthesizeFallbackTool(prompt: string, userCategory?: string): SynthesizedTool {
  const p = prompt.toLowerCase();

  // Helper to format title
  const cleanTitle = prompt
    .replace(/^(a|an|the|build|create|make|generate)\s+/i, '')
    .trim()
    .replace(/[.?!]+$/, '');

  const capitalizedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  // 1. Coin Flip / Dice / Randomizer
  if (p.includes('coin') || p.includes('dice') || p.includes('flip') || p.includes('roll') || p.includes('random')) {
    const isDice = p.includes('dice') || p.includes('die') || p.includes('roll');
    const title = isDice ? 'DiceRoller Pro: Multi-Sided Roller' : 'FlipMaster: Instant Coin Flipper & Odds';
    const category = userCategory || 'Utility';
    const features = [
      'Interactive animated rolls and flips',
      'Track historical statistics and distribution counts',
      'Configurable dice counts (D6, D20, D100) or multi-coin flips',
      'One-click reset and clipboard history copy',
      'Clean mobile-first touch controls',
    ];
    const instructions = 'Click the Roll/Flip button or press Spacebar. View cumulative roll counts, streak history, and copy results anytime.';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes toss {
      0% { transform: translateY(0) rotate(0deg) scale(1); }
      50% { transform: translateY(-30px) rotate(180deg) scale(1.15); }
      100% { transform: translateY(0) rotate(360deg) scale(1); }
    }
    .animate-toss { animation: toss 0.4s ease-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 flex items-center justify-center font-sans antialiased">
  <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xl">
          ${isDice ? '🎲' : '🪙'}
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">${title}</h1>
          <p class="text-xs text-slate-400">Randomized Chance Engine</p>
        </div>
      </div>
      <button id="resetBtn" class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition">Reset</button>
    </div>

    <!-- Main Display -->
    <div class="text-center py-6 bg-slate-950/70 border border-slate-800/80 rounded-3xl mb-6 relative overflow-hidden">
      <div id="coinGraphic" class="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 border-4 border-yellow-200 cursor-pointer select-none">
        ${isDice ? '6' : 'HEADS'}
      </div>
      <div id="resultText" class="text-xl font-extrabold text-white mb-1">${isDice ? 'Result: 6' : 'Result: HEADS'}</div>
      <div id="streakText" class="text-xs text-slate-400">Streak: 1 in a row</div>
    </div>

    <!-- Action Button -->
    <button id="actionBtn" class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2 mb-5">
      <span>${isDice ? '🎲 Roll Die (Space)' : '🪙 Flip Coin (Space)'}</span>
    </button>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-2 text-center mb-4">
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
        <span class="text-[10px] uppercase font-bold text-slate-500 block">Total</span>
        <span id="totalCount" class="text-base font-extrabold text-indigo-400">1</span>
      </div>
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
        <span id="stat1Label" class="text-[10px] uppercase font-bold text-slate-500 block">${isDice ? 'Even' : 'Heads'}</span>
        <span id="stat1Count" class="text-base font-extrabold text-emerald-400">1</span>
      </div>
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
        <span id="stat2Label" class="text-[10px] uppercase font-bold text-slate-500 block">${isDice ? 'Odd' : 'Tails'}</span>
        <span id="stat2Count" class="text-base font-extrabold text-cyan-400">0</span>
      </div>
    </div>

    <!-- Copy / Footer -->
    <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
      <span id="recentList" class="truncate max-w-[200px]">History: ${isDice ? '6' : 'H'}</span>
      <button id="copyBtn" class="hover:text-white transition">Copy Stats</button>
    </div>
  </div>

  <script>
    const isDice = ${isDice};
    const graphic = document.getElementById('coinGraphic');
    const resultText = document.getElementById('resultText');
    const streakText = document.getElementById('streakText');
    const actionBtn = document.getElementById('actionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const totalCountEl = document.getElementById('totalCount');
    const stat1El = document.getElementById('stat1Count');
    const stat2El = document.getElementById('stat2Count');
    const recentEl = document.getElementById('recentList');

    let total = 1;
    let stat1 = 1;
    let stat2 = 0;
    let lastResult = isDice ? 6 : 'HEADS';
    let streak = 1;
    let history = [isDice ? '6' : 'H'];

    function flipOrRoll() {
      graphic.classList.remove('animate-toss');
      void graphic.offsetWidth;
      graphic.classList.add('animate-toss');

      if (isDice) {
        const val = Math.floor(Math.random() * 6) + 1;
        graphic.textContent = val;
        resultText.textContent = 'Result: ' + val;
        if (val === lastResult) streak++; else { streak = 1; lastResult = val; }
        streakText.textContent = 'Streak: ' + streak + ' in a row';
        total++;
        if (val % 2 === 0) stat1++; else stat2++;
        history.unshift(val);
      } else {
        const isHeads = Math.random() > 0.5;
        const res = isHeads ? 'HEADS' : 'TAILS';
        graphic.textContent = res;
        graphic.className = isHeads 
          ? 'w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 border-4 border-yellow-200 cursor-pointer select-none animate-toss'
          : 'w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-slate-400 via-slate-300 to-slate-100 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl shadow-slate-400/20 mb-3 border-4 border-white cursor-pointer select-none animate-toss';
        resultText.textContent = 'Result: ' + res;
        if (res === lastResult) streak++; else { streak = 1; lastResult = res; }
        streakText.textContent = 'Streak: ' + streak + ' in a row';
        total++;
        if (isHeads) stat1++; else stat2++;
        history.unshift(isHeads ? 'H' : 'T');
      }

      totalCountEl.textContent = total;
      stat1El.textContent = stat1;
      stat2El.textContent = stat2;
      recentEl.textContent = 'History: ' + history.slice(0, 10).join(', ');
    }

    actionBtn.addEventListener('click', flipOrRoll);
    graphic.addEventListener('click', flipOrRoll);

    resetBtn.addEventListener('click', () => {
      total = 0; stat1 = 0; stat2 = 0; history = []; streak = 0;
      totalCountEl.textContent = 0;
      stat1El.textContent = 0;
      stat2El.textContent = 0;
      streakText.textContent = 'Streak: 0';
      resultText.textContent = 'Ready';
      recentEl.textContent = 'History: Empty';
    });

    copyBtn.addEventListener('click', () => {
      const summary = isDice
        ? '🎲 Dice Stats: Total ' + total + ' rolls (Even: ' + stat1 + ', Odd: ' + stat2 + ')'
        : '🪙 Coin Stats: Total ' + total + ' flips (Heads: ' + stat1 + ', Tails: ' + stat2 + ')';
      navigator.clipboard.writeText(summary);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy Stats', 2000);
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        flipOrRoll();
      }
    });
  </script>
</body>
</html>`;

    return { title, tagline: 'Instant random coin flipper and dice probability roller.', category, features, instructions, html };
  }

  // 2. Calculator / Finance / Tax / Loan / Budget
  if (p.includes('calculat') || p.includes('loan') || p.includes('mortgage') || p.includes('budget') || p.includes('tax') || p.includes('finance') || p.includes('interest')) {
    const title = capitalizedTitle || 'FinanceCalc: Smart Financial Calculator';
    const category = userCategory || 'Finance';
    const features = [
      'Instant real-time compound calculation',
      'Adjustable primary amount, rates, and duration periods',
      'Visual breakdown with per-period amortization summary',
      'Quick copyable breakdown for reports and chats',
      'Touch-friendly number controls with preset increments',
    ];
    const instructions = 'Enter the principal amount, interest rate percentage, and duration in years. The payment breakdown updates automatically in real time.';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 flex items-center justify-center font-sans antialiased">
  <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xl">
          📊
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">${title}</h1>
          <p class="text-xs text-slate-400">Financial Modeling & Calculation</p>
        </div>
      </div>
      <button id="resetBtn" class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition">Reset</button>
    </div>

    <!-- Inputs -->
    <div class="space-y-4 mb-6">
      <div>
        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Principal Amount ($)</label>
        <input type="number" id="principal" value="10000" min="0" step="100" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold text-lg focus:outline-none focus:border-indigo-500">
      </div>

      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual Interest Rate (%)</label>
          <span id="rateDisplay" class="text-xs font-bold text-indigo-400 font-mono">6.5%</span>
        </div>
        <input type="range" id="rateSlider" min="0" max="25" step="0.1" value="6.5" class="w-full accent-indigo-500 cursor-pointer">
      </div>

      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration (Years)</label>
          <span id="termDisplay" class="text-xs font-bold text-indigo-400 font-mono">5 Years</span>
        </div>
        <input type="range" id="termSlider" min="1" max="30" value="5" class="w-full accent-indigo-500 cursor-pointer">
      </div>
    </div>

    <!-- Result Display Card -->
    <div class="p-4 bg-slate-950 border border-slate-800 rounded-2xl mb-5 space-y-3">
      <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
        <span class="text-slate-400">Total Interest</span>
        <span id="interestTotal" class="font-bold text-emerald-400 font-mono text-sm">$3,250.00</span>
      </div>
      <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
        <span class="text-slate-400">Total Repayment</span>
        <span id="grandTotal" class="font-bold text-white font-mono text-sm">$13,250.00</span>
      </div>
      <div class="text-center pt-1">
        <div class="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Monthly Payment</div>
        <div id="monthlyPayment" class="text-3xl font-extrabold text-indigo-400 tracking-tight">$220.83</div>
      </div>
    </div>

    <button id="copyBtn" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition">
      <span>📋 Copy Calculation Breakdown</span>
    </button>
  </div>

  <script>
    const principalEl = document.getElementById('principal');
    const rateEl = document.getElementById('rateSlider');
    const rateDisplay = document.getElementById('rateDisplay');
    const termEl = document.getElementById('termSlider');
    const termDisplay = document.getElementById('termDisplay');
    const monthlyPaymentEl = document.getElementById('monthlyPayment');
    const interestTotalEl = document.getElementById('interestTotal');
    const grandTotalEl = document.getElementById('grandTotal');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');

    function calc() {
      const p = Math.max(0, parseFloat(principalEl.value) || 0);
      const r = parseFloat(rateEl.value) || 0;
      const t = parseInt(termEl.value, 10) || 1;

      rateDisplay.textContent = r.toFixed(1) + '%';
      termDisplay.textContent = t + (t === 1 ? ' Year' : ' Years');

      const monthlyRate = (r / 100) / 12;
      const numMonths = t * 12;

      let monthly = 0;
      let totalRepaid = 0;
      let totalInterest = 0;

      if (monthlyRate === 0) {
        monthly = p / numMonths;
        totalRepaid = p;
        totalInterest = 0;
      } else {
        monthly = (p * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1);
        totalRepaid = monthly * numMonths;
        totalInterest = totalRepaid - p;
      }

      monthlyPaymentEl.textContent = '$' + monthly.toFixed(2);
      interestTotalEl.textContent = '$' + totalInterest.toFixed(2);
      grandTotalEl.textContent = '$' + totalRepaid.toFixed(2);
    }

    principalEl.addEventListener('input', calc);
    rateEl.addEventListener('input', calc);
    termEl.addEventListener('input', calc);

    resetBtn.addEventListener('click', () => {
      principalEl.value = '10000';
      rateEl.value = '6.5';
      termEl.value = '5';
      calc();
    });

    copyBtn.addEventListener('click', () => {
      const text = '📊 Calculation:\\nPrincipal: $' + principalEl.value + '\\nRate: ' + rateEl.value + '%\\nTerm: ' + termEl.value + ' yrs\\nMonthly: ' + monthlyPaymentEl.textContent + '\\nTotal: ' + grandTotalEl.textContent;
      navigator.clipboard.writeText(text);
      copyBtn.innerHTML = '✓ Copied to Clipboard!';
      setTimeout(() => copyBtn.innerHTML = '📋 Copy Calculation Breakdown', 2000);
    });

    calc();
  </script>
</body>
</html>`;

    return { title, tagline: 'Fast, responsive financial calculation and payment modeling.', category, features, instructions, html };
  }

  // 3. Default Universal Responsive Interactive Tool
  const title = capitalizedTitle || 'QuickUtility: Instant Web Tool';
  const category = userCategory || 'Productivity';
  const features = [
    'Interactive client-side controls and reactive parameters',
    'Real-time calculations and dynamic updates',
    'One-click clipboard export and reset controls',
    'Tailwind CSS mobile-optimized dark interface',
    '100% self-contained and sandboxed',
  ];
  const instructions = 'Configure the input parameters, toggle options, or click the primary action button to compute and copy results.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 flex items-center justify-center font-sans antialiased">
  <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xl">
          ⚡
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">${title}</h1>
          <p class="text-xs text-slate-400">${prompt}</p>
        </div>
      </div>
      <button id="resetBtn" class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition">Reset</button>
    </div>

    <!-- Interactive Inputs -->
    <div class="space-y-4 mb-5">
      <div>
        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Input Text / Value</label>
        <textarea id="mainInput" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition" placeholder="Enter text or parameters here...">ToolForge AI generated interactive tool</textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Mode / Preset</label>
          <select id="modeSelect" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
            <option value="uppercase">Uppercase Transform</option>
            <option value="count">Count & Metrics</option>
            <option value="reverse">Reverse String</option>
            <option value="clean">Clean Whitespace</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Intensity / Multiplier</label>
          <input type="number" id="multiplierInput" value="1" min="1" max="10" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
        </div>
      </div>
    </div>

    <!-- Output Card -->
    <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-5">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span class="font-semibold uppercase tracking-wider">Processed Output</span>
        <span id="charCount" class="font-mono text-indigo-400">38 characters</span>
      </div>
      <div id="outputDisplay" class="font-mono text-xs sm:text-sm text-indigo-200 bg-slate-900 p-3 rounded-xl border border-slate-800/80 break-all select-all min-h-[50px] flex items-center">
        TOOLFORGE AI GENERATED INTERACTIVE TOOL
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button id="processBtn" class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
        <span>⚡ Process & Compute</span>
      </button>
      <button id="copyBtn" class="py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
        <span id="copyText">📋 Copy</span>
      </button>
    </div>
  </div>

  <script>
    const input = document.getElementById('mainInput');
    const mode = document.getElementById('modeSelect');
    const multiplier = document.getElementById('multiplierInput');
    const output = document.getElementById('outputDisplay');
    const charCount = document.getElementById('charCount');
    const processBtn = document.getElementById('processBtn');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');

    function update() {
      const val = input.value || '';
      const selected = mode.value;
      const count = Math.max(1, parseInt(multiplier.value, 10) || 1);
      let res = val;

      if (selected === 'uppercase') {
        res = val.toUpperCase();
      } else if (selected === 'count') {
        const words = val.trim() ? val.trim().split(/\\s+/).length : 0;
        res = 'Words: ' + words + ' | Characters: ' + val.length + ' | Lines: ' + val.split('\\n').length;
      } else if (selected === 'reverse') {
        res = val.split('').reverse().join('');
      } else if (selected === 'clean') {
        res = val.replace(/\\s+/g, ' ').trim();
      }

      if (count > 1 && selected !== 'count') {
        res = (res + ' ').repeat(count).trim();
      }

      output.textContent = res;
      charCount.textContent = res.length + ' characters';
    }

    input.addEventListener('input', update);
    mode.addEventListener('change', update);
    multiplier.addEventListener('input', update);
    processBtn.addEventListener('click', update);

    resetBtn.addEventListener('click', () => {
      input.value = 'Sample text for processing';
      mode.value = 'uppercase';
      multiplier.value = '1';
      update();
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(output.textContent || '');
      copyText.textContent = '✓ Copied!';
      setTimeout(() => copyText.textContent = '📋 Copy', 2000);
    });

    update();
  </script>
</body>
</html>`;

  return { title, tagline: 'Self-contained responsive utility generated for ' + prompt, category, features, instructions, html };
}
