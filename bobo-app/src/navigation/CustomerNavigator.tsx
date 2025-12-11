/**
 * Customer Navigator
 * Bottom tabs for customer users
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../theme'

// Placeholder screens
import { Text, View, StyleSheet } from 'react-native'

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title}</Text>
    <Text style={styles.placeholderSubtext}>Coming soon...</Text>
  </View>
)

const DiscoveryScreen = () => <PlaceholderScreen title="🔍 Découvrir" />
const QRScannerScreen = () => <PlaceholderScreen title="📷 Scanner QR" />
const OrdersScreen = () => <PlaceholderScreen title="📦 Mes Commandes" />
const ChatListScreen = () => <PlaceholderScreen title="💬 Messages" />
const ProfileScreen = () => <PlaceholderScreen title="👤 Profil" />

const Tab = createBottomTabNavigator()

export const CustomerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.terracotta.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.light,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          title: 'Découvrir',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📦</Text>,
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
  },
})
