import { addDoc, collection, doc, onSnapshot, orderBy, query, where, getDocs, limit, serverTimestamp, updateDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { CartItem, Order, OrderStatus } from '../types'

export const generateOrderId = () => `WX${Math.random().toString(36).slice(2, 8).toUpperCase()}`

export async function createOrder(order: Omit<Order, 'createdAt'>) {
  await addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() })
}

export const subscribeToOrders = (callback: (orders: Order[]) => void, onError?: (error: Error) => void): Unsubscribe => {
  const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  return onSnapshot(ordersQuery, (snapshot) => callback(snapshot.docs.map((item) => { const data = item.data(); return { id: data.id, firestoreId: item.id, ...data } as Order; })), onError)
}

export const updateOrderStatus = (id: string, status: OrderStatus) => updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() })

export const clearOrder = async (identifier: string) => {
  try {
    // Try to update by document ID (assuming identifier is a Firestore doc ID)
    await updateDoc(doc(db, 'orders', identifier), { cleared: true, updatedAt: serverTimestamp() });
    return;
  } catch (err) {
    const error = err as any;
    // If the error is 'not-found', try to find by the 'id' field
    if (error?.code === 'not-found') {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('id', '==', identifier), limit(1));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docSnap = querySnap.docs[0];
        await updateDoc(doc(db, 'orders', docSnap.id), { cleared: true, updatedAt: serverTimestamp() });
        return;
      } else {
        // If not found by id field either, re-throw original error
        throw err;
      }
    } else {
      // For other errors, re-throw
      throw err;
    }
  }
}

export const cartToLines = (items: CartItem[]) => items.map((item) => ({
  id: item.id, name: item.name, type: item.type, unitPrice: item.unitPrice, quantity: item.quantity,
  lineTotal: item.unitPrice * item.quantity, imageUrl: item.imageUrl, kind: item.kind,
  ...(item.customImageName !== undefined ? { customImageName: item.customImageName } : {}),
}))
