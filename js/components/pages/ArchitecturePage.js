// SmartCanteen AI - System Architecture Pipeline Page Component
window.ArchitecturePage = function() {
  const steps = [
    {
      step: 1,
      title: "CANTEEN QUEUE",
      sub: "Physical Student Queue",
      desc: "Physical arrivals forming in front of meal and snack counters during canteen operating hours.",
      icon: "Users",
      color: "from-sky-500 to-blue-600",
      tech: "Physical Space • Dynamic Inflow"
    },
    {
      step: 2,
      title: "CAMERA / DATA COLLECTION",
      sub: "Overhead Wide-Angle Feed",
      desc: "Fixed overhead RTSP cameras capture non-identifiable top-down frames at 15–30 FPS.",
      icon: "Camera",
      color: "from-blue-600 to-indigo-600",
      tech: "RTSP Stream • 1080p @ 30FPS"
    },
    {
      step: 3,
      title: "DATA PREPROCESSING",
      sub: "Frame Normalization & ROI",
      desc: "Frame resizing, lane ROI masking, contrast adjustment, and temporal frame downsampling.",
      icon: "Layers",
      color: "from-indigo-600 to-purple-600",
      tech: "OpenCV • ROI Polygon Crop"
    },
    {
      step: 4,
      title: "AI PERSON DETECTION",
      sub: "YOLO-Class Edge Model",
      desc: "Lightweight YOLOv8 object detection detects heads/bodies with confidence scores & IoU tracking.",
      icon: "Cpu",
      color: "from-purple-600 to-fuchsia-600",
      tech: "YOLOv8 Edge / ONNX Runtime"
    },
    {
      step: 5,
      title: "QUEUE DATA",
      sub: "Aggregated Metrics Stream",
      desc: "Person coordinates translated to queue counts per counter, dwell times, and velocity vectors.",
      icon: "Activity",
      color: "from-fuchsia-600 to-rose-600",
      tech: "Time-Series Stream (JSON / MQTT)"
    },
    {
      step: 6,
      title: "ML PREDICTION ENGINE",
      sub: "Time-Series Forecasting",
      desc: "Predicts future queue growth (15m/30m/60m) combining current queue, hour of day, and historical trend.",
      icon: "Brain",
      color: "from-rose-600 to-amber-600",
      tech: "XGBoost / LSTM / Heuristic Regressor"
    },
    {
      step: 7,
      title: "DECISION LOGIC",
      sub: "Rule & Threshold Engine",
      desc: "Computes wait times, generates crowd level alerts, and calculates best-time recommendation windows.",
      icon: "Zap",
      color: "from-amber-600 to-emerald-600",
      tech: "State Machine • Dynamic Thresholds"
    },
    {
      step: 8,
      title: "STUDENT / STAFF DASHBOARD",
      sub: "Real-Time User Interfaces",
      desc: "Distributes simplified student mobile view, staff operations command, and public display boards.",
      icon: "LayoutDashboard",
      color: "from-emerald-600 to-teal-600",
      tech: "React 18 • WebSocket • Tailwind"
    },
    {
      step: 9,
      title: "FEEDBACK LOOP",
      sub: "Closed-Loop Error Correction",
      desc: "Actual observed wait time at checkout feeds back into the ML Prediction Engine to refine error weights.",
      icon: "History",
      color: "from-teal-600 to-sky-600",
      tech: "Ground Truth Checkout Logs → Retraining",
      isFeedback: true
    }
  ];

  const stepsHtml = steps.map((s, idx) => {
    const isLast = idx === steps.length - 1;
    const iconSvg = window.Icons[s.icon] ? window.Icons[s.icon]("w-6 h-6 text-white") : window.Icons.Activity("w-6 h-6 text-white");

    return `
      <div class="relative flex flex-col items-center">
        <!-- Node Box -->
        <div class="w-full glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:scale-[1.02] shadow-sm relative overflow-hidden group">
          
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              ${iconSvg}
            </div>

            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">BLOCK ${s.step}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">${s.tech}</span>
              </div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">${s.title}</h3>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">${s.sub}</p>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">${s.desc}</p>
            </div>
          </div>

          ${s.isFeedback ? `
            <div class="mt-3 pt-2 border-t border-teal-500/20 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              ${window.Icons.History("w-4 h-4")}
              <span>Feedback Data: Actual Wait Time ➔ ML Engine Error Tuning</span>
            </div>
          ` : ''}
        </div>

        <!-- Animated Downward Flow Arrow (if not last) -->
        ${!isLast ? `
          <div class="my-2 flex flex-col items-center">
            <div class="w-0.5 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 animate-pulse"></div>
            <div class="text-sky-500 -mt-1 font-bold">
              ▼
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join("");

  return `
    <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      <!-- Page Header -->
      <div class="text-center py-2">
        <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
          END-TO-END PIPELINE ARCHITECTURE
        </span>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
          System Architecture & Data Flow
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          Interactive flow tracing physical queue detection to predictive inference and closed-loop feedback.
        </p>
      </div>

      <!-- Closed-loop Feedback Callout Banner -->
      <div class="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-mono flex items-center justify-between gap-3">
        <span class="flex items-center gap-2 font-bold">
          ${window.Icons.History("w-4 h-4")}
          Closed-Loop Self-Improving Pipeline: Actual Checkout Duration feeds continuous model refinement
        </span>
        <span class="px-2.5 py-1 rounded bg-teal-500/20 font-black">9-STAGE FLOW</span>
      </div>

      <!-- 18. INTERACTIVE 9-STAGE PIPELINE -->
      <div class="space-y-1">
        ${stepsHtml}
      </div>

    </div>
  `;
};
