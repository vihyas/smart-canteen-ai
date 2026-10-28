// SmartCanteen AI - Interactive Graphs & Forecasting Charts
window.PredictionCharts = {
  // 1. AI Queue Prediction 60-Minute Chart
  QueueForecastChart: function(data, options = {}) {
    const forecast = data.forecast || [];
    const width = options.width || 600;
    const height = options.height || 260;
    const padding = { top: 30, right: 30, bottom: 40, left: 45 };

    if (!forecast.length) return `<div class="p-4 text-center">No forecast data</div>`;

    const maxQueue = Math.max(50, Math.max(...forecast.map(d => d.queue)) + 5);
    const minQueue = 0;

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Map points to SVG coordinates
    const points = forecast.map((d, i) => {
      const x = padding.left + (i / (forecast.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.queue - minQueue) / (maxQueue - minQueue)) * chartH;
      return { x, y, ...d };
    });

    // Generate smooth bezier curve path
    function createSmoothPath(pts) {
      if (pts.length <= 1) return "";
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    }

    const curvePath = createSmoothPath(points);
    const areaPath = `${curvePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    // Horizontal grid lines
    const gridTicks = [10, 20, 30, 40, 50];
    const gridLinesSvg = gridTicks.map(val => {
      const y = padding.top + chartH - ((val - minQueue) / (maxQueue - minQueue)) * chartH;
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
              stroke="currentColor" class="text-slate-200 dark:text-slate-800" stroke-dasharray="3 3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" class="text-[10px] fill-slate-400 font-mono font-medium">${val}</text>
      `;
    }).join("");

    // Data points & tooltip trigger circles
    const dataPointsSvg = points.map((p, idx) => `
      <g class="cursor-pointer group">
        <circle cx="${p.x}" cy="${p.y}" r="6" class="fill-sky-500 stroke-white dark:stroke-slate-900 transition-transform group-hover:scale-150" stroke-width="2.5" />
        <circle cx="${p.x}" cy="${p.y}" r="14" class="fill-transparent hover:fill-sky-500/20 transition-all cursor-pointer" />
        
        <!-- Text label above point -->
        <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" class="text-[11px] font-bold fill-slate-700 dark:fill-slate-200 font-mono">
          ${p.queue}
        </text>

        <!-- X-axis tick label -->
        <text x="${p.x}" y="${height - 12}" text-anchor="middle" class="text-[11px] font-medium fill-slate-500 dark:fill-slate-400 font-mono">
          ${p.time}
        </text>
      </g>
    `).join("");

    return `
      <div class="glass-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                ${window.Icons.TrendingUp("w-4 h-4")}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">AI Queue Prediction</h3>
              <span class="badge-ai px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono">AI FORECAST</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Predicted queue length for the next 60 minutes</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              ${window.Icons.Sparkles("w-3 h-3")}
              DEMO / SIMULATED DATA
            </span>
          </div>
        </div>

        <!-- SVG Line Chart -->
        <div class="w-full overflow-x-auto">
          <svg class="w-full min-w-[500px]" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="queueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.35" />
                <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
              </linearGradient>
              <linearGradient id="queueLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>
            </defs>

            <!-- Grid -->
            ${gridLinesSvg}

            <!-- Area Fill -->
            <path d="${areaPath}" fill="url(#queueAreaGrad)" />

            <!-- Smooth Bezier Line -->
            <path d="${curvePath}" fill="none" stroke="url(#queueLineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Points & Labels -->
            ${dataPointsSvg}
          </svg>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 font-mono">
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            Queue Inflow Forecast (Students)
          </span>
          <span class="text-slate-400">Peak threshold: 45 students (~30m mark)</span>
        </div>
      </div>
    `;
  },

  // 2. Estimated Waiting Time Prediction Chart
  WaitTimeChart: function(data, options = {}) {
    const forecast = data.forecast || [];
    const width = options.width || 600;
    const height = options.height || 240;
    const padding = { top: 30, right: 30, bottom: 40, left: 45 };

    const maxWait = Math.max(35, Math.max(...forecast.map(d => d.wait)) + 5);
    const minWait = 0;

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = forecast.map((d, i) => {
      const x = padding.left + (i / (forecast.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.wait - minWait) / (maxWait - minWait)) * chartH;
      return { x, y, ...d };
    });

    function createSmoothPath(pts) {
      if (pts.length <= 1) return "";
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    }

    const curvePath = createSmoothPath(points);
    const areaPath = `${curvePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    const gridTicks = [5, 15, 25, 35];
    const gridLinesSvg = gridTicks.map(val => {
      const y = padding.top + chartH - ((val - minWait) / (maxWait - minWait)) * chartH;
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
              stroke="currentColor" class="text-slate-200 dark:text-slate-800" stroke-dasharray="3 3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" class="text-[10px] fill-slate-400 font-mono font-medium">${val}m</text>
      `;
    }).join("");

    const dataPointsSvg = points.map((p, idx) => `
      <g class="cursor-pointer group">
        <circle cx="${p.x}" cy="${p.y}" r="5.5" class="fill-amber-500 stroke-white dark:stroke-slate-900 transition-transform group-hover:scale-150" stroke-width="2.5" />
        <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" class="text-[11px] font-bold fill-slate-700 dark:fill-slate-200 font-mono">
          ${p.wait}m
        </text>
        <text x="${p.x}" y="${height - 12}" text-anchor="middle" class="text-[11px] font-medium fill-slate-500 dark:fill-slate-400 font-mono">
          ${p.time}
        </text>
      </g>
    `).join("");

    return `
      <div class="glass-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                ${window.Icons.Clock("w-4 h-4")}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Estimated Waiting Time</h3>
              <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Demo prediction</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Expected queue turnaround time per student</p>
          </div>

          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping-subtle"></span>
            Peak expected in ~30 minutes (30 min wait)
          </div>
        </div>

        <div class="w-full overflow-x-auto">
          <svg class="w-full min-w-[500px]" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="waitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
                <stop offset="80%" stop-color="#f59e0b" stop-opacity="0.02" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
              </linearGradient>
              <linearGradient id="waitLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="50%" stop-color="#ef4444" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
            </defs>

            ${gridLinesSvg}
            <path d="${areaPath}" fill="url(#waitAreaGrad)" />
            <path d="${curvePath}" fill="none" stroke="url(#waitLineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${dataPointsSvg}
          </svg>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 font-mono">
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Service Time Estimation (Minutes)
          </span>
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Fastest: &lt; 15 min at +60m mark</span>
        </div>
      </div>
    `;
  },

  // 3. Peak Hours Hourly Bar Chart
  PeakHoursBarChart: function(peakHours = []) {
    const maxQ = Math.max(...peakHours.map(d => d.queue)) + 5;

    const bars = peakHours.map(d => {
      const heightPct = Math.round((d.queue / maxQ) * 100);
      let color = "bg-emerald-500";
      let badge = "LOW";
      if (d.crowd === "HIGH") {
        color = "bg-red-500";
        badge = "HIGH";
      } else if (d.crowd === "MEDIUM") {
        color = "bg-amber-500";
        badge = "MED";
      }

      return `
        <div class="flex flex-col items-center flex-1 group">
          <span class="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ${d.queue} st
          </span>
          <div class="w-full max-w-[38px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-36 flex items-end p-1 relative overflow-hidden">
            <div class="w-full ${color} rounded-t-md transition-all duration-700 group-hover:opacity-90 shadow-sm" style="height: ${heightPct}%;"></div>
          </div>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 font-mono">${d.hour}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500">${d.wait}m wait</span>
        </div>
      `;
    }).join("");

    return `
      <div class="glass-card p-5 sm:p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                ${window.Icons.BarChart3("w-4 h-4")}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Peak Hours Analysis</h3>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Average hourly queue traffic distribution (10 AM - 4 PM)</p>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Historical Aggregation</span>
        </div>

        <div class="flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          ${bars}
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 mt-2 font-mono">
          <span class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> High Rush (12 PM - 1 PM)
          </span>
          <span class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Off-Peak (10 AM, 3-4 PM)
          </span>
        </div>
      </div>
    `;
  },

  // 4. Daily Average Wait Time Chart (Monday - Sunday)
  DailyWaitTimeChart: function(dailyData = []) {
    const maxWait = Math.max(...dailyData.map(d => d.wait)) + 5;

    const daysHtml = dailyData.map(d => {
      const pct = Math.round((d.wait / maxWait) * 100);
      const isPeakDay = d.wait >= 24;

      return `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="font-bold text-slate-800 dark:text-slate-200">${d.day}</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-[11px]">Peak: ${d.peakTime}</span>
              <span class="font-bold ${isPeakDay ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}">${d.wait} mins</span>
            </div>
          </div>
          <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700 ${
              isPeakDay ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'
            }" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="glass-card p-5 sm:p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                ${window.Icons.History("w-4 h-4")}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Daily Average Wait Time</h3>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Weekly benchmark: Mon–Sun comparison</p>
          </div>
          <span class="text-xs font-mono text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Friday: Peak Day</span>
        </div>

        <div class="space-y-3.5 py-1">
          ${daysHtml}
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 font-mono flex items-center justify-between">
          <span>Overall Weekly Avg: 18.1 min</span>
          <span class="text-emerald-500 font-semibold">Weekend drop: -68%</span>
        </div>
      </div>
    `;
  }
};
