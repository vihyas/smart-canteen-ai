// SmartCanteen AI - Dedicated AI Prediction Page Component
window.PredictionPage = function(data) {
  const current = data.current;
  const factors = data.factors || [];

  const factorCards = factors.map(f => {
    const iconSvg = window.Icons[f.icon] ? window.Icons[f.icon]("w-5 h-5 text-sky-500") : window.Icons.Zap("w-5 h-5 text-sky-500");
    return `
      <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
        <div class="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
          ${iconSvg}
        </div>
        <div>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase font-mono">${f.title}</h4>
          <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">${f.value}</div>
          <span class="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-semibold">${f.impact}</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Queue Forecasting & Trend Inference</h2>
            <span class="badge-ai px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              PROTOTYPE FORECAST
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-horizon queue arrival forecasting powered by simulated regression heuristics</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono font-semibold">
            ${window.Icons.Sparkles("w-3.5 h-3.5 inline mr-1")}
            Simulated Demonstration Model
          </span>
        </div>
      </div>

      <!-- 14. CURRENT SITUATION & MULTI-HORIZON HORIZONS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Current Situation Card -->
        <div class="glass-card p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-transparent">
          <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">CURRENT SITUATION</span>
          <div class="mt-3 space-y-1.5 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-500">Queue:</span>
              <strong class="text-slate-900 dark:text-white">${current.queueLength} students</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Wait:</span>
              <strong class="text-amber-500">${current.waitTimeMin} min</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Crowd:</span>
              <strong class="text-red-500">${current.crowdLevel}</strong>
            </div>
          </div>
        </div>

        <!-- Next 15 min -->
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">NEXT 15 MIN FORECAST</span>
          <div class="text-2xl font-extrabold text-red-500 mt-2">HIGH</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Expected queue: ~41 students</p>
          <div class="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-red-500 h-full w-[85%]"></div>
          </div>
        </div>

        <!-- Next 30 min -->
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">NEXT 30 MIN (PEAK)</span>
          <div class="text-2xl font-extrabold text-red-500 mt-2">HIGH (PEAK)</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Expected queue: ~45 students</p>
          <div class="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-red-500 h-full w-[95%]"></div>
          </div>
        </div>

        <!-- Next 60 min -->
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">NEXT 60 MIN FORECAST</span>
          <div class="text-2xl font-extrabold text-amber-500 mt-2">MEDIUM</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Expected queue: ~29 students</p>
          <div class="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full w-[55%]"></div>
          </div>
        </div>

      </div>

      <!-- 8. & 9. PREDICTION CHARTS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          ${window.PredictionCharts.QueueForecastChart(data)}
        </div>
        <div>
          ${window.PredictionCharts.WaitTimeChart(data)}
        </div>
      </div>

      <!-- 14. FACTORS USED SECTION -->
      <div class="glass-card p-6">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Feature Weights & Factors Used</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Inference parameters fed into the predictive queue modeling pipeline</p>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            5 Features Active
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${factorCards}
        </div>

        <!-- AI Model Disclaimer -->
        <div class="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="p-1 rounded bg-sky-500 text-white">${window.Icons.Cpu("w-3.5 h-3.5")}</span>
            <span class="text-slate-700 dark:text-slate-300 font-bold">AI Model: Queue Forecasting Prototype (Time-series Heuristics)</span>
          </div>
          <span class="text-slate-500 dark:text-slate-400 text-[11px]">
            * Note: Simulated prototype demonstration data for academic presentation.
          </span>
        </div>
      </div>

    </div>
  `;
};
