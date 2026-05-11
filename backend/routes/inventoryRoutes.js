import express from 'express';
import { 
  getInventory, updateInventoryItem, getLogs, 
  getSuppliers, addInventoryItem, deleteInventoryItem, executePO
} from '../controllers/inventoryController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getInventory);
router.get('/suppliers', authenticateToken, getSuppliers);
router.get('/logs', authenticateToken, getLogs);

// Admin & Manager can add items
router.post('/', authenticateToken, authorizeRole(['admin', 'warehouse_manager']), addInventoryItem);

// Only Admin can delete
router.delete('/:sku', authenticateToken, authorizeRole(['admin']), deleteInventoryItem);

// Admin & Manager can update
router.patch('/:sku', authenticateToken, authorizeRole(['admin', 'warehouse_manager']), updateInventoryItem);

// Execute P.O.
router.post('/execute-po/:sku', authenticateToken, authorizeRole(['admin', 'warehouse_manager']), executePO);

export default router;
