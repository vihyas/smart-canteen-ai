// SmartCanteen AI - Main Application Controller & State Orchestrator
window.App = (function() {
  let activePage = "dashboard"; // default page
  let activeOrderCategory = "all";
  let selectedQrOrder = null;
  let mobileMenuOpen = false;
  let alertFilter = "all";
  let toastTimeout = null;

  // Initialize theme from localStorage or system preference
  function initTheme() {
    try {
      const saved = localStorage.getItem('smartcanteen-theme');
      if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('smartcanteen-theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    render();
  }

  function showToast(message, type = "info") {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl border';
      document.body.appendChild(toast);
    }

    if (type === "success") {
      toast.className = 'fixed bottom-6 right-6 z-50 transition-all duration-300 font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl border bg-emerald-900/90 text-emerald-200 border-emerald-500/40 translate-y-0 opacity-100';
    } else if (type === "warning") {
      toast.className = 'fixed bottom-6 right-6 z-50 transition-all duration-300 font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl border bg-amber-900/90 text-amber-200 border-amber-500/40 translate-y-0 opacity-100';
    } else {
      toast.className = 'fixed bottom-6 right-6 z-50 transition-all duration-300 font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl border bg-sky-900/90 text-sky-200 border-sky-500/40 translate-y-0 opacity-100';
    }

    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : (type === 'warning' ? 'bg-amber-400' : 'bg-sky-400')} animate-ping-subtle"></span>
      <span>${message}</span>
    `;

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      if (toast) {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }
    }, 3200);
  }

  function switchPage(pageId) {
    activePage = pageId;
    mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    render();
  }

  function setScenario(scKey) {
    window.SimulationEngine.setScenario(scKey);
    showToast(`Simulation Scenario: ${scKey.toUpperCase()}`, "info");
    render();
  }

  function toggleCounter(id) {
    window.SimulationEngine.toggleCounter(id);
    const state = window.SimulationEngine.getState();
    const c = state.counters.find(item => item.id === id);
    showToast(`Counter #${id} is now ${c && c.active ? 'OPEN' : 'CLOSED'}`, c && c.active ? "success" : "warning");
    render();
  }

  function applyStaffAction(recId) {
    const state = window.SimulationEngine.getState();
    const rec = state.staffRecommendations.find(r => r.id === recId);
    if (rec) {
      if (recId === 1) {
        window.SimulationEngine.toggleCounter(4);
      } else {
        rec.applied = !rec.applied;
      }
      showToast(`Action: ${rec.title}`, "success");
      render();
    }
  }

  function acknowledgeAlert(alertId) {
    window.SimulationEngine.acknowledgeAlert(alertId);
    showToast("Alert marked as Acknowledged", "success");
    render();
  }

  function acknowledgeAllAlerts() {
    window.SimulationEngine.acknowledgeAllAlerts();
    showToast("All active alerts acknowledged", "success");
    render();
  }

  function toggleDemoMode() {
    window.SimulationEngine.toggleDemoMode();
    const state = window.SimulationEngine.getState();
    showToast(`Demo Mode Watermark: ${state.system.demoMode ? 'ON' : 'OFF'}`, "info");
    render();
  }

  function setAlertFilter(filter) {
    alertFilter = filter;
    render();
  }

  function setOrderCategory(category) {
    activeOrderCategory = category;
    render();
  }

  function addToCart(itemId) {
    window.SimulationEngine.addToCart(itemId);
    const state = window.SimulationEngine.getState();
    const item = state.menu.find(m => m.id === itemId);
    showToast(`Added ${item ? item.name : 'item'} to Pre-Order Cart`, "success");
    render();
  }

  function updateCartQty(itemId, delta) {
    window.SimulationEngine.updateCartQty(itemId, delta);
    render();
  }

  function clearCart() {
    window.SimulationEngine.clearCart();
    showToast("Cart cleared", "info");
    render();
  }

  function placeOrder() {
    const order = window.SimulationEngine.placeOrder("Student #429 (CSE Dept)");
    if (order) {
      selectedQrOrder = order;
      showToast(`🎉 Order Placed! Token #${order.token} generated.`, "success");
      render();

      // Scroll to QR pass card
      setTimeout(() => {
        const qrEl = document.getElementById('active-qr-pass');
        if (qrEl) qrEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  function simulateQrScan(orderId) {
    const state = window.SimulationEngine.getState();
    const ord = state.activeOrders.find(o => o.orderId === orderId);
    if (ord) {
      ord.status = "VERIFIED & COLLECTED";
      ord.estimatedReadyMin = 0;
      showToast(`✅ QR Verified at Counter 4! Order #${ord.orderId} dispensed.`, "success");
      render();
    }
  }

  function setCustomQueue(val) {
    const queueVal = parseInt(val, 10);
    const label = document.getElementById('custom-queue-val');
    if (label) label.innerText = `${queueVal} Students`;

    const state = window.SimulationEngine.getState();
    state.current.queueLength = queueVal;
    window.SimulationEngine.triggerTick();
  }

  function triggerSimulationTick() {
    window.SimulationEngine.triggerTick();
    showToast("Triggered live queue tick", "info");
  }

  function toggleLiveSimulation() {
    window.SimulationEngine.triggerTick();
    showToast("Simulation step executed", "info");
    render();
  }

  function resetDemoData() {
    try {
      localStorage.removeItem('smartcanteen-custom');
    } catch (e) {}
    location.reload();
  }

  function renderMobileDrawer(unreadCount) {
    if (!mobileMenuOpen) return '';

    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { id: "order", label: "Order Food & QR", icon: "ShoppingBag", badge: "Express" },
      { id: "live-queue", label: "Live Queue", icon: "Camera", badge: "LIVE" },
      { id: "prediction", label: "AI Prediction", icon: "TrendingUp" },
      { id: "student-view", label: "Student View", icon: "GraduationCap" },
      { id: "staff-dashboard", label: "Staff Operations", icon: "Briefcase" },
      { id: "analytics", label: "Analytics", icon: "BarChart3" },
      { id: "alerts", label: "Alerts", icon: "Bell", badgeCount: unreadCount },
      { id: "architecture", label: "Architecture", icon: "Layers" },
      { id: "tech-ethics", label: "AI Tech & Privacy", icon: "ShieldCheck" },
      { id: "settings", label: "Simulation Settings", icon: "Settings" }
    ];

    const links = navItems.map(item => {
      const isActive = activePage === item.id;
      const iconSvg = window.Icons[item.icon] ? window.Icons[item.icon]("w-5 h-5") : window.Icons.Activity("w-5 h-5");

      return `
        <button onclick="window.App.switchPage('${item.id}')" 
                class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-sky-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }">
          <div class="flex items-center gap-3">
            <span>${iconSvg}</span>
            <span>${item.label}</span>
          </div>
          ${item.badge ? `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">${item.badge}</span>` : ''}
          ${item.badgeCount ? `<span class="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white font-mono">${item.badgeCount}</span>` : ''}
        </button>
      `;
    }).join("");

    return `
      <!-- Mobile Drawer Backdrop -->
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden flex" onclick="window.App.toggleMobileMenu()">
        <div class="w-72 bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800" onclick="event.stopPropagation()">
          <div>
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  ${window.Icons.Brain("w-4 h-4")}
                </div>
                <span class="font-black text-slate-900 dark:text-white">SmartCanteen AI</span>
              </div>
              <button onclick="window.App.toggleMobileMenu()" class="p-2 rounded-lg text-slate-400 hover:text-slate-600">
                ${window.Icons.X("w-5 h-5")}
              </button>
            </div>

            <nav class="space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
              ${links}
            </nav>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button onclick="window.App.switchPage('landing')" class="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-center">
              Public Landing Page
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    try {
      const state = window.SimulationEngine.getState();
      const unreadAlerts = state.alerts.filter(a => !a.acknowledged).length;

      // If Landing Page is active, render full-bleed landing view
      if (activePage === "landing") {
        root.innerHTML = window.LandingPage(state);
        return;
      }

      // Determine current page body
      let pageContent = "";
      switch (activePage) {
        case "dashboard":
          pageContent = window.DashboardPage(state);
          break;
        case "order":
          pageContent = window.OrderPage(state, { category: activeOrderCategory, selectedQrOrder: selectedQrOrder });
          break;
        case "live-queue":
          pageContent = window.LiveQueuePage(state);
          break;
        case "prediction":
          pageContent = window.PredictionPage(state);
          break;
        case "student-view":
          pageContent = window.StudentViewPage(state);
          break;
        case "staff-dashboard":
          pageContent = window.StaffDashboardPage(state);
          break;
        case "analytics":
          pageContent = window.AnalyticsPage(state);
          break;
        case "alerts":
          pageContent = window.AlertsPage(state, alertFilter);
          break;
        case "architecture":
          pageContent = window.ArchitecturePage();
          break;
        case "tech-ethics":
          pageContent = window.TechEthicsPage();
          break;
        case "settings":
          pageContent = window.SettingsPage(state);
          break;
        default:
          pageContent = window.DashboardPage(state);
      }

      // App Layout Shell (Sidebar + Navbar + Page Viewport)
      root.innerHTML = `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row">
          
          <!-- Desktop Sidebar -->
          ${window.Sidebar(activePage, unreadAlerts)}

          <!-- Mobile Drawer Navigation -->
          ${renderMobileDrawer(unreadAlerts)}

          <!-- Main Content Viewport -->
          <div class="flex-1 flex flex-col min-w-0">
            
            <!-- Top Navbar -->
            ${window.Navbar(state)}

            <!-- Page Body Area -->
            <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              ${pageContent}
            </main>

            <!-- Bottom Footer -->
            <footer class="border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2">
              <span>SmartCanteen AI • Prototype Queue Management</span>
              <span class="text-slate-400">Simulation Data • Zero Facial Recognition • Express QR Counter 4</span>
            </footer>
          </div>

        </div>
      `;
    } catch (err) {
      console.error("Render error in SmartCanteen AI:", err);
      root.innerHTML = `
        <div class="p-8 text-center max-w-lg mx-auto mt-20 bg-slate-900 text-white rounded-3xl border border-red-500/40 shadow-2xl">
          <h2 class="text-xl font-bold text-red-400 mb-2">Rendering Error Detected</h2>
          <p class="text-xs text-slate-400 font-mono mb-4">${err.message || err}</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs">
            Reload Application
          </button>
        </div>
      `;
    }
  }

  // Subscribe to live simulation ticker
  window.SimulationEngine.subscribe((updatedState) => {
    if (["dashboard", "live-queue", "student-view", "staff-dashboard"].includes(activePage)) {
      render();
    }
  });

  return {
    init: function() {
      initTheme();
      render();
    },
    switchPage,
    toggleMobileMenu,
    toggleTheme,
    setScenario,
    toggleCounter,
    applyStaffAction,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    toggleDemoMode,
    setAlertFilter,
    setOrderCategory,
    addToCart,
    updateCartQty,
    clearCart,
    placeOrder,
    simulateQrScan,
    setCustomQueue,
    resetDemoData,
    triggerSimulationTick,
    toggleLiveSimulation,
    showToast
  };
})();

// Boot application immediately or when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
  });
} else {
  window.App.init();
}
