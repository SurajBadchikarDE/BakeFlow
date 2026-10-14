import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  BakerySettings, 
  Product, 
  Order, 
  Ingredient, 
  Recipe, 
  Customer, 
  Expense, 
  NotificationItem, 
  CartItem, 
  OrderStatus, 
  ProductionStage, 
  PaymentRecord, 
  ProductVariant 
} from '../types';

import { 
  initialSettings, 
  initialProducts, 
  initialIngredients, 
  initialRecipes, 
  initialCustomers, 
  initialOrders, 
  initialExpenses, 
  initialNotifications 
} from '../data/mockData';

export type BakerTab = 
  | 'dashboard'
  | 'orders'
  | 'order_detail'
  | 'new_order'
  | 'products'
  | 'recipes'
  | 'cost_calculator'
  | 'production_calendar'
  | 'production_board'
  | 'inventory'
  | 'customers'
  | 'customer_detail'
  | 'payments'
  | 'invoices'
  | 'expenses'
  | 'reports'
  | 'delivery'
  | 'notifications'
  | 'settings'
  | 'onboarding';

export type StorefrontTab = 
  | 'home'
  | 'catalog'
  | 'product_detail'
  | 'custom_cake'
  | 'cart'
  | 'checkout'
  | 'order_confirmed'
  | 'order_track';

interface BakeryContextType {
  // App views
  activeRole: 'baker' | 'storefront';
  setActiveRole: (role: 'baker' | 'storefront') => void;
  bakerTab: BakerTab;
  setBakerTab: (tab: BakerTab) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  storefrontTab: StorefrontTab;
  setStorefrontTab: (tab: StorefrontTab) => void;
  selectedStorefrontProductId: string | null;
  setSelectedStorefrontProductId: (id: string | null) => void;
  lastConfirmedOrderId: string | null;
  setLastConfirmedOrderId: (id: string | null) => void;
  orderTrackId: string;
  setOrderTrackId: (id: string) => void;

  // Search & Global state
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  // Data Collections
  settings: BakerySettings;
  updateSettings: (updates: Partial<BakerySettings>) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateOrderProductionStage: (orderId: string, stage: ProductionStage) => void;
  recordPayment: (orderId: string, payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  ingredients: Ingredient[];
  addIngredient: (item: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  adjustIngredientStock: (id: string, deltaQty: number, reason?: string) => void;
  deleteIngredient: (id: string) => void;

  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'orderCount'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'date'>) => void;

  // Customer Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number, isEggless: boolean, flavor: string, instructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Reset & Helpers
  resetToDemoData: () => void;
  exportToCsv: (type: 'orders' | 'customers' | 'inventory' | 'expenses') => void;
  
  // Navigation helper
  navigateToOrderDetail: (orderId: string) => void;
  navigateToCustomerDetail: (customerId: string) => void;
  navigateToStorefrontProduct: (productId: string) => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bakeflow_app_v2_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View State
  const [activeRole, setActiveRole] = useState<'baker' | 'storefront'>('baker');
  const [bakerTab, setBakerTab] = useState<BakerTab>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [storefrontTab, setStorefrontTab] = useState<StorefrontTab>('home');
  const [selectedStorefrontProductId, setSelectedStorefrontProductId] = useState<string | null>(null);
  const [lastConfirmedOrderId, setLastConfirmedOrderId] = useState<string | null>(null);
  const [orderTrackId, setOrderTrackId] = useState<string>('BF-2026-101');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Domain Collections with LocalStorage Persistence
  const [settings, setSettingsState] = useState<BakerySettings>(() => getStored('settings', initialSettings));
  const [products, setProductsState] = useState<Product[]>(() => getStored('products', initialProducts));
  const [orders, setOrdersState] = useState<Order[]>(() => getStored('orders', initialOrders));
  const [ingredients, setIngredientsState] = useState<Ingredient[]>(() => getStored('ingredients', initialIngredients));
  const [recipes, setRecipesState] = useState<Recipe[]>(() => getStored('recipes', initialRecipes));
  const [customers, setCustomersState] = useState<Customer[]>(() => getStored('customers', initialCustomers));
  const [expenses, setExpensesState] = useState<Expense[]>(() => getStored('expenses', initialExpenses));
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => getStored('notifications', initialNotifications));
  const [cart, setCartState] = useState<CartItem[]>(() => getStored('cart', []));

