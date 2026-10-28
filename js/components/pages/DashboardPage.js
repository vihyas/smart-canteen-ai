// SmartCanteen AI - Central Dashboard Page Component
window.DashboardPage = function(data) {
  const current = data.current;
  const system = data.system;

  // 1. Metric Cards
  const card1 = window.MetricCard({
    title: "CURRENT QUEUE",
    value: current.queueLength,
    unit: "",
    subtitle: "Students waiting in queue",
    icon: "Users",
    status: current.crowdLevel,
    statusType: current.crowdLevel
  });

  const card2 = window.MetricCard({
    title: "ESTIMATED WAIT",
    value: current.waitTimeMin,
    unit: "min",
    subtitle: "Current estimated waiting time",
    icon: "Clock",
    status: current.waitTimeMin > 20 ? "HIGH" : (current.waitTimeMin > 10 ? "MEDIUM" : "LOW"),
    statusType: current.waitTimeMin > 20 ? "HIGH" : (current.waitTimeMin > 10 ? "MEDIUM" : "LOW")
  });

  const card3 = window.MetricCard({
    title: "CROWD LEVEL",
    value: current.crowdLevel,
    unit: "",
    subtitle: current.crowdLevel === 'HIGH' ? "Peak crowd detected" : (current.crowdLevel === 'MEDIUM' ? "Moderate queue traffic" : "Optimal counter flow"),
    icon: "UsersRound",
    status: current.crowdLevel,
    statusType: current.crowdLevel
  });

  const card4 = window.MetricCard({
    title: "AI CONFIDENCE",
    value: `${system.confidence}%`,
    unit: "",
    subtitle: "Prediction confidence score",
    icon: "Brain",
    isDemo: true
  });

  // 2. Visual queue representation (anonymous student icons/person indicators)
  const queueVisualIcons = Array.from({ length: Math.min(30, current.queueLength) }).map((_, idx) => {
    const isRed = current.crowdLevel === 'HIGH';
    const colorCls = isRed ? 'text-red-500 bg-red-50 dark:bg-red-950/40' : (current.crowdLevel === 'MEDIUM' ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40');
    return `
      <div class="p-1.5 rounded-lg ${colorCls} flex items-center justify-center transition-all hover:scale-125 cursor-pointer" title="Anonymous Student #${idx + 1}">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
    `;
  }).join("");

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- 5. TOP METRIC CARDS (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        ${card1}
        ${card2}
        ${card3}
        ${card4}
      </div>

      <!-- PROMINENT FAST-LANE PRE-ORDER BANNER -->
      <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white shadow-xl shadow-sky-600/20 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div class="relative z-10 max-w-xl">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 text-white border border-white/30 mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping-subtle"></span>
            FAST-LANE PRE-ORDER ACTIVE
          </span>
          <h3 class="text-xl sm:text-2xl font-black tracking-tight">Don't want to wait ${current.waitTimeMin} minutes in line?</h3>
          <p class="text-xs sm:text-sm text-sky-100 mt-1">Pre-order meals, snacks, or drinks online now, get an instant digital QR code pass, and collect directly at Express Counter 4.</p>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <button onclick="window.App.switchPage('order')" class="px-6 py-3 rounded-2xl text-xs sm:text-sm font-black bg-white text-slate-900 hover:bg-sky-50 shadow-lg transition-all flex items-center gap-2 active:scale-95">
            ${window.Icons.ShoppingBag("w-4 h-4 text-sky-600")}
            <span>Order Food & Get QR Pass</span>
            ${window.Icons.ArrowRight("w-4 h-4")}
          </button>
        </div>
      </div>

      <!-- 10. AI INSIGHT CARD -->
      <div>
        ${window.AIInsightCard(data)}
      </div>

      <!-- MAIN ROW: 6. LIVE QUEUE MONITORING & 7. CROWD LEVEL GAUGE -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- 6. LIVE QUEUE SECTION (2 cols) -->
        <div class="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  ${window.Icons.Users("w-5 h-5")}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Live Queue Monitoring</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Visual anonymous student queue distribution across service counters</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping-subtle"></span>
                  LIVE
                </span>
                <span class="text-xs text-slate-400 font-mono">Updated: Just now</span>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 mb-5 text-center">
              <div>
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Current Queue</span>
                <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">${current.queueLength} <span class="text-xs font-medium text-slate-500">students</span></div>
              </div>
              <div class="border-x border-slate-200 dark:border-slate-800">
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Estimated Wait</span>
                <div class="text-2xl font-extrabold text-amber-500 mt-0.5">${current.waitTimeMin} <span class="text-xs font-medium text-slate-500">minutes</span></div>
              </div>
              <div>
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Crowd Level</span>
                <div class="text-2xl font-extrabold ${current.crowdLevel === 'HIGH' ? 'text-red-500' : (current.crowdLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500')} mt-0.5">${current.crowdLevel}</div>
              </div>
            </div>

            <!-- Anonymous Person Indicator Grid -->
            <div>
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
                <span>Active Waiting Line (Anonymous Person Indicators):</span>
                <span>${current.queueLength} total persons detected</span>
              </div>
              <div class="p-4 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap gap-2 items-center justify-start min-h-[90px]">
                ${queueVisualIcons}
                ${current.queueLength > 30 ? `
                  <span class="text-xs font-mono font-bold text-slate-400 p-1.5">
                    +${current.queueLength - 30} more
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-5 text-xs text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5">
              ${window.Icons.ShieldCheck("w-4 h-4 text-emerald-500")}
              Strict Privacy Protocol • Anonymous Density Detection
            </span>
            <button onclick="window.App.switchPage('live-queue')" class="text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1">
              Open Camera Stream ${window.Icons.ChevronRight("w-3.5 h-3.5")}
            </button>
          </div>
        </div>

        <!-- 7. CROWD LEVEL INDICATOR (1 col) -->
        <div class="lg:col-span-1">
          ${window.CrowdIndicator(data)}
        </div>

      </div>

      <!-- 8. & 9. PREDICTION CHARTS (Queue Forecast & Wait-Time Prediction) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          ${window.PredictionCharts.QueueForecastChart(data)}
        </div>
        <div>
          ${window.PredictionCharts.WaitTimeChart(data)}
        </div>
      </div>

      <!-- Quick Action Modules Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="glass-card p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-sky-500/40 transition-all group" onclick="window.App.switchPage('order')">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              ${window.Icons.ShoppingBag("w-5 h-5")}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Smart Order & QR</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Skip the line at Counter 4</p>
            </div>
          </div>
          <span class="text-slate-400 group-hover:text-emerald-500 transition-colors">
            ${window.Icons.ChevronRight("w-5 h-5")}
          </span>
        </div>

        <div class="glass-card p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-sky-500/40 transition-all group" onclick="window.App.switchPage('student-view')">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              ${window.Icons.GraduationCap("w-5 h-5")}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Student Fast View</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">“Should I visit now?”</p>
            </div>
          </div>
          <span class="text-slate-400 group-hover:text-indigo-500 transition-colors">
            ${window.Icons.ChevronRight("w-5 h-5")}
          </span>
        </div>

        <div class="glass-card p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-sky-500/40 transition-all group" onclick="window.App.switchPage('staff-dashboard')">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              ${window.Icons.Briefcase("w-5 h-5")}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Staff Operations</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Counters & dispatch alerts</p>
            </div>
          </div>
          <span class="text-slate-400 group-hover:text-amber-500 transition-colors">
            ${window.Icons.ChevronRight("w-5 h-5")}
          </span>
        </div>

      </div>

    </div>
  `;
};
