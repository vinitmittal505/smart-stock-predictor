import Item from '../models/Item.js';
import Log from '../models/Log.js';
import Supplier from '../models/Supplier.js';

export const getInventory = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

export const addInventoryItem = async (req, res) => {
  const { sku, name, category, currentStock, price, supplierLeadTime, minThreshold } = req.body;
  
  if (currentStock < 0 || price < 0 || supplierLeadTime < 0) {
    return res.status(400).json({ message: 'Values cannot be negative.' });
  }

  try {
    const newItem = new Item({
      sku,
      name,
      category,
      currentStock: parseInt(currentStock),
      price: parseFloat(price),
      supplierLeadTime: parseInt(supplierLeadTime),
      minThreshold: parseInt(minThreshold || 10),
      historicalDailySales: Array(30).fill(0),
      aiInsight: 'New item added. Awaiting sales data for analysis.',
      status: 'Healthy'
    });

    await newItem.save();

    const newLog = new Log({
      user: req.user.username,
      action: `Created Item ${name}`,
      details: `SKU: ${sku}, Initial Stock: ${currentStock}, Category: ${category}`
    });
    await newLog.save();

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating item', error: err.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  const { sku } = req.params;
  try {
    const deletedItem = await Item.findOneAndDelete({ sku });
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });

    const newLog = new Log({
      user: req.user.username,
      action: `Deleted Item ${deletedItem.name}`,
      details: `Removed SKU ${sku} from catalog.`
    });
    await newLog.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

export const updateInventoryItem = async (req, res) => {
  const { sku } = req.params;
  const { currentStock, supplierLeadTime, minThreshold, price } = req.body;

  if (currentStock < 0 || supplierLeadTime < 0 || minThreshold < 0 || price < 0) {
    return res.status(400).json({ message: 'Values cannot be negative.' });
  }

  try {
    const item = await Item.findOne({ sku });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const oldStock = item.currentStock;
    
    if (currentStock !== undefined) item.currentStock = parseInt(currentStock);
    if (supplierLeadTime !== undefined) item.supplierLeadTime = parseInt(supplierLeadTime);
    if (minThreshold !== undefined) item.minThreshold = parseInt(minThreshold);
    if (price !== undefined) item.price = parseFloat(price);

    // Recalculate local stats so status updates immediately
    const totalSales = item.historicalDailySales.reduce((sum, sale) => sum + sale, 0);
    const avgDailySales = totalSales / item.historicalDailySales.length;
    item.calculatedRunRate = parseFloat(avgDailySales.toFixed(2));
    item.isSlowMoving = avgDailySales < 0.5 && item.currentStock > 10;

    if (avgDailySales > 0) {
      const daysUntilStockout = item.currentStock / avgDailySales;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout);
      item.stockoutDate = stockoutDate;

      const safetyStock = avgDailySales * 7;
      const targetStock = avgDailySales * 30;
      if (item.currentStock < item.minThreshold || daysUntilStockout < item.supplierLeadTime + 7) {
        item.suggestedReorder = Math.max(0, Math.ceil(targetStock + safetyStock - item.currentStock));
      } else {
        item.suggestedReorder = 0;
      }

      if (daysUntilStockout <= item.supplierLeadTime) {
        item.status = 'Critical';
      } else if (daysUntilStockout <= item.supplierLeadTime + 7) {
        item.status = 'Low';
      } else {
        item.status = 'Healthy';
      }
    } else {
      item.stockoutDate = null;
      item.status = 'Healthy';
    }

    await item.save();

    const newLog = new Log({
      user: req.user.username,
      action: `Updated ${item.name}`,
      details: `Stock adjustment: ${oldStock} -> ${item.currentStock}`
    });
    await newLog.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

export const executePO = async (req, res) => {
  const { sku } = req.params;
  try {
    const item = await Item.findOne({ sku });
    if (!item) return res.status(404).json({ message: 'SKU not found' });

    const reorderAmount = item.suggestedReorder || 0;
    if (reorderAmount <= 0) {
      return res.status(400).json({ message: 'No suggested reorder amount for this item.' });
    }

    const oldStock = item.currentStock;
    item.currentStock += reorderAmount;
    item.suggestedReorder = 0; 
    
    const totalSales = item.historicalDailySales.reduce((sum, sale) => sum + sale, 0);
    const avgDailySales = totalSales / item.historicalDailySales.length;
    item.calculatedRunRate = parseFloat(avgDailySales.toFixed(2));
    
    if (avgDailySales > 0) {
      const daysUntilStockout = item.currentStock / avgDailySales;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout);
      item.stockoutDate = stockoutDate;
      item.status = daysUntilStockout <= item.supplierLeadTime ? 'Critical' : 
                    daysUntilStockout <= item.supplierLeadTime + 7 ? 'Low' : 'Healthy';
    } else {
      item.stockoutDate = null;
      item.status = 'Healthy';
    }

    await item.save();

    const newLog = new Log({
      user: req.user.username,
      action: `P.O. EXECUTED [${sku}]`,
      details: `Procured ${reorderAmount} units. Stock: ${oldStock} -> ${item.currentStock}.`
    });
    await newLog.save();

    res.json({ message: 'Purchase Order executed successfully', item });
  } catch (err) {
    res.status(500).json({ message: 'Error executing PO' });
  }
};
