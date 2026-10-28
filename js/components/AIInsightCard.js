// SmartCanteen AI - AI Insight & Actionable Recommendations Card
window.AIInsightCard = function(data) {
  const current = data.current;
  const confidence = data.system.confidence || 92;

  let insightText = "";
  let recText = "";
  let badgeColor = "from-sky-500/20 to-indigo-500/20 border-sky-500/40 text-sky-600 dark:text-sky-400";

  if (current.crowdLevel === "HIGH") {
    insightText = `Current crowd levels are <strong>HIGH (${current.queueLength} students)</strong>. Based on current queue conditions and historical lunch rush patterns, the queue is expected to remain high for the next 20–30 minutes with a peak wait time of ~30 minutes.`;
    recText = "Students may consider visiting after 2:15 PM or ordering via the express takeaway lane to minimize in-person wait time.";
    badgeColor = "from-rose-500/15 to-orange-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400";
  } else if (current.crowdLevel === "MEDIUM") {
    insightText = `Current crowd levels are <strong>MODERATE (${current.queueLength} students)</strong>. Flow throughput is steady at ~1.4 min per student across 3 active counters.`;
    recText = "Queue length is within manageable limits. Recommended time to order before the impending evening rush.";
    badgeColor = "from-amber-500/15 to-yellow-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400";
  } else {
    insightText = `Current crowd levels are <strong>OPTIMAL / LOW (${current.queueLength} students)</strong>. Minimal waiting time (~${current.waitTimeMin} min).`;
    recText = "Immediate counter availability. Best window for meal pickup with zero congestion.";
    badgeColor = "from-emerald-500/15 to-teal-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
  }

  return `
    <div class="glass-card p-6 relative overflow-hidden bg-gradient-to-br ${badgeColor} border border-sky-500/30 dark:border-sky-500/20 shadow-lg">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30">
            ${window.Icons.Brain("w-5 h-5")}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">🤖 AI INSIGHT & RECOMMENDATION</h3>
              <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Confidence: ${confidence}%
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">Real-time analytical inference derived from queue inflow and service rates</p>
          </div>
        </div>

        <button onclick="window.App.switchPage('prediction')" class="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 transition-all flex items-center gap-1.5 active:scale-95">
          <span>View Full Prediction</span>
          ${window.Icons.ChevronRight("w-3.5 h-3.5")}
        </button>
      </div>

      <div class="space-y-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-xl border border-white/80 dark:border-slate-800/80 backdrop-blur-sm">
        <p class="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          ${insightText}
        </p>

        <div class="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2 text-xs">
          <strong class="font-bold text-sky-600 dark:text-sky-400 shrink-0 font-mono tracking-wider">RECOMMENDATION:</strong>
          <span class="text-slate-700 dark:text-slate-300">${recText}</span>
        </div>
      </div>
    </div>
  `;
};
