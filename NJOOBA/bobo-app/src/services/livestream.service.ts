/**
 * BOBO Livestream Service
 * QR code generation, overlay state management, and analytics for live commerce
 * Adapted for React Native from web implementation
 */

import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// TYPES
// ============================================================================

export interface QRGeneratorOptions {
  productId: string;
  merchantId: string;
  price?: number;
  title?: string;
  platform?: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
}

export interface QRCodeResult {
  dataUrl: string;
  url: string;
  productId: string;
}

export interface OverlayState {
  id: string;
  merchant_id: string;
  show_qr: boolean;
  qr_code_data_url: string | null;
  current_product_id: string | null;
  product_title: string | null;
  product_price: string | null;
  updated_at: string;
}

export interface QRScanRecord {
  id: string;
  merchant_id: string;
  product_id: string;
  platform: string;
  scanned_at: string;
  converted: boolean;
  order_id?: string;
  referrer?: string;
  session_duration?: number;
}

export interface ScanAnalytics {
  totalScans: number;
  conversions: number;
  conversionRate: number;
  products: Array<{
    id: string;
    name: string;
    scans: number;
    conversions: number;
    revenue: number;
  }>;
}

export interface PlatformAnalytics {
  facebook: number;
  instagram: number;
  tiktok: number;
  youtube: number;
  unknown: number;
}

// ============================================================================
// QR CODE GENERATION
// ============================================================================

/**
 * Generate a QR code for a product
 * Links to the BOBO product checkout page
 */
