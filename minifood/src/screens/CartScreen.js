import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cartArray, updateQty, total } = useCart();

  const renderItem = ({ item }) => {
    const { item: product, qty } = item;
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
        </View>
        <View style={styles.qtyBox}>
          <TouchableOpacity onPress={() => updateQty(product.id, qty - 1)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity onPress={() => updateQty(product.id, qty + 1)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartArray}
        keyExtractor={(i) => i.item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Your cart is empty.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Order')}>
          <Text style={styles.checkoutText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  name: { fontSize: 16, fontWeight: '600' },
  price: { color: '#666' },
  qtyBox: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  qtyBtnText: { fontSize: 18 },
  qtyText: { marginHorizontal: 8, fontSize: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  total: { fontSize: 18, fontWeight: '700' },
  checkoutBtn: { backgroundColor: '#28a745', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  checkoutText: { color: '#fff', fontWeight: '700' },
});