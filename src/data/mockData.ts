import type { 
  BakerySettings, 
  Product, 
  Order, 
  Ingredient, 
  Recipe, 
  Customer, 
  Expense, 
  NotificationItem 
} from '../types';


export const initialSettings: BakerySettings = {
  businessName: "Vanilla & Cocoa Artisan Bakes",
  tagline: "Handcrafted Luxury Cakes, Brownies & French Patisserie",
  bakerName: "Chef Ananya Sharma",
  logoUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=1600&auto=format&fit=crop&q=80",
  phone: "+91 98450 12890",
  email: "orders@vanillaandcocoa.in",
  pickupAddress: "Studio 4B, Gulmohar Enclave, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038",
  upiId: "ananya.baker@okaxis",
  bankDetails: "HDFC Bank, Indiranagar Branch | A/C: 50200084729104 | IFSC: HDFC0001234",
  currency: "INR",
  currencySymbol: "₹",
  taxRatePercent: 5,
  minNoticeHours: 24,
  leadTimeDaysCustomCake: 3,
  dailyOrderCapacity: 12,
  operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  pickupTimeSlots: [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:30 PM",
    "02:30 PM - 05:00 PM",
    "05:00 PM - 08:00 PM"
  ],
  deliveryZones: [
    { zone: "Indiranagar & Domlur (Within 5 km)", fee: 60, minOrder: 300 },
    { zone: "Koramangala, HSR & CBD (5-12 km)", fee: 120, minOrder: 500 },
    { zone: "Whitefield, Bellandur & Outer Ring Rd (12-20 km)", fee: 180, minOrder: 800 },
    { zone: "North Bangalore & Hebbal (20+ km)", fee: 260, minOrder: 1200 }
  ],
  cancellationPolicy: "Orders can be cancelled with 100% refund up to 48 hours before delivery date. Custom cake advance deposits are non-refundable within 48 hours of scheduled production.",
  storefrontSlug: "vanilla-and-cocoa",
  aboutStory: "Founded in 2021 by Le Cordon Bleu-trained pastry chef Ananya Sharma, Vanilla & Cocoa brings authentic French-inspired pastry craftsmanship to Bangalore. We use 100% pure butter, genuine Belgian Callebaut chocolate, Madagascar bourbon vanilla, and zero artificial preservatives. Every cake is custom-crafted to make your intimate celebrations unforgettable.",
  instagramHandle: "@vanillaandcocoa.blr",
  acceptCustomOrders: true
};

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Signature Belgian Chocolate Truffle Cake",
    category: "cakes",
    price: 850,
    compareAtPrice: 950,
    description: "Layers of moist dark chocolate sponge filled and frosted with silky 54.5% Callebaut dark chocolate ganache. Rich, decadent, and a classic crowd pleaser.",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "0.5 kg (Bento/Mini)", weightKg: 0.5, servings: "3-4 persons", price: 550 },
      { name: "1.0 kg (Standard)", weightKg: 1.0, servings: "8-10 persons", price: 850 },
      { name: "1.5 kg (Celebration)", weightKg: 1.5, servings: "12-15 persons", price: 1250 },
      { name: "2.0 kg (Grand Feast)", weightKg: 2.0, servings: "18-22 persons", price: 1650 }
    ],
    availableFlavors: ["Belgian Dark 54%", "Milk Chocolate Hazelnut", "Orange Chocolate Truffle"],
    availableFillings: ["Chocolate Ganache", "Salted Caramel Layer", "Nutella Swirl"],
    availableFrostings: ["Whipped Dark Ganache", "Mirror Glaze", "Chocolate Buttercream"],
    isEgglessAvailable: true,
    preparationTimeHours: 4,
    minAdvanceNoticeDays: 1,
    maxDailyQty: 6,
    isAvailable: true,
    isFeatured: true,
    estimatedIngredientCost: 320,
    recipeId: "rec-1",
    rating: 4.9,
    reviewCount: 48
  },
  {
    id: "prod-2",
    name: "Classic Red Velvet Cake with Cream Cheese",
    category: "cakes",
    price: 950,
    compareAtPrice: 1050,
    description: "Velvety scarlet sponge with subtle hints of pure cocoa, layered with signature Philadelphia cream cheese frosting and toasted red velvet crumb accents.",
    images: [
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "0.5 kg", weightKg: 0.5, servings: "3-4 persons", price: 600 },
      { name: "1.0 kg", weightKg: 1.0, servings: "8-10 persons", price: 950 },
      { name: "1.5 kg", weightKg: 1.5, servings: "12-15 persons", price: 1400 }
    ],
    availableFlavors: ["Classic Red Velvet", "Raspberry Red Velvet"],
    availableFillings: ["Whipped Cream Cheese", "Raspberry Coulis"],
    availableFrostings: ["Vanilla Bean Cream Cheese", "Swiss Meringue"],
    isEgglessAvailable: true,
    preparationTimeHours: 3.5,
    minAdvanceNoticeDays: 1,
    maxDailyQty: 5,
    isAvailable: true,
    isFeatured: true,
    estimatedIngredientCost: 390,
    recipeId: "rec-2",
    rating: 4.8,
    reviewCount: 39
  },
  {
    id: "prod-3",
    name: "Lotus Biscoff Caramel Drip Cake",
    category: "cakes",
    price: 1200,
    compareAtPrice: 1350,
    description: "Brown butter sponge layered with caramelized Lotus Biscoff spread, speculoos crunch, whipped cinnamon cream, and crowned with a golden salted caramel drip.",
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "0.5 kg", weightKg: 0.5, servings: "3-4 persons", price: 750 },
      { name: "1.0 kg", weightKg: 1.0, servings: "8-10 persons", price: 1200 },
      { name: "1.5 kg", weightKg: 1.5, servings: "12-15 persons", price: 1750 }
    ],
    availableFlavors: ["Lotus Speculoos", "Biscoff Espresso Swirl"],
    availableFillings: ["Crunchy Biscoff Spread", "Dulce de Leche"],
    availableFrostings: ["Biscoff Whipped Buttercream", "Caramel Drip"],
    isEgglessAvailable: true,
    preparationTimeHours: 4.5,
    minAdvanceNoticeDays: 2,
    maxDailyQty: 4,
    isAvailable: true,
    isFeatured: true,
    estimatedIngredientCost: 460,
    recipeId: "rec-3",
    rating: 5.0,
    reviewCount: 32
  },
  {
    id: "prod-4",
    name: "Pastel Dream Bento Cake (Korean Style)",
    category: "cakes",
    price: 499,
    description: "Adorable 300g lunchbox cake packaged in eco-friendly sugarcane clamshell with wooden spoon and glitter candle. Customized with your choice of pastel aesthetic lettering.",
    images: [
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "Mini Bento (300g)", weightKg: 0.35, servings: "1-2 persons", price: 499 }
    ],
    availableFlavors: ["Vanilla Confetti", "Belgian Dark Chocolate", "Fresh Strawberry Cream"],
    availableFillings: ["Berry Compote", "Nutella", "Vanilla Custard"],
    availableFrostings: ["Korean Buttercream", "Light Whipped Ganache"],
    isEgglessAvailable: true,
    preparationTimeHours: 2,
    minAdvanceNoticeDays: 1,
    maxDailyQty: 10,
    isAvailable: true,
    isFeatured: true,
    estimatedIngredientCost: 140,
    recipeId: "rec-4",
    rating: 4.9,
    reviewCount: 64
  },
  {
    id: "prod-5",
    name: "Fudgy Walnut Belgian Brownies (Box of 6)",
    category: "brownies",
    price: 480,
    compareAtPrice: 520,
    description: "Deeply fudgy, crackly-topped squares made with 70% dark Belgian cocoa and studded with toasted Kashmiri walnuts. Served warmed with a molten chocolate center.",
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "Box of 6 Pieces", weightKg: 0.45, servings: "4-6 persons", price: 480 },
      { name: "Box of 12 Pieces", weightKg: 0.9, servings: "8-12 persons", price: 890 }
    ],
    availableFlavors: ["Classic Dark Walnut", "Salted Caramel Brownie", "Nutella Swirl"],
    availableFillings: ["Gooey Chocolate Chips"],
    availableFrostings: ["Dusted Cocoa"],
    isEgglessAvailable: true,
    preparationTimeHours: 2,
    minAdvanceNoticeDays: 1,
    maxDailyQty: 12,
    isAvailable: true,
    isFeatured: false,
    estimatedIngredientCost: 180,
    rating: 4.9,
    reviewCount: 51
  },
  {
    id: "prod-6",
    name: "Gourmet Cupcake Bouquet (Box of 6)",
    category: "cupcakes",
    price: 550,
    description: "Artisan piped floral cupcakes featuring Madagascar vanilla, double chocolate espresso, and salted caramel rosettes. Perfect for gifts and tea parties.",
    images: [
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "Box of 6 Assorted", weightKg: 0.5, servings: "6 cupcakes", price: 550 },
      { name: "Box of 12 Assorted", weightKg: 1.0, servings: "12 cupcakes", price: 1050 }
    ],
    availableFlavors: ["Assorted Favorites", "All Dark Chocolate", "All Vanilla Rosette"],
    availableFillings: ["Core Molten Ganache"],
    availableFrostings: ["Italian Meringue Buttercream"],
    isEgglessAvailable: true,
    preparationTimeHours: 2.5,
    minAdvanceNoticeDays: 1,
    maxDailyQty: 8,
    isAvailable: true,
    isFeatured: false,
    estimatedIngredientCost: 190,
    rating: 4.8,
    reviewCount: 27
  },
  {
    id: "prod-7",
    name: "New York Baked Cheesecake with Berry Compote",
    category: "cheesecakes",
    price: 750,
    description: "Ultra-creamy slow-baked authentic New York cheesecake over a buttery graham digestive biscuit crust, topped with handmade raspberry and blueberry reduction.",
    images: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "0.5 kg (Small)", weightKg: 0.5, servings: "4-5 persons", price: 750 },
      { name: "1.0 kg (Standard)", weightKg: 1.0, servings: "8-10 persons", price: 1350 }
    ],
    availableFlavors: ["Wild Berry Reduction", "Alphonso Mango (Seasonal)", "Burnt Basque Style"],
    availableFillings: ["Digestive Crust"],
    availableFrostings: ["Sour Cream Layer"],
    isEgglessAvailable: false,
    preparationTimeHours: 6,
    minAdvanceNoticeDays: 2,
    maxDailyQty: 3,
    isAvailable: true,
    isFeatured: true,
    estimatedIngredientCost: 410,
    rating: 4.9,
    reviewCount: 38
  },
  {
    id: "prod-8",
    name: "Parisian Almond Macarons (Gift Box of 8)",
    category: "dessert_boxes",
    price: 620,
    description: "Delicate Parisian macarons with crisp eggshell shells and chewy almond interiors. Flavors: Pistachio, Raspberry Rose, Dark Chocolate Ganache, Salted Butter Caramel.",
    images: [
      "https://images.unsplash.com/photo-1569864321390-dc6f6d0f5082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?w=800&auto=format&fit=crop&q=80"
    ],
    variants: [
      { name: "Box of 8 Pieces", weightKg: 0.25, servings: "8 macarons", price: 620 },
      { name: "Luxury Box of 16 Pieces", weightKg: 0.5, servings: "16 macarons", price: 1180 }
    ],
    availableFlavors: ["Chef's Signature Assortment", "Chocolate & Caramel Luxe"],
    availableFillings: ["Flavored Buttercreams & Jams"],
    availableFrostings: ["N/A"],
    isEgglessAvailable: false,
    preparationTimeHours: 4,
    minAdvanceNoticeDays: 2,
    maxDailyQty: 6,
    isAvailable: true,
    isFeatured: false,
    estimatedIngredientCost: 220,
    rating: 4.7,
    reviewCount: 19
  }
];