  // Sync to localStorage
  useEffect(() => { setStored('settings', settings); }, [settings]);
  useEffect(() => { setStored('products', products); }, [products]);
  useEffect(() => { setStored('orders', orders); }, [orders]);
  useEffect(() => { setStored('ingredients', ingredients); }, [ingredients]);
  useEffect(() => { setStored('recipes', recipes); }, [recipes]);
  useEffect(() => { setStored('customers', customers); }, [customers]);
  useEffect(() => { setStored('expenses', expenses); }, [expenses]);
  useEffect(() => { setStored('notifications', notifications); }, [notifications]);
  useEffect(() => { setStored('cart', cart); }, [cart]);

  // Settings
  const updateSettings = (updates: Partial<BakerySettings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProductsState(prev => [newProduct, ...prev]);
    addNotification({
      title: "New Product Added",
      message: `Product "${newProduct.name}" added to menu catalog.`,
      type: "info"
    });
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  // Notification helper
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read' | 'date'>) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      date: dateStr
    };
    setNotificationsState(prev => [newNotif, ...prev]);
  };

  // Orders
  const createOrder = (orderData: Partial<Order>): Order => {
    const nextOrderNum = orders.length + 101;
    const orderId = `BF-2026-${nextOrderNum}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const subtotal = orderData.subtotal || 0;
    const customizationCharges = orderData.customizationCharges || 0;
    const deliveryFee = orderData.deliveryFee || 0;
    const discount = orderData.discount || 0;
    const tax = Math.round((subtotal + customizationCharges - discount) * (settings.taxRatePercent / 100));
    const totalAmount = Math.max(0, subtotal + customizationCharges + deliveryFee - discount + tax);
    const advancePaid = orderData.advancePaid || 0;
    const remainingBalance = Math.max(0, totalAmount - advancePaid);

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName || "Customer",
      customerPhone: orderData.customerPhone || "",
      customerEmail: orderData.customerEmail || "",
      deliveryType: orderData.deliveryType || "pickup",
      deliveryAddress: orderData.deliveryAddress,
      deliveryTimeSlot: orderData.deliveryTimeSlot || "12:00 PM - 02:30 PM",
      requestedDate: orderData.requestedDate || now.toISOString().split('T')[0],
      items: orderData.items || [],
      customCakeDetails: orderData.customCakeDetails,
      status: orderData.status || (orderData.customCakeDetails ? "pending_confirmation" : "new"),
      productionStage: "to_prepare",
      subtotal,
      customizationCharges,
      deliveryFee,
      discount,
      tax,
      totalAmount,
      advancePaid,
      remainingBalance,
      paymentStatus: advancePaid >= totalAmount ? "paid" : advancePaid > 0 ? "partially_paid" : "unpaid",
      paymentMethod: orderData.paymentMethod || "upi",
      allergyNotes: orderData.allergyNotes,
      internalBakerNotes: orderData.internalBakerNotes,
      createdAt: now.toISOString(),
      statusHistory: [
        { status: orderData.status || "new", timestamp: dateStr, note: "Order created" }
      ],
      payments: advancePaid > 0 ? [
        {
          id: `pay-${Date.now()}`,
          orderId,
          amount: advancePaid,
          method: orderData.paymentMethod || "upi",
          transactionRef: `REF-${Date.now().toString().slice(-6)}`,
          notes: "Initial payment recorded",
          date: now.toISOString().split('T')[0],
          receiptNumber: `REC-2026-${Math.floor(Math.random() * 900 + 100)}`
        }
      ] : []
    };

    setOrdersState(prev => [newOrder, ...prev]);

    // Update or add customer record
    setCustomersState(prev => {
      const existing = prev.find(c => c.phone.replace(/\D/g, '') === newOrder.customerPhone.replace(/\D/g, ''));
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalSpent: c.totalSpent + totalAmount,
          orderCount: c.orderCount + 1,
          addresses: newOrder.deliveryAddress && !c.addresses.includes(newOrder.deliveryAddress)
            ? [...c.addresses, newOrder.deliveryAddress]
            : c.addresses
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          email: newOrder.customerEmail,
          addresses: newOrder.deliveryAddress ? [newOrder.deliveryAddress] : [],
          dietaryPreferences: newOrder.allergyNotes || "None specified",
          tags: ["New Customer"],
          totalSpent: totalAmount,
          orderCount: 1,
          notes: "First order placed via storefront",
          createdAt: now.toISOString().split('T')[0]
        };
        return [newCust, ...prev];
      }
    });

    addNotification({
      title: "New Order Received",
      message: `Order #${orderId} from ${newOrder.customerName} (Total: ₹${totalAmount}).`,
      type: "order"
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    setOrdersState(prev => prev.map(o => {
      if (o.id !== orderId) return o;

      // Sync production stage if status maps to one
      let stage = o.productionStage;
      if (status === 'baking') stage = 'baking';
      if (status === 'decorating') stage = 'decorating';
      if (status === 'ready') stage = 'ready';

      return {
        ...o,
        status,
        productionStage: stage,
        statusHistory: [
          ...o.statusHistory,
          { status, timestamp: dateStr, note: note || `Status updated to ${status}` }
        ]
      };
    }));

    addNotification({
      title: `Order Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `Order #${orderId} marked as ${status}.`,
      type: "order"
    });
  };

  const updateOrderProductionStage = (orderId: string, stage: ProductionStage) => {
    setOrdersState(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      // Auto upgrade status if it fits
      let newStatus = o.status;
      if (stage === 'baking' && (o.status === 'confirmed' || o.status === 'scheduled')) {
        newStatus = 'baking';
      } else if (stage === 'decorating') {
        newStatus = 'decorating';
      } else if (stage === 'ready' && o.status !== 'completed') {
        newStatus = 'ready';
      }

      return {
        ...o,
        productionStage: stage,
        status: newStatus
      };
    }));
  };

  const recordPayment = (orderId: string, paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => {
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(Math.random() * 900 + 100)}`
    };

    setOrdersState(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const newAdvance = o.advancePaid + newPayment.amount;
      const remaining = Math.max(0, o.totalAmount - newAdvance);
      const paymentStatus = remaining === 0 ? 'paid' : newAdvance > 0 ? 'partially_paid' : 'unpaid';

      return {
        ...o,
        advancePaid: newAdvance,
        remainingBalance: remaining,
        paymentStatus,
        payments: [...o.payments, newPayment]
      };
    }));

    addNotification({
      title: "Payment Recorded",
      message: `Payment of ₹${paymentData.amount} recorded for Order #${orderId}.`,
      type: "payment"
    });
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', reason || "Cancelled by baker/customer");
  };

  // Ingredients & Inventory
  const addIngredient = (itemData: Omit<Ingredient, 'id'>) => {
    const newItem: Ingredient = {
      ...itemData,
      id: `ing-${Date.now()}`
    };
    setIngredientsState(prev => [...prev, newItem]);
    addNotification({
      title: "Ingredient Added",
      message: `Added ${newItem.name} (${newItem.currentStock} ${newItem.unit}).`,
      type: "inventory"
    });
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredientsState(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const adjustIngredientStock = (id: string, deltaQty: number, reason?: string) => {
    setIngredientsState(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newStock = Math.max(0, Number((item.currentStock + deltaQty).toFixed(2)));
      
      if (newStock <= item.minThreshold) {
        addNotification({
          title: "Low Stock Warning!",
          message: `${item.name} is down to ${newStock} ${item.unit} (Threshold: ${item.minThreshold}). ${reason ? `[${reason}]` : ''}`,
          type: "inventory"
        });
      }

      return {
        ...item,
        currentStock: newStock,
        lastRestocked: deltaQty > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked
      };
    }));
  };

  const deleteIngredient = (id: string) => {
    setIngredientsState(prev => prev.filter(i => i.id !== id));
  };

  // Recipes
  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    const newRec: Recipe = {
      ...recipeData,
      id: `rec-${Date.now()}`
    };
    setRecipesState(prev => [...prev, newRec]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipesState(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecipe = (id: string) => {
    setRecipesState(prev => prev.filter(r => r.id !== id));
  };

  // Customers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'orderCount'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      orderCount: 0
    };
    setCustomersState(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomersState(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Expenses
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpensesState(prev => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpensesState(prev => prev.filter(e => e.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotificationsState(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotificationsState(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Customer Cart
  const addToCart = (product: Product, variant: ProductVariant, quantity: number, isEggless: boolean, flavor: string, instructions?: string) => {
    setCartState(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.variant.name === variant.name && 
        item.isEggless === isEggless && 
        item.selectedFlavor === flavor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product,
          variant,
          quantity,
          isEggless,
          selectedFlavor: flavor,
          specialInstructions: instructions
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartState(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartState(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: qty } : item));
    }
  };

  const clearCart = () => setCartState([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

  // Reset to Demo Data
  const resetToDemoData = () => {
    localStorage.clear();
    setSettingsState(initialSettings);
    setProductsState(initialProducts);
    setOrdersState(initialOrders);
    setIngredientsState(initialIngredients);
    setRecipesState(initialRecipes);
    setCustomersState(initialCustomers);
    setExpensesState(initialExpenses);
    setNotificationsState(initialNotifications);
    setCartState([]);
    setSelectedOrderId(null);
    setSelectedCustomerId(null);
    setBakerTab('dashboard');
    alert("Reset successful! Sample bakery data restored.");
  };

  // CSV Export utility
  const exportToCsv = (type: 'orders' | 'customers' | 'inventory' | 'expenses') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `bakeflow_${type}_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'orders') {
      csvContent += "Order ID,Customer Name,Phone,Date,Status,Total (INR),Advance Paid,Balance,Payment Status,Delivery Type\n";
      orders.forEach(o => {
        csvContent += `"${o.id}","${o.customerName}","${o.customerPhone}","${o.requestedDate}","${o.status}",${o.totalAmount},${o.advancePaid},${o.remainingBalance},"${o.paymentStatus}","${o.deliveryType}"\n`;
      });
    } else if (type === 'customers') {
      csvContent += "Customer ID,Name,Phone,Email,Total Spent (INR),Orders Count,Dietary Preferences,Tags\n";
      customers.forEach(c => {
        csvContent += `"${c.id}","${c.name}","${c.phone}","${c.email}",${c.totalSpent},${c.orderCount},"${c.dietaryPreferences}","${c.tags.join('; ')}"\n`;
      });
    } else if (type === 'inventory') {
      csvContent += "Item ID,Name,Category,Current Stock,Unit,Min Threshold,Unit Cost (INR),Supplier,Last Restocked\n";
      ingredients.forEach(i => {
        csvContent += `"${i.id}","${i.name}","${i.category}",${i.currentStock},"${i.unit}",${i.minThreshold},${i.unitCost},"${i.supplier}","${i.lastRestocked}"\n`;
      });
    } else if (type === 'expenses') {
      csvContent += "Expense ID,Date,Category,Amount (INR),Payment Method,Description,Vendor\n";
      expenses.forEach(e => {
        csvContent += `"${e.id}","${e.date}","${e.category}",${e.amount},"${e.paymentMethod}","${e.description}","${e.vendor || ''}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigation helpers
  const navigateToOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveRole('baker');
    setBakerTab('order_detail');
  };

  const navigateToCustomerDetail = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveRole('baker');
    setBakerTab('customer_detail');
  };

  const navigateToStorefrontProduct = (productId: string) => {
    setSelectedStorefrontProductId(productId);
    setActiveRole('storefront');
    setStorefrontTab('product_detail');
  };

  return (
    <BakeryContext.Provider
      value={{
        activeRole,
        setActiveRole,
        bakerTab,
        setBakerTab,
        selectedOrderId,
        setSelectedOrderId,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedProductId,
        setSelectedProductId,
        storefrontTab,
        setStorefrontTab,
        selectedStorefrontProductId,
        setSelectedStorefrontProductId,
        lastConfirmedOrderId,
        setLastConfirmedOrderId,
        orderTrackId,
        setOrderTrackId,
        globalSearchQuery,
        setGlobalSearchQuery,

        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderProductionStage,
        recordPayment,
        cancelOrder,
        ingredients,
        addIngredient,
        updateIngredient,
        adjustIngredientStock,
        deleteIngredient,
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        customers,
        addCustomer,
        updateCustomer,
        expenses,
        addExpense,
        deleteExpense,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        resetToDemoData,
        exportToCsv,
        navigateToOrderDetail,
        navigateToCustomerDetail,
        navigateToStorefrontProduct
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
