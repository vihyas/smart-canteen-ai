// SmartCanteen AI - Dedicated Smart Pre-Order & QR Code Pickup Page
window.OrderPage = function(data, options = {}) {
  const menu = data.menu || [];
  const cart = data.cart || [];
  const activeOrders = data.activeOrders || [];
  const current = data.current;
  const activeCategory = options.category || "all";
  const activeQrOrder = options.selectedQrOrder || (activeOrders.length ? activeOrders[0] : null);

  // Filter menu items by category
  const filteredItems = menu.filter(item => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Calculate cart total
  let subtotal = 0;
  let totalItemsCount = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    totalItemsCount += item.qty;
  });
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + tax;

  // Helper to generate a realistic SVG QR code for the order
  function generateSvgQrCode(payload, token) {
    // Generate deterministic 21x21 QR matrix pattern based on token/payload
    const size = 21;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    // Corner finder patterns (7x7)
    function drawFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[r0 + r][c0 + c] = 1;
          }
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // Pseudo-random data blocks seeded from payload characters
    let seed = 0;
    for (let i = 0; i < payload.length; i++) {
      seed = (seed * 31 + payload.charCodeAt(i)) % 100000;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner finder zones
        if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        seed = (seed * 1103515245 + 12345) % 2147483647;
        matrix[r][c] = (seed % 100) > 46 ? 1 : 0;
      }
    }

    // Build SVG paths
    const cellSize = 10;
    let rects = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] === 1) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" rx="1"/>`;
        }
      }
    }

    return `
      <svg viewBox="0 0 ${size * cellSize} ${size * cellSize}" class="w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl shadow-md border-4 border-slate-900 mx-auto">
        ${rects}
      </svg>
    `;
  }

  // Food card items html
  const foodCardsHtml = filteredItems.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const qty = inCart ? inCart.qty : 0;

    return `
      <div class="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <!-- Top category strip & veg/non-veg badge -->
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded border-2 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'} flex items-center justify-center p-0.5" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
                <span class="w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              </span>
              <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ${item.category}
              </span>
            </div>
            
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              ${item.badge}
            </span>
          </div>

          <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-500 transition-colors">
            ${item.name}
          </h3>

          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            ${item.description}
          </p>

          <!-- Key item tags -->
          <div class="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
              ${window.Icons.Clock("w-3 h-3 text-amber-500")} ${item.prepTime}
            </span>
            <span class="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
              🔥 ${item.calories}
            </span>
            <span class="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded text-sky-600 dark:text-sky-400 font-semibold">
              ${item.counter}
            </span>
          </div>
        </div>

        <!-- Price & Add/Quantity Actions -->
        <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <div class="text-xl font-black text-slate-900 dark:text-white">
              ₹${item.price}
              <span class="text-xs font-medium text-slate-400 font-mono ml-1">(${item.priceUsd})</span>
            </div>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">★ ${item.rating} Rating</span>
          </div>

          <div>
            ${qty > 0 ? `
              <div class="flex items-center gap-2 bg-sky-600 text-white rounded-xl p-1 shadow-md">
                <button onclick="window.App.updateCartQty('${item.id}', -1)" class="w-7 h-7 rounded-lg bg-sky-700 hover:bg-sky-800 flex items-center justify-center transition-colors">
                  ${window.Icons.Minus("w-3.5 h-3.5")}
                </button>
                <span class="font-mono font-bold text-sm px-1.5">${qty}</span>
                <button onclick="window.App.updateCartQty('${item.id}', 1)" class="w-7 h-7 rounded-lg bg-sky-700 hover:bg-sky-800 flex items-center justify-center transition-colors">
                  ${window.Icons.Plus("w-3.5 h-3.5")}
                </button>
              </div>
            ` : `
              <button onclick="window.App.addToCart('${item.id}')" class="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 transition-all flex items-center gap-1.5 active:scale-95">
                ${window.Icons.Plus("w-3.5 h-3.5")}
                <span>Add Item</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Categories bar
  const categories = [
    { id: "all", label: "All Items", icon: "Utensils", count: menu.length },
    { id: "meals", label: "Meals & Mains", icon: "Utensils", count: menu.filter(m => m.category === "meals").length },
    { id: "snacks", label: "Quick Snacks", icon: "Coffee", count: menu.filter(m => m.category === "snacks").length },
    { id: "drinks", label: "Drinks & Shakes", icon: "Zap", count: menu.filter(m => m.category === "drinks").length },
    { id: "combos", label: "Express Deals", icon: "Sparkles", count: menu.filter(m => m.category === "combos").length }
  ];

  const categoryTabsHtml = categories.map(cat => `
    <button onclick="window.App.setOrderCategory('${cat.id}')" 
            class="px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }">
      <span>${cat.label}</span>
      <span class="px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === cat.id ? 'bg-sky-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
        ${cat.count}
      </span>
    </button>
  `).join("");

  return `
    <div class="space-y-6 animate-fadeIn pb-16">
      
      <!-- Top Header & Fast Lane Banner -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Smart Pre-Order & Fast-Lane QR Pickup</h2>
            <span class="badge-ai px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              ZERO-WAIT FAST LANE
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Pre-order online, receive an instant pickup QR code ticket, and collect directly at Express Counter 4.</p>
        </div>

        <!-- Live Queue Comparison Pill -->
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
            <span class="text-slate-400">Physical In-Person Line:</span>
            <strong class="text-amber-500 ml-1">${current.queueLength} students (~${current.waitTimeMin}m)</strong>
          </div>
          <div class="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
            <span class="text-slate-400">Express QR Pickup:</span>
            <strong class="text-emerald-500 ml-1">~5–8 mins (0m wait)</strong>
          </div>
        </div>
      </div>

      <!-- MAIN GRID: Menu Items (2 cols) & Cart/QR Ticket Panel (1 col) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- LEFT 2 COLS: Category Bar & Food Menu Grid -->
        <div class="lg:col-span-2 space-y-4">
          
          <!-- Category Tabs Bar -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2">
            ${categoryTabsHtml}
          </div>

          <!-- Food Items Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${foodCardsHtml}
          </div>

        </div>

        <!-- RIGHT 1 COL: Live Cart & Instant QR Code Pass -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Active Cart Summary Card -->
          <div class="glass-card p-5 rounded-3xl border-2 border-sky-500/30 relative">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <div class="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  ${window.Icons.ShoppingBag("w-4 h-4")}
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white">Your Pre-Order Cart</h3>
                  <span class="text-[11px] font-mono text-slate-400">${totalItemsCount} item(s) selected</span>
                </div>
              </div>

              ${cart.length ? `
                <button onclick="window.App.clearCart()" class="text-xs text-rose-500 hover:underline font-mono">
                  Clear All
                </button>
              ` : ''}
            </div>

            <!-- Cart Items List -->
            <div class="py-3 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-64 overflow-y-auto">
              ${cart.length ? cart.map(item => `
                <div class="py-2.5 flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <h5 class="text-xs font-bold text-slate-900 dark:text-white truncate">${item.name}</h5>
                    <span class="text-[10px] font-mono text-slate-400">₹${item.price} each • ${item.counter}</span>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button onclick="window.App.updateCartQty('${item.id}', -1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                        ${window.Icons.Minus("w-3 h-3")}
                      </button>
                      <span class="font-mono text-xs font-bold px-1">${item.qty}</span>
                      <button onclick="window.App.updateCartQty('${item.id}', 1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                        ${window.Icons.Plus("w-3 h-3")}
                      </button>
                    </div>
                    <span class="text-xs font-mono font-bold text-slate-900 dark:text-white w-12 text-right">₹${item.price * item.qty}</span>
                  </div>
                </div>
              `).join("") : `
                <div class="py-8 text-center text-slate-400">
                  <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-2">
                    ${window.Icons.ShoppingBag("w-5 h-5 text-slate-400")}
                  </div>
                  <p class="text-xs font-semibold">Your cart is empty</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Add delicious snacks or meals to generate an express QR pickup pass!</p>
                </div>
              `}
            </div>

            <!-- Price Breakdown & Checkout -->
            ${cart.length ? `
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div class="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹${subtotal}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Canteen GST (5%):</span>
                  <span>₹${tax}</span>
                </div>
                <div class="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span>Grand Total:</span>
                  <span class="text-sky-500">₹${grandTotal}</span>
                </div>

                <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono mt-3 border border-emerald-500/20">
                  ⚡ <strong>Express Pickup Route:</strong> Ready at Counter 4 in ~6 mins.
                </div>

                <button onclick="window.App.placeOrder()" class="w-full mt-3 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                  ${window.Icons.QrCode("w-5 h-5")}
                  <span>Pay ₹${grandTotal} & Get QR Code</span>
                </button>
              </div>
            ` : ''}
          </div>

          <!-- LATEST GENERATED QR PICKUP PASS CARD -->
          ${activeQrOrder ? `
            <div id="active-qr-pass" class="glass-card p-6 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-slate-900/40 to-transparent relative overflow-hidden shadow-2xl">
              
              <div class="flex items-center justify-between pb-3 border-b border-emerald-500/30 mb-4">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping-subtle"></span>
                  <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    ACTIVE EXPRESS PICKUP PASS
                  </h4>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white">
                  ${activeQrOrder.status}
                </span>
              </div>

              <!-- QR Visual Representation -->
              <div class="text-center my-2">
                ${generateSvgQrCode(activeQrOrder.qrPayload, activeQrOrder.token)}
                
                <div class="mt-3">
                  <span class="text-xs font-mono text-slate-400">Pickup Token:</span>
                  <div class="text-2xl font-black tracking-widest text-slate-900 dark:text-white font-mono mt-0.5">
                    ${activeQrOrder.token}
                  </div>
                  <span class="text-[11px] font-mono text-slate-500">Order ID: #${activeQrOrder.orderId}</span>
                </div>
              </div>

              <!-- Pickup Instructions -->
              <div class="mt-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-emerald-500/30 text-xs font-mono space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Designated Counter:</span>
                  <strong class="text-emerald-500 font-bold">${activeQrOrder.pickupCounter}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Est. Ready:</span>
                  <strong class="text-amber-500">${activeQrOrder.estimatedReadyMin > 0 ? `In ~${activeQrOrder.estimatedReadyMin} mins` : 'READY AT COUNTER 4!'}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Items:</span>
                  <span class="text-slate-700 dark:text-slate-300">${activeQrOrder.items.map(i => `${i.qty}x ${i.name}`).join(", ")}</span>
                </div>
              </div>

              <!-- Verification Note -->
              <p class="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-3 font-mono">
                📱 Present this QR code at Counter 4 scanner for zero-queue fast pickup.
              </p>

              <button onclick="window.App.simulateQrScan('${activeQrOrder.orderId}')" class="w-full mt-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
                ${window.Icons.CheckCircle("w-4 h-4 text-emerald-500")}
                <span>Simulate Scanner Verification</span>
              </button>
            </div>
          ` : ''}

        </div>

      </div>

    </div>
  `;
};
