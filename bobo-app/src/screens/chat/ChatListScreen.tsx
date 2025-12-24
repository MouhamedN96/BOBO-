/**
 * Chat List Screen
 * Displays user's conversations
 */

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { chatService, type Conversation } from '../../services/chat.service'
import { colors, typography, spacing } from '../../theme'
import { formatDateTime } from '../../utils/formatters'
import { pb } from '../../lib/pocketbase'

export const ChatListScreen = ({ navigation }: any) => {
  const { profile } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadConversations = async () => {
    if (!profile) return
    setIsLoading(true)
    const data = await chatService.getConversations(profile.id)
    setConversations(data)
    setIsLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadConversations()
    setRefreshing(false)
  }

  useEffect(() => {
    loadConversations()
  }, [profile])

  const renderItem = ({ item }: { item: Conversation }) => {
    // Find other participant
    const otherUser = item.expand?.participants?.find((p: any) => p.id !== profile?.id)
    const avatarUrl = otherUser?.avatar_url
      ? pb.getFileUrl(otherUser, otherUser.avatar_url)
      : undefined

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id, otherUser })}
      >
        <Image
          source={{ uri: avatarUrl || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.username}>{otherUser?.username || 'Utilisateur'}</Text>
            <Text style={styles.date}>{formatDateTime(item.updated)}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'Démarrer la conversation'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucune message pour le moment</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  listContent: {
    padding: spacing.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
    backgroundColor: colors.background.subtle,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
  },
  date: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  lastMessage: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
})
