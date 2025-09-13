import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { currency } from '../utils/format';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const deviceId = (await AsyncStorage.getItem('device_id')) || 'anonymous';
        const colRef = collection(db, 'orders');
        const q = query(colRef, where('deviceId', '==', deviceId), orderBy('createdAt', 'desc'));
        unsub = onSnapshot(
          q,
          (snap) => {
            setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
          },
          (e) => {
            setError(e?.message || 'Failed to load order history');
            setLoading(false);
          }
        );
      } catch (e) {
        setError(e?.message || 'Failed to initialize order history');
        setLoading(false);
      }
    })();
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>#{item.id.slice(0, 6)}</Text>
            <Text style={styles.total}>{currency(item.total)}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>No orders found.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 1, marginBottom: 12 },
  id: { color: '#666' },
  total: { fontWeight: '700', marginTop: 4 },
  status: { marginTop: 4, color: '#1e90ff' },
});