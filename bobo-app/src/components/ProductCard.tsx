/**
 * Product Card Component
 * Adapted from NJOOBA's MobileOptimizedCard for React Native
 * Used in Discovery Feed
 */

import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { colors, typography, spacing } from '../../theme'
import { formatCFA, truncateText } from '../../utils/formatters'
import { pb } from '../../lib/pocketbase'
import type { Product } from '../../types/models'

interface ProductCardProps {
  product: Product
  onPress: () => void
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const imageUrl = pb.getFileUrl(product, product.image_url)
  const hasVideo = !!product.video_url
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const displayPrice = hasDiscount ? product.discount_price! : product.price

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Video Badge */}
        {hasVideo && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeIcon}>▶️</Text>
          </View>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
            </Text>
          </View>
        )}

        {/* Featured Badge */}
        {product.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredIcon}>⭐</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Price */}
        <View style={styles.priceRow}>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              {formatCFA(product.price)}
            </Text>
          )}
          <Text style={styles.price}>{formatCFA(displayPrice)}</Text>
        </View>

        {/* Seller & Stats */}
        <View style={styles.footer}>
          <View style={styles.seller}>
            {product.expand?.seller_id && (
              <>
                <Image
                  source={{
                    uri: product.expand.seller_id.avatar_url
                      ? pb.getFileUrl(product.expand.seller_id, product.expand.seller_id.avatar_url)
                      : 'https://via.placeholder.com/24',
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.sellerName} numberOfLines={1}>
                  {product.expand.seller_id.username}
                </Text>
              </>
            )}
          </View>

          <View style={styles.stats}>
            <Text style={styles.statText}>❤️ {product.upvotes}</Text>
          </View>
        </View>

        {/* Stock Status */}
        {product.stock_quantity === 0 && (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Rupture de stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...StyleSheet.create({
      shadow: {
        shadowColor: colors.terracotta.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      },
    }).shadow,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: colors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.charcoal.base + 'DD',
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  videoBadgeIcon: {
    fontSize: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.rust.accent,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  discountText: {
    ...typography.micro,
    color: colors.clay.white,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.savanna.gold,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredIcon: {
    fontSize: 16,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  originalPrice: {
    ...typography.caption,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  price: {
    ...typography.price,
    color: colors.savanna.gold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.xs,
    backgroundColor: colors.background.secondary,
  },
  sellerName: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  outOfStock: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.rust.accent + '20',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  outOfStockText: {
    ...typography.micro,
    color: colors.rust.accent,
    fontWeight: '700',
  },
})
