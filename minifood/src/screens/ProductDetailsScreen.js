import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';

export default function ProductDetailsScreen({ route }) {
  const { item } = route.params;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
      <Text style={styles.desc}>{item.description}</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 260, borderRadius: 12, backgroundColor: '#f2f2f2' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  price: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  desc: { color: '#666', marginTop: 8, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  qtyBox: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  qtyBtnText: { fontSize: 18 },
  qtyText: { marginHorizontal: 10, fontSize: 18 },
  addBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '700' },
});