// SmartCanteen AI - Simulated Camera & Computer Vision Overlay Component
window.CameraMonitor = function(data, options = {}) {
  const current = data.current;
  const boxes = data.cameraBoxes || [];
  const isCompact = options.compact || false;

  // Generate SVG bounding boxes
  const boxesSvg = boxes.map(b => {
    const isRed = current.crowdLevel === 'HIGH';
    const boxColor = isRed ? '#ef4444' : (current.crowdLevel === 'MEDIUM' ? '#f59e0b' : '#10b981');

    return `
      <g class="detection-box group cursor-pointer" data-id="${b.id}">
        <!-- Person Bounding Box -->
        <rect x="${b.x}%" y="${b.y}%" width="${b.w}%" height="${b.h}%" 
              fill="rgba(56, 189, 248, 0.08)" 
              stroke="${boxColor}" 
              stroke-width="1.8" 
              stroke-dasharray="0"
              rx="3" 
              class="transition-all duration-300 hover:fill-sky-500/20" />
        
        <!-- Corner brackets for futuristic vision HUD look -->
        <line x1="${b.x}%" y1="${b.y}%" x2="${b.x + 1.2}%" y2="${b.y}%" stroke="#38bdf8" stroke-width="2" />
        <line x1="${b.x}%" y1="${b.y}%" x2="${b.x}%" y2="${b.y + 2}%" stroke="#38bdf8" stroke-width="2" />
        
        <!-- Anonymous Person Label badge (Zero facial recognition) -->
        <rect x="${b.x}%" y="${Math.max(2, b.y - 4.5)}%" width="${Math.max(6, b.w + 2)}%" height="4%" 
              fill="#0f172a" rx="2" opacity="0.85" />
        <text x="${b.x + 0.8}%" y="${Math.max(4.5, b.y - 1.5)}%" 
              class="text-[9px] font-mono font-bold fill-sky-300">
          #${b.id} [${b.confidence}]
        </text>

        <!-- Abstract head circle (strictly non-identifiable) -->
        <circle cx="${b.x + b.w / 2}%" cy="${b.y + b.h * 0.22}%" r="${Math.min(b.w, b.h) * 0.18}%" 
                fill="${boxColor}" opacity="0.4" />
      </g>
    `;
  }).join("");

  return `
    <div class="glass-card p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative">
      <!-- Camera Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            ${window.Icons.Camera("w-4 h-4")}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Camera Stream (Canteen Main Floor)</h3>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping-subtle"></span>
                ONLINE • CAM-01
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">YOLOv8 Edge Vision Node • 30 FPS Anonymous Detection</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="badge-ai px-2.5 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5">
            ${window.Icons.Cpu("w-3.5 h-3.5")}
            AI PERSON DETECTION
          </span>
          <span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Detected: <strong class="text-sky-500 font-black">${current.queueLength}</strong>
          </span>
        </div>
      </div>

      <!-- Synthetic Canteen Video Feed Simulation Viewport -->
      <div class="relative w-full ${isCompact ? 'h-64' : 'h-80 sm:h-96'} rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex flex-col justify-between p-3 select-none">
        
        <!-- Background Simulated Canteen Grid & Queue Lanes -->
        <div class="absolute inset-0 opacity-25 pointer-events-none" style="background-image: radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px); background-size: 20px 20px;"></div>

        <!-- Simulated Counter Zones & Floor Architecture -->
        <div class="absolute top-0 left-0 right-0 h-14 bg-slate-900/90 border-b border-slate-700 flex items-center justify-around px-4 z-0 text-slate-400 text-xs font-mono">
          <div class="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-600">
            <span class="w-2 h-2 rounded-full bg-red-500"></span> Counter 1 (Main Meals)
          </div>
          <div class="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-600">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Counter 2 (Snacks)
          </div>
          <div class="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-600">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Counter 3 (Beverages)
          </div>
        </div>

        <!-- Queue Guideline Barriers (Floor Markings) -->
        <div class="absolute inset-0 pointer-events-none flex justify-around pt-16 pb-6 px-8 opacity-20">
          <div class="w-28 border-x-2 border-dashed border-sky-400 h-full"></div>
          <div class="w-28 border-x-2 border-dashed border-sky-400 h-full"></div>
          <div class="w-28 border-x-2 border-dashed border-sky-400 h-full"></div>
        </div>

        <!-- Dynamic Scanline Animation -->
        <div class="absolute inset-x-0 h-2 bg-gradient-to-b from-sky-400/30 to-transparent animate-scanline pointer-events-none"></div>

        <!-- SVG Detection Overlay (Bounding boxes and confidence scores) -->
        <svg class="absolute inset-0 w-full h-full pointer-events-auto z-10" preserveAspectRatio="none">
          ${boxesSvg}
        </svg>

        <!-- Top HUD Overlay -->
        <div class="relative z-20 flex justify-between items-center text-[11px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80">
          <div class="flex items-center gap-3">
            <span class="text-rose-400 font-bold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping-subtle"></span> REC [SIMULATED]
            </span>
            <span class="text-slate-400">FPS: 29.98</span>
            <span class="text-slate-400">Latency: 18ms</span>
          </div>
          <div class="flex items-center gap-2 text-sky-400">
            <span>YOLO-V8 ANONYMOUS TRACKING</span>
            <span>FOV: 110°</span>
          </div>
        </div>

        <!-- Bottom Privacy & Live Watermark HUD -->
        <div class="relative z-20 flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 gap-2">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400 flex items-center gap-1">
              ${window.Icons.ShieldCheck("w-3.5 h-3.5")}
              Zero Facial Recognition • Strict Anonymization
            </span>
          </div>
          <div class="text-slate-400">
            Canteen Central Hall • Floor 1 South Gate
          </div>
        </div>
      </div>

      <!-- Quick Action Controls below feed -->
      <div class="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span class="font-mono font-medium">Tracking Status:</span>
          <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            ${window.Icons.Check("w-3.5 h-3.5")} Normal Tracking (98.4% IoU)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.App.switchPage('live-queue')" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors flex items-center gap-1">
            <span>Expand Full Monitor</span>
            ${window.Icons.ArrowRight("w-3 h-3")}
          </button>
        </div>
      </div>
    </div>
  `;
};
