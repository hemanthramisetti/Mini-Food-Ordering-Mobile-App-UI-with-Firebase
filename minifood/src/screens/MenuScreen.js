import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuItemCard from '../components/MenuItemCard';
import { subscribeToMenu, seedMenu } from '../services/firestore';

export default function MenuScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsub = subscribeToMenu(
      (items) => {
        setMenu(items);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to load menu');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const openDetails = (item) => navigation.navigate('ProductDetails', { item });

  const onSeed = async () => {
    try {
      setSeeding(true);
      await seedMenu([
        { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 8.99, imageUrl: '' },
        { name: 'Chicken Burger', description: 'Grilled chicken with lettuce and mayo', price: 6.5, imageUrl: '' },
        { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons', price: 5.25, imageUrl: '' },
      ]);
    } finally {
      setSeeding(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menu;
    return menu.filter((m) =>
      (m.name || '').toLowerCase().includes(q) || (m.description || '').toLowerCase().includes(q)
    );
  }, [menu, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ marginTop: 8 }}>Loading menu...</Text>
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
      <Text style={styles.header}>Today's Menu</Text>

      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search dishes..."
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      {menu.length === 0 && (
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Text style={{ color: '#666', marginBottom: 8 }}>No items yet. You can seed a few sample items for testing:</Text>
          <TouchableOpacity onPress={onSeed} disabled={seeding} style={styles.seedBtn}>
            <Text style={styles.seedBtnText}>{seeding ? 'Seeding…' : 'Seed Sample Menu'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => openDetails(item)}>
            <MenuItemCard item={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { paddingHorizontal: 16, paddingTop: 8 },
  search: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#eee' },
  seedBtn: { backgroundColor: '#1e90ff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  seedBtnText: { color: '#fff', fontWeight: '700' },
});