/**
 * PowerSync Schema Definition for BOBO
 * Defines all tables for offline-first e-commerce platform
 * Updated for PowerSync React Native v1.28+
 */

import { column, Schema, Table } from '@powersync/react-native';

// Profiles table - user information for buyers, sellers, and delivery personnel
const profiles = new Table(
  {
    phone: column.text,
    full_name: column.text,
    avatar_url: column.text,
    role: column.text, // 'buyer' | 'seller' | 'delivery'
    shop_name: column.text,
    seller_rating: column.real,
    city: column.text,
    neighborhood: column.text,
  },
  { indexes: { phone: ['phone'], role: ['role'] } }
);

// Products table - items listed by sellers
const products = new Table(
  {
    merchant_id: column.text,
    name: column.text,
    description: column.text,
    price: column.real,
    discount_price: column.real,
    stock: column.integer,
    category: column.text,
    images: column.text, // JSON string array of image URLs
    is_active: column.integer, // 0 or 1 (boolean)
    upvotes: column.integer,
  },
  { indexes: { merchant_id: ['merchant_id'], category: ['category'], is_active: ['is_active'] } }
);

// Orders table - purchase orders
const orders = new Table(
  {
    buyer_id: column.text,
    seller_id: column.text,
    status: column.text, // 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    payment_method: column.text, // 'cash' | 'mobile_money' | 'card'
    payment_status: column.text, // 'pending' | 'paid' | 'failed'
    subtotal: column.real,
    shipping_cost: column.real,
    total: column.real,
    delivery_method: column.text, // 'pickup' | 'delivery'
    delivery_address: column.text,
    delivery_phone: column.text,
  },
  { indexes: { buyer_id: ['buyer_id'], seller_id: ['seller_id'], status: ['status'] } }
);

// Order items table - individual products in an order
const order_items = new Table(
  {
    order_id: column.text,
    product_id: column.text,
    quantity: column.integer,
    unit_price: column.real,
    total_price: column.real,
  },
  { indexes: { order_id: ['order_id'], product_id: ['product_id'] } }
);

// Delivery requests table - delivery assignments
const delivery_requests = new Table(
  {
    order_id: column.text,
    delivery_person_id: column.text,
    status: column.text, // 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
    pickup_location: column.text,
    dropoff_location: column.text,
    estimated_time: column.text,
  },
  { indexes: { order_id: ['order_id'], delivery_person_id: ['delivery_person_id'], status: ['status'] } }
);

// Livestream overlay state - real-time state for OBS overlay
const livestream_overlay_state = new Table(
  {
    merchant_id: column.text,
    show_qr: column.integer, // 0 or 1 (boolean)
    qr_code_data_url: column.text,
    current_product_id: column.text,
    product_title: column.text,
    product_price: column.text,
    updated_at: column.text,
  },
  { indexes: { merchant_id: ['merchant_id'] } }
);

// Livestream QR scans table - track QR code scans from livestreams
const livestream_qr_scans = new Table(
  {
    merchant_id: column.text,
    product_id: column.text,
    platform: column.text, // 'facebook' | 'instagram' | 'tiktok' | 'youtube'
    scanned_at: column.text,
    converted: column.integer, // 0 or 1 (boolean)
    order_id: column.text,
  },
  { indexes: { merchant_id: ['merchant_id'], product_id: ['product_id'], platform: ['platform'] } }
);

// Conversations table - chat threads between buyers and sellers
const conversations = new Table(
  {
    buyer_id: column.text,
    seller_id: column.text,
    order_id: column.text,
    last_message_at: column.text,
  },
  { indexes: { buyer_id: ['buyer_id'], seller_id: ['seller_id'], order_id: ['order_id'] } }
);

// Messages table - individual chat messages
const messages = new Table(
  {
    conversation_id: column.text,
    sender_id: column.text,
    content: column.text,
    type: column.text, // 'text' | 'image' | 'audio' | 'location'
    metadata: column.text, // JSON string for additional data
    read_at: column.text,
    created_at: column.text,
  },
  { indexes: { conversation_id: ['conversation_id'], sender_id: ['sender_id'], created_at: ['created_at'] } }
);

// Reviews table - product reviews and ratings
const reviews = new Table(
  {
    product_id: column.text,
    buyer_id: column.text,
    order_id: column.text,
    rating: column.integer, // 1-5
    comment: column.text,
  },
  { indexes: { product_id: ['product_id'], buyer_id: ['buyer_id'], order_id: ['order_id'] } }
);

// Define the complete app schema
export const AppSchema = new Schema({
  profiles,
  products,
  orders,
  order_items,
  delivery_requests,
  livestream_overlay_state,
  livestream_qr_scans,
  conversations,
  messages,
  reviews,
});

// Export Database type for type-safe database access
export type Database = (typeof AppSchema)['types'];
