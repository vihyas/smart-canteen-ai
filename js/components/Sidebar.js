// SmartCanteen AI - Sidebar Navigation Component
window.Sidebar = function(activePage, unreadAlertsCount = 2) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { id: "order", label: "Order Food & QR", icon: "ShoppingBag", badge: "Express" },
    { id: "live-queue", label: "Live Queue", icon: "Camera", badge: "LIVE" },
    { id: "prediction", label: "AI Prediction", icon: "TrendingUp" },
    { id: "student-view", label: "Student View", icon: "GraduationCap", badge: "Simple" },
    { id: "staff-dashboard", label: "Staff Operations", icon: "Briefcase" },
    { id: "analytics", label: "Analytics", icon: "BarChart3" },
    { id: "alerts", label: "Alerts", icon: "Bell", badgeCount: unreadAlertsCount },
    { id: "architecture", label: "Architecture", icon: "Layers" },
    { id: "tech-ethics", label: "AI Tech & Privacy", icon: "ShieldCheck" },
    { id: "settings", label: "Simulation Settings", icon: "Settings" }
  ];

  const navLinksHtml = navItems.map(item => {
    const isActive = activePage === item.id;
    const iconSvg = window.Icons[item.icon] ? window.Icons[item.icon]("w-5 h-5") : window.Icons.Activity("w-5 h-5");

    return `
      <button onclick="window.App.switchPage('${item.id}')" 
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
              }">
        <div class="flex items-center gap-3">
          <span class="transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-sky-500'}">
            ${iconSvg}
          </span>
          <span>${item.label}</span>
        </div>

        ${item.badge ? `
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
            isActive ? 'bg-sky-700 text-white' : (item.badge === 'Express' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300')
          }">
            ${item.badge}
          </span>
        ` : ''}

        ${item.badgeCount ? `
          <span class="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full font-mono ${
            isActive ? 'bg-white text-sky-600' : 'bg-red-500 text-white'
          }">
            ${item.badgeCount}
          </span>
        ` : ''}
      </button>
    `;
  }).join("");

  return `
    <aside class="w-64 shrink-0 h-screen sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 z-30 hidden lg:flex select-none">
      
      <!-- Brand & Logo -->
      <div>
        <div class="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer" onclick="window.App.switchPage('landing')">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
            ${window.Icons.Brain("w-6 h-6")}
          </div>
          <div>
            <h1 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              SmartCanteen <span class="text-sky-500">AI</span>
            </h1>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Intelligent Queue Management</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1 mt-2">
          ${navLinksHtml}
        </nav>
      </div>

      <!-- Footer & System Status -->
      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <!-- Landing Page Preview Link -->
        <button onclick="window.App.switchPage('landing')" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/60 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 transition-all">
          ${window.Icons.Coffee("w-4 h-4")}
          <span>Public Landing Page</span>
        </button>

        <!-- System Status Indicator Card -->
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono">
          <div class="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
            <span class="text-[11px] font-semibold">AI System Status</span>
            <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping-subtle"></span>
              Online
            </span>
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500">
            Express QR Counter 4: Active
          </div>
        </div>
      </div>
    </aside>
  `;
};
