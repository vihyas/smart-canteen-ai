// SmartCanteen AI - Public Landing Page Component
window.LandingPage = function(data) {
  const current = data.current;

  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      
      <!-- Top Navigation -->
      <nav class="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
              ${window.Icons.Brain("w-6 h-6")}
            </div>
            <div>
              <span class="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">SmartCanteen <span class="text-sky-500">AI</span></span>
              <span class="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                Prototype v2.4
              </span>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Features</a>
            <a href="#comparison" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Before vs After</a>
            <a href="#tech" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">AI & Privacy</a>
            <button onclick="window.App.switchPage('architecture')" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Architecture</button>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.App.toggleTheme()" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <span class="hidden dark:inline">${window.Icons.Sun("w-4 h-4 text-amber-400")}</span>
              <span class="inline dark:hidden">${window.Icons.Moon("w-4 h-4 text-slate-700")}</span>
            </button>
            <button onclick="window.App.switchPage('dashboard')" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 active:scale-95">
              <span>Open Dashboard</span>
              ${window.Icons.ArrowRight("w-4 h-4")}
            </button>
          </div>
        </div>
      </nav>

      <!-- 21. HERO SECTION -->
      <section class="relative pt-12 pb-20 px-6 overflow-hidden">
        <!-- Glow background shapes -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 dark:bg-sky-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="max-w-6xl mx-auto text-center relative z-10">
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-300 text-xs font-mono font-bold mb-6">
            <span class="w-2 h-2 rounded-full bg-sky-500 animate-ping-subtle"></span>
            AI-POWERED COLLEGE QUEUE INTELLIGENCE
          </div>

          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Predict the queue <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">before you join it.</span>
          </h1>

          <p class="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered queue intelligence platform designed to help students and canteen staff understand crowd conditions, estimate waiting times, and make smarter decisions.
          </p>

          <!-- Action Buttons -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button onclick="window.App.switchPage('live-queue')" class="px-6 py-3.5 rounded-2xl text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2 active:scale-95">
              ${window.Icons.Camera("w-4 h-4")}
              <span>View Live Queue</span>
            </button>
            <button onclick="window.App.switchPage('prediction')" class="px-6 py-3.5 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 active:scale-95">
              ${window.Icons.TrendingUp("w-4 h-4 text-sky-500")}
              <span>Explore AI Prediction</span>
            </button>
            <button onclick="window.App.switchPage('student-view')" class="px-6 py-3.5 rounded-2xl text-sm font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-2 active:scale-95">
              ${window.Icons.GraduationCap("w-4 h-4")}
              <span>Student Quick View</span>
            </button>
          </div>

          <!-- Hero Visual: Simulated Modern AI Vision Card -->
          <div class="mt-14 max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-sky-500/20 via-indigo-500/10 to-transparent border border-sky-500/30 shadow-2xl backdrop-blur-md">
            <div class="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-left relative overflow-hidden">
              
              <!-- Top bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-red-500"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span class="ml-3 text-xs font-mono text-slate-400">canteen-ai://live-monitor-node-01</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping-subtle"></span>
                    SIMULATED CV INFERENCE (YOLOv8)
                  </span>
                  <span class="text-xs font-mono text-slate-400">LATENCY: 18ms</span>
                </div>
              </div>

              <!-- Hero Visual Interactive Mockup -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Mini Metric 1 -->
                <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span class="text-xs font-mono text-slate-400 uppercase">Live Queue</span>
                  <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-black text-white">${current.queueLength}</span>
                    <span class="text-xs font-semibold text-rose-400 uppercase font-mono">Students Waiting</span>
                  </div>
                  <span class="mt-2 inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">HIGH CROWD</span>
                </div>

                <!-- Mini Metric 2 -->
                <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span class="text-xs font-mono text-slate-400 uppercase">Est. Waiting Time</span>
                  <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-black text-amber-400">${current.waitTimeMin}</span>
                    <span class="text-xs font-semibold text-slate-300">Minutes</span>
                  </div>
                  <span class="mt-2 inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Peak In ~30m</span>
                </div>

                <!-- Mini Metric 3 -->
                <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span class="text-xs font-mono text-slate-400 uppercase">Best Window</span>
                  <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-2xl font-black text-emerald-400">After 2:15 PM</span>
                  </div>
                  <span class="mt-2 inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">&lt; 8 min wait</span>
                </div>
              </div>

              <!-- Quick action inside preview -->
              <div class="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
                <span class="flex items-center gap-2">
                  ${window.Icons.ShieldCheck("w-4 h-4 text-sky-400")}
                  100% Anonymous Edge Computing • No Face ID Stored
                </span>
                <button onclick="window.App.switchPage('dashboard')" class="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1">
                  Launch Full Interactive Prototype ${window.Icons.ArrowRight("w-3.5 h-3.5")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 22. KEY FEATURES SECTION -->
      <section id="features" class="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80">
        <div class="max-w-6xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-bold font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              Core Capabilities
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
              Intelligent Canteen Operations
            </h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Combining edge computer vision, predictive time-series modeling, and actionable staff decision support.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Feature 1 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                  ${window.Icons.Users("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">AI People Counting</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Real-time anonymous queue estimation using lightweight edge YOLO detection without capturing facial identities.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1">
                Computer Vision • Edge ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

            <!-- Feature 2 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  ${window.Icons.TrendingUp("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Queue Prediction</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Forecast future crowd conditions for the next 15, 30, and 60 minutes using historical trends and active inflow rates.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                Forecasting Engine ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

            <!-- Feature 3 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  ${window.Icons.Clock("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Wait-Time Estimation</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Estimate how long students may wait based on active service counters and real-time checkout velocity.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                Dynamic Latency Calc ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

            <!-- Feature 4 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                  ${window.Icons.Bell("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Live Alerts</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Notify students and staff immediately when queues spike or when bottleneck counters require backup support.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                Threshold Triggers ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

            <!-- Feature 5 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  ${window.Icons.BarChart3("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Analytics</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Understand peak periods, weekly footfall distribution, and average service durations to optimize staffing.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                Historical Intelligence ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

            <!-- Feature 6 -->
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  ${window.Icons.Briefcase("w-6 h-6")}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Staff Intelligence</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Actionable counter dispatch recommendations, automated bottleneck detection, and crowd surge warnings.
                </p>
              </div>
              <span class="mt-4 text-xs font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                Operations Command ${window.Icons.ChevronRight("w-3 h-3")}
              </span>
            </div>

          </div>
        </div>
      </section>

      <!-- 23. BEFORE VS AFTER SECTION -->
      <section id="comparison" class="py-20 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-bold font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Impact & Value
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
              Before vs. After SmartCanteen AI
            </h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Transforming unstructured waiting into predictable, data-driven campus dining.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- BEFORE CARD -->
            <div class="p-8 rounded-3xl bg-red-500/5 border-2 border-red-500/20 dark:border-red-500/30 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black">
                    ${window.Icons.X("w-5 h-5")}
                  </div>
                  <div>
                    <h3 class="text-xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">BEFORE</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Traditional Canteen Chaos</p>
                  </div>
                </div>

                <ul class="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <li class="flex items-start gap-3">
                    <span class="text-red-500 font-bold shrink-0">❌</span>
                    <span><strong>Unknown queue size:</strong> Students walk down only to find unexpected 40-student congestion.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-red-500 font-bold shrink-0">❌</span>
                    <span><strong>Students guess waiting time:</strong> Missed lectures and delayed meal breaks.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-red-500 font-bold shrink-0">❌</span>
                    <span><strong>Reactive staff management:</strong> Counters open too late when lines spill outside.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-red-500 font-bold shrink-0">❌</span>
                    <span><strong>Unnecessary waiting & food coldness:</strong> Stressed servers and frustrated students.</span>
                  </li>
                </ul>
              </div>

              <div class="mt-6 pt-4 border-t border-red-200 dark:border-red-950/60 text-xs font-mono text-red-600 dark:text-red-400">
                Outcome: Low satisfaction & peak bottlenecks
              </div>
            </div>

            <!-- AFTER CARD -->
            <div class="p-8 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/30 dark:border-emerald-500/40 shadow-xl flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                    ${window.Icons.Check("w-5 h-5")}
                  </div>
                  <div>
                    <h3 class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">AFTER</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">SmartCanteen AI Ecosystem</p>
                  </div>
                </div>

                <ul class="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Live queue information:</strong> Check the exact queue length from dorm or classroom instantly.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>AI-assisted prediction:</strong> Know the best arrival window (e.g. after 2:15 PM) with 92% confidence.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Data-driven counter staffing:</strong> Open express lanes dynamically before peak surges.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Better planning & faster meals:</strong> Up to 60% reduction in peak idle waiting time.</span>
                  </li>
                </ul>
              </div>

              <div class="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-950/60 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                Outcome: Smooth flow & enhanced student experience
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 24. CALL TO ACTION SECTION -->
      <section class="py-20 px-6 bg-gradient-to-b from-sky-500/10 via-indigo-500/10 to-transparent border-t border-slate-200/80 dark:border-slate-800/80 text-center">
        <div class="max-w-4xl mx-auto">
          <span class="badge-ai px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            Ready to explore?
          </span>
          <h2 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-6 tracking-tight">
            Smarter Predictions. <br />
            Better Planning. <br />
            <span class="text-sky-500">Shorter Waits.</span>
          </h2>
          <p class="mt-4 text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Experience the interactive AI prototype with live simulated vision, 60-minute predictions, student fast decisions, and staff operations.
          </p>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button onclick="window.App.switchPage('dashboard')" class="px-8 py-4 rounded-2xl text-base font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2 active:scale-95">
              <span>Open SmartCanteen Dashboard</span>
              ${window.Icons.ArrowRight("w-5 h-5")}
            </button>
            <button onclick="window.App.switchPage('architecture')" class="px-6 py-4 rounded-2xl text-base font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2">
              ${window.Icons.Layers("w-5 h-5")}
              <span>View System Architecture</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-500 font-mono">
        <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>SmartCanteen AI • College AI/DS Queue Management Prototype</span>
          <span>Simulation Mode • Demo Data • Zero Facial Recognition</span>
        </div>
      </footer>

    </div>
  `;
};
