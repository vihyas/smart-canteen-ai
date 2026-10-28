// SmartCanteen AI - Dedicated Live Queue Monitoring Page Component
window.LiveQueuePage = function(data) {
  const current = data.current;
  const counters = data.counters || [];

  const counterCards = counters.map(c => `
    <div class="p-4 rounded-xl ${c.active ? 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800' : 'bg-slate-100/60 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800'} border flex flex-col justify-between">
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-mono font-bold text-slate-400">COUNTER ${c.id}</span>
          <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">${c.name}</h4>
        </div>
        <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
          c.active ? (c.status === 'Peak' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300') : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }">
          ${c.status}
        </span>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div>
          <span class="text-slate-400">Queue:</span>
          <strong class="text-slate-900 dark:text-white font-bold ml-1">${c.active ? c.queue : 0} st</strong>
        </div>
        <div>
          <span class="text-slate-400">Speed:</span>
          <span class="text-sky-600 dark:text-sky-400 font-bold ml-1">${c.avgSpeed}</span>
        </div>
      </div>
    </div>
  `).join("");

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header with Current Status Cards -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Live Queue Vision & Tracking</h2>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping-subtle"></span>
              CAM-01 ONLINE
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time simulated computer-vision tracking for automated people counting</p>
        </div>

        <div class="flex items-center gap-2 font-mono text-xs">
          <button onclick="window.App.triggerSimulationTick()" class="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 transition-all font-bold flex items-center gap-1.5 active:scale-95">
            ${window.Icons.Zap("w-3.5 h-3.5")}
            <span>Simulate Inflow Spike</span>
          </button>
        </div>
      </div>

      <!-- 13. CURRENT STATUS SUMMARY STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-bold text-slate-400 uppercase">CURRENT QUEUE</span>
            <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${current.queueLength} <span class="text-xs font-medium text-slate-400">students</span></div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            ${window.Icons.Users("w-5 h-5")}
          </div>
        </div>

        <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-bold text-slate-400 uppercase">ESTIMATED WAIT</span>
            <div class="text-3xl font-black text-amber-500 mt-1">${current.waitTimeMin} <span class="text-xs font-medium text-slate-400">mins</span></div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            ${window.Icons.Clock("w-5 h-5")}
          </div>
        </div>

        <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-bold text-slate-400 uppercase">CROWD STATUS</span>
            <div class="text-3xl font-black ${current.crowdLevel === 'HIGH' ? 'text-red-500' : (current.crowdLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500')} mt-1">${current.crowdLevel}</div>
          </div>
          <div class="w-10 h-10 rounded-xl ${current.crowdLevel === 'HIGH' ? 'bg-red-500/10 text-red-500' : (current.crowdLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500')} flex items-center justify-center">
            ${window.Icons.Activity("w-5 h-5")}
          </div>
        </div>

      </div>

      <!-- CAMERA MONITOR FEED -->
      <div>
        ${window.CameraMonitor(data, { compact: false })}
      </div>

      <!-- ACTIVE COUNTERS BREAKDOWN -->
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Active Counter Queue Distribution</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Real-time load balancing across dining counters</p>
          </div>
          <button onclick="window.App.switchPage('staff-dashboard')" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
            Manage Service Counters ${window.Icons.ChevronRight("w-3.5 h-3.5")}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${counterCards}
        </div>
      </div>

    </div>
  `;
};