export const initialIngredients: Ingredient[] = [
  {
    id: "ing-1",
    name: "Callebaut 54.5% Dark Chocolate Couverture",
    category: "chocolate",
    unit: "kg",
    currentStock: 3.5,
    minThreshold: 5.0, // LOW STOCK
    unitCost: 1100,
    purchasePrice: 5500,
    supplier: "Fine Foods Importers Bangalore",
    lastRestocked: "2026-10-02",
    expiryDate: "2027-04-15"
  },
  {
    id: "ing-2",
    name: "Amul Unsalted Table Butter",
    category: "dairy",
    unit: "kg",
    currentStock: 12.0,
    minThreshold: 4.0,
    unitCost: 520,
    purchasePrice: 6240,
    supplier: "Karnataka Dairy Distributors",
    lastRestocked: "2026-10-10",
    expiryDate: "2026-12-15"
  },
  {
    id: "ing-3",
    name: "Philadelphia Cream Cheese (2kg block)",
    category: "dairy",
    unit: "kg",
    currentStock: 1.8,
    minThreshold: 3.0, // LOW STOCK
    unitCost: 1250,
    purchasePrice: 2500,
    supplier: "Gourmet Dairy Hub",
    lastRestocked: "2026-09-28",
    expiryDate: "2026-11-20"
  },
  {
    id: "ing-4",
    name: "Organic Castor / Superfine Sugar",
    category: "sugars",
    unit: "kg",
    currentStock: 25.0,
    minThreshold: 10.0,
    unitCost: 58,
    purchasePrice: 1450,
    supplier: "Nature's Basket Wholesale",
    lastRestocked: "2026-10-08",
    expiryDate: "2027-10-01"
  },
  {
    id: "ing-5",
    name: "Premium Pastry Flour (Maida T55)",
    category: "flour_grains",
    unit: "kg",
    currentStock: 30.0,
    minThreshold: 15.0,
    unitCost: 65,
    purchasePrice: 1950,
    supplier: "Shree Krishna Agro Mills",
    lastRestocked: "2026-10-05",
    expiryDate: "2027-02-28"
  },
  {
    id: "ing-6",
    name: "Rich's Non-Dairy / Dairy Whipping Cream",
    category: "dairy",
    unit: "l",
    currentStock: 4.0,
    minThreshold: 8.0, // LOW STOCK
    unitCost: 240,
    purchasePrice: 960,
    supplier: "Baking Essentials Hub",
    lastRestocked: "2026-10-07",
    expiryDate: "2026-11-30"
  },
  {
    id: "ing-7",
    name: "Madagascar Bourbon Vanilla Bean Extract",
    category: "flavorings",
    unit: "ml",
    currentStock: 350,
    minThreshold: 200,
    unitCost: 4.5,
    purchasePrice: 2250,
    supplier: "Spice Sanctuary Co.",
    lastRestocked: "2026-09-15",
    expiryDate: "2028-01-01"
  },
  {
    id: "ing-8",
    name: "Lotus Biscoff Spread Crunchy (1.6kg tub)",
    category: "sugars",
    unit: "kg",
    currentStock: 3.2,
    minThreshold: 2.0,
    unitCost: 850,
    purchasePrice: 2720,
    supplier: "Fine Foods Importers",
    lastRestocked: "2026-10-04",
    expiryDate: "2027-06-30"
  },
  {
    id: "ing-9",
    name: "Farm Fresh Grade-A Brown Eggs",
    category: "dairy",
    unit: "pcs",
    currentStock: 90,
    minThreshold: 40,
    unitCost: 7.5,
    purchasePrice: 675,
    supplier: "Happy Hens Farm",
    lastRestocked: "2026-10-12",
    expiryDate: "2026-10-26"
  },
  {
    id: "ing-10",
    name: "Luxury Gold Embossed Cake Boxes (8x8x6)",
    category: "packaging",
    unit: "pcs",
    currentStock: 18,
    minThreshold: 30, // LOW STOCK
    unitCost: 45,
    purchasePrice: 810,
    supplier: "PackCraft Custom Packaging",
    lastRestocked: "2026-09-20",
    expiryDate: undefined
  },
  {
    id: "ing-11",
    name: "Sugarcane Bento Clamshell Boxes + Wooden Spoons",
    category: "packaging",
    unit: "pcs",
    currentStock: 45,
    minThreshold: 25,
    unitCost: 22,
    purchasePrice: 990,
    supplier: "EcoPack India",
    lastRestocked: "2026-10-01",
    expiryDate: undefined
  },
  {
    id: "ing-12",
    name: "Golden Thick Masonite Cake Boards (10 inch)",
    category: "packaging",
    unit: "pcs",
    currentStock: 22,
    minThreshold: 15,
    unitCost: 35,
    purchasePrice: 770,
    supplier: "BakeStore Bangalore",
    lastRestocked: "2026-09-25",
    expiryDate: undefined
  }
];

