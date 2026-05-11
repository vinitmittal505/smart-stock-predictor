import { inventoryItems } from '../models/data.js';

export const runEmailService = () => {
  console.log('--- Running Mock Email Alert Service ---');
  
  inventoryItems.forEach(item => {
    if (item.status === 'Critical' || item.status === 'Low') {
      console.log(`[Email] ALERT: Item ${item.name} (${item.sku}) is in ${item.status} status.`);
      console.log(`[Email] Action: Send reorder request to supplier. Predicted stockout: ${item.stockoutDate?.toDateString()}.`);
      console.log(`[Email] Destination: supply-chain-manager@company.com (via Mock SendGrid)`);
    }
  });
  
  console.log('--- Mock Email Alert Service Complete ---');
};
