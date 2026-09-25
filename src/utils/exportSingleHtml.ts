/**
 * Generates a completely standalone single HTML file containing inline CSS and JavaScript
 * supporting Dark Mode / Black Mode, the 85-student attendance grid, Flashcard sequential mode, and WhatsApp sharing.
 */
export function generateSingleFileHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>RollCall - 85 Students Daily Attendance Tracker</title>
  <!-- Tailwind CSS via CDN with Dark Mode configured -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class'
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
  <script>
    (function() {
      try {
        var t = localStorage.getItem('rollcall_theme_preference');
        var isDark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      } catch (e) {}
    })();
  </script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen pb-28 transition-colors duration-150">

  <!-- Top Sticky Header -->
  <header class="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
    <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
          RC
        </div>
        <div>
          <h1 class="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">RollCall 85</h1>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5" id="dateSubtitle">Today</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <button id="themeToggleBtn" class="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center" title="Toggle Light / Dark Mode">
          <span id="themeIcon">🌙</span>
        </button>

        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total:</span>
          <input type="number" id="strengthInput" min="1" max="300" value="85" 
                 class="w-12 text-center text-xs font-mono font-bold bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 py-0.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                 title="Total Students / Strength" />
        </div>
        <input type="date" id="dateInput" class="text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer" />
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-2xl mx-auto px-4 pt-4 space-y-4">

    <!-- Mode Switcher Tabs -->
    <div class="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-2xl gap-1">
      <button id="tabFlashcard" class="py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs flex items-center justify-center gap-1.5">
        <span>🗂 Flashcard Mode</span>
      </button>
      <button id="tabGrid" class="py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center gap-1.5">
        <span>⊞ 85-Box Grid View</span>
      </button>
    </div>

    <!-- Live Progress & 4-Stat Summary -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div class="grid grid-cols-4 gap-2">
        <div class="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Total</div>
          <div class="text-xl font-bold font-mono text-slate-900 dark:text-white" id="statTotal">85</div>
        </div>
        <div class="p-2 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-center">
          <div class="text-[10px] text-blue-700 dark:text-blue-400 font-semibold uppercase">Marked</div>
          <div class="text-xl font-bold font-mono text-blue-700 dark:text-blue-400" id="statMarked">0</div>
        </div>
        <div class="p-2 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
          <div class="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Present</div>
          <div class="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400" id="statPresent">0</div>
        </div>
        <div class="p-2 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-center">
          <div class="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase">Absent</div>
          <div class="text-xl font-bold font-mono text-rose-700 dark:text-rose-400" id="statAbsent">0</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="space-y-1 pt-1">
        <div class="flex items-center justify-between text-xs font-semibold">
          <span id="progressLabel" class="text-slate-700 dark:text-slate-300">0 / 85 Completed</span>
          <span id="progressPercent" class="text-slate-500 dark:text-slate-400 font-mono">0%</span>
        </div>
        <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex shadow-inner">
          <div id="barPresent" class="bg-emerald-500 h-full transition-all duration-300" style="width: 0%"></div>
          <div id="barAbsent" class="bg-rose-500 h-full transition-all duration-300" style="width: 0%"></div>
        </div>
      </div>

      <!-- Quick Bulk Actions -->
      <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <button id="markRemainingPresentBtn" class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          Mark Remaining Present
        </button>
        <div class="flex items-center gap-1.5">
          <button id="markAllPresentBtn" class="text-[11px] font-semibold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2 py-1">
            All Present
          </button>
          <span class="text-slate-300 dark:text-slate-700">·</span>
          <button id="resetAllBtn" class="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2 py-1">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW A: Flashcard / Sequential Carousel Mode -->
    <div id="viewFlashcard" class="space-y-4">
      
      <!-- Horizontal Carousel Viewport -->
      <div id="carouselTrack" class="relative py-2 px-2 overflow-hidden flex items-center justify-center min-h-[210px] sm:min-h-[230px]">
        <!-- Ambient status glow -->
        <div id="ambientGlow" class="absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-500 opacity-20 dark:opacity-30 rounded-full"></div>

        <!-- Left Peek Card -->
        <button id="leftPeekCard" class="hidden sm:flex absolute left-3 md:left-8 z-0 flex-col items-center justify-center w-20 md:w-24 h-36 md:h-40 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xs opacity-40 hover:opacity-75 transition-all scale-90 hover:scale-95 shadow-md cursor-pointer">
          <span class="text-[9px] font-mono text-slate-400 font-semibold mb-0.5" id="leftPeekRollText">Roll</span>
          <span class="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300" id="leftPeekRollNum">1</span>
          <span class="mt-1 text-[9px] font-bold" id="leftPeekStatus">⚪</span>
        </button>

        <!-- Center Floating Card -->
        <div class="relative z-10 w-full max-w-[240px] sm:max-w-[260px] flex items-center justify-center">
          <div id="centerCard" class="w-full rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-[190px] sm:h-[210px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" id="cardRollFraction">
                Roll 1 of 85
              </span>
              <span id="cardStatusBadge" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                ⚪ Unmarked
              </span>
            </div>

            <div class="text-center py-1 my-auto">
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Roll Number</div>
              <div class="text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums" id="cardRollBig">
                1
              </div>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5" id="cardTipText">
                Tap to toggle status
              </p>
            </div>

            <div class="text-center pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
              <span class="text-[9px] uppercase font-bold tracking-wider opacity-60">
                Click card or buttons below
              </span>
            </div>
          </div>
        </div>

        <!-- Right Peek Card -->
        <button id="rightPeekCard" class="hidden sm:flex absolute right-3 md:right-8 z-0 flex-col items-center justify-center w-20 md:w-24 h-36 md:h-40 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xs opacity-40 hover:opacity-75 transition-all scale-90 hover:scale-95 shadow-md cursor-pointer">
          <span class="text-[9px] font-mono text-slate-400 font-semibold mb-0.5" id="rightPeekRollText">Roll</span>
          <span class="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300" id="rightPeekRollNum">2</span>
          <span class="mt-1 text-[9px] font-bold" id="rightPeekStatus">⚪</span>
        </button>
      </div>

      <!-- Big Touch Buttons: PRESENT & ABSENT (Auto-advance) -->
      <div class="grid grid-cols-2 gap-3 pt-1">
        <button id="btnMarkPresent" class="min-h-[64px] sm:min-h-[70px] px-4 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 text-white rounded-2xl font-bold text-sm sm:text-base flex flex-col items-center justify-center gap-1 shadow-sm transition-transform cursor-pointer">
          <span>✅ PRESENT</span>
          <span class="text-[10px] font-normal opacity-90">Auto-slides to next ➔</span>
        </button>
        <button id="btnMarkAbsent" class="min-h-[64px] sm:min-h-[70px] px-4 py-3 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 active:scale-95 text-white rounded-2xl font-bold text-sm sm:text-base flex flex-col items-center justify-center gap-1 shadow-sm transition-transform cursor-pointer">
          <span>❌ ABSENT</span>
          <span class="text-[10px] font-normal opacity-90">Auto-slides to next ➔</span>
        </button>
      </div>

      <!-- Manual Navigation Buttons -->
      <div class="flex items-center justify-between gap-2 pt-2">
        <button id="btnPrev" class="flex-1 min-h-[44px] px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-2xs active:scale-98">
          ⬅ Previous
        </button>
        <button id="btnUnmark" class="min-h-[44px] px-3.5 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl">
          Unmark
        </button>
        <button id="btnNext" class="flex-1 min-h-[44px] px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-2xs active:scale-98">
          Next ➔
        </button>
      </div>

      <!-- Scrub slider -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
        <span class="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">Scrub Roll:</span>
        <input type="range" id="rollSlider" min="1" max="85" value="1" class="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer" />
        <span id="sliderVal" class="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 w-8 text-right shrink-0">1</span>
      </div>
    </div>

    <!-- VIEW B: Interactive 85-Box Grid View -->
    <div id="viewGrid" class="hidden space-y-3">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span class="font-semibold text-slate-700 dark:text-slate-300">Tap box to toggle:</span>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></span>
              <span class="text-slate-600 dark:text-slate-400 font-medium">Unmarked</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
              <span class="text-emerald-700 dark:text-emerald-400 font-bold">Present</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
              <span class="text-rose-700 dark:text-rose-400 font-bold">Absent</span>
            </div>
          </div>
        </div>

        <div id="gridContainer" class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          <!-- Injected by JavaScript -->
        </div>

        <div class="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Tip: Single tap cycles: Unmarked ➔ Present (Green) ➔ Absent (Red) ➔ Unmarked
        </div>
      </div>
    </div>

  </main>

  <!-- Sticky Bottom Thumb-Zone CTA Bar -->
  <div class="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-lg">
    <div class="max-w-2xl mx-auto flex items-center gap-2">
      <button id="openReportBtn" class="flex-1 min-h-[46px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm border border-transparent dark:border-slate-700">
        <span>Generate Coordinator Report</span>
      </button>
      <button id="quickWhatsAppBtn" class="min-h-[46px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-sm">
        <span>WhatsApp</span>
      </button>
    </div>
  </div>

  <!-- Report Modal -->
  <div id="reportModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
      <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Coordinator Report</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400" id="reportDate"></p>
        </div>
        <button id="closeReportBtn" class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full">✕</button>
      </div>

      <div class="p-5 overflow-y-auto space-y-4">
        <div class="grid grid-cols-3 gap-2">
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Strength</span>
            <span class="text-xl font-bold font-mono text-slate-900 dark:text-white" id="modalStrength">85</span>
          </div>
          <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
            <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase block">Present</span>
            <span class="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400" id="modalPresent">0</span>
          </div>
          <div class="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-center">
            <span class="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase block">Absent</span>
            <span class="text-xl font-bold font-mono text-rose-700 dark:text-rose-400" id="modalAbsent">0</span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Formatted Message</label>
            <button id="copyModalReportBtn" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Copy Text</button>
          </div>
          <textarea id="modalTextPreview" rows="5" class="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"></textarea>
        </div>
      </div>

      <div class="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <a id="modalWhatsAppLink" target="_blank" rel="noopener noreferrer" class="flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs">
          <span>Share via WhatsApp</span>
        </a>
        <button id="closeReportFooterBtn" class="min-h-[44px] px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- JavaScript Application Logic -->
  <script>
    // State
    let totalStrength = 85;
    let selectedDate = getTodayDate();
    let currentRoll = 1;
    let currentView = 'flashcard'; // 'flashcard' or 'grid'
    let records = {}; // { [roll]: 'unmarked' | 'present' | 'absent' }
    let isDark = false;
    let section = localStorage.getItem('rollcall_section_preference_v1') || '';

    function getTodayDate() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return \`\${y}-\${m}-\${d}\`;
    }

    function formatShortDate(dateStr) {
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-');
      return \`\${d}/\${m}/\${y}\`;
    }

    // Theme Management
    function initTheme() {
      const saved = localStorage.getItem('rollcall_theme_preference');
      if (saved === 'dark') {
        isDark = true;
      } else if (saved === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      applyTheme();

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('rollcall_theme_preference')) {
          isDark = e.matches;
          applyTheme();
        }
      });
    }

    function toggleTheme() {
      isDark = !isDark;
      localStorage.setItem('rollcall_theme_preference', isDark ? 'dark' : 'light');
      applyTheme();
    }

    function applyTheme() {
      const icon = document.getElementById('themeIcon');
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
        if (icon) icon.textContent = '☀️';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        if (icon) icon.textContent = '🌙';
      }
    }

    function init() {
      initTheme();

      // Load saved total strength
      const savedStrength = localStorage.getItem('rollcall_grid85_strength');
      if (savedStrength) {
        const parsed = parseInt(savedStrength, 10);
        if (parsed > 0 && parsed <= 300) totalStrength = parsed;
      }
      document.getElementById('strengthInput').value = totalStrength;

      // Date
      document.getElementById('dateInput').value = selectedDate;
      document.getElementById('dateSubtitle').textContent = formatShortDate(selectedDate);

      loadRecords();
      setupEvents();
      render();
    }

    function loadRecords() {
      const key = 'rollcall_grid85_' + selectedDate;
      const stored = localStorage.getItem(key);
      records = {};
      for (let i = 1; i <= totalStrength; i++) {
        records[i] = 'unmarked';
      }
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          for (let i = 1; i <= totalStrength; i++) {
            if (parsed[i]) records[i] = parsed[i];
          }
        } catch (e) {}
      }
    }

    function saveRecords() {
      const key = 'rollcall_grid85_' + selectedDate;
      try {
        localStorage.setItem(key, JSON.stringify(records));
      } catch (e) {}
    }

    function markRollAndAdvance(status) {
      records[currentRoll] = status;
      saveRecords();

      if ('vibrate' in navigator) {
        try { navigator.vibrate(15); } catch (e) {}
      }

      if (currentRoll < totalStrength) {
        currentRoll++;
      }
      render();
    }

    function toggleBox(roll) {
      const current = records[roll] || 'unmarked';
      let nextStatus = 'present';
      if (current === 'present') nextStatus = 'absent';
      else if (current === 'absent') nextStatus = 'unmarked';
      else nextStatus = 'present';

      records[roll] = nextStatus;
      currentRoll = roll;
      saveRecords();

      if ('vibrate' in navigator) {
        try { navigator.vibrate(15); } catch (e) {}
      }
      render();
    }

    function buildWhatsAppText() {
      const shortDate = formatShortDate(selectedDate);
      let text = \`📅 Date: \${shortDate}\\n\`;
      if (section && section.trim()) {
        text += \`Section: \${section.trim()}\\n\`;
      }
      const absentList = [];
      for (let i = 1; i <= totalStrength; i++) {
        if (records[i] === 'absent') absentList.push(i);
      }
      if (absentList.length > 0) {
        text += \`Absentees: \${absentList.join(', ')}\\n\`;
      } else {
        text += \`Absentees: None\\n\`;
      }
      return text;
    }

    function render() {
      // Counters
      let present = 0;
      let absent = 0;
      for (let i = 1; i <= totalStrength; i++) {
        if (records[i] === 'present') present++;
        else if (records[i] === 'absent') absent++;
      }
      const marked = present + absent;
      const unmarked = totalStrength - marked;

      document.getElementById('statTotal').textContent = totalStrength;
      document.getElementById('statMarked').textContent = marked;
      document.getElementById('statPresent').textContent = present;
      document.getElementById('statAbsent').textContent = absent;

      const pct = totalStrength > 0 ? Math.round((marked / totalStrength) * 100) : 0;
      document.getElementById('progressLabel').textContent = \`\${marked} / \${totalStrength} Completed\`;
      document.getElementById('progressPercent').textContent = \`\${pct}%\`;
      document.getElementById('barPresent').style.width = ((present / totalStrength) * 100) + '%';
      document.getElementById('barAbsent').style.width = ((absent / totalStrength) * 100) + '%';

      // Flashcard view render
      document.getElementById('cardRollFraction').textContent = \`Roll \${currentRoll} of \${totalStrength}\`;
      document.getElementById('cardRollBig').textContent = currentRoll;
      document.getElementById('rollSlider').max = totalStrength;
      document.getElementById('rollSlider').value = currentRoll;
      document.getElementById('sliderVal').textContent = currentRoll;

      const currentStatus = records[currentRoll] || 'unmarked';
      const badge = document.getElementById('cardStatusBadge');
      const centerCard = document.getElementById('centerCard');
      const ambientGlow = document.getElementById('ambientGlow');
      const cardTipText = document.getElementById('cardTipText');

      if (currentStatus === 'present') {
        badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs';
        badge.textContent = '✅ Present';
        centerCard.className = 'w-full rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-[190px] sm:h-[210px] bg-emerald-50/95 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-100 shadow-[0_8px_25px_-5px_rgba(16,185,129,0.35),0_0_18px_rgba(16,185,129,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.45),0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50';
        ambientGlow.className = 'absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-500 opacity-20 dark:opacity-30 rounded-full bg-emerald-500';
        cardTipText.textContent = 'Marked Present · Tap to toggle';
      } else if (currentStatus === 'absent') {
        badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs';
        badge.textContent = '❌ Absent';
        centerCard.className = 'w-full rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-[190px] sm:h-[210px] bg-rose-50/95 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/80 text-rose-950 dark:text-rose-100 shadow-[0_8px_25px_-5px_rgba(244,63,94,0.35),0_0_18px_rgba(244,63,94,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(244,63,94,0.45),0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/50';
        ambientGlow.className = 'absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-500 opacity-20 dark:opacity-30 rounded-full bg-rose-500';
        cardTipText.textContent = 'Marked Absent · Tap to toggle';
      } else {
        badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
        badge.textContent = '⚪ Unmarked';
        centerCard.className = 'w-full rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-[190px] sm:h-[210px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/60 hover:border-slate-300 dark:hover:border-slate-700';
        ambientGlow.className = 'absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-500 opacity-0 rounded-full bg-transparent';
        cardTipText.textContent = 'Tap to mark Present';
      }

      // Left peek card update
      const leftPeek = document.getElementById('leftPeekCard');
      if (currentRoll > 1) {
        leftPeek.classList.remove('hidden');
        document.getElementById('leftPeekRollText').textContent = \`Roll #\${currentRoll - 1}\`;
        document.getElementById('leftPeekRollNum').textContent = currentRoll - 1;
        const ls = records[currentRoll - 1] || 'unmarked';
        document.getElementById('leftPeekStatus').textContent = ls === 'present' ? '● Present' : ls === 'absent' ? '● Absent' : '○ Unmarked';
        document.getElementById('leftPeekStatus').className = ls === 'present' ? 'mt-2 text-[10px] font-bold text-emerald-600' : ls === 'absent' ? 'mt-2 text-[10px] font-bold text-rose-600' : 'mt-2 text-[10px] font-bold text-slate-400';
      } else {
        leftPeek.classList.add('hidden');
      }

      // Right peek card update
      const rightPeek = document.getElementById('rightPeekCard');
      if (currentRoll < totalStrength) {
        rightPeek.classList.remove('hidden');
        document.getElementById('rightPeekRollText').textContent = \`Roll #\${currentRoll + 1}\`;
        document.getElementById('rightPeekRollNum').textContent = currentRoll + 1;
        const rs = records[currentRoll + 1] || 'unmarked';
        document.getElementById('rightPeekStatus').textContent = rs === 'present' ? '● Present' : rs === 'absent' ? '● Absent' : '○ Unmarked';
        document.getElementById('rightPeekStatus').className = rs === 'present' ? 'mt-2 text-[10px] font-bold text-emerald-600' : rs === 'absent' ? 'mt-2 text-[10px] font-bold text-rose-600' : 'mt-2 text-[10px] font-bold text-slate-400';
      } else {
        rightPeek.classList.add('hidden');
      }

      document.getElementById('btnPrev').disabled = currentRoll <= 1;
      document.getElementById('btnNext').disabled = currentRoll >= totalStrength;

      // Grid view render
      const grid = document.getElementById('gridContainer');
      let gridHtml = '';
      for (let i = 1; i <= totalStrength; i++) {
        const st = records[i] || 'unmarked';
        let cls = 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-none';
        let symbol = '—';
        if (st === 'present') {
          cls = 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 border-emerald-600 dark:border-emerald-400 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)] dark:shadow-[0_0_16px_rgba(16,185,129,0.55)] ring-1 ring-emerald-400/40';
          symbol = 'P';
        } else if (st === 'absent') {
          cls = 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 border-rose-600 dark:border-rose-400 text-white shadow-[0_0_14px_rgba(244,63,94,0.45)] dark:shadow-[0_0_16px_rgba(244,63,94,0.55)] ring-1 ring-rose-400/40';
          symbol = 'A';
        }

        const isCurrent = i === currentRoll ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 dark:ring-offset-slate-900' : '';
        gridHtml += \`
          <button onclick="toggleBox(\${i})" class="min-h-[46px] rounded-xl font-mono text-sm font-bold border transition-all active:scale-95 flex flex-col items-center justify-center select-none \${cls} \${isCurrent}">
            <span>\${i}</span>
            <span class="text-[9px] uppercase tracking-tighter opacity-80 font-sans font-medium leading-none">\${symbol}</span>
          </button>
        \`;
      }
      grid.innerHTML = gridHtml;
    }

    function setupEvents() {
      // Theme toggle
      document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

      // Tab switcher
      const tabF = document.getElementById('tabFlashcard');
      const tabG = document.getElementById('tabGrid');
      const viewF = document.getElementById('viewFlashcard');
      const viewG = document.getElementById('viewGrid');

      tabF.addEventListener('click', () => {
        currentView = 'flashcard';
        tabF.className = 'py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs flex items-center justify-center gap-1.5';
        tabG.className = 'py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center gap-1.5';
        viewF.classList.remove('hidden');
        viewG.classList.add('hidden');
      });

      tabG.addEventListener('click', () => {
        currentView = 'grid';
        tabG.className = 'py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs flex items-center justify-center gap-1.5';
        tabF.className = 'py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center gap-1.5';
        viewG.classList.remove('hidden');
        viewF.classList.add('hidden');
      });

      // Flashcard buttons
      document.getElementById('btnMarkPresent').addEventListener('click', () => markRollAndAdvance('present'));
      document.getElementById('btnMarkAbsent').addEventListener('click', () => markRollAndAdvance('absent'));
      document.getElementById('btnPrev').addEventListener('click', () => {
        if (currentRoll > 1) { currentRoll--; render(); }
      });
      document.getElementById('btnNext').addEventListener('click', () => {
        if (currentRoll < totalStrength) { currentRoll++; render(); }
      });
      document.getElementById('btnUnmark').addEventListener('click', () => {
        records[currentRoll] = 'unmarked';
        saveRecords();
        render();
      });

      // Direct Card Clicks
      document.getElementById('centerCard').addEventListener('click', () => {
        const cur = records[currentRoll] || 'unmarked';
        markRollAndAdvance(cur === 'present' ? 'absent' : 'present');
      });
      document.getElementById('leftPeekCard').addEventListener('click', () => {
        if (currentRoll > 1) { currentRoll--; render(); }
      });
      document.getElementById('rightPeekCard').addEventListener('click', () => {
        if (currentRoll < totalStrength) { currentRoll++; render(); }
      });

      // Slider
      document.getElementById('rollSlider').addEventListener('input', (e) => {
        currentRoll = parseInt(e.target.value, 10);
        render();
      });

      // Strength input
      document.getElementById('strengthInput').addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val > 0 && val <= 300) {
          totalStrength = val;
          localStorage.setItem('rollcall_grid85_strength', String(val));
          if (currentRoll > totalStrength) currentRoll = totalStrength;
          loadRecords();
          render();
        }
      });

      // Date input
      document.getElementById('dateInput').addEventListener('change', (e) => {
        selectedDate = e.target.value || getTodayDate();
        document.getElementById('dateSubtitle').textContent = formatShortDate(selectedDate);
        loadRecords();
        render();
      });

      // Bulk buttons
      document.getElementById('markRemainingPresentBtn').addEventListener('click', () => {
        for (let i = 1; i <= totalStrength; i++) {
          if (records[i] === 'unmarked') records[i] = 'present';
        }
        saveRecords();
        render();
      });

      document.getElementById('markAllPresentBtn').addEventListener('click', () => {
        for (let i = 1; i <= totalStrength; i++) records[i] = 'present';
        saveRecords();
        render();
      });

      document.getElementById('resetAllBtn').addEventListener('click', () => {
        if (confirm('Reset all roll numbers to Unmarked?')) {
          for (let i = 1; i <= totalStrength; i++) records[i] = 'unmarked';
          saveRecords();
          render();
        }
      });

      // Report modal
      const reportModal = document.getElementById('reportModal');
      const openReport = () => {
        const text = buildWhatsAppText();
        document.getElementById('modalTextPreview').value = text;
        document.getElementById('reportDate').textContent = formatShortDate(selectedDate);
        document.getElementById('modalStrength').textContent = totalStrength;

        let present = 0;
        let absent = 0;
        const absentList = [];
        for (let i = 1; i <= totalStrength; i++) {
          if (records[i] === 'present') present++;
          else if (records[i] === 'absent') {
            absent++;
            absentList.push(i);
          }
        }
        document.getElementById('modalPresent').textContent = present;
        document.getElementById('modalAbsent').textContent = absent;

        document.getElementById('modalWhatsAppLink').href = \`https://wa.me/?text=\${encodeURIComponent(text)}\`;
        reportModal.classList.remove('hidden');
      };

      document.getElementById('modalTextPreview').addEventListener('input', (e) => {
        const text = e.target.value;
        document.getElementById('modalWhatsAppLink').href = \`https://wa.me/?text=\${encodeURIComponent(text)}\`;
      });

      document.getElementById('openReportBtn').addEventListener('click', openReport);
      document.getElementById('quickWhatsAppBtn').addEventListener('click', () => {
        const text = buildWhatsAppText();
        window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
      });

      document.getElementById('closeReportBtn').addEventListener('click', () => reportModal.classList.add('hidden'));
      document.getElementById('closeReportFooterBtn').addEventListener('click', () => reportModal.classList.add('hidden'));

      document.getElementById('copyModalReportBtn').addEventListener('click', () => {
        const text = buildWhatsAppText();
        navigator.clipboard.writeText(text).then(() => alert('Copied report to clipboard!'));
      });

      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        if (currentView !== 'flashcard') return;
        if (e.key === 'ArrowRight' || e.key === ' ') {
          if (currentRoll < totalStrength) { currentRoll++; render(); }
        } else if (e.key === 'ArrowLeft') {
          if (currentRoll > 1) { currentRoll--; render(); }
        } else if (e.key.toLowerCase() === 'p' || e.key === 'Enter') {
          markRollAndAdvance('present');
        } else if (e.key.toLowerCase() === 'a' || e.key === 'Backspace') {
          markRollAndAdvance('absent');
        }
      });
    }

    window.toggleBox = toggleBox;

    init();
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtml(): void {
  const htmlContent = generateSingleFileHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rollcall-85-students-attendance.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