export const initialRecipes: Recipe[] = [
  {
    id: "rec-1",
    name: "Belgian Chocolate Truffle Cake (1kg Batch)",
    linkedProductId: "prod-1",
    batchYield: "1 x 1kg Cake or 2 x Bento Cakes",
    servingsCount: 10,
    prepTimeMins: 45,
    bakeTimeMins: 35,
    ingredients: [
      { ingredientId: "ing-1", ingredientName: "Callebaut 54.5% Dark Chocolate", quantity: 0.22, unit: "kg", cost: 242 },
      { ingredientId: "ing-2", ingredientName: "Amul Butter", quantity: 0.15, unit: "kg", cost: 78 },
      { ingredientId: "ing-4", ingredientName: "Castor Sugar", quantity: 0.2, unit: "kg", cost: 12 },
      { ingredientId: "ing-5", ingredientName: "Pastry Flour", quantity: 0.18, unit: "kg", cost: 12 },
      { ingredientId: "ing-6", ingredientName: "Whipping Cream", quantity: 0.2, unit: "l", cost: 48 },
      { ingredientId: "ing-7", ingredientName: "Vanilla Extract", quantity: 5, unit: "ml", cost: 22.5 },
      { ingredientId: "ing-9", ingredientName: "Eggs", quantity: 3, unit: "pcs", cost: 22.5 }
    ],
    packagingCost: 65, // Box + Board + Ribbon + Tag
    laborCost: 150, // Baker's skilled hands
    overheadCost: 50, // Electricity + Gas + Equipment
    totalEstimatedCost: 652,
    recommendedSellingPrice: 850,
    instructions: "1. Melt chocolate and butter over double boiler.\n2. Whisk eggs and sugar until ribbon stage.\n3. Fold sifted cocoa and flour gently.\n4. Bake at 165°C for 32 mins until tester comes out moist.\n5. Layer with silky truffle ganache."
  },
  {
    id: "rec-2",
    name: "Classic Red Velvet with Cream Cheese (1kg Batch)",
    linkedProductId: "prod-2",
    batchYield: "1 x 1kg Cake",
    servingsCount: 10,
    prepTimeMins: 40,
    bakeTimeMins: 30,
    ingredients: [
      { ingredientId: "ing-3", ingredientName: "Philadelphia Cream Cheese", quantity: 0.28, unit: "kg", cost: 350 },
      { ingredientId: "ing-2", ingredientName: "Amul Butter", quantity: 0.12, unit: "kg", cost: 62.4 },
      { ingredientId: "ing-4", ingredientName: "Castor Sugar", quantity: 0.22, unit: "kg", cost: 12.8 },
      { ingredientId: "ing-5", ingredientName: "Pastry Flour", quantity: 0.2, unit: "kg", cost: 13 },
      { ingredientId: "ing-7", ingredientName: "Vanilla Extract", quantity: 6, unit: "ml", cost: 27 }
    ],
    packagingCost: 65,
    laborCost: 140,
    overheadCost: 50,
    totalEstimatedCost: 720.2,
    recommendedSellingPrice: 950,
    instructions: "1. Cream butter and sugar. Add buttermilk and white vinegar emulsion.\n2. Gently fold dry mix with subtle cocoa.\n3. Bake in two 8-inch tins.\n4. Frost generously with chilled cream cheese frosting."
  },
  {
    id: "rec-3",
    name: "Lotus Biscoff Dream Cake (1kg Batch)",
    linkedProductId: "prod-3",
    batchYield: "1 x 1kg Cake",
    servingsCount: 10,
    prepTimeMins: 50,
    bakeTimeMins: 35,
    ingredients: [
      { ingredientId: "ing-8", ingredientName: "Lotus Biscoff Spread", quantity: 0.3, unit: "kg", cost: 255 },
      { ingredientId: "ing-2", ingredientName: "Amul Butter", quantity: 0.18, unit: "kg", cost: 93.6 },
      { ingredientId: "ing-4", ingredientName: "Castor Sugar", quantity: 0.18, unit: "kg", cost: 10.4 },
      { ingredientId: "ing-5", ingredientName: "Pastry Flour", quantity: 0.2, unit: "kg", cost: 13 },
      { ingredientId: "ing-6", ingredientName: "Whipping Cream", quantity: 0.25, unit: "l", cost: 60 }
    ],
    packagingCost: 75,
    laborCost: 160,
    overheadCost: 55,
    totalEstimatedCost: 722,
    recommendedSellingPrice: 1200,
    instructions: "1. Brown the butter to a nutty amber aroma.\n2. Mix into fluffy speculoos sponge.\n3. Layer with warmed crunchy Biscoff spread and cinnamon mousse."
  },
  {
    id: "rec-4",
    name: "Korean Bento Lunchbox Cake",
    linkedProductId: "prod-4",
    batchYield: "1 x 350g Bento Cake",
    servingsCount: 2,
    prepTimeMins: 25,
    bakeTimeMins: 20,
    ingredients: [
      { ingredientId: "ing-5", ingredientName: "Pastry Flour", quantity: 0.08, unit: "kg", cost: 5.2 },
      { ingredientId: "ing-2", ingredientName: "Amul Butter", quantity: 0.05, unit: "kg", cost: 26 },
      { ingredientId: "ing-4", ingredientName: "Castor Sugar", quantity: 0.06, unit: "kg", cost: 3.5 },
      { ingredientId: "ing-6", ingredientName: "Whipping Cream", quantity: 0.1, unit: "l", cost: 24 },
      { ingredientId: "ing-7", ingredientName: "Vanilla Extract", quantity: 2, unit: "ml", cost: 9 }
    ],
    packagingCost: 28, // Bento Box + Spoon + Candle
    laborCost: 65,
    overheadCost: 20,
    totalEstimatedCost: 180.7,
    recommendedSellingPrice: 499,
    instructions: "1. Bake miniature 4-inch sponge.\n2. Level into 3 cute layers.\n3. Apply smooth Korean style crumb coat and write custom piped message."
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Pooja Hegde",
    phone: "+91 98860 41234",
    email: "pooja.hegde@techcorp.io",
    addresses: ["Flat 402, Adarsh Palm Retreat, Outer Ring Road, Bellandur, Bengaluru 560103"],
    birthday: "1994-11-18",
    importantOccasion: "Anniversary: 24th February",
    dietaryPreferences: "Strictly Eggless only. Nut allergy (No hazelnuts).",
    tags: ["VIP", "Repeat", "Eggless Lover"],
    totalSpent: 4250,
    orderCount: 4,
    notes: "Prefers pastel floral aesthetics. Always orders for company promotions and family birthdays.",
    createdAt: "2026-03-12"
  },
  {
    id: "cust-2",
    name: "Rahul Verma",
    phone: "+91 97412 88901",
    email: "rahul.verma@innovate.com",
    addresses: ["Villa 14, Prestige Silver Oak, Whitefield, Bengaluru 560066"],
    birthday: "1989-10-22",
    importantOccasion: "Wife's Birthday: 18th October",
    dietaryPreferences: "Regular (Eggs preferred for fluffy sponge).",
    tags: ["High Value", "Corporate"],
    totalSpent: 6850,
    orderCount: 3,
    notes: "Ordered 2-tier anniversary cake previously. Always tips delivery driver.",
    createdAt: "2026-05-18"
  },
  {
    id: "cust-3",
    name: "Sneha Krishnan",
    phone: "+91 99001 54321",
    email: "sneha.k@designstudio.in",
    addresses: ["#82, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560008"],
    birthday: "1996-08-05",
    importantOccasion: "Mom's 60th: 15th October",
    dietaryPreferences: "Less sweet, loves dark chocolate.",
    tags: ["Neighborhood Regular", "Pickup Prefer"],
    totalSpent: 3100,
    orderCount: 3,
    notes: "Lives 5 minutes walking distance. Often walks into studio for quick pickup.",
    createdAt: "2026-06-04"
  },
  {
    id: "cust-4",
    name: "Vikramaditya Roy",
    phone: "+91 98451 77654",
    email: "vikram.roy@fintech.co",
    addresses: ["Penthouse 9, Sobha Turquoise, Koramangala 4th Block, Bengaluru 560034"],
    birthday: "1992-12-03",
    dietaryPreferences: "Allergen free: No peanut.",
    tags: ["New Customer", "Custom Cake"],
    totalSpent: 2600,
    orderCount: 1,
    notes: "Requested Spiderman theme for son's 5th birthday.",
    createdAt: "2026-10-10"
  },
  {
    id: "cust-5",
    name: "Ayesha Siddiqui",
    phone: "+91 96112 33490",
    email: "ayesha.s@artisanlife.org",
    addresses: ["45/2, Defense Colony, Indiranagar, Bengaluru 560038"],
    dietaryPreferences: "100% Halal certified ingredients, eggless preferred.",
    tags: ["Bento Lover", "Repeat"],
    totalSpent: 1998,
    orderCount: 4,
    notes: "Loves sending Bento surprise cakes to her friends across Bangalore.",
    createdAt: "2026-07-20"
  }
];

