import mongoose from 'mongoose';
import Item from './models/Item.js';
import Supplier from './models/Supplier.js';
import User from './models/User.js';
import { inventoryItems, suppliers, users } from './models/data.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Atlas for seeding...');

    // Clear existing
    await Item.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});

    // Insert
    await Item.insertMany(inventoryItems);
    await Supplier.insertMany(suppliers);
    await User.insertMany(users);

    console.log('--- Database Seeded Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
