// SmartCanteen AI - Simulation Engine & Order Manager
//
// Architecture (Condition 1 fix):
// ─────────────────────────────────────────────────────────────────────────────
//  This engine now acts as a *thin state bridge*.  Every tick it first tries to
//  fetch the live queue count from the FastAPI backend (GET /queue).  If the
//  backend is reachable, the real crowd count, wait time and crowd level from the
//  server drive the UI.  If the backend is unavailable (e.g. the server hasn't
//  been started yet), the engine falls back to the synthetic stochastic model so
//  the dashboard remains functional for offline demos.
//
//  Backend URL can be overridden by setting window.CANTEEN_API_URL before this
//  script loads (useful for staging / production deployments).
// ─────────────────────────────────────────────────────────────────────────────

window.SimulationEngine = (function() {
  // ── Configuration ──────────────────────────────────────────────────────────
  const API_BASE = (window.CANTEEN_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const POLL_INTERVAL_MS  = 4000;   // how often to hit GET /queue
  const FETCH_TIMEOUT_MS  = 3000;   // abort a slow backend request after this

  // ── Mutable state ──────────────────────────────────────────────────────────
  let state = JSON.parse(JSON.stringify(window.InitialCanteenData));
  let listeners         = [];
  let intervalId        = null;
  let timerTicker       = null;
  let isRunning         = true;
  let secondsSinceLastUpdate = 0;

  // Tracks whether the last backend call succeeded
  state.system.backendConnected = false;
  state.system.detectorSource   = 'offline-fallback';

  // ── Bounding-box generator ─────────────────────────────────────────────────
  // Generates synthetic bounding boxes for the camera-monitor visualisation.
  // In YOLO mode the real boxes would come from the backend; for now we use a
  // deterministic placement algorithm so the live-queue panel always shows
  // something meaningful regardless of detector mode.
  function generateBoundingBoxes(count) {
    const boxes = [];
    const zones = [
      { name: 'Counter 1 Queue', xMin: 12, xMax: 35, yMin: 30, yMax: 85 },
      { name: 'Counter 2 Queue', xMin: 38, xMax: 62, yMin: 30, yMax: 85 },
      { name: 'Counter 3 Queue', xMin: 65, xMax: 88, yMin: 35, yMax: 85 },
    ];

    for (let i = 1; i <= count; i++) {
      const zone   = zones[(i - 1) % zones.length];
      const width  = 5 + Math.random() * 2.5;
      const height = 10 + Math.random() * 4;
      const linePos = Math.floor((i - 1) / zones.length);
      const yCenter = Math.min(zone.yMax - 5,
        zone.yMin + linePos * 5.2 + (Math.random() * 3 - 1.5));
      const xCenter = zone.xMin + (zone.xMax - zone.xMin) * 0.4 + (Math.random() * 8 - 4);

      boxes.push({
        id:           100 + i,
        label:        `Person #${100 + i}`,
        confidence:   (0.88 + Math.random() * 0.11).toFixed(2),
        x:            Math.max(5,  Math.min(90, xCenter)),
        y:            Math.max(15, Math.min(85, yCenter)),
        w:            width,
        h:            height,
        zone:         zone.name,
        dwellTimeSec: Math.floor(60 + Math.random() * 480),
      });
    }
    return boxes;
  }

  state.cameraBoxes = generateBoundingBoxes(state.current.queueLength);

  // ── Local fallback helpers ─────────────────────────────────────────────────
  function _localCrowdLevel(queue) {
    if (queue >= 15) return 'HIGH';
    if (queue >= 7)  return 'MEDIUM';
    return 'LOW';
  }

  function _localWaitTime(queue, activeCounters) {
    const effectiveCounters = Math.max(1, activeCounters || 3);
    const avgServiceTime = 1.1;   // matches app/predictor.py DEFAULT_SERVICE_RATE
    return Math.max(0, Math.ceil((queue / (avgServiceTime * effectiveCounters))));
  }

  // ── Backend integration (Condition 1) ─────────────────────────────────────
  /**
   * Poll GET /queue on the FastAPI backend.
   *
   * On success  → update state.current with real crowd data; returns true.
   * On failure  → set backendConnected = false; caller handles fallback.
   */
  async function _pollBackend() {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch(`${API_BASE}/queue`, { signal: controller.signal });
      clearTimeout(tid);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Expected shape from app/main.py _snapshot():
      //   { id, count, crowd_level, est_wait_min, advice, source }
      const data = await res.json();

      state.current.queueLength   = data.count;
      state.current.waitTimeMin   = data.est_wait_min;
      state.current.crowdLevel    = data.crowd_level;
      state.current.backendAdvice = data.advice;
      state.system.backendConnected = true;
      state.system.detectorSource   = data.source || 'backend';
      return true;
    } catch (_err) {
      state.system.backendConnected = false;
      state.system.detectorSource   = 'offline-fallback';
      return false;
    }
  }

  // ── Tick (called on each interval) ────────────────────────────────────────
  /**
   * The main update cycle.  Tries the backend first; if unavailable falls back
   * to a stochastic simulation so the UI stays alive for offline demos.
   */
  async function tick() {
    if (!isRunning) return;

    const gotBackendData = await _pollBackend();

    if (!gotBackendData) {
      // ── Offline fallback: small stochastic drift ────────────────────────
      const delta    = Math.floor(Math.random() * 3) - 1;
      const newQueue = Math.max(5, Math.min(65, state.current.queueLength + delta));

      const activeCounterCount = state.counters.filter(c => c.active).length;
      const counter4Active     = state.counters.find(c => c.id === 4)?.active;
      const adjustedQueue      = (counter4Active && Math.random() > 0.4)
        ? Math.max(5, newQueue - 1)
        : newQueue;

      state.current.queueLength = adjustedQueue;
      state.current.waitTimeMin = _localWaitTime(adjustedQueue, activeCounterCount);
      state.current.crowdLevel  = _localCrowdLevel(adjustedQueue);
    }

    // ── Shared post-update logic (runs regardless of data source) ──────────
    secondsSinceLastUpdate = 0;
    state.system.lastUpdated = new Date();

    const q = state.current.queueLength;
    const activeCounterCount = state.counters.filter(c => c.active).length;

    // Status message
    if (state.current.crowdLevel === 'HIGH') {
      state.current.statusMessage =
        'Peak crowd detected. Consider visiting after the rush or pre-order online.';
    } else if (state.current.crowdLevel === 'MEDIUM') {
      state.current.statusMessage = 'Moderate queue. Average waiting time is manageable.';
    } else {
      state.current.statusMessage = 'Optimal time to visit! Minimal or zero wait time.';
    }

    // Short-term forecast (mirrors app/predictor.py forecast_count logic)
    const multipliers = [1.0, 1.08, 1.16, 1.21, 1.10, 0.94, 0.78];
    state.forecast[0].queue = q;
    state.forecast[0].wait  = state.current.waitTimeMin;
    state.forecast[0].crowd = state.current.crowdLevel;
    for (let i = 1; i < state.forecast.length; i++) {
      const qVal = Math.round(q * multipliers[i]);
      state.forecast[i].queue = qVal;
      state.forecast[i].wait  = _localWaitTime(qVal, activeCounterCount);
      state.forecast[i].crowd = _localCrowdLevel(qVal);
    }

    // Distribute queue across active counters
    const activeList = state.counters.filter(c => c.active);
    let remaining    = q;
    activeList.forEach((c, idx) => {
      if (idx === activeList.length - 1) {
        c.queue = remaining;
      } else {
        const portion = Math.round(remaining / (activeList.length - idx));
        c.queue  = portion;
        remaining -= portion;
      }
    });

    // Update active order countdowns
    if (state.activeOrders && state.activeOrders.length) {
      state.activeOrders.forEach(ord => {
        if (ord.status === 'PREPARING' && ord.estimatedReadyMin > 1 && Math.random() > 0.6) {
          ord.estimatedReadyMin = Math.max(1, ord.estimatedReadyMin - 1);
        } else if (ord.status === 'PREPARING' && ord.estimatedReadyMin <= 1) {
          ord.status = 'READY';
          ord.estimatedReadyMin = 0;
        }
      });
    }

    // Regenerate bounding boxes from current count
    state.cameraBoxes = generateBoundingBoxes(q);

    notifyListeners();
  }

  // ── Pub/sub ────────────────────────────────────────────────────────────────
  function notifyListeners() {
    listeners.forEach(fn => fn(state));
  }

  // ── Interval management ────────────────────────────────────────────────────
  function start() {
    if (intervalId) clearInterval(intervalId);
    // setInterval with an async function is safe: JS does not await the return value,
    // so overlapping calls can't happen within one 4-second window in practice.
    intervalId = setInterval(tick, POLL_INTERVAL_MS);

    if (timerTicker) clearInterval(timerTicker);
    timerTicker = setInterval(() => {
      secondsSinceLastUpdate += 1;
      const el = document.getElementById('live-last-updated-text');
      if (el) {
        el.innerText = secondsSinceLastUpdate <= 2 ? 'Just now' : `${secondsSinceLastUpdate}s ago`;
      }
    }, 1000);
  }

  // ── Scenario overrides ────────────────────────────────────────────────────
  function setScenario(key) {
    const sc = state.scenarios[key];
    if (!sc) return;
    state.current.queueLength = sc.queue;
    state.current.waitTimeMin = sc.wait;
    state.current.crowdLevel  = sc.crowd;
    state.system.confidence   = sc.confidence;
    tick();
  }

  // ── Counter control ───────────────────────────────────────────────────────
  function toggleCounter(id) {
    const c = state.counters.find(item => item.id === id);
    if (c) {
      c.active = !c.active;
      c.status = c.active ? 'Active' : 'Standby';
      const rec = state.staffRecommendations.find(r => r.id === 1);
      if (rec && id === 4) rec.applied = c.active;
      tick();
    }
  }

  // ── Alert control ─────────────────────────────────────────────────────────
  function acknowledgeAlert(alertId) {
    const a = state.alerts.find(item => item.id === alertId);
    if (a) { a.acknowledged = true; notifyListeners(); }
  }

  function acknowledgeAllAlerts() {
    state.alerts.forEach(a => a.acknowledged = true);
    notifyListeners();
  }

  // ── Demo / speed control ──────────────────────────────────────────────────
  function toggleDemoMode(val) {
    state.system.demoMode = (val !== undefined) ? val : !state.system.demoMode;
    notifyListeners();
  }

  function setSimSpeed(intervalMs) {
    updateIntervalMs = intervalMs;
    start();
  }

  function toggleSimulation(running) {
    isRunning = (running !== undefined) ? running : !isRunning;
    notifyListeners();
  }

  // ── Cart & order management ───────────────────────────────────────────────
  function addToCart(itemId) {
    const item = state.menu.find(m => m.id === itemId);
    if (!item) return;

    if (!state.cart) state.cart = [];
    const existing = state.cart.find(c => c.id === itemId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: item.id, name: item.name, price: item.price,
        qty: 1, category: item.category, counter: item.counter,
      });
    }
    notifyListeners();
  }

  function updateCartQty(itemId, delta) {
    if (!state.cart) return;
    const existing = state.cart.find(c => c.id === itemId);
    if (existing) {
      existing.qty += delta;
      if (existing.qty <= 0) state.cart = state.cart.filter(c => c.id !== itemId);
    }
    notifyListeners();
  }

  function removeFromCart(itemId) {
    if (!state.cart) return;
    state.cart = state.cart.filter(c => c.id !== itemId);
    notifyListeners();
  }

  function clearCart() {
    state.cart = [];
    notifyListeners();
  }

  function placeOrder(studentName = 'Student #412') {
    if (!state.cart || !state.cart.length) return null;

    const randNum  = Math.floor(1000 + Math.random() * 9000);
    const tokenNum = Math.floor(100  + Math.random() * 900);
    const orderId  = `SC-${randNum}`;
    const token    = `TK-${tokenNum}`;

    let total = 0;
    const itemsCopy = state.cart.map(c => {
      total += c.price * c.qty;
      return { name: c.name, qty: c.qty, price: c.price };
    });

    // Ensure express counter 4 is active for QR pickup
    const counter4 = state.counters.find(c => c.id === 4);
    if (counter4) counter4.active = true;

    const newOrder = {
      orderId, token,
      createdAt:         new Date(),
      status:            'PREPARING',
      pickupCounter:     'Counter 4 (Express QR Pickup)',
      estimatedReadyMin: Math.floor(4 + Math.random() * 4),
      items:             itemsCopy,
      totalAmount:       total,
      studentName,
      qrPayload: `SMARTCANTEEN:ORD:${orderId}:TOKEN-${token}:EXPRESS-C4:TOTAL-INR-${total}`,
    };

    if (!state.activeOrders) state.activeOrders = [];
    state.activeOrders.unshift(newOrder);
    state.cart = [];

    state.alerts.unshift({
      id:                `alt-${Date.now()}`,
      severity:          'low',
      badge:             'EXPRESS ORDER PLACED',
      message:           `Order #${orderId} (${token}) received for Counter 4 pickup.`,
      timestamp:         'Just now',
      isoTime:           new Date(),
      acknowledged:      false,
      recommendedAction: 'Pre-package combo at Counter 4 express lane.',
    });

    notifyListeners();
    return newOrder;
  }

  // ── Feedback submission to backend (Condition 3) ──────────────────────────
  /**
   * POST a user-testing feedback entry to the backend /feedback endpoint.
   * Fails silently if the backend is unreachable (the UI toast handles it).
   */
  async function submitFeedback(role, rating, comment = '') {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role, rating, comment }),
        signal:  AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch (_err) {
      return false;
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  // Trigger one immediate tick so the UI shows real data as fast as possible,
  // then schedule the repeating poll.
  tick();
  start();

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    getState:           () => state,
    subscribe:          (fn) => {
      listeners.push(fn);
      fn(state);
      return () => { listeners = listeners.filter(l => l !== fn); };
    },
    setScenario,
    toggleCounter,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    toggleDemoMode,
    toggleSimulation,
    setSimSpeed,
    triggerTick:        tick,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    placeOrder,
    submitFeedback,    // exposed for the feedback form in the UI
    getApiBase:        () => API_BASE,
  };
})();
