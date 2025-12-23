/**
 * Customer Navigator
 * Bottom tabs for customer users
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { colors } from '../theme'

// Real screens
import { DiscoveryScreen } from '../screens/customer/DiscoveryScreen'
import { QRScannerScreen } from '../screens/customer/QRScannerScreen'
import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen'
import { CheckoutScreen } from '../screens/customer/CheckoutScreen'
import { OrdersScreen } from '../screens/customer/OrdersScreen'
import { OrderDetailScreen } from '../screens/customer/OrderDetailScreen'

// Placeholder screens (Day 3+)
import { Text, View, StyleSheet } from 'react-native'

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title}</Text>
    <Text style={styles.placeholderSubtext}>Coming soon...</Text>
  </View>
)

const ChatListScreen = () => <PlaceholderScreen title="💬 Messages" />
const ProfileScreen = () => <PlaceholderScreen title="👤 Profil" />

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Discovery Stack Navigator (includes ProductDetail and Checkout)
const DiscoveryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DiscoveryFeed"
      component={DiscoveryScreen}
      options={{ title: 'Découvrir' }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Détails du produit' }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: 'Paiement' }}
    />
  </Stack.Navigator>
)

// QR Scanner Stack Navigator (includes ProductDetail and Checkout)
const QRStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="QRScan"
      component={QRScannerScreen}
      options={{ title: 'Scanner QR' }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Détails du produit' }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: 'Paiement' }}
    />
  </Stack.Navigator>
)

// Orders Stack Navigator (includes OrderDetail)
const OrdersStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="OrdersList"
      component={OrdersScreen}
      options={{ title: 'Mes Commandes' }}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{ title: 'Détails de la commande' }}
    />
  </Stack.Navigator>
)

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
        component={DiscoveryStack}
        options={{
          title: 'Découvrir',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="QRScanner"
        component={QRStack}
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📷</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📦</Text>,
          headerShown: false,
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
