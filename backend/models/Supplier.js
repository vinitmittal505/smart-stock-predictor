import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  contact: { type: String, required: true },
  performance: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
