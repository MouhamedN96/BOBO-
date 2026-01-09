/**
 * BOBO Livestream Controls Screen
 * Merchant interface for controlling QR overlay during live sales
 * React Native implementation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { usePowerSync } from '@powersync/react-native';
import LivestreamService from '../../services/livestream.service';

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  images: string;
  stock: number;
  is_active: number;
}

type Platform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

// ============================================================================
// COMPONENT
// ============================================================================

export default function LivestreamControlsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const powerSync = usePowerSync();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentQRProduct, setCurrentQRProduct] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [isLive, setIsLive] = useState(false);
  
  const merchantId = user?.id;

  // Fetch merchant's products
  const fetchProducts = useCallback(async () => {
    if (!merchantId) return;
    
    try {
      const results = await powerSync.getAll<Product>(
        'SELECT * FROM products WHERE merchant_id = ? AND is_active = 1 ORDER BY title',
        [merchantId]
      );
      setProducts(results);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [merchantId, powerSync]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  // Show QR for a product
  const handleShowQR = async (product: Product) => {
    if (!merchantId) return;
    
    setActionLoading(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const result = await LivestreamService.updateOverlayState(
        merchantId,
        product.id,
        true,
        {
          title: product.title,
          price: product.discount_price || product.price,
        }
      );
      
      if (result.success) {
        setCurrentQRProduct(product.id);
        setIsLive(true);
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'affichage du QR');
      }
    } catch (error) {
      console.error('Error showing QR:', error);
      Alert.alert('Erreur', 'Impossible d\'afficher le QR');
    } finally {
      setActionLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Hide QR overlay
  const handleHideQR = async () => {
    if (!merchantId) return;
    
    setActionLoading(prev => ({ ...prev, hide: true }));
    
    try {
      const success = await LivestreamService.hideOverlayQR(merchantId);
      
      if (success) {
        setCurrentQRProduct(null);
      } else {
        Alert.alert('Erreur', 'Échec du masquage du QR');
      }
    } catch (error) {
      console.error('Error hiding QR:', error);
      Alert.alert('Erreur', 'Impossible de masquer le QR');
    } finally {
      setActionLoading(prev => ({ ...prev, hide: false }));
    }
  };

  // Stop livestream mode
  const handleStopLive = async () => {
    Alert.alert(
      'Arrêter le Live',
      'Voulez-vous vraiment arrêter la session live?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Arrêter',
          style: 'destructive',
          onPress: async () => {
            await handleHideQR();
            setIsLive(false);
          },
        },
      ]
    );
  };

  // Copy OBS overlay URL
  const handleCopyOverlayURL = async () => {
    if (!merchantId) return;
    
    const overlayUrl = `https://bobo.sn/merchant/overlay/${merchantId}`;
    
    try {
      await Clipboard.setString(overlayUrl);
      Alert.alert('Copié!', 'URL de l\'overlay copiée dans le presse-papiers');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de copier l\'URL');
    }
  };

  // Share overlay URL
  const handleShareOverlayURL = async () => {
    if (!merchantId) return;
    
    const overlayUrl = `https://bobo.sn/merchant/overlay/${merchantId}`;
    
    try {
      await Share.share({
        message: `Mon overlay BOBO Live: ${overlayUrl}`,
        url: overlayUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Format price in CFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get first image from JSON array
  const getFirstImage = (imagesJson: string): string | null => {
    try {
      const images = JSON.parse(imagesJson);
      return Array.isArray(images) && images.length > 0 ? images[0] : null;
    } catch {
      return null;
    }
  };

  // Navigate to analytics
  const handleViewAnalytics = () => {
    navigation.navigate('LivestreamAnalytics' as never);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contrôles Live</Text>
        </View>
        
        <View style={styles.headerRight}>
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN DIRECT</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleViewAnalytics} style={styles.analyticsButton}>
            <Ionicons name="stats-chart" size={20} color="#1a1a2e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Platform Selector */}
      <View style={styles.platformSelector}>
        <Text style={styles.sectionLabel}>Plateforme:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['tiktok', 'instagram', 'facebook', 'youtube'] as Platform[]).map((platform) => (
            <TouchableOpacity
              key={platform}
              style={[
                styles.platformButton,
                selectedPlatform === platform && styles.platformButtonActive,
              ]}
              onPress={() => setSelectedPlatform(platform)}
            >
              <Ionicons
                name={
                  platform === 'tiktok' ? 'musical-notes' :
                  platform === 'instagram' ? 'logo-instagram' :
                  platform === 'facebook' ? 'logo-facebook' :
                  'logo-youtube'
                }
                size={18}
                color={selectedPlatform === platform ? '#fff' : '#666'}
              />
              <Text style={[
                styles.platformText,
                selectedPlatform === platform && styles.platformTextActive,
              ]}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* OBS Overlay URL Section */}
      <View style={styles.overlaySection}>
        <Text style={styles.sectionLabel}>URL Overlay OBS:</Text>
        <View style={styles.overlayActions}>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyOverlayURL}>
            <Ionicons name="copy-outline" size={18} color="#FF6B35" />
            <Text style={styles.copyButtonText}>Copier URL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareOverlayURL}>
            <Ionicons name="share-outline" size={18} color="#1a1a2e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {currentQRProduct ? (
          <TouchableOpacity
            style={styles.hideQRButton}
            onPress={handleHideQR}
            disabled={actionLoading.hide}
          >
            {actionLoading.hide ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="eye-off" size={20} color="#fff" />
                <Text style={styles.hideQRButtonText}>Masquer QR</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}
        
        {isLive && (
          <TouchableOpacity
            style={styles.stopLiveButton}
            onPress={handleStopLive}
          >
            <Ionicons name="stop-circle" size={20} color="#fff" />
            <Text style={styles.stopLiveButtonText}>Arrêter Live</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Products Grid */}
      <ScrollView
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Aucun produit actif</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez des produits pour commencer à vendre en live
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((product) => {
              const imageUrl = getFirstImage(product.images);
              const isActive = currentQRProduct === product.id;
              const isLoading = actionLoading[product.id];
              
              return (
                <View key={product.id} style={styles.productCard}>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  )}
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {product.title}
                    </Text>
                    
                    <View style={styles.priceRow}>
                      {product.discount_price ? (
                        <>
                          <Text style={styles.discountPrice}>
                            {formatPrice(product.discount_price)}
                          </Text>
                          <Text style={styles.originalPrice}>
                            {formatPrice(product.price)}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.productPrice}>
                          {formatPrice(product.price)}
                        </Text>
                      )}
                    </View>
                    
                    <Text style={styles.stockText}>
                      Stock: {product.stock}
                    </Text>
                    
                    <TouchableOpacity
                      style={[
                        styles.showQRButton,
                        isActive && styles.showQRButtonActive,
                      ]}
                      onPress={() => handleShowQR(product)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={isActive ? '#fff' : '#FF6B35'} />
                      ) : (
                        <>
                          <Ionicons
                            name={isActive ? 'qr-code' : 'qr-code-outline'}
                            size={18}
                            color={isActive ? '#fff' : '#FF6B35'}
                          />
                          <Text style={[
                            styles.showQRButtonText,
                            isActive && styles.showQRButtonTextActive,
                          ]}>
                            {isActive ? 'QR Actif' : 'Afficher QR'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                  
                  {isActive && (
                    <View style={styles.activeIndicator}>
                      <View style={styles.activeDot} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  analyticsButton: {
    padding: 8,
  },
  platformSelector: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    gap: 6,
  },
  platformButtonActive: {
    backgroundColor: '#1a1a2e',
  },
  platformText: {
    fontSize: 14,
    color: '#666',
  },
  platformTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  overlaySection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  overlayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
    gap: 6,
  },
  copyButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  hideQRButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  hideQRButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopLiveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  stopLiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  showQRButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
    gap: 6,
  },
  showQRButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  showQRButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  showQRButtonTextActive: {
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