export const initialOrders: Order[] = [
  {
    id: "BF-2026-101",
    customerName: "Sneha Krishnan",
    customerPhone: "+91 99001 54321",
    customerEmail: "sneha.k@designstudio.in",
    deliveryType: "pickup",
    deliveryTimeSlot: "05:00 PM - 08:00 PM",
    requestedDate: "2026-10-15", // Today
    items: [
      {
        id: "item-101",
        productId: "prod-1",
        productName: "Signature Belgian Chocolate Truffle Cake",
        variantName: "1.5 kg (Celebration)",
        quantity: 1,
        unitPrice: 1250,
        totalPrice: 1250,
        isEggless: true,
        specialInstructions: "Golden 'Happy 60th Birthday Ma' acrylic charm + subtle edible gold leaf flakes on rim",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80"
      }
    ],
    status: "decorating",
    productionStage: "decorating",
    subtotal: 1250,
    customizationCharges: 150, // for gold leaf & charm
    deliveryFee: 0,
    discount: 0,
    tax: 70,
    totalAmount: 1470,
    advancePaid: 1000,
    remainingBalance: 470,
    paymentStatus: "partially_paid",
    paymentMethod: "upi",
    allergyNotes: "Eggless only. No nuts.",
    internalBakerNotes: "Gold leaf carefully placed. Pickup scheduled around 6 PM.",
    createdAt: "2026-10-13T10:15:00Z",
    statusHistory: [
      { status: "new", timestamp: "2026-10-13 10:15", note: "Order placed online" },
      { status: "confirmed", timestamp: "2026-10-13 11:00", note: "Advance ₹1000 received via UPI" },
      { status: "baking", timestamp: "2026-10-15 09:30", note: "Sponges out of oven, cooling" },
      { status: "decorating", timestamp: "2026-10-15 13:00", note: "Ganache set, applying gold foil" }
    ],
    payments: [
      {
        id: "pay-101-1",
        orderId: "BF-2026-101",
        amount: 1000,
        method: "upi",
        transactionRef: "UPI/628941038291",
        notes: "Advance deposit received on GPay",
        date: "2026-10-13",
        receiptNumber: "REC-2026-081"
      }
    ]
  },
  {
    id: "BF-2026-102",
    customerName: "Ayesha Siddiqui",
    customerPhone: "+91 96112 33490",
    customerEmail: "ayesha.s@artisanlife.org",
    deliveryType: "delivery",
    deliveryAddress: "45/2, Defense Colony, Indiranagar, Bengaluru 560038",
    deliveryTimeSlot: "02:30 PM - 05:00 PM",
    requestedDate: "2026-10-15", // Today
    items: [
      {
        id: "item-102-1",
        productId: "prod-4",
        productName: "Pastel Dream Bento Cake (Korean Style)",
        variantName: "Mini Bento (300g)",
        quantity: 1,
        unitPrice: 499,
        totalPrice: 499,
        isEggless: true,
        specialInstructions: "Pastel lilac frosting with white lettering: 'You Did It! 🎓'",
        image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "item-102-2",
        productId: "prod-6",
        productName: "Gourmet Cupcake Bouquet (Box of 6)",
        variantName: "Box of 6 Assorted",
        quantity: 1,
        unitPrice: 550,
        totalPrice: 550,
        isEggless: true,
        specialInstructions: "All floral rosette theme",
        image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300&auto=format&fit=crop&q=80"
      }
    ],
    status: "ready",
    productionStage: "ready",
    subtotal: 1049,
    customizationCharges: 0,
    deliveryFee: 60,
    discount: 50,
    tax: 53,
    totalAmount: 1112,
    advancePaid: 1112,
    remainingBalance: 0,
    paymentStatus: "paid",
    paymentMethod: "upi",
    allergyNotes: "Eggless",
    internalBakerNotes: "Packed in sugarcane box with purple satin ribbon. Dunzo scheduled for 3:30 PM.",
    createdAt: "2026-10-14T08:20:00Z",
    statusHistory: [
      { status: "new", timestamp: "2026-10-14 08:20", note: "Order placed online" },
      { status: "confirmed", timestamp: "2026-10-14 09:00", note: "Full payment ₹1112 received" },
      { status: "baking", timestamp: "2026-10-15 08:00", note: "Baking mini sponge and cupcakes" },
      { status: "ready", timestamp: "2026-10-15 14:00", note: "Boxed and sealed ready for dispatch" }
    ],
    payments: [
      {
        id: "pay-102-1",
        orderId: "BF-2026-102",
        amount: 1112,
        method: "upi",
        transactionRef: "UPI/628994018274",
        notes: "Full payment via PhonePe",
        date: "2026-10-14",
        receiptNumber: "REC-2026-082"
      }
    ]
  },
  {
    id: "BF-2026-103",
    customerName: "Rahul Verma",
    customerPhone: "+91 97412 88901",
    customerEmail: "rahul.verma@innovate.com",
    deliveryType: "delivery",
    deliveryAddress: "Villa 14, Prestige Silver Oak, Whitefield, Bengaluru 560066",
    deliveryTimeSlot: "12:00 PM - 02:30 PM",
    requestedDate: "2026-10-16", // Tomorrow
    items: [
      {
        id: "item-103",
        productId: "prod-3",
        productName: "Lotus Biscoff Caramel Drip Cake",
        variantName: "1.5 kg (Celebration)",
        quantity: 1,
        unitPrice: 1750,
        totalPrice: 1750,
        isEggless: false,
        specialInstructions: "Happy Birthday Pooja! Include sparkler candle and handwritten calligraphy note.",
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&auto=format&fit=crop&q=80"
      }
    ],
    status: "scheduled",
    productionStage: "to_prepare",
    subtotal: 1750,
    customizationCharges: 100,
    deliveryFee: 180,
    discount: 0,
    tax: 101,
    totalAmount: 2131,
    advancePaid: 1500,
    remainingBalance: 631,
    paymentStatus: "partially_paid",
    paymentMethod: "bank_transfer",
    allergyNotes: "None",
    internalBakerNotes: "Brown butter sponges to be baked tomorrow 7 AM. Deliver to Whitefield via AC cab.",
    createdAt: "2026-10-13T16:45:00Z",
    statusHistory: [
      { status: "new", timestamp: "2026-10-13 16:45", note: "Order placed online" },
      { status: "confirmed", timestamp: "2026-10-13 17:30", note: "Advance ₹1500 received via IMPS" },
      { status: "scheduled", timestamp: "2026-10-14 10:00", note: "Production slot booked for Friday morning" }
    ],
    payments: [
      {
        id: "pay-103-1",
        orderId: "BF-2026-103",
        amount: 1500,
        method: "bank_transfer",
        transactionRef: "IMPS/629001928410",
        notes: "Advance deposit via Netbanking",
        date: "2026-10-13",
        receiptNumber: "REC-2026-083"
      }
    ]
  },
  {
    id: "BF-2026-104",
    customerName: "Vikramaditya Roy",
    customerPhone: "+91 98451 77654",
    customerEmail: "vikram.roy@fintech.co",
    deliveryType: "delivery",
    deliveryAddress: "Penthouse 9, Sobha Turquoise, Koramangala 4th Block, Bengaluru 560034",
    deliveryTimeSlot: "05:00 PM - 08:00 PM",
    requestedDate: "2026-10-17",
    items: [],
    customCakeDetails: {
      cakeType: "2-Tier Thematic Fondant Birthday Cake",
      occasion: "5th Birthday",
      servings: 25,
      sizeWeight: "2.5 kg (2-Tier: 6 inch top + 8 inch base)",
      flavor: "Belgian Dark Chocolate Ganache & Oreo Swirl",
      filling: "Silky Chocolate Cream & Crushed Oreos",
      frosting: "Semi-fondant with hand-sculpted comic details",
      themeColors: "Deep Marvel Red & Royal Blue with Web Texture",
      decorations: ["Handmade Sugar Figurine", "Edible Sugar Webs", "Gold Name Plaque"],
      inscription: "Happy 5th Birthday Veer!",
      allergies: "Strictly peanut-free environment",
      referenceImages: [
        "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80"
      ],
      estimatedCost: 2800
    },
    status: "pending_confirmation",
    productionStage: "to_prepare",
    subtotal: 2800,
    customizationCharges: 400,
    deliveryFee: 120,
    discount: 0,
    tax: 166,
    totalAmount: 3486,
    advancePaid: 0,
    remainingBalance: 3486,
    paymentStatus: "unpaid",
    allergyNotes: "No Peanuts. Check all ingredient labels.",
    internalBakerNotes: "Custom design request submitted via builder. Need to verify figurine structure and confirm advance.",
    createdAt: "2026-10-14T19:30:00Z",
    statusHistory: [
      { status: "new", timestamp: "2026-10-14 19:30", note: "Custom cake inquiry submitted" },
      { status: "pending_confirmation", timestamp: "2026-10-14 20:00", note: "Awaiting baker quote review" }
    ],
    payments: []
  },
  {
    id: "BF-2026-105",
    customerName: "Pooja Hegde",
    customerPhone: "+91 98860 41234",
    customerEmail: "pooja.hegde@techcorp.io",
    deliveryType: "delivery",
    deliveryAddress: "Flat 402, Adarsh Palm Retreat, Outer Ring Road, Bellandur, Bengaluru 560103",
    deliveryTimeSlot: "10:00 AM - 12:00 PM",
    requestedDate: "2026-10-14", // Yesterday
    items: [
      {
        id: "item-105-1",
        productId: "prod-2",
        productName: "Classic Red Velvet Cake with Cream Cheese",
        variantName: "1.0 kg (Standard)",
        quantity: 1,
        unitPrice: 950,
        totalPrice: 950,
        isEggless: true,
        specialInstructions: "Eggless red velvet with extra cream cheese piping",
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "item-105-2",
        productId: "prod-5",
        productName: "Fudgy Walnut Belgian Brownies (Box of 6)",
        variantName: "Box of 6 Pieces",
        quantity: 1,
        unitPrice: 480,
        totalPrice: 480,
        isEggless: true,
        specialInstructions: "Eggless brownie option",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80"
      }
    ],
    status: "completed",
    productionStage: "ready",
    subtotal: 1430,
    customizationCharges: 0,
    deliveryFee: 180,
    discount: 100, // VIP discount
    tax: 75,
    totalAmount: 1585,
    advancePaid: 1585,
    remainingBalance: 0,
    paymentStatus: "paid",
    paymentMethod: "upi",
    allergyNotes: "Eggless only. No hazelnuts.",
    internalBakerNotes: "Delivered smoothly yesterday. Customer sent great feedback on WhatsApp!",
    createdAt: "2026-10-12T14:10:00Z",
    statusHistory: [
      { status: "new", timestamp: "2026-10-12 14:10", note: "Order placed" },
      { status: "confirmed", timestamp: "2026-10-12 15:00", note: "Paid full amount" },
      { status: "ready", timestamp: "2026-10-14 09:15", note: "Dispatched with driver" },
      { status: "completed", timestamp: "2026-10-14 11:30", note: "Delivered and verified with customer" }
    ],
    payments: [
      {
        id: "pay-105-1",
        orderId: "BF-2026-105",
        amount: 1585,
        method: "upi",
        transactionRef: "UPI/62881940182",
        notes: "Full payment on order confirmation",
        date: "2026-10-12",
        receiptNumber: "REC-2026-079"
      }
    ]
  }
];

