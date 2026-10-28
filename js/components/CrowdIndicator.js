// SmartCanteen AI - Circular Gauge / Crowd Level Indicator Component
window.CrowdIndicator = function(data) {
  const current = data.current;
  const level = current.crowdLevel; // "LOW", "MEDIUM", "HIGH"
  const queue = current.queueLength;
  const wait = current.waitTimeMin;
  
  // Calculate gauge parameters
  // Total arc is 180 degrees (half circle)
  let percentage = 33;
  let strokeColor = "#10b981"; // green
  let glowColor = "rgba(16, 185, 129, 0.3)";
  
  if (level === "HIGH") {
    percentage = 90;
    strokeColor = "#ef4444"; // red
    glowColor = "rgba(239, 68, 68, 0.35)";
  } else if (level === "MEDIUM") {
    percentage = 58;
    strokeColor = "#f59e0b"; // amber
    glowColor = "rgba(245, 158, 11, 0.35)";
  }

  // Radius = 80, circumference = 2 * PI * 80 = ~502.6, half circle = 251.3
  const halfCircumference = 251.3;
  const offset = halfCircumference - (halfCircumference * (percentage / 100));

  return `
    <div class="glass-card p-6 flex flex-col items-center justify-between relative overflow-hidden text-center">
      <div class="w-full flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            ${window.Icons.Activity("w-4 h-4")}
          </span>
          <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase font-mono">Crowd Gauge</h3>
        </div>
        <span class="text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
          level === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
          level === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
        }">
          ● Real-time
        </span>
      </div>

      <!-- Semi-Circle Gauge SVG -->
      <div class="relative w-56 h-32 my-3 flex items-end justify-center">
        <svg class="w-56 h-32" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#ef4444" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${strokeColor}" flood-opacity="0.5"/>
            </filter>
          </defs>
          <!-- Background track arc -->
          <path d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="currentColor" 
                class="text-slate-200 dark:text-slate-800" 
                stroke-width="16" 
                stroke-linecap="round" />
          <!-- Active value arc -->
          <path d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                stroke-width="16" 
                stroke-linecap="round"
                stroke-dasharray="251.3"
                stroke-dashoffset="${offset}"
                filter="url(#gaugeGlow)"
                class="gauge-arc" />
        </svg>

        <!-- Gauge Central Stats -->
        <div class="absolute bottom-0 flex flex-col items-center">
          <span class="text-3xl font-black tracking-tight ${
            level === 'HIGH' ? 'text-red-500 dark:text-red-400' :
            level === 'MEDIUM' ? 'text-amber-500 dark:text-amber-400' :
            'text-emerald-500 dark:text-emerald-400'
          }">${level}</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono mt-0.5">${queue} Students • ${wait} min wait</span>
        </div>
      </div>

      <!-- Segment Indicators (LOW | MEDIUM | HIGH) -->
      <div class="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div class="py-1.5 px-2 rounded-xl text-center transition-all ${
          level === 'LOW' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/40' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-medium'
        }">
          <span>LOW</span>
          <span class="block text-[10px] opacity-80">&lt; 18 students</span>
        </div>

        <div class="py-1.5 px-2 rounded-xl text-center transition-all ${
          level === 'MEDIUM' ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-medium'
        }">
          <span>MEDIUM</span>
          <span class="block text-[10px] opacity-80">18 - 32 students</span>
        </div>

        <div class="py-1.5 px-2 rounded-xl text-center transition-all ${
          level === 'HIGH' ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20 ring-2 ring-red-400/40' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-medium'
        }">
          <span>HIGH</span>
          <span class="block text-[10px] opacity-80">&gt; 32 students</span>
        </div>
      </div>

      <!-- Explanation note -->
      <p class="text-xs text-slate-600 dark:text-slate-400 mt-3 font-medium bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 w-full flex items-center justify-center gap-1.5">
        <span class="${level === 'HIGH' ? 'text-red-500' : level === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'}">
          ${window.Icons.Info("w-3.5 h-3.5")}
        </span>
        ${current.statusMessage}
      </p>
    </div>
  `;
};
