import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function subscribeToMenu(callback, onError) {
  const colRef = collection(db, 'menu');
  // Consistent ordering by name; real-time updates
  const q = query(colRef, orderBy('name'));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    },
    onError
  );
  return unsub;
}

export async function submitOrder({ items, total, deviceId }) {
  const colRef = collection(db, 'orders');
  const orderItems = items.map(({ item, qty }) => ({ id: item.id, name: item.name, price: item.price, qty }));
  const docRef = await addDoc(colRef, {
    items: orderItems,
    total,
    status: 'pending',
    deviceId: deviceId || 'anonymous',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Optional helper to seed menu items (call manually from dev UI)
export async function seedMenu(items) {
  const batch = writeBatch(db);
  const colRef = collection(db, 'menu');
  items.forEach((it) => {
    const id = it.id || doc(colRef).id;
    const ref = doc(colRef, id);
    batch.set(ref, {
      name: it.name,
      description: it.description || '',
      price: Number(it.price || 0),
      imageUrl: it.imageUrl || '',
    });
  });
  await batch.commit();
}