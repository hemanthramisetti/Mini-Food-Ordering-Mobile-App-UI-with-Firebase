import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useCart } from '../context/CartContext';
import { currency } from '../utils/format';

export default function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));

  return (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} cachePolicy="memory-disk" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.price}>{currency(item.price)}</Text>
        <View style={styles.row}>
          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={dec} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity onPress={inc} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => addToCart(item, qty)} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { padding: 12 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  desc: { color: '#666', marginBottom: 6 },
  price: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyBox: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  qtyBtnText: { fontSize: 18 },
  qtyText: { marginHorizontal: 8, fontSize: 16 },
  addBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
});