import bcrypt from 'bcryptjs';

// In-memory data store
export const users = [
  {
    id: '1',
    username: 'admin',
    passwordHash: await bcrypt.hash('admin123', 10),
    role: 'admin'
  },
  {
    id: '2',
    username: 'manager',
    passwordHash: await bcrypt.hash('manager123', 10),
    role: 'warehouse_manager'
  },
  {
    id: '3',
    username: 'staff',
    passwordHash: await bcrypt.hash('staff123', 10),
    role: 'staff'
  }
];

export const suppliers = [
  { id: 'S001', name: 'Global Tech Distro', contact: 'sales@globaltech.com', category: 'Electronics' },
  { id: 'S002', name: 'Premium Office Furnishings', contact: 'orders@premiumoffice.com', category: 'Furniture' },
  { id: 'S003', name: 'Swift Logistics Inc.', contact: 'logistics@swift.com', category: 'Logistics' },
];

export const activityLogs = [
  { id: 1, timestamp: new Date(Date.now() - 3600000), user: 'system', action: 'Initial baseline analysis complete', details: 'Gemini AI processed initial items' },
];

export const inventoryItems = [
  {
    sku: 'SKU001',
    name: 'Wireless Mouse',
    category: 'Peripherals',
    price: 25.00,
    currentStock: 150,
    minThreshold: 40,
    supplierId: 'S001',
    historicalDailySales: [10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 11, 10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 11, 10, 12, 8, 15, 11, 13, 9, 14],
    stockHistory: [180, 170, 165, 150],
    supplierLeadTime: 5,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU002',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    price: 89.99,
    currentStock: 45,
    minThreshold: 20,
    supplierId: 'S001',
    historicalDailySales: [5, 4, 6, 5, 7, 5, 4, 6, 5, 5, 6, 5, 4, 6, 5, 7, 5, 4, 6, 5, 5, 6, 5, 4, 6, 5, 7, 5, 4, 6],
    stockHistory: [60, 55, 50, 45],
    supplierLeadTime: 10,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU003',
    name: 'USB-C Cable',
    category: 'Accessories',
    price: 12.50,
    currentStock: 12,
    minThreshold: 50,
    supplierId: 'S001',
    historicalDailySales: [2, 3, 2, 4, 3, 2, 3, 4, 3, 2, 2, 3, 2, 4, 3, 2, 3, 4, 3, 2, 2, 3, 2, 4, 3, 2, 3, 4, 3, 2],
    stockHistory: [20, 18, 15, 12],
    supplierLeadTime: 3,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU004',
    name: '4K Monitor',
    category: 'Computing',
    price: 349.99,
    currentStock: 25,
    minThreshold: 10,
    supplierId: 'S001',
    historicalDailySales: [2, 1, 3, 2, 1, 2, 3, 1, 2, 2, 1, 2, 3, 2, 1, 2, 3, 1, 2, 2, 1, 2, 3, 2, 1, 2, 3, 1, 2, 2],
    stockHistory: [35, 30, 28, 25],
    supplierLeadTime: 14,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU005',
    name: 'Gaming Laptop',
    category: 'Computing',
    price: 1299.00,
    currentStock: 8,
    minThreshold: 5,
    supplierId: 'S001',
    historicalDailySales: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    stockHistory: [15, 12, 10, 8],
    supplierLeadTime: 21,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU006',
    name: 'HD Webcam',
    category: 'Peripherals',
    price: 59.99,
    currentStock: 60,
    minThreshold: 20,
    supplierId: 'S001',
    historicalDailySales: [4, 5, 3, 4, 5, 6, 4, 3, 5, 4, 4, 5, 3, 4, 5, 6, 4, 3, 5, 4, 4, 5, 3, 4, 5, 6, 4, 3, 5, 4],
    stockHistory: [80, 75, 70, 60],
    supplierLeadTime: 7,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU007',
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 45.00,
    currentStock: 30,
    minThreshold: 15,
    supplierId: 'S001',
    historicalDailySales: [3, 2, 4, 3, 2, 3, 4, 2, 3, 3, 3, 2, 4, 3, 2, 3, 4, 2, 3, 3, 3, 2, 4, 3, 2, 3, 4, 2, 3, 3],
    stockHistory: [50, 45, 40, 30],
    supplierLeadTime: 8,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU008',
    name: 'Noise Cancelling Headphones',
    category: 'Audio',
    price: 199.99,
    currentStock: 18,
    minThreshold: 10,
    supplierId: 'S001',
    historicalDailySales: [2, 1, 2, 3, 2, 1, 2, 2, 1, 2, 2, 1, 2, 3, 2, 1, 2, 2, 1, 2, 2, 1, 2, 3, 2, 1, 2, 2, 1, 2],
    stockHistory: [30, 25, 22, 18],
    supplierLeadTime: 10,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  },
  {
    sku: 'SKU009',
    name: 'Ergonomic Chair',
    category: 'Furniture',
    price: 249.99,
    currentStock: 5,
    minThreshold: 10,
    supplierId: 'S002',
    historicalDailySales: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    stockHistory: [10, 8, 6, 5],
    supplierLeadTime: 30,
    calculatedRunRate: 0,
    suggestedReorder: 0,
    isSlowMoving: false,
    aiInsight: '',
    stockoutDate: null,
    status: 'Healthy'
  }
];
