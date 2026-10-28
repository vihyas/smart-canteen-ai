// SmartCanteen AI - Alert Management & Notification Center Page Component
window.AlertsPage = function(data, filter = "all") {
  const alerts = data.alerts || [];

  const filteredAlerts = alerts.filter(a => {
    if (filter === "all") return true;
    return a.severity === filter;
  });

  const alertsListHtml = filteredAlerts.length ? filteredAlerts.map(a => {
    let iconColor = "bg-sky-500 text-white";
    let borderColor = "border-sky-200 dark:border-sky-800";
    let badgeCls = "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";

    if (a.severity === "high") {
      iconColor = "bg-red-500 text-white";
      borderColor = "border-red-200 dark:border-red-800/80 bg-red-500/5";
      badgeCls = "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-800";
    } else if (a.severity === "medium") {
      iconColor = "bg-amber-500 text-white";
      borderColor = "border-amber-200 dark:border-amber-800/80 bg-amber-500/5";
      badgeCls = "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800";
    } else if (a.severity === "low") {
      iconColor = "bg-emerald-500 text-white";
      borderColor = "border-emerald-200 dark:border-emerald-800/80 bg-emerald-500/5";
      badgeCls = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    }

    return `
      <div class="glass-card p-5 rounded-2xl border ${borderColor} flex flex-wrap items-center justify-between gap-4 transition-all">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center shrink-0 shadow-sm">
            ${a.severity === 'high' ? window.Icons.AlertTriangle("w-5 h-5") : (a.severity === 'medium' ? window.Icons.Clock("w-5 h-5") : window.Icons.CheckCircle("w-5 h-5"))}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${badgeCls}">
                ${a.badge}
              </span>
              <span class="text-xs text-slate-400 font-mono">${a.timestamp}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-1.5">${a.message}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">Recommended Action: ${a.recommendedAction}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          ${a.acknowledged ? `
            <span class="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              ${window.Icons.Check("w-3.5 h-3.5")} Acknowledged
            </span>
          ` : `
            <button onclick="window.App.acknowledgeAlert('${a.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all active:scale-95">
              Acknowledge Alert
            </button>
          `}
        </div>
      </div>
    `;
  }).join("") : `
    <div class="glass-card p-12 text-center text-slate-400">
      <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3">
        ${window.Icons.CheckCircle("w-6 h-6 text-emerald-500")}
      </div>
      <p class="text-sm font-bold text-slate-700 dark:text-slate-300">No alerts found for this filter</p>
    </div>
  `;

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Crowd & Queue Alerts</h2>
            <span class="badge-ai px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              REAL-TIME DISPATCH
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Automated threshold triggers notifying students & staff of queue events</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.App.acknowledgeAllAlerts()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-mono">
            Acknowledge All
          </button>
        </div>
      </div>

      <!-- 16. FILTER TABS (All | High | Medium | Low) -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button onclick="window.App.setAlertFilter('all')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          All (${alerts.length})
        </button>
        <button onclick="window.App.setAlertFilter('high')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === 'high' ? 'bg-red-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          🔴 High (${alerts.filter(a => a.severity === 'high').length})
        </button>
        <button onclick="window.App.setAlertFilter('medium')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === 'medium' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          🟠 Medium (${alerts.filter(a => a.severity === 'medium').length})
        </button>
        <button onclick="window.App.setAlertFilter('low')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === 'low' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          🟢 Low (${alerts.filter(a => a.severity === 'low').length})
        </button>
      </div>

      <!-- ALERTS LIST -->
      <div class="space-y-3">
        ${alertsListHtml}
      </div>

    </div>
  `;
};
