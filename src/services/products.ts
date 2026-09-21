import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { starterProducts, customDefaults } from '../data/catalogDefaults'
import type { Product } from '../types'

export const subscribeToProducts = (callback: (products: Product[]) => void, onError?: (error: Error) => void): Unsubscribe => {
  const productsQuery = query(collection(db, 'products'), orderBy('name'))
  return onSnapshot(productsQuery, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Product))), onError)
}

export const createProduct = async (product: Omit<Product, 'id'>) => addDoc(collection(db, 'products'), { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
export const updateProduct = async (id: string, values: Partial<Product>) => updateDoc(doc(db, 'products', id), { ...values, updatedAt: serverTimestamp() })
export const deleteProduct = async (id: string) => deleteDoc(doc(db, 'products', id))

export async function seedStarterCatalog() {
  const existing = await getDocs(collection(db, 'products'))
  if (!existing.empty) return false
  for (const product of starterProducts) await addDoc(collection(db, 'products'), { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  for (const product of customDefaults) await addDoc(collection(db, 'products'), { ...product, imagePath: '', imageUrl: '', active: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return true
}
