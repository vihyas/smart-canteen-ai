// SmartCanteen AI - Staff Operations Command Center Page Component
window.StaffDashboardPage = function(data) {
  const current = data.current;
  const recommendations = data.staffRecommendations || [];
  const counters = data.counters || [];
  const counter4 = counters.find(c => c.id === 4);

  const recListHtml = recommendations.map(rec => `
    <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-start gap-3">
        <span class="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
          ${rec.id}
        </span>
        <div>
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">${rec.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${rec.desc}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="window.App.applyStaffAction(${rec.id})" 
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rec.applied 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                }">
          ${rec.applied ? '✓ Active / Applied' : rec.action}
        </button>
      </div>
    </div>
  `).join("");

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Canteen Operations Command</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              STAFF MODE ACTIVE
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time throughput management, counter dispatching, and queue mitigation</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.App.acknowledgeAllAlerts()" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5 active:scale-95">
            ${window.Icons.Check("w-4 h-4")}
            <span>Acknowledge All Alerts</span>
          </button>
        </div>
      </div>

      <!-- 17. OPERATIONS STATUS STRIP (4 metrics) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">CURRENT QUEUE</span>
          <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${current.queueLength} <span class="text-xs font-medium text-slate-400">students</span></div>
          <span class="text-[11px] font-mono text-red-500 font-bold mt-1 inline-block">+3 students in last 5m</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">ESTIMATED WAIT</span>
          <div class="text-3xl font-black text-amber-500 mt-1">${current.waitTimeMin} <span class="text-xs font-medium text-slate-400">min</span></div>
          <span class="text-[11px] font-mono text-slate-500 mt-1 inline-block">1.6 min / student avg</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">CROWD STATUS</span>
          <div class="text-3xl font-black ${current.crowdLevel === 'HIGH' ? 'text-red-500' : 'text-amber-500'} mt-1">${current.crowdLevel}</div>
          <span class="text-[11px] font-mono text-slate-500 mt-1 inline-block">Capacity load: 88%</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">PREDICTED PEAK</span>
          <div class="text-3xl font-black text-sky-500 mt-1">30 min</div>
          <span class="text-[11px] font-mono text-slate-500 mt-1 inline-block">Expected drop after 2:15 PM</span>
        </div>

      </div>

      <!-- 17. STAFF RECOMMENDATIONS LIST -->
      <div class="glass-card p-6 border-l-4 border-l-amber-500">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              ${window.Icons.Briefcase("w-5 h-5")}
            </span>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase font-mono">STAFF RECOMMENDATIONS</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">AI-suggested mitigating operational actions</p>
            </div>
          </div>
          <span class="badge-ai px-2.5 py-1 rounded text-xs font-mono font-bold">Automated Advisory</span>
        </div>

        <div class="space-y-3">
          ${recListHtml}
        </div>
      </div>

      <!-- COUNTER MANAGEMENT CONTROLLER -->
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Active Counter Controls</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Dynamically toggle service points to balance queue inflow</p>
          </div>
          <span class="text-xs font-mono text-slate-400">Active: <strong>${counters.filter(c => c.active).length} / ${counters.length}</strong></span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${counters.map(c => `
            <div class="p-4 rounded-2xl border ${c.active ? 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800' : 'bg-slate-100/50 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800'} flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-slate-400">COUNTER #${c.id}</span>
                  <span class="w-2 h-2 rounded-full ${c.active ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
                </div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-1">${c.name}</h4>
                <div class="text-xs text-slate-500 mt-2 font-mono">
                  Queue: <strong class="text-slate-900 dark:text-white">${c.active ? c.queue : 0} students</strong>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-[11px] font-mono text-slate-400">${c.active ? 'Active' : 'Standby'}</span>
                <button onclick="window.App.toggleCounter(${c.id})" 
                        class="px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                          c.active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }">
                  ${c.active ? 'Close' : 'Open Counter'}
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
};
