import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/firestore';
import { currency } from '../utils/format';

export default function OrderSummaryScreen() {
  const { cartArray, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem('device_id');
      if (!id) {
        id = Math.random().toString(36).slice(2);
        await AsyncStorage.setItem('device_id', id);
      }
      setDeviceId(id);
    })();
  }, []);

  const onSubmit = async () => {
    if (!cartArray.length) return;
    try {
      setSubmitting(true);
      const id = await submitOrder({ items: cartArray, total, deviceId });
      clearCart();
      Alert.alert('Order Placed', `Your order ID: ${id}`);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>
      <FlatList
        data={cartArray}
        keyExtractor={(i) => i.item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>{item.item.name} x{item.qty}</Text>
            <Text>{currency(item.item.price * item.qty)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Your cart is empty.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: {currency(total)}</Text>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={submitting || !cartArray.length}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Confirm Order</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  total: { fontSize: 18, fontWeight: '700' },
  submitBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  submitText: { color: '#fff', fontWeight: '700' },
});