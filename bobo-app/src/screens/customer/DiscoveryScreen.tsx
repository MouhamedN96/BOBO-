/**
 * Discovery Screen (Customer)
 * Main feed with trending, deals, and AI-powered smart search
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { ProductCard } from '../../components/ProductCard'
import { productsService } from '../../services/products.service'
import { AISearchService, VisualSearch } from '../../services/ai.service'
import { useAuthStore } from '../../store/authStore'
import { colors, typography, spacing } from '../../theme'
import type { Product } from '../../types/models'

const CATEGORIES = [
  { value: 'all', label: 'Tout', icon: '🔍' },
  { value: 'fashion', label: 'Mode', icon: '👔' },
  { value: 'electronics', label: 'Tech', icon: '📱' },
  { value: 'beauty', label: 'Beauté', icon: '💄' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'home', label: 'Maison', icon: '🏠' },
]

export const DiscoveryScreen = ({ navigation }: any) => {
  const { profile } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [isAISearching, setIsAISearching] = useState(false)
  const [aiSearchMode, setAiSearchMode] = useState<'local' | 'ai' | null>(null)

  const loadProducts = async (reset: boolean = false) => {
    if (isLoading) return

    setIsLoading(true)
    const currentPage = reset ? 1 : page

    if (searchQuery) {
      const result = await productsService.search(searchQuery, currentPage, 20)
      setProducts(reset ? result.items : [...products, ...result.items])
    } else {
      const result = await productsService.getAll(currentPage, 20)
      setProducts(reset ? result.items : [...products, ...result.items])
    }

    if (reset) {
      // Load featured products for trending section
      const result = await productsService.getAll(1, 10)
      const featured = result.items.filter((p) => p.is_featured || p.upvotes > 5)
      setFeaturedProducts(featured)
    }

    setIsLoading(false)
    if (reset) setPage(2)
    else setPage(currentPage + 1)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadProducts(true)
    setRefreshing(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPage(1)
      await loadProducts(true)
      return
    }

    setIsAISearching(true)
    setPage(1)

    try {
      // Use hybrid AI search
      const results = await AISearchService.smartSearch(searchQuery, profile?.id)
      setProducts(results)
      setAiSearchMode(results.length > 0 ? 'ai' : 'local')
    } catch (error) {
      console.error('AI search failed:', error)
      // Fallback to regular search
      await loadProducts(true)
    }

    setIsAISearching(false)
  }

  const handleVisualSearch = async () => {
    try {
      // Pick image from gallery
      const imageBase64 = await VisualSearch.pickImage()

      if (!imageBase64) return

      setIsAISearching(true)

      // Perform visual search
      const results = await AISearchService.visualSearch(imageBase64, profile?.id)
      setProducts(results)
      setAiSearchMode('ai')

      Alert.alert('Recherche visuelle', `${results.length} produits similaires trouvés!`)
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'La recherche visuelle a échoué')
    }

    setIsAISearching(false)
  }

  const handleTakePhoto = async () => {
    try {
      const imageBase64 = await VisualSearch.takePhoto()

      if (!imageBase64) return

      setIsAISearching(true)

      const results = await AISearchService.visualSearch(imageBase64, profile?.id)
      setProducts(results)
      setAiSearchMode('ai')

      Alert.alert('Recherche par photo', `${results.length} produits similaires trouvés!`)
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'La recherche par photo a échoué')
    }

    setIsAISearching(false)
  }

  const handleVisualSearchOptions = () => {
    Alert.alert(
      '📸 Recherche visuelle AI',
      'Trouvez des produits similaires à partir d\'une image',
      [
        { text: 'Galerie', onPress: handleVisualSearch },
        { text: 'Prendre une photo', onPress: handleTakePhoto },
        { text: 'Annuler', style: 'cancel' },
      ]
    )
  }

  useEffect(() => {
    loadProducts(true)
  }, [])

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id })
  }

  const renderHeader = () => (
    <View>
      {/* Search Bar with AI Features */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher avec AI..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {isAISearching && <ActivityIndicator size="small" color={colors.terracotta.primary} />}
          {searchQuery.length > 0 && !isAISearching && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('')
                setAiSearchMode(null)
                handleSearch()
              }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Visual Search Button */}
        <TouchableOpacity style={styles.visualSearchButton} onPress={handleVisualSearchOptions}>
          <Text style={styles.visualSearchIcon}>📸</Text>
        </TouchableOpacity>
      </View>

      {/* AI Search Mode Indicator */}
      {aiSearchMode && (
        <View style={styles.aiIndicator}>
          <Text style={styles.aiIndicatorText}>
            {aiSearchMode === 'ai' ? '🤖 Recherche AI active' : '⚡ Recherche rapide'}
          </Text>
        </View>
      )}

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryChip,
              selectedCategory === cat.value && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.value)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === cat.value && styles.categoryLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Section */}
      {featuredProducts.length > 0 && selectedCategory === 'all' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Tendances</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredProducts.slice(0, 5).map((product) => (
              <View key={product.id} style={styles.horizontalCard}>
                <ProductCard
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Deals Section */}
      {selectedCategory === 'all' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Promotions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {products
              .filter((p) => p.discount_price && p.discount_price < p.price)
              .slice(0, 5)
              .map((product) => (
                <View key={product.id} style={styles.horizontalCard}>
                  <ProductCard
                    product={product}
                    onPress={() => handleProductPress(product)}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      {/* All Products Header */}
      <Text style={styles.sectionTitle}>
        {selectedCategory === 'all' ? '📦 Tous les produits' : `📦 ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
      </Text>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>Aucun produit trouvé</Text>
      <Text style={styles.emptySubtext}>
        Essayez une autre recherche ou catégorie
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        onEndReached={() => loadProducts(false)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.terracotta.primary}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: colors.text.primary,
  },
  clearIcon: {
    ...typography.h3,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  visualSearchButton: {
    backgroundColor: colors.terracotta.primary,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualSearchIcon: {
    fontSize: 24,
  },
  aiIndicator: {
    backgroundColor: colors.savanna.gold + '20',
    borderRadius: 8,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.savanna.gold,
  },
  aiIndicatorText: {
    ...typography.caption,
    color: colors.savanna.gold,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesContent: {
    paddingRight: spacing.base,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.terracotta.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryLabel: {
    ...typography.captionBold,
    color: colors.text.primary,
  },
  categoryLabelActive: {
    color: colors.clay.white,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  horizontalList: {
    paddingRight: spacing.base,
  },
  horizontalCard: {
    width: 280,
    marginRight: spacing.md,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