export async function generateProductQR(
  options: QRGeneratorOptions
): Promise<QRCodeResult> {
  const { productId, merchantId, platform = 'tiktok' } = options;

  // Build checkout URL with tracking params
  const baseUrl = process.env.BOBO_WEB_URL || 'https://bobo.sn';
  const checkoutUrl = `${baseUrl}/checkout/${productId}?merchant=${merchantId}&source=livestream&platform=${platform}`;

  try {
    // Generate QR code as data URL (base64 PNG)
    const dataUrl = await QRCode.toDataURL(checkoutUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });

    return {
      dataUrl,
      url: checkoutUrl,
      productId,
    };
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code with custom styling for livestream overlay
 */
export async function generateStyledQR(
  options: QRGeneratorOptions & { 
    size?: number;
    logoUrl?: string;
  }
): Promise<QRCodeResult> {
  const { productId, merchantId, platform = 'tiktok', size = 256 } = options;

  const baseUrl = process.env.BOBO_WEB_URL || 'https://bobo.sn';
  const checkoutUrl = `${baseUrl}/checkout/${productId}?merchant=${merchantId}&source=livestream&platform=${platform}`;

  try {
    const dataUrl = await QRCode.toDataURL(checkoutUrl, {
      width: size,
      margin: 1,
      color: {
        dark: '#1a1a2e',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    });

    return {
      dataUrl,
      url: checkoutUrl,
      productId,
    };
  } catch (error) {
    console.error('Styled QR generation error:', error);
    throw new Error('Failed to generate styled QR code');
  }
}

// ============================================================================
// OVERLAY STATE MANAGEMENT
// ============================================================================

let activeSubscription: RealtimeChannel | null = null;

/**
 * Update the overlay state for a merchant's livestream
 */
export async function updateOverlayState(
  merchantId: string,
  productId: string,
  showQR: boolean,
  productInfo?: { title: string; price: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate QR code if showing
    let qrDataUrl: string | null = null;
    if (showQR) {
      const qr = await generateProductQR({ productId, merchantId });
      qrDataUrl = qr.dataUrl;
    }

    // Format price for display (CFA)
    const formattedPrice = productInfo?.price
      ? new Intl.NumberFormat('fr-SN', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(productInfo.price)
      : null;

    // Upsert overlay state
    const { error } = await supabase
      .from('livestream_overlay_state')
      .upsert({
        merchant_id: merchantId,
        show_qr: showQR,
        qr_code_data_url: qrDataUrl,
        current_product_id: showQR ? productId : null,
        product_title: showQR ? productInfo?.title || null : null,
        product_price: showQR ? formattedPrice : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'merchant_id',
      });

    if (error) {
      console.error('Update overlay state error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update overlay state error:', error);
    return { success: false, error: 'Failed to update overlay state' };
  }
}

/**
 * Hide the QR overlay
 */
export async function hideOverlayQR(merchantId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('livestream_overlay_state')
      .update({
        show_qr: false,
        qr_code_data_url: null,
        current_product_id: null,
        product_title: null,
        product_price: null,
        updated_at: new Date().toISOString(),
      })
      .eq('merchant_id', merchantId);

    if (error) {
      console.error('Hide QR error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Hide QR error:', error);
    return false;
  }
}

/**
 * Subscribe to overlay state changes (real-time)
 */
export function subscribeToOverlayState(
  merchantId: string,
  callback: (state: OverlayState) => void
): () => void {
  // Clean up existing subscription
  if (activeSubscription) {
    activeSubscription.unsubscribe();
  }

  // Create new subscription
  activeSubscription = supabase
    .channel(`overlay-${merchantId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'livestream_overlay_state',
        filter: `merchant_id=eq.${merchantId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as OverlayState);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    if (activeSubscription) {
      activeSubscription.unsubscribe();
      activeSubscription = null;
    }
  };
}

/**
 * Get current overlay state
 */
export async function getOverlayState(merchantId: string): Promise<OverlayState | null> {
  try {
    const { data, error } = await supabase
      .from('livestream_overlay_state')
      .select('*')
      .eq('merchant_id', merchantId)
      .single();

    if (error) {
      console.error('Get overlay state error:', error);
      return null;
    }

    return data as OverlayState;
  } catch (error) {
    console.error('Get overlay state error:', error);
    return null;
  }
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Log a QR scan event
 */
export async function logQRScan(
  productId: string,
  merchantId: string,
  options: {
    platform?: string;
    referrer?: string;
  } = {}
): Promise<{ success: boolean; scanId?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('livestream_qr_scans')
      .insert({
        merchant_id: merchantId,
        product_id: productId,
        platform: options.platform || 'unknown',
        referrer: options.referrer || null,
        converted: false,
        scanned_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Log QR scan error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, scanId: data?.id };
  } catch (error) {
    console.error('Log QR scan error:', error);
    return { success: false, error: 'Failed to log QR scan' };
  }
}

/**
 * Mark a scan as converted (purchase completed)
 */
export async function markScanAsConverted(
  scanId: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('livestream_qr_scans')
      .update({
        converted: true,
        order_id: orderId,
      })
      .eq('id', scanId);

    if (error) {
      console.error('Mark scan converted error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Mark scan converted error:', error);
    return { success: false, error: 'Failed to mark scan as converted' };
  }
}

/**
 * Get merchant analytics
 */
export async function getMerchantAnalytics(
  merchantId: string,
  from?: string,
  to?: string
): Promise<ScanAnalytics | null> {
  try {
    // Build base query
    let scansQuery = supabase
      .from('livestream_qr_scans')
      .select('*', { count: 'exact' })
      .eq('merchant_id', merchantId);

    if (from) scansQuery = scansQuery.gte('scanned_at', from);
    if (to) scansQuery = scansQuery.lte('scanned_at', to);

    const { data: scans, count: totalScans, error: scansError } = await scansQuery;

    if (scansError) {
      console.error('Get scans error:', scansError);
      return null;
    }

    // Count conversions
    const conversions = scans?.filter(s => s.converted).length || 0;

    // Group by product
    const productMetrics = new Map<string, { scans: number; conversions: number }>();
    scans?.forEach((scan: QRScanRecord) => {
      const pid = scan.product_id;
      if (!productMetrics.has(pid)) {
        productMetrics.set(pid, { scans: 0, conversions: 0 });
      }
      const metrics = productMetrics.get(pid)!;
      metrics.scans++;
      if (scan.converted) metrics.conversions++;
    });

    // Get product titles
    const productIds = Array.from(productMetrics.keys());
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price')
      .in('id', productIds);

    // Get revenue from converted orders
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, total_price')
      .in('product_id', productIds);

    // Build product analytics
    const productAnalytics = productIds.map(pid => {
      const product = products?.find(p => p.id === pid);
      const metrics = productMetrics.get(pid)!;
      const revenue = orderItems
        ?.filter(oi => oi.product_id === pid)
        .reduce((sum, oi) => sum + (oi.total_price || 0), 0) || 0;

      return {
        id: pid,
        name: product?.title || 'Unknown Product',
        scans: metrics.scans,
        conversions: metrics.conversions,
        revenue,
      };
    });

    const conversionRate = totalScans && totalScans > 0 
      ? conversions / totalScans 
      : 0;

    return {
      totalScans: totalScans || 0,
      conversions,
      conversionRate,
      products: productAnalytics,
    };
  } catch (error) {
    console.error('Get merchant analytics error:', error);
    return null;
  }
}

/**
 * Get platform breakdown analytics
 */
export async function getPlatformAnalytics(
  merchantId: string,
  from?: string,
  to?: string
): Promise<PlatformAnalytics | null> {
  try {
    let query = supabase
      .from('livestream_qr_scans')
      .select('platform')
      .eq('merchant_id', merchantId);

    if (from) query = query.gte('scanned_at', from);
    if (to) query = query.lte('scanned_at', to);

    const { data, error } = await query;

    if (error) {
      console.error('Get platform analytics error:', error);
      return null;
    }

    // Count by platform
    const counts: PlatformAnalytics = {
      facebook: 0,
      instagram: 0,
      tiktok: 0,
      youtube: 0,
      unknown: 0,
    };

    data?.forEach((scan: QRScanRecord) => {
      const platform = scan.platform as keyof PlatformAnalytics;
      if (platform in counts) {
        counts[platform]++;
      } else {
        counts.unknown++;
      }
    });

    return counts;
  } catch (error) {
    console.error('Get platform analytics error:', error);
    return null;
  }
}

/**
 * Track session duration for engagement metrics
 */
export async function updateSessionDuration(
  scanId: string,
  durationSeconds: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('livestream_qr_scans')
      .update({ session_duration: durationSeconds })
      .eq('id', scanId);

    if (error) {
      console.error('Update session duration error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Update session duration error:', error);
    return false;
  }
}

// ============================================================================
// EXPORT DEFAULT SERVICE
// ============================================================================

export const LivestreamService = {
  // QR Generation
  generateProductQR,
  generateStyledQR,
  
  // Overlay Management
  updateOverlayState,
  hideOverlayQR,
  subscribeToOverlayState,
  getOverlayState,
  
  // Analytics
  logQRScan,
  markScanAsConverted,
  getMerchantAnalytics,
  getPlatformAnalytics,
  updateSessionDuration,
};

export default LivestreamService;
