// SmartCanteen AI - Historical Analytics Page Component
window.AnalyticsPage = function(data) {
  const peakHours = data.peakHours || [];
  const dailyAverageWait = data.dailyAverageWait || [];

  return `
    <div class="space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Queue & Footfall Analytics</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              DEMO ANALYTICS
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Aggregated historical patterns for capacity planning and peak mitigation</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono">
          <span class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Timeframe: Past 30 Days (Demo)
          </span>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">AVG WAIT TIME</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">18.2 <span class="text-xs font-normal text-slate-400">mins</span></div>
          <span class="text-[11px] font-mono text-emerald-500 font-bold mt-1 inline-block">-14% vs last month</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">PEAK CONGESTION HOUR</span>
          <div class="text-2xl font-black text-red-500 mt-1">1:00 PM - 1:30 PM</div>
          <span class="text-[11px] font-mono text-slate-400 mt-1 inline-block">Avg queue: 45 students</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">DAILY AVG FOOTFALL</span>
          <div class="text-2xl font-black text-sky-500 mt-1">540 <span class="text-xs font-normal text-slate-400">students / day</span></div>
          <span class="text-[11px] font-mono text-slate-400 mt-1 inline-block">Peak on Fridays</span>
        </div>

        <div class="glass-card p-4 rounded-2xl">
          <span class="text-xs font-mono font-bold text-slate-400 uppercase">SERVICE EFFICIENCY</span>
          <div class="text-2xl font-black text-emerald-500 mt-1">1.48 <span class="text-xs font-normal text-slate-400">min / order</span></div>
          <span class="text-[11px] font-mono text-slate-400 mt-1 inline-block">3.2 counters avg</span>
        </div>

      </div>

      <!-- 15. CHARTS ROW 1: Peak Hours & Daily Average -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          ${window.PredictionCharts.PeakHoursBarChart(peakHours)}
        </div>
        <div>
          ${window.PredictionCharts.DailyWaitTimeChart(dailyAverageWait)}
        </div>
      </div>

      <!-- Historical Insight & Optimization Note -->
      <div class="glass-card p-6 border-l-4 border-l-sky-500">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
            ${window.Icons.TrendingUp("w-5 h-5")}
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Analytical Takeaways & Staffing Optimization</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Historical distribution shows sharp lunch arrival surges between <strong>12:45 PM and 1:30 PM</strong>. Opening <strong>Counter 4 (Express Pre-Order Lane)</strong> precisely at 12:40 PM reduces peak wait times from 30 minutes down to under 18 minutes.
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>• Tuesday & Friday peak traffic: +35%</span>
              <span>• Morning Off-Peak throughput: 99.2% optimal</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
};
