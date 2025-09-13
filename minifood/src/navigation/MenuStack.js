import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MenuList" component={MenuScreen} options={{ title: "Menu" }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: "Details" }} />
    </Stack.Navigator>
  );
}