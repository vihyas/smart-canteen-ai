// SmartCanteen AI - Ultra Simple Student Queue View Component
window.StudentViewPage = function(data) {
  const current = data.current;
  const nextSlots = data.studentNext30Min || [];
  const rec = current.bestTimeRecommendation;

  const isHigh = current.crowdLevel === 'HIGH';
  const isMed = current.crowdLevel === 'MEDIUM';

  const crowdBadgeColor = isHigh ? 'bg-red-500 text-white' : (isMed ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white');
  const verdictText = isHigh ? "❌ Not recommended right now (High Congestion)" : (isMed ? "⚠️ Moderate wait (~15 mins)" : "✅ Great time to visit! Minimal wait");

  return `
    <div class="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      <!-- Student View Top Header -->
      <div class="text-center pt-2 pb-4">
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          STUDENT SMART DECISION ASSISTANT
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
          Should I visit the canteen now?
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Live queue status and 30-minute arrival guidance</p>
      </div>

      <!-- 11. MAIN DECISION CARD -->
      <div class="glass-card p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden shadow-xl border-2 ${
        isHigh ? 'border-red-500/40 bg-gradient-to-b from-red-500/10 via-transparent to-transparent' : 
        (isMed ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent' : 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent')
      }">
        
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wider ${crowdBadgeColor} shadow-md mb-4">
          <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping-subtle"></span>
          ${current.crowdLevel} CROWD
        </div>

        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
          ${verdictText}
        </h3>

        <!-- Key Metrics Strip -->
        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto my-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80">
          <div>
            <span class="text-xs font-mono text-slate-400 uppercase font-bold">Waiting in Line</span>
            <div class="text-3xl font-black text-slate-900 dark:text-white mt-0.5">${current.queueLength}</div>
            <span class="text-xs text-slate-500">students</span>
          </div>

          <div class="border-l border-slate-200 dark:border-slate-800">
            <span class="text-xs font-mono text-slate-400 uppercase font-bold">Estimated Wait</span>
            <div class="text-3xl font-black text-amber-500 mt-0.5">${current.waitTimeMin}</div>
            <span class="text-xs text-slate-500">minutes</span>
          </div>
        </div>

        <!-- Next 30 Minutes Trajectory -->
        <div class="max-w-lg mx-auto text-left pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
            Next 30 Minutes Forecast
          </h4>

          <div class="space-y-2.5">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span class="font-bold text-slate-700 dark:text-slate-300">In 10 min</span>
              <span class="px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">HIGH CROWD (40 st)</span>
              <span class="text-slate-400">~27 min wait</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span class="font-bold text-slate-700 dark:text-slate-300">In 20 min</span>
              <span class="px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">HIGH CROWD (43 st)</span>
              <span class="text-slate-400">~29 min wait</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span class="font-bold text-slate-700 dark:text-slate-300">In 30 min</span>
              <span class="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">MEDIUM CROWD (35 st)</span>
              <span class="text-slate-400">~19 min wait</span>
            </div>
          </div>
        </div>

      </div>

      <!-- 12. BEST TIME TO VISIT RECOMMENDATION CARD -->
      <div id="best-time-card" class="glass-card p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent relative overflow-hidden shadow-lg">
        
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-emerald-500 text-white">
              ${window.Icons.Sparkles("w-5 h-5")}
            </span>
            <div>
              <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">AI RECOMMENDATION</span>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">BEST TIME TO VISIT</h3>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Optimal Slot
          </span>
        </div>

        <!-- Large Time Callout -->
        <div class="my-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-xs font-mono text-slate-500 uppercase font-semibold">Recommended Arrival Window</span>
            <div class="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${rec.time}</div>
          </div>
          <div class="flex items-center gap-6 text-right font-mono">
            <div>
              <span class="text-xs text-slate-400">Expected Queue:</span>
              <div class="text-xl font-black text-slate-900 dark:text-white">${rec.expectedQueue} students</div>
            </div>
            <div>
              <span class="text-xs text-slate-400">Expected Waiting:</span>
              <div class="text-xl font-black text-emerald-500">${rec.expectedWait} minutes</div>
            </div>
          </div>
        </div>

        <!-- Benefit checkmarks -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</span>
            <span>Lower crowd</span>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</span>
            <span>Shorter waiting time</span>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</span>
            <span>Better experience</span>
          </div>
        </div>

      </div>

    </div>
  `;
};
