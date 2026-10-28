// SmartCanteen AI - AI Technology & Privacy Ethics Page Component
window.TechEthicsPage = function() {
  return `
    <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="text-center py-2">
        <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
          TECHNICAL STACK & ETHICAL CHARTER
        </span>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
          AI Technology & Privacy Ethics
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          How SmartCanteen AI balances cutting-edge edge computer vision with strict student privacy protection.
        </p>
      </div>

      <!-- 19. AI TECHNOLOGY SECTION (4 Pillars) -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
            ${window.Icons.Cpu("w-4 h-4")}
          </span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">AI Technology Pillars</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Pillar 1: Computer Vision -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                ${window.Icons.Camera("w-5 h-5")}
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">COMPUTER VISION</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Proposed Technique: YOLO-Class Person Detection</p>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                Utilized exclusively to estimate the count and density of people waiting in the queue. Lightweight YOLOv8 / MobileNet edge models identify head/torso bounding boxes without processing identifiable facial features.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400">
              Role: Queue Length & Inflow Rate Extraction
            </div>
          </div>

          <!-- Pillar 2: Machine Learning -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                ${window.Icons.Brain("w-5 h-5")}
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">MACHINE LEARNING</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Time-Series Predictive Forecasting</p>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                Predicts future queue conditions and waiting duration for 15, 30, and 60-minute time horizons. Evaluates current line size, timetable schedules, historical weekday curves, and active counter service speed.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400">
              Role: Multi-Horizon Arrival & Wait Estimation
            </div>
          </div>

          <!-- Pillar 3: Data Analytics -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                ${window.Icons.BarChart3("w-5 h-5")}
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">DATA ANALYTICS</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Historical Footfall & Congestion Profiling</p>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                Aggregates hourly, daily, and weekly congestion patterns to help canteen managers schedule food preparation batches, manage counter staffing, and reduce student waiting time during sudden rushes.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400">
              Role: Capacity Planning & Resource Optimization
            </div>
          </div>

          <!-- Pillar 4: Real-Time Dashboard -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                ${window.Icons.LayoutDashboard("w-5 h-5")}
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">REAL-TIME DASHBOARD</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Instant Visual Intelligence</p>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                Communicates queue states with high visual clarity through simplified student widgets, comprehensive staff dispatch consoles, and live edge simulation gauges.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400">
              Role: Transparent Information Distribution
            </div>
          </div>

        </div>
      </div>

      <!-- 20. PRIVACY & ETHICS SECTION -->
      <div class="glass-card p-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-transparent">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            ${window.Icons.ShieldCheck("w-6 h-6")}
          </div>
          <div>
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">ETHICAL AI CHARTER</span>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">PRIVACY FIRST ARCHITECTURE</h3>
          </div>
        </div>

        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          SmartCanteen AI is engineered from the ground up to respect campus privacy. The system operates purely on numerical density measurements without capturing biometric or identifiable individual data:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Avoid facial identification</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No facial recognition algorithms or facial landmark models are deployed.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Avoid unnecessary personal info</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero student roll numbers, names, or contact credentials required.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Anonymous people counting</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Only ephemeral numerical bounding boxes are processed in-memory.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Minimize data retention</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Raw video frames are discarded immediately after inference.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Restricted dashboard access</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Staff operations tools separated from public student display feeds.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <span class="text-emerald-500 font-black text-base shrink-0">✓</span>
            <div>
              <h5 class="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">Provide human oversight</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Canteen managers make final decisions; the AI solely provides advisory data.</p>
            </div>
          </div>
        </div>

        <!-- Final Statement -->
        <div class="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center font-bold text-sm text-emerald-700 dark:text-emerald-300">
          “AI assists decisions — humans remain responsible.”
        </div>
      </div>

    </div>
  `;
};
