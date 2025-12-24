/**
 * Orders Service
 * CRUD operations for orders and order management
 */

import { pb } from '../lib/pocketbase'
import { validatePhoneNumber } from '../utils/validation'
import type { Order, Product } from '../types/models'

export interface ShippingInfo {
  address: string
  city: string
  region: string
  zipCode?: string
  phoneNumber: string
}

export class OrdersService {
  /**
   * Create a new order
   */
  async createOrder(
    buyerId: string,
    sellerId: string,
    productId: string,
    quantity: number,
    shippingInfo: ShippingInfo,
    paymentMethod: 'wave' | 'orange_money' | 'cash'
  ): Promise<{
    success: boolean
    order?: Order
    error?: string
  }> {
    try {
      // Validate inputs
      if (!buyerId || !sellerId || !productId) {
        return { success: false, error: 'IDs manquants' }
      }

      if (quantity <= 0) {
        return { success: false, error: 'Quantité invalide' }
      }

      // Validate shipping info
      const phoneValidation = validatePhoneNumber(shippingInfo.phoneNumber)
      if (!phoneValidation.valid) {
        return { success: false, error: phoneValidation.error }
      }

      if (!shippingInfo.address?.trim()) {
        return { success: false, error: 'Adresse requise' }
      }

      if (!shippingInfo.city?.trim()) {
        return { success: false, error: 'Ville requise' }
      }

      // Fetch product to get price
      const product = await pb.collection('products').getOne(productId)
      if (!product) {
        return { success: false, error: 'Produit introuvable' }
      }

      // Calculate prices
      const unitPrice = product.discount_price ?? product.price
      const totalPrice = unitPrice * quantity

      // Check stock
      if (product.stock_quantity < quantity) {
        return {
          success: false,
          error: `Stock insuffisant. Disponible: ${product.stock_quantity}`,
        }
      }

      // Format shipping address
      const formattedAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.region}${
        shippingInfo.zipCode ? `, ${shippingInfo.zipCode}` : ''
      }`

      // Create order
      const orderData = {
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        status: paymentMethod === 'cash' ? 'pending_payment' : 'pending_payment',
        payment_method: paymentMethod,
        shipping_address: formattedAddress,
        phone_number: shippingInfo.phoneNumber,
      }

      const order = await pb.collection('orders').create(orderData)

      return {
        success: true,
        order: order as unknown as Order,
      }
    } catch (error: any) {
      console.error('Create order error:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de la commande',
      }
    }
  }

  /**
   * Calculate order total (includes discounts)
   */
  calculateTotal(product: Product, quantity: number): {
    unitPrice: number
    subtotal: number
    total: number
  } {
    const unitPrice = product.discount_price ?? product.price
    const subtotal = unitPrice * quantity

    return {
      unitPrice,
      subtotal,
      total: subtotal,
      // TODO: Add shipping costs calculation
      // TODO: Add tax calculation
      // TODO: Add promo code support
    }
  }

  /**
   * Get orders by buyer
   */
  async getOrdersByBuyer(buyerId: string, page: number = 1, limit: number = 20) {
    try {
      const result = await pb.collection('orders').getList(page, limit, {
        filter: `buyer_id = "${buyerId}"`,
        sort: '-created',
        expand: 'product_id,seller_id',
      })

      return {
        items: result.items as unknown as Order[],
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      }
    } catch (error) {
      console.error('Get buyer orders error:', error)
      return { items: [], totalItems: 0, totalPages: 0 }
    }
  }

  /**
   * Get orders by seller
   */
  async getOrdersBySeller(sellerId: string, page: number = 1, limit: number = 20) {
    try {
      const result = await pb.collection('orders').getList(page, limit, {
        filter: `seller_id = "${sellerId}"`,
        sort: '-created',
        expand: 'buyer_id,product_id',
      })

      return {
        items: result.items as unknown as Order[],
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      }
    } catch (error) {
      console.error('Get seller orders error:', error)
      return { items: [], totalItems: 0, totalPages: 0 }
    }
  }

  /**
   * Get single order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await pb.collection('orders').getOne(orderId, {
        expand: 'buyer_id,seller_id,product_id',
      })

      return order as unknown as Order
    } catch (error) {
      console.error('Get order error:', error)
      return null
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<{
    success: boolean
    order?: Order
    error?: string
  }> {
    try {
      // Validate status
      const validStatuses: Order['status'][] = [
        'pending_payment',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'disputed',
      ]

      if (!validStatuses.includes(status)) {
        return { success: false, error: 'Statut invalide' }
      }

      const order = await pb.collection('orders').update(orderId, {
        status,
      })

      return {
        success: true,
        order: order as unknown as Order,
      }
    } catch (error: any) {
      console.error('Update order status error:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du statut',
      }
    }
  }

  /**
   * Update payment reference (after payment)
   */
  async updatePaymentReference(
    orderId: string,
    paymentReference: string
  ): Promise<{
    success: boolean
    order?: Order
    error?: string
  }> {
    try {
      const order = await pb.collection('orders').update(orderId, {
        payment_reference: paymentReference,
        status: 'paid',
      })

      return {
        success: true,
        order: order as unknown as Order,
      }
    } catch (error: any) {
      console.error('Update payment reference error:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du paiement',
      }
    }
  }

  /**
   * Add tracking number to order
   */
  async addTrackingNumber(
    orderId: string,
    trackingNumber: string
  ): Promise<{
    success: boolean
    order?: Order
    error?: string
  }> {
    try {
      const order = await pb.collection('orders').update(orderId, {
        tracking_number: trackingNumber,
      })

      return {
        success: true,
        order: order as unknown as Order,
      }
    } catch (error: any) {
      console.error('Add tracking number error:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout du numéro de suivi',
      }
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{
    success: boolean
    order?: Order
    error?: string
  }> {
    try {
      const order = await pb.collection('orders').update(orderId, {
        status: 'cancelled',
      })

      return {
        success: true,
        order: order as unknown as Order,
      }
    } catch (error: any) {
      console.error('Cancel order error:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'annulation de la commande',
      }
    }
  }

  /**
   * Get order statistics for seller
   */
  async getSellerStats(sellerId: string): Promise<{
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    shippedOrders: number
  }> {
    try {
      const result = await pb.collection('orders').getFullList({
        filter: `seller_id = "${sellerId}"`,
      })

      const orders = result as unknown as Order[]

      const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
      const pendingOrders = orders.filter((o) => o.status === 'pending_payment').length
      const shippedOrders = orders.filter((o) => o.status === 'shipped').length

      return {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        shippedOrders,
      }
    } catch (error) {
      console.error('Get seller stats error:', error)
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        shippedOrders: 0,
      }
    }
  }
}

// Export singleton instance
export const ordersService = new OrdersService()
