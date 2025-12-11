/**
 * Merchant Navigator
 * Bottom tabs for merchant users
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { colors } from '../theme'

// Screens
import { Text, View, StyleSheet } from 'react-native'
import { ProductsListScreen } from '../screens/merchant/ProductsListScreen'
import { AddProductScreen } from '../screens/merchant/AddProductScreen'

// Placeholder screens
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title}</Text>
    <Text style={styles.placeholderSubtext}>Coming soon...</Text>
  </View>
)

const DashboardScreen = () => <PlaceholderScreen title="📊 Dashboard" />
const OrdersScreen = () => <PlaceholderScreen title="🛒 Commandes" />
const ChatListScreen = () => <PlaceholderScreen title="💬 Messages" />
const ProfileScreen = () => <PlaceholderScreen title="👤 Profil" />

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Products Stack Navigator
const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProductsList"
      component={ProductsListScreen}
      options={{ title: 'Mes Produits' }}
    />
    <Stack.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{ title: 'Ajouter un Produit' }}
    />
  </Stack.Navigator>
)

export const MerchantNavigator = () => {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Tableau de bord',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{
          title: 'Produits',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📦</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🛒</Text>,
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
