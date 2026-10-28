// SmartCanteen AI - Top Metric Cards Component
window.MetricCard = function(props) {
  const { title, value, unit, subtitle, icon, status, statusType, confidence, isDemo } = props;
  
  // Status badge styling
  let badgeStyle = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  let glowBorder = "";

  if (statusType === "HIGH" || status === "HIGH") {
    badgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/60";
    glowBorder = "hover:border-red-500/40";
  } else if (statusType === "MEDIUM" || status === "MEDIUM") {
    badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60";
    glowBorder = "hover:border-amber-500/40";
  } else if (statusType === "LOW" || status === "LOW") {
    badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60";
    glowBorder = "hover:border-emerald-500/40";
  }

  const iconSvg = window.Icons[icon] ? window.Icons[icon]("w-6 h-6") : window.Icons.Activity("w-6 h-6");

  return `
    <div class="glass-card glass-card-hover p-5 sm:p-6 transition-all duration-300 relative overflow-hidden group ${glowBorder}">
      <!-- Subtle top color accent strip -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
        statusType === 'HIGH' ? 'from-red-500 to-rose-600' :
        statusType === 'MEDIUM' ? 'from-amber-500 to-orange-500' :
        statusType === 'LOW' ? 'from-emerald-500 to-teal-500' :
        'from-sky-500 to-indigo-600'
      }"></div>

      <div class="flex items-start justify-between mb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">${title}</span>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">${value}</h3>
            ${unit ? `<span class="text-lg font-semibold text-slate-500 dark:text-slate-400">${unit}</span>` : ''}
          </div>
        </div>
        
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
          statusType === 'HIGH' ? 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400' :
          statusType === 'MEDIUM' ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400' :
          statusType === 'LOW' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400' :
          'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400'
        }">
          ${iconSvg}
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <p class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">${subtitle}</p>
        
        ${status ? `
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle}">
            <span class="w-1.5 h-1.5 rounded-full ${
              status === 'HIGH' ? 'bg-red-500 animate-ping-subtle' :
              status === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
            }"></span>
            ${status}
          </span>
        ` : ''}

        ${isDemo ? `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
            Demo prediction
          </span>
        ` : ''}
      </div>
    </div>
  `;
};
