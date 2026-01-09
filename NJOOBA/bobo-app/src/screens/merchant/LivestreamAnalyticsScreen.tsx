/**
 * BOBO Livestream Analytics Screen
 * View QR scan metrics, conversions, and revenue from live sales
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import LivestreamService, { ScanAnalytics, PlatformAnalytics } from '../../services/livestream.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function LivestreamAnalyticsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformAnalytics | null>(null);
  
  const merchantId = user?.id;

  const getDateFrom = (range: DateRange): string | undefined => {
    if (range === 'all') return undefined;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const fetchAnalytics = useCallback(async () => {
    if (!merchantId) return;
    
    try {
      const from = getDateFrom(dateRange);
      const [scanData, platformData] = await Promise.all([
        LivestreamService.getMerchantAnalytics(merchantId, from),
        LivestreamService.getPlatformAnalytics(merchantId, from),
      ]);
      
      setAnalytics(scanData);
      setPlatformStats(platformData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [merchantId, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'musical-notes';
      case 'instagram': return 'logo-instagram';
      case 'facebook': return 'logo-facebook';
      case 'youtube': return 'logo-youtube';
      default: return 'help-circle';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok': return '#000000';
      case 'instagram': return '#E4405F';
      case 'facebook': return '#1877F2';
      case 'youtube': return '#FF0000';
      default: return '#666666';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Chargement des analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPlatformScans = platformStats 
    ? Object.values(platformStats).reduce((a, b) => a + b, 0) 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Live</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateSelector}>
        {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.dateButton, dateRange === range && styles.dateButtonActive]}
            onPress={() => setDateRange(range)}
          >
            <Text style={[styles.dateButtonText, dateRange === range && styles.dateButtonTextActive]}>
              {range === 'all' ? 'Tout' : range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
            <Ionicons name="scan" size={24} color="#fff" />
            <Text style={styles.summaryValue}>{analytics?.totalScans || 0}</Text>
            <Text style={styles.summaryLabel}>Scans QR</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Ionicons name="cart" size={24} color="#FF6B35" />
            <Text style={[styles.summaryValue, { color: '#1a1a2e' }]}>{analytics?.conversions || 0}</Text>
            <Text style={[styles.summaryLabel, { color: '#666' }]}>Conversions</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {formatPercent(analytics?.conversionRate || 0)}
            </Text>
            <Text style={[styles.summaryLabel, { color: '#666' }]}>Taux Conv.</Text>
          </View>
        </View>

        {/* Platform Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Par Plateforme</Text>
          <View style={styles.platformGrid}>
            {platformStats && Object.entries(platformStats).map(([platform, count]) => {
              if (platform === 'unknown' && count === 0) return null;
              const percentage = totalPlatformScans > 0 ? (count / totalPlatformScans) * 100 : 0;
              
              return (
                <View key={platform} style={styles.platformCard}>
                  <Ionicons 
                    name={getPlatformIcon(platform) as any} 
                    size={28} 
                    color={getPlatformColor(platform)} 
                  />
                  <Text style={styles.platformName}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                  <Text style={styles.platformCount}>{count}</Text>
                  <View style={styles.platformBarContainer}>
                    <View 
                      style={[
                        styles.platformBar, 
                        { width: `${percentage}%`, backgroundColor: getPlatformColor(platform) }
                      ]} 
                    />
                  </View>
                  <Text style={styles.platformPercent}>{percentage.toFixed(0)}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Produits</Text>
          {analytics?.products && analytics.products.length > 0 ? (
            analytics.products
              .sort((a, b) => b.scans - a.scans)
              .slice(0, 5)
              .map((product, index) => (
                <View key={product.id} style={styles.productRow}>
                  <View style={styles.productRank}>
                    <Text style={styles.productRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <View style={styles.productStats}>
                      <Text style={styles.productStat}>
                        <Ionicons name="scan" size={12} color="#666" /> {product.scans}
                      </Text>
                      <Text style={styles.productStat}>
                        <Ionicons name="cart" size={12} color="#666" /> {product.conversions}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productRevenue}>
                    <Text style={styles.revenueAmount}>{formatCFA(product.revenue)}</Text>
                    <Text style={styles.revenueLabel}>Revenus</Text>
                  </View>
                </View>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Aucune donnée disponible</Text>
            </View>
          )}
        </View>

        {/* Total Revenue */}
        {analytics?.products && analytics.products.length > 0 && (
          <View style={styles.totalRevenueCard}>
            <Text style={styles.totalRevenueLabel}>Revenus Totaux (Live)</Text>
            <Text style={styles.totalRevenueAmount}>
              {formatCFA(analytics.products.reduce((sum, p) => sum + p.revenue, 0))}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  dateSelector: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', gap: 8 },
  dateButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  dateButtonActive: { backgroundColor: '#1a1a2e' },
  dateButtonText: { fontSize: 14, color: '#666' },
  dateButtonTextActive: { color: '#fff', fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  summaryGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  summaryCardPrimary: { backgroundColor: '#FF6B35' },
  summaryValue: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 8 },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  platformGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  platformCard: { width: (SCREEN_WIDTH - 64) / 2, backgroundColor: '#f8f8f8', padding: 12, borderRadius: 8, alignItems: 'center' },
  platformName: { fontSize: 12, color: '#666', marginTop: 4 },
  platformCount: { fontSize: 24, fontWeight: '700', color: '#1a1a2e', marginTop: 4 },
  platformBarContainer: { width: '100%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, marginTop: 8 },
  platformBar: { height: '100%', borderRadius: 2 },
  platformPercent: { fontSize: 12, color: '#999', marginTop: 4 },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  productRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  productRankText: { fontSize: 12, fontWeight: '700', color: '#666' },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  productStats: { flexDirection: 'row', gap: 12, marginTop: 4 },
  productStat: { fontSize: 12, color: '#666' },
  productRevenue: { alignItems: 'flex-end' },
  revenueAmount: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  revenueLabel: { fontSize: 10, color: '#999' },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 8 },
  totalRevenueCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 20, alignItems: 'center' },
  totalRevenueLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  totalRevenueAmount: { fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 8 },
});
