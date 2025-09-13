import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MenuStack from './MenuStack';
import CartScreen from '../screens/CartScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

function CartTabIcon({ color, size }) {
  const { cartArray } = useCart();
  const count = cartArray.reduce((sum, it) => sum + it.qty, 0);
  return (
    <View>
      <Ionicons name="cart-outline" color={color} size={size} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#9aa0a6',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Menu') return <Ionicons name="restaurant-outline" color={color} size={size} />;
          if (route.name === 'Cart') return <CartTabIcon color={color} size={size} />;
          if (route.name === 'History') return <Ionicons name="time-outline" color={color} size={size} />;
          return <Ionicons name="receipt-outline" color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Order" component={OrderSummaryScreen} />
      <Tab.Screen name="History" component={OrderHistoryScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#ff3b30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});