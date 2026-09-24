import { pgTable, text, timestamp, uuid, numeric, integer, date } from 'drizzle-orm/pg-core'

export const orders = pgTable('blyss_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: text('order_id').notNull().unique(),
  orderDate: timestamp('order_date', { withTimezone: true }).notNull().defaultNow(),
  customerName: text('customer_name').notNull(), email: text('email').notNull(), phone: text('phone').notNull(), country: text('country').notNull(), shippingAddress: text('shipping_address').notNull(),
  fitType: text('fit_type').notNull(), standardSize: text('standard_size'), bust: numeric('bust'), underBust: numeric('under_bust'), waist: numeric('waist'), shoulder: numeric('shoulder'), armhole: numeric('armhole'), blouseLength: numeric('blouse_length'), sleeveLength: numeric('sleeve_length'), sleeveRound: numeric('sleeve_round'),
  frontNeck: text('front_neck').notNull(), backNeck: text('back_neck').notNull(), sleeves: text('sleeves').notNull(), lining: text('lining').notNull(), padding: text('padding').notNull(), fabricType: text('fabric_type').notNull(), fabricName: text('fabric_name'), referenceImage: text('reference_image'), specialInstructions: text('special_instructions'), quantity: integer('quantity').notNull().default(1), stitchingPrice: numeric('stitching_price').notNull().default('4800'), fabricPrice: numeric('fabric_price').notNull().default('0'), shippingFee: numeric('shipping_fee').notNull().default('0'), totalAmount: numeric('total_amount').notNull().default('4800'), currency: text('currency').notNull().default('INR'), paymentStatus: text('payment_status').notNull().default('Payment Received'), orderStatus: text('order_status').notNull().default('Payment Received'), estimatedDelivery: date('estimated_delivery'), trackingNumber: text('tracking_number'), paymentReference: text('payment_reference').unique(), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export const orderStatuses = ['Payment Received', 'Measurements Pending', 'Fabric Pending', 'Fabric Received', 'Cutting', 'Stitching', 'Quality Check', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled'] as const
