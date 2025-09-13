import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();
const STORAGE_KEY = 'cart_state_v1';

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      return action.payload || { items: {} };
    }
    case 'ADD': {
      const { item, qty } = action.payload;
      const existing = state.items[item.id];
      const newQty = (existing?.qty || 0) + qty;
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: { item, qty: newQty },
        },
      };
    }
    case 'UPDATE': {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        const newItems = { ...state.items };
        delete newItems[id];
        return { ...state, items: newItems };
      }
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { ...state.items[id], qty },
        },
      };
    }
    case 'CLEAR': {
      return { items: {} };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} });

  // Hydrate from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            dispatch({ type: 'HYDRATE', payload: parsed });
          }
        }
      } catch (e) {
        // ignore hydration errors
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // ignore persistence errors
      }
    })();
  }, [state]);

  const value = useMemo(() => {
    const cartArray = Object.values(state.items);
    const total = cartArray.reduce((sum, { item, qty }) => sum + Number(item.price || 0) * qty, 0);

    return {
      items: state.items,
      cartArray,
      total,
      addToCart: (item, qty = 1) => dispatch({ type: 'ADD', payload: { item, qty } }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE', payload: { id, qty } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}