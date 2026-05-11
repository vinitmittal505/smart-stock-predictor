import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentStock: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 10 },
  supplierLeadTime: { type: Number, default: 5 },
  price: { type: Number, required: true },
  historicalDailySales: { type: [Number], default: [] },
  status: { type: String, enum: ['Healthy', 'Low', 'Critical'], default: 'Healthy' },
  aiInsight: { type: String, default: '' },
  suggestedReorder: { type: Number, default: 0 },
  calculatedRunRate: { type: Number, default: 0 },
  stockoutDate: { type: Date, default: null },
  isSlowMoving: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
