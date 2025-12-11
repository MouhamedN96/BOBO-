/**
 * Add Product Screen (Merchant)
 * Create new product with photo
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '../../store/authStore'
import { productsService } from '../../services/products.service'
import { colors, typography, spacing } from '../../theme'
import type { ProductFormData } from '../../types/models'

const CATEGORIES = [
  { value: 'fashion', label: 'Mode 👔' },
  { value: 'electronics', label: 'Électronique 📱' },
  { value: 'beauty', label: 'Beauté 💄' },
  { value: 'food', label: 'Alimentation 🍽️' },
  { value: 'home', label: 'Maison 🏠' },
  { value: 'other', label: 'Autre 📦' },
]

export const AddProductScreen = ({ navigation }: any) => {
  const { profile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: 'other',
    stock_quantity: 1,
  })
  const [imageUri, setImageUri] = useState<string | null>(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à vos photos')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!profile) return

    if (!imageUri) {
      Alert.alert('Erreur', 'Veuillez ajouter une photo du produit')
      return
    }

    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis')
      return
    }

    if (formData.price <= 0) {
      Alert.alert('Erreur', 'Le prix doit être supérieur à 0')
      return
    }

    setIsLoading(true)

    const result = await productsService.create(profile.id, {
      ...formData,
      image_uri: imageUri,
    })

    setIsLoading(false)

    if (result.success) {
      Alert.alert('Succès', 'Produit créé avec succès!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ])
    } else {
      Alert.alert('Erreur', result.error || 'Échec de la création')
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>
                Ajouter une photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre du produit *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Robe Africaine Wax"
            placeholderTextColor={colors.text.tertiary}
            value={formData.title}
            onChangeText={(title) => setFormData({ ...formData, title })}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez votre produit..."
            placeholderTextColor={colors.text.tertiary}
            value={formData.description}
            onChangeText={(description) =>
              setFormData({ ...formData, description })
            }
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prix (CFA) *</Text>
          <TextInput
            style={styles.input}
            placeholder="10000"
            placeholderTextColor={colors.text.tertiary}
            value={formData.price > 0 ? formData.price.toString() : ''}
            onChangeText={(text) =>
              setFormData({ ...formData, price: parseInt(text) || 0 })
            }
            keyboardType="numeric"
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  formData.category === cat.value &&
                    styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, category: cat.value as any })
                }
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === cat.value &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stock */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantité en stock *</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor={colors.text.tertiary}
            value={formData.stock_quantity.toString()}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                stock_quantity: parseInt(text) || 0,
              })
            }
            keyboardType="numeric"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.clay.white} />
          ) : (
            <Text style={styles.submitButtonText}>Créer le produit</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  imagePicker: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  imagePlaceholderText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.captionBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    padding: spacing.base,
    color: colors.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryButtonActive: {
    backgroundColor: colors.terracotta.primary + '20',
    borderColor: colors.terracotta.primary,
  },
  categoryButtonText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  categoryButtonTextActive: {
    ...typography.captionBold,
    color: colors.terracotta.primary,
  },
  submitButton: {
    backgroundColor: colors.terracotta.primary,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.clay.white,
  },
  bottomSpacing: {
    height: spacing['3xl'],
  },
})