export const initialExpenses: Expense[] = [
  {
    id: "exp-1",
    date: "2026-10-02",
    category: "ingredients",
    amount: 5500,
    paymentMethod: "UPI / Bank Transfer",
    description: "Callebaut 54.5% Dark Chocolate Couverture (5kg bulk box)",
    vendor: "Fine Foods Importers Bangalore"
  },
  {
    id: "exp-2",
    date: "2026-10-05",
    category: "ingredients",
    amount: 3120,
    paymentMethod: "UPI",
    description: "Amul Butter 10kg + Fresh Cream Cartons",
    vendor: "Karnataka Dairy Hub"
  },
  {
    id: "exp-3",
    date: "2026-10-06",
    category: "packaging",
    amount: 2200,
    paymentMethod: "Card",
    description: "Gold embossed cake boxes (50 pcs) + Satin logo ribbons",
    vendor: "PackCraft Custom Packaging"
  },
  {
    id: "exp-4",
    date: "2026-10-08",
    category: "electricity",
    amount: 2850,
    paymentMethod: "Netbanking",
    description: "Baking studio electricity bill (BESCOM Commercial)",
    vendor: "BESCOM Bangalore"
  },
  {
    id: "exp-5",
    date: "2026-10-10",
    category: "marketing",
    amount: 1500,
    paymentMethod: "Card",
    description: "Instagram sponsored ad campaign for Diwali pre-orders",
    vendor: "Meta Platforms"
  },
  {
    id: "exp-6",
    date: "2026-10-12",
    category: "delivery",
    amount: 840,
    paymentMethod: "UPI",
    description: "Dunzo / Porter local delivery partner prepaid wallet reload",
    vendor: "Dunzo For Business"
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Low Ingredient Stock Alert",
    message: "Callebaut 54.5% Dark Chocolate is at 3.5kg (Threshold: 5kg). Please reorder soon to fulfill upcoming orders.",
    type: "inventory",
    read: false,
    date: "2026-10-15 08:30"
  },
  {
    id: "notif-2",
    title: "New Custom Order Inquiry",
    message: "Vikramaditya Roy requested a 2.5kg 2-Tier Spiderman Theme Cake for Oct 17. Review quote and approve.",
    type: "order",
    read: false,
    date: "2026-10-14 19:30"
  },
  {
    id: "notif-3",
    title: "Order Ready For Pickup",
    message: "Order #BF-2026-102 (Ayesha Siddiqui) has been packed and tagged. Customer notified for afternoon pickup.",
    type: "production",
    read: true,
    date: "2026-10-15 14:00"
  },
  {
    id: "notif-4",
    title: "Outstanding Balance Reminder",
    message: "Order #BF-2026-101 (Sneha Krishnan) has ₹470 remaining balance to collect upon pickup.",
    type: "payment",
    read: false,
    date: "2026-10-15 11:00"
  }
];
