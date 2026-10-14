export type OrderStatus = 
  | 'new'
  | 'pending_confirmation'
  | 'confirmed'
  | 'scheduled'
  | 'in_preparation'
  | 'baking'
  | 'decorating'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'on_hold';

export type ProductionStage = 
  | 'to_prepare'
  | 'baking'
  | 'cooling'
  | 'decorating'
  | 'packaging'
  | 'ready';

export type PaymentStatus = 
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'refund_pending'
  | 'partially_refunded'
  | 'refunded';

export type PaymentMethod = 
  | 'upi'
  | 'cash'
  | 'bank_transfer'
  | 'card'
  | 'online_gateway';

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
  notes?: string;
  date: string;
  receiptNumber: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  flavor?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isEggless: boolean;
  specialInstructions?: string;
  image?: string;
}

export interface CustomCakeDetails {
  cakeType: string;
  occasion: string;
  servings: number;
  sizeWeight: string;
  flavor: string;
  filling: string;
  frosting: string;
  themeColors: string;
  decorations: string[];
  inscription: string;
  allergies?: string;
  referenceImages: string[];
  estimatedCost: number;
}

export interface Order {
  id: string; // e.g. "BF-2026-101"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryTimeSlot: string;
  requestedDate: string; // YYYY-MM-DD
  items: OrderItem[];
  customCakeDetails?: CustomCakeDetails;
  status: OrderStatus;
  productionStage: ProductionStage;
  subtotal: number;
  customizationCharges: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  advancePaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  allergyNotes?: string;
  internalBakerNotes?: string;
  createdAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  payments: PaymentRecord[];
}

export interface ProductVariant {
  name: string;
  weightKg: number;
  servings: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'cakes' | 'cupcakes' | 'brownies' | 'cheesecakes' | 'cookies' | 'dessert_boxes' | 'seasonal';
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  availableFlavors: string[];
  availableFillings: string[];
  availableFrostings: string[];
  isEgglessAvailable: boolean;
  preparationTimeHours: number;
  minAdvanceNoticeDays: number;
  maxDailyQty: number;
  isAvailable: boolean;
  isFeatured: boolean;
  estimatedIngredientCost: number;
  recipeId?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'dairy' | 'flour_grains' | 'sugars' | 'chocolate' | 'flavorings' | 'packaging' | 'decorations';
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'box';
  currentStock: number;
  minThreshold: number;
  unitCost: number; // cost per unit in ₹
  purchasePrice: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface Recipe {
  id: string;
  name: string;
  linkedProductId?: string;
  batchYield: string;
  servingsCount: number;
  prepTimeMins: number;
  bakeTimeMins: number;
  ingredients: RecipeIngredient[];
  packagingCost: number;
  laborCost: number;
  overheadCost: number;
  totalEstimatedCost: number;
  recommendedSellingPrice: number;
  instructions?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: string[];
  birthday?: string;
  importantOccasion?: string;
  dietaryPreferences: string;
  tags: string[]; // e.g. "VIP", "Repeat", "Eggless Lover", "Corporate"
  totalSpent: number;
  orderCount: number;
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'ingredients' | 'packaging' | 'electricity' | 'equipment' | 'marketing' | 'delivery' | 'misc';
  amount: number;
  paymentMethod: string;
  description: string;
  vendor?: string;
  receiptUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'production' | 'payment' | 'info';
  read: boolean;
  date: string;
  actionLink?: string;
}

export interface BakerySettings {
  businessName: string;
  tagline: string;
  logoUrl: string;
  coverImageUrl: string;
  bakerName: string;
  phone: string;
  email: string;
  pickupAddress: string;
  upiId: string;
  bankDetails: string;
  currency: string;
  currencySymbol: string;
  taxRatePercent: number;
  minNoticeHours: number;
  leadTimeDaysCustomCake: number;
  dailyOrderCapacity: number;
  operatingDays: string[];
  pickupTimeSlots: string[];
  deliveryZones: { zone: string; fee: number; minOrder: number }[];
  cancellationPolicy: string;
  storefrontSlug: string;
  aboutStory: string;
  instagramHandle: string;
  acceptCustomOrders: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  isEggless: boolean;
  selectedFlavor: string;
  specialInstructions?: string;
}
