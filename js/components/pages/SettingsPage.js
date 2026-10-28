// SmartCanteen AI - Settings & Simulation Control Center Page Component
window.SettingsPage = function(data) {
  const system = data.system;
  const current = data.current;

  return `
    <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Simulation & System Settings</h2>
            <span class="badge-ai px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              DEMO ENGINE
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Control simulated traffic scenarios, inference speed, and demo watermarks</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.App.resetDemoData()" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Reset to Baseline
          </button>
        </div>
      </div>

      <!-- 26. DEMO MODE MASTER TOGGLE -->
      <div class="glass-card p-6 rounded-2xl border-2 border-sky-500/30">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              ${window.Icons.Brain("w-6 h-6")}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Global Demo Mode Watermark</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${system.demoMode ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'}">
                  ${system.demoMode ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Displays the “DEMO MODE ● ON: All queue values and predictions shown in this prototype are simulated demonstration data” header banner across the application.
              </p>
            </div>
          </div>

          <div>
            <button onclick="window.App.toggleDemoMode()" class="px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
              system.demoMode 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }">
              ${system.demoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
            </button>
          </div>
        </div>
      </div>

      <!-- SCENARIO SWITCHER -->
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Simulated Peak Scenarios</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-5">Select a campus dining scenario to immediately observe live fluctuations across all pages</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-sky-500/50 cursor-pointer transition-all" onclick="window.App.setScenario('lunchRush')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-red-500 uppercase">🔴 Lunch Rush (Peak)</span>
              <span class="text-xs font-bold font-mono">37 Students</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">High congestion (25 min wait time), peak inflow exceeding capacity.</p>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-sky-500/50 cursor-pointer transition-all" onclick="window.App.setScenario('teaBreak')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-amber-500 uppercase">🟠 Tea & Snack Break</span>
              <span class="text-xs font-bold font-mono">24 Students</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Medium crowd (16 min wait), brisk snack counter activity.</p>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-sky-500/50 cursor-pointer transition-all" onclick="window.App.setScenario('afternoonCalm')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-emerald-500 uppercase">🟢 Afternoon Calm</span>
              <span class="text-xs font-bold font-mono">11 Students</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Low congestion (7 min wait), optimal fast meal turnaround.</p>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-sky-500/50 cursor-pointer transition-all" onclick="window.App.setScenario('morningQuiet')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-emerald-500 uppercase">🟢 Morning Breakfast</span>
              <span class="text-xs font-bold font-mono">8 Students</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimal queue (5 min wait), instant counter availability.</p>
          </div>

        </div>
      </div>

      <!-- LIVE TICKER & INJECTION CONTROLS -->
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Live Ticker & Custom Queue Injection</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Manually inject queue size to test gauge animations and prediction recalibration</p>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Inject Custom Queue Length:</span>
              <span class="text-sky-500 text-sm" id="custom-queue-val">${current.queueLength} Students</span>
            </div>
            <input type="range" min="5" max="65" value="${current.queueLength}" 
                   class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                   oninput="window.App.setCustomQueue(this.value)">
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-mono text-slate-500">Live Engine Ticker:</span>
              <button onclick="window.App.toggleLiveSimulation()" class="px-3 py-1.5 rounded-lg font-mono font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                Trigger +1 Tick Now
              </button>
            </div>

            <div class="flex items-center gap-2 font-mono">
              <span class="text-slate-500">Speed:</span>
              <button onclick="window.SimulationEngine.setSimSpeed(2000)" class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">2s</button>
              <button onclick="window.SimulationEngine.setSimSpeed(4000)" class="px-2 py-1 rounded bg-sky-600 text-white font-bold">4s (Default)</button>
              <button onclick="window.SimulationEngine.setSimSpeed(8000)" class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">8s</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
};
