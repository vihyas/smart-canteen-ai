// SmartCanteen AI - Initial Baseline Demo Data
window.InitialCanteenData = {
  system: {
    name: "SmartCanteen AI",
    tagline: "Intelligent Queue Management",
    version: "v2.4-prototype",
    status: "ONLINE",
    demoMode: true,
    lastUpdated: new Date(),
    confidence: 92,
    serviceRate: 1.5, // minutes per student per counter
    activeCounters: 3,
    totalCounters: 4
  },
  
  current: {
    queueLength: 37,
    waitTimeMin: 25,
    crowdLevel: "HIGH", // "LOW", "MEDIUM", "HIGH"
    statusMessage: "Peak crowd detected. Consider visiting later.",
    bestTimeRecommendation: {
      time: "After 2:15 PM",
      expectedQueue: 12,
      expectedWait: 8,
      benefits: [
        "Lower crowd & zero waiting congestion",
        "Shorter waiting time (~8 mins)",
        "Fresh batch of lunch specials available",
        "Better seating availability"
      ]
    }
  },

  cart: [
    { id: "m-1", name: "South Indian Executive Thali", price: 120, qty: 1, category: "meals", counter: "Counter 1" },
    { id: "d-1", name: "Iced Hazelnut Cold Coffee", price: 75, qty: 1, category: "drinks", counter: "Counter 3" }
  ],

  activeOrders: [
    {
      orderId: "SC-8492",
      token: "TK-429",
      createdAt: new Date(Date.now() - 4 * 60 * 1000),
      status: "PREPARING", // "PLACED", "PREPARING", "READY", "COLLECTED"
      pickupCounter: "Counter 4 (Express QR Pickup)",
      estimatedReadyMin: 8,
      items: [
        { name: "Rush Hour Student Combo", qty: 1, price: 160 }
      ],
      totalAmount: 160,
      studentName: "Rahul Sharma",
      qrPayload: "SMARTCANTEEN:ORD:SC-8492:TOKEN-429:TIME-1345:EXPRESS-C4"
    }
  ],

  menu: [
    {
      id: "m-1",
      name: "South Indian Executive Thali",
      category: "meals",
      price: 120,
      priceUsd: "$4.50",
      rating: 4.8,
      prepTime: "8 min",
      calories: "520 kcal",
      isVeg: true,
      counter: "Counter 1",
      tag: "Chef's Special",
      description: "Steamed rice, 2 whole wheat rotis, paneer sabzi, dal tadka, curd, crispy papad & gulab jamun.",
      badge: "Popular Meal"
    },
    {
      id: "m-2",
      name: "Paneer Butter Masala Combo",
      category: "meals",
      price: 140,
      priceUsd: "$5.00",
      rating: 4.9,
      prepTime: "10 min",
      calories: "640 kcal",
      isVeg: true,
      counter: "Counter 1",
      tag: "Bestseller",
      description: "Rich creamy cottage cheese gravy cooked in cashew-tomato reduction, with 3 butter naans & jeera rice.",
      badge: "Top Rated"
    },
    {
      id: "m-3",
      name: "Hyderabadi Chicken Biryani",
      category: "meals",
      price: 180,
      priceUsd: "$6.00",
      rating: 4.9,
      prepTime: "6 min",
      calories: "710 kcal",
      isVeg: false,
      counter: "Counter 1",
      tag: "Hot & Spicy",
      description: "Slow-cooked aromatic basmati rice layered with spiced marinated chicken, mirchi ka salan & raita.",
      badge: "Student Favorite"
    },
    {
      id: "m-4",
      name: "Classic Masala Dosa Meal",
      category: "meals",
      price: 90,
      priceUsd: "$3.50",
      rating: 4.7,
      prepTime: "5 min",
      calories: "380 kcal",
      isVeg: true,
      counter: "Counter 1",
      tag: "Quick Serve",
      description: "Golden crispy fermented crepe filled with spiced potato onion masala, hot vegetable sambar & 2 chutneys.",
      badge: "Breakfast/Lunch"
    },
    {
      id: "s-1",
      name: "Crispy Punjabi Samosas (2 pcs)",
      category: "snacks",
      price: 40,
      priceUsd: "$1.50",
      rating: 4.8,
      prepTime: "2 min",
      calories: "280 kcal",
      isVeg: true,
      counter: "Counter 2",
      tag: "Instant Pickup",
      description: "Crispy fried golden pastry stuffed with spiced potatoes, peas, served with tangy tamarind and mint chutneys.",
      badge: "Snack Hit"
    },
    {
      id: "s-2",
      name: "Cheesy Veg Burger & Crinkle Fries",
      category: "snacks",
      price: 110,
      priceUsd: "$3.80",
      rating: 4.6,
      prepTime: "7 min",
      calories: "510 kcal",
      isVeg: true,
      counter: "Counter 2",
      tag: "Hot & Fresh",
      description: "Crispy herb potato patty with melted cheddar slice, crisp lettuce, tomato, chipotle mayo & seasoned fries.",
      badge: "Combo Deal"
    },
    {
      id: "s-3",
      name: "Loaded Cheesy Nachos",
      category: "snacks",
      price: 95,
      priceUsd: "$3.20",
      rating: 4.7,
      prepTime: "4 min",
      calories: "420 kcal",
      isVeg: true,
      counter: "Counter 2",
      tag: "Sharing Plate",
      description: "Crispy corn tortilla chips smothered in warm cheese sauce, jalapeno slices, black olives & tangy salsa.",
      badge: "Snack"
    },
    {
      id: "s-4",
      name: "Paneer Tikka Kathi Roll",
      category: "snacks",
      price: 85,
      priceUsd: "$3.00",
      rating: 4.8,
      prepTime: "5 min",
      calories: "390 kcal",
      isVeg: true,
      counter: "Counter 2",
      tag: "Grab & Go",
      description: "Tandoori marinated cottage cheese with roasted bell peppers rolled in a flaky layered paratha.",
      badge: "Quick Bite"
    },
    {
      id: "s-5",
      name: "Peri Peri French Fries",
      category: "snacks",
      price: 70,
      priceUsd: "$2.20",
      rating: 4.9,
      prepTime: "3 min",
      calories: "310 kcal",
      isVeg: true,
      counter: "Counter 2",
      tag: "Bestseller",
      description: "Deep fried golden potato batons dusted generously with fiery peri-peri seasoning and garlic mayo dip.",
      badge: "Crunchy"
    },
    {
      id: "d-1",
      name: "Iced Hazelnut Cold Coffee",
      category: "drinks",
      price: 75,
      priceUsd: "$2.50",
      rating: 4.9,
      prepTime: "2 min",
      calories: "190 kcal",
      isVeg: true,
      counter: "Counter 3",
      tag: "Chilled",
      description: "Double shot espresso blended with chilled full-cream milk, hazelnut extract and chocolate swirl.",
      badge: "Summer Hit"
    },
    {
      id: "d-2",
      name: "Fresh Alphonso Mango Smoothie",
      category: "drinks",
      price: 80,
      priceUsd: "$2.80",
      rating: 4.8,
      prepTime: "3 min",
      calories: "210 kcal",
      isVeg: true,
      counter: "Counter 3",
      tag: "Seasonal",
      description: "Pure Alphonso mango pulp blended with greek yogurt, crushed ice and a touch of wild honey.",
      badge: "Fresh"
    },
    {
      id: "d-3",
      name: "Special Masala Chai",
      category: "drinks",
      price: 25,
      priceUsd: "$0.90",
      rating: 4.9,
      prepTime: "1 min",
      calories: "85 kcal",
      isVeg: true,
      counter: "Counter 3",
      tag: "Steaming Hot",
      description: "Traditional brewed Assam black tea simmered with fresh crushed ginger, green cardamom and whole cloves.",
      badge: "Evergreen"
    },
    {
      id: "d-4",
      name: "Lemon Mint Sparkler Cooler",
      category: "drinks",
      price: 50,
      priceUsd: "$1.80",
      rating: 4.7,
      prepTime: "2 min",
      calories: "65 kcal",
      isVeg: true,
      counter: "Counter 3",
      tag: "Refreshing",
      description: "Freshly squeezed lime juice, crushed garden mint, black salt and chilled sparkling club soda.",
      badge: "Zero Fat"
    },
    {
      id: "c-1",
      name: "Rush Hour Express Student Combo",
      category: "combos",
      price: 160,
      priceUsd: "$5.50",
      rating: 4.9,
      prepTime: "4 min",
      calories: "680 kcal",
      isVeg: true,
      counter: "Counter 4 (Express)",
      tag: "Zero Wait Deal",
      description: "Veg Cheese Burger + Seasoned French Fries + Iced Cold Coffee (Pre-packed for immediate express QR pickup!).",
      badge: "Save ₹25 • Express"
    }
  ],

  forecast: [
    { time: "Now", queue: 37, wait: 25, crowd: "HIGH", confidence: 92, trend: "up" },
    { time: "10 min", queue: 40, wait: 27, crowd: "HIGH", confidence: 91, trend: "up" },
    { time: "20 min", queue: 43, wait: 29, crowd: "HIGH", confidence: 89, trend: "up" },
    { time: "30 min", queue: 45, wait: 30, crowd: "HIGH", confidence: 88, trend: "peak" },
    { time: "40 min", queue: 41, wait: 24, crowd: "HIGH", confidence: 86, trend: "down" },
    { time: "50 min", queue: 35, wait: 19, crowd: "MEDIUM", confidence: 84, trend: "down" },
    { time: "60 min", queue: 29, wait: 15, crowd: "MEDIUM", confidence: 81, trend: "down" }
  ],

  studentNext30Min: [
    { slot: "10 min", level: "HIGH", wait: "27 min", barColor: "bg-red-500", note: "Queue growing (+3 students)" },
    { slot: "20 min", level: "HIGH", wait: "29 min", barColor: "bg-red-500", note: "Approaching peak arrival" },
    { slot: "30 min", level: "MEDIUM", wait: "22 min", barColor: "bg-amber-500", note: "Crowd starts subsiding" }
  ],

  factors: [
    { title: "Current Queue Length", value: "37 Students", impact: "+35% peak load", icon: "Users" },
    { title: "Time of Day", value: "1:15 PM (Lunch Rush)", impact: "+40% arrival rate", icon: "Clock" },
    { title: "Historical Queue Patterns", value: "Tuesdays Peak at 1:30 PM", impact: "High correlation (r=0.94)", icon: "History" },
    { title: "Service Rate", value: "1.48 min / student", impact: "3 counters active", icon: "Zap" },
    { title: "Current Crowd Trend", value: "+2.4 students / 5 min", impact: "Inflow exceeds throughput", icon: "TrendingUp" }
  ],

  peakHours: [
    { hour: "10 AM", queue: 12, wait: 8, crowd: "LOW" },
    { hour: "11 AM", queue: 22, wait: 14, crowd: "MEDIUM" },
    { hour: "12 PM", queue: 42, wait: 28, crowd: "HIGH" },
    { hour: "1 PM", queue: 45, wait: 30, crowd: "HIGH" },
    { hour: "2 PM", queue: 28, wait: 18, crowd: "MEDIUM" },
    { hour: "3 PM", queue: 14, wait: 9, crowd: "LOW" },
    { hour: "4 PM", queue: 9, wait: 5, crowd: "LOW" }
  ],

  dailyAverageWait: [
    { day: "Monday", wait: 18, queue: 28, peakTime: "1:15 PM" },
    { day: "Tuesday", wait: 25, queue: 38, peakTime: "1:30 PM" },
    { day: "Wednesday", wait: 22, queue: 34, peakTime: "1:00 PM" },
    { day: "Thursday", wait: 20, queue: 31, peakTime: "1:20 PM" },
    { day: "Friday", wait: 26, queue: 40, peakTime: "1:10 PM" },
    { day: "Saturday", wait: 11, queue: 16, peakTime: "12:30 PM" },
    { day: "Sunday", wait: 6, queue: 8, peakTime: "12:00 PM" }
  ],

  alerts: [
    {
      id: "alt-1",
      severity: "high",
      badge: "HIGH CROWD DETECTED",
      message: "Queue reached 37 students.",
      timestamp: "2 minutes ago",
      isoTime: new Date(Date.now() - 2 * 60 * 1000),
      acknowledged: false,
      recommendedAction: "Dispatch queue marshals and open Counter 4."
    },
    {
      id: "alt-2",
      severity: "medium",
      badge: "PEAK PERIOD PREDICTED",
      message: "High crowd expected for the next 20 minutes.",
      timestamp: "8 minutes ago",
      isoTime: new Date(Date.now() - 8 * 60 * 1000),
      acknowledged: true,
      recommendedAction: "Pre-package combo lunch plates at counter 2."
    },
    {
      id: "alt-3",
      severity: "low",
      badge: "QUEUE DECREASING",
      message: "Queue expected to fall below 20 students by 2:15 PM.",
      timestamp: "15 minutes ago",
      isoTime: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: true,
      recommendedAction: "Normal operational status."
    },
    {
      id: "alt-4",
      severity: "medium",
      badge: "COUNTER 3 SPEED ALERT",
      message: "Average checkout time at Beverages counter increased to 2.1 mins.",
      timestamp: "28 minutes ago",
      isoTime: new Date(Date.now() - 28 * 60 * 1000),
      acknowledged: true,
      recommendedAction: "Check barcode scanner connectivity."
    }
  ],

  staffRecommendations: [
    { id: 1, title: "Open additional service capacity", desc: "Activate Counter 4 (Express Lane) to decrease wait time by ~8 minutes.", action: "Open Counter 4", applied: false, priority: "High" },
    { id: 2, title: "Prioritize high-demand counters", desc: "Redirect 40% of standard orders to Pre-Ordered QR pickup point.", action: "Enable QR Fast-lane", applied: true, priority: "Medium" },
    { id: 3, title: "Monitor queue growth", desc: "Threshold set to trigger alert when queue surpasses 42 students.", action: "Set Threshold: 42", applied: true, priority: "Medium" },
    { id: 4, title: "Display crowd information to students", desc: "Publish 'Peak Rush Warning' on student mobile portal and digital screens.", action: "Broadcast Live Alert", applied: true, priority: "Low" }
  ],

  counters: [
    { id: 1, name: "Main Meal & Thali", active: true, queue: 16, avgSpeed: "1.4 min", status: "Busy" },
    { id: 2, name: "Fast Food & Snacks", active: true, queue: 13, avgSpeed: "1.2 min", status: "Peak" },
    { id: 3, name: "Beverages & Juice", active: true, queue: 8, avgSpeed: "0.9 min", status: "Optimal" },
    { id: 4, name: "Express Pre-order Pickup", active: false, queue: 0, avgSpeed: "0.5 min", status: "Standby" }
  ],

  scenarios: {
    lunchRush: { name: "Lunch Rush (Peak)", queue: 37, wait: 25, crowd: "HIGH", confidence: 92, trend: "+3/min" },
    afternoonCalm: { name: "Afternoon Lull (Low)", queue: 11, wait: 7, crowd: "LOW", confidence: 95, trend: "-1/min" },
    teaBreak: { name: "Tea Break (Medium)", queue: 24, wait: 16, crowd: "MEDIUM", confidence: 90, trend: "+1/min" },
    morningQuiet: { name: "Morning Breakfast (Low)", queue: 8, wait: 5, crowd: "LOW", confidence: 97, trend: "0/min" }
  }
};
