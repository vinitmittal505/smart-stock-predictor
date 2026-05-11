import Item from '../models/Item.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.replace(/"/g, ''));

export const runAIService = async () => {
  console.log('--- Running Real Gemini AI Forecasting ---');
  
  try {
    const inventoryItems = await Item.find({});
    if (inventoryItems.length === 0) return;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const payload = inventoryItems.map(item => ({
      sku: item.sku,
      name: item.name,
      currentStock: item.currentStock,
      supplierLeadTime: item.supplierLeadTime,
      recentDailySales: item.historicalDailySales.slice(-5) 
    }));

    const prompt = `Act as an expert Supply Chain Analyst. I am providing you with JSON data for my inventory.
    For each SKU, calculate a brief, 1-sentence insight (under 15 words) about its stock health. 
    Return the result strictly as a JSON array of objects with 'sku' and 'aiInsight' keys. Do not include markdown formatting like \`\`\`json.
    
    Data:
    ${JSON.stringify(payload)}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const insights = JSON.parse(responseText);

    for (const item of inventoryItems) {
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
          item.suggestedReorder = Math.ceil(targetStock + safetyStock - item.currentStock);
        } else {
          item.suggestedReorder = 0;
        }

        if (daysUntilStockout <= item.supplierLeadTime) item.status = 'Critical';
        else if (daysUntilStockout <= item.supplierLeadTime + 7) item.status = 'Low';
        else item.status = 'Healthy';
      } else {
        item.stockoutDate = null;
        item.status = 'Healthy';
      }

      const aiResponse = insights.find(i => i.sku === item.sku);
      if (aiResponse) {
        item.aiInsight = aiResponse.aiInsight;
      }
      
      await item.save();
    }
    console.log('--- Real AI Analysis Complete ---');
  } catch (err) {
    console.error('--- Real AI Failed, falling back to algorithmic forecasting ---', err.message);
    const inventoryItems = await Item.find({});
    for (const item of inventoryItems) {
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
           item.suggestedReorder = Math.ceil(targetStock + safetyStock - item.currentStock);
         } else {
           item.suggestedReorder = 0;
         }

         if (daysUntilStockout <= item.supplierLeadTime) {
           item.status = 'Critical';
           item.aiInsight = `URGENT: Stockout predicted by ${stockoutDate.toLocaleDateString()}. Reorder ${item.suggestedReorder} units immediately.`;
         } else if (daysUntilStockout <= item.supplierLeadTime + 7) {
           item.status = 'Low';
           item.aiInsight = `Demand steady. Reorder ${item.suggestedReorder} units soon to maintain shelf levels.`;
         } else if (item.isSlowMoving) {
           item.status = 'Healthy';
           item.aiInsight = `Slow-moving stock. Run promotional campaign to free capital.`;
         } else {
           item.status = 'Healthy';
           item.aiInsight = `Optimal levels. Projected stockout in ${Math.floor(daysUntilStockout)} days based on velocity.`;
         }
       } else {
         item.stockoutDate = null;
         item.status = 'Healthy';
         item.aiInsight = 'No recent sales activity detected for this SKU.';
       }
       await item.save();
    }
  }
};
