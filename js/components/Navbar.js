// SmartCanteen AI - Top Navbar & Mobile Header Component
window.Navbar = function(data, options = {}) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const demoMode = data.system.demoMode;

  // Determine current time greeting
  const hour = new Date().getHours();
  let greeting = "Good Afternoon 👋";
  if (hour < 12) greeting = "Good Morning ☕";
  else if (hour >= 17) greeting = "Good Evening 🌆";

  return `
    <!-- Top Global Announcement: Demo Mode Watermark Banner -->
    ${demoMode ? `
      <div class="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-xs py-1.5 px-4 text-center font-mono font-medium flex items-center justify-center gap-2 shadow-sm">
        <span class="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping-subtle"></span>
          DEMO MODE ● ON
        </span>
        <span class="truncate">All queue values and predictions shown in this prototype are simulated demonstration data.</span>
        <button onclick="window.App.toggleDemoMode()" class="underline hover:text-sky-200 text-[11px] ml-2 font-sans font-bold">Dismiss</button>
      </div>
    ` : ''}

    <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 sm:px-6 py-3.5 transition-colors">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        <!-- Left: Page Title & Greeting or Mobile Brand -->
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Button -->
          <button onclick="window.App.toggleMobileMenu()" class="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            ${window.Icons.Menu("w-5 h-5")}
          </button>

          <!-- Mobile Logo (hidden on lg) -->
          <div class="flex lg:hidden items-center gap-2 cursor-pointer" onclick="window.App.switchPage('dashboard')">
            <div class="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              ${window.Icons.Brain("w-4 h-4")}
            </div>
            <span class="font-extrabold text-slate-900 dark:text-white text-sm">SmartCanteen <span class="text-sky-500">AI</span></span>
          </div>

          <!-- Desktop Title & Subtitle -->
          <div class="hidden sm:block">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono tracking-wider uppercase">${greeting}</span>
              <span class="text-slate-300 dark:text-slate-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping-subtle"></span>
                SYSTEM ONLINE
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">SmartCanteen AI Dashboard</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">“Real-time queue intelligence for smarter canteen management.”</p>
          </div>
        </div>

        <!-- Right: Action Controls (Scenario selector, Live Ticker, Dark/Light Mode) -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Scenario Trigger Dropdown for quick live demo during college presentation -->
          <div class="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono">
            <span class="px-2 text-[11px] text-slate-400 font-semibold">Sim Scenario:</span>
            <button onclick="window.App.setScenario('lunchRush')" class="px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${data.current.queueLength >= 32 ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
              Lunch Rush
            </button>
            <button onclick="window.App.setScenario('teaBreak')" class="px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${data.current.queueLength >= 18 && data.current.queueLength < 32 ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
              Tea Break
            </button>
            <button onclick="window.App.setScenario('afternoonCalm')" class="px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${data.current.queueLength < 18 ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
              Quiet Off-Peak
            </button>
          </div>

          <!-- Live Status Indicator -->
          <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping-subtle"></span>
            <span class="font-bold text-slate-700 dark:text-slate-300">LIVE</span>
            <span class="text-slate-400 text-[11px]" id="live-last-updated-text">Just now</span>
          </div>

          <!-- Dark / Light Theme Toggle -->
          <button onclick="window.App.toggleTheme()" 
                  title="Toggle Dark/Light Mode"
                  class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm">
            <span class="hidden dark:inline">${window.Icons.Sun("w-4 h-4 text-amber-400")}</span>
            <span class="inline dark:hidden">${window.Icons.Moon("w-4 h-4 text-slate-700")}</span>
          </button>
        </div>
      </div>
    </header>
  `;
};
