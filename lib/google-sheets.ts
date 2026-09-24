import { google } from 'googleapis'
import type { Order } from './db/schema'

export const sheetHeaders = ['Order ID','Order Date','Customer Name','Email','Phone','Country','Shipping Address','Fit Type','Standard Size','Bust','Under Bust','Waist','Shoulder','Armhole','Blouse Length','Sleeve Length','Sleeve Round','Front Neck','Back Neck','Sleeves','Lining','Padding','Fabric Type','Fabric Name','Reference Image','Special Instructions','Quantity','Stitching Price','Fabric Price','Shipping Fee','Total Amount','Currency','Payment Status','Order Status','Estimated Delivery','Tracking Number']

export async function appendOrderToSheet(order: Order) {
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return
  const auth = new google.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), ['https://www.googleapis.com/auth/spreadsheets'])
  const sheets = google.sheets({ version: 'v4', auth })
  const row = [order.orderId, order.orderDate.toISOString(), order.customerName, order.email, order.phone, order.country, order.shippingAddress, order.fitType, order.standardSize, order.bust, order.underBust, order.waist, order.shoulder, order.armhole, order.blouseLength, order.sleeveLength, order.sleeveRound, order.frontNeck, order.backNeck, order.sleeves, order.lining, order.padding, order.fabricType, order.fabricName, order.referenceImage, order.specialInstructions, order.quantity, order.stitchingPrice, order.fabricPrice, order.shippingFee, order.totalAmount, order.currency, order.paymentStatus, order.orderStatus, order.estimatedDelivery, order.trackingNumber]
  await sheets.spreadsheets.values.append({ spreadsheetId: process.env.GOOGLE_SHEETS_ID, range: 'Sheet1!A:AJ', valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] } })
}
