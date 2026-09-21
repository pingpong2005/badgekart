import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product, ProductType } from '../types'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  total: number
  addProduct: (product: Product, quantity: number) => void
  addCustom: (type: ProductType, quantity: number, price: number, imageDataUrl: string, imageName: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItemName: (id: string, name: string) => void
  updateItemType: (id: string, type: ProductType) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'badgekart-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CartItem[] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    addProduct: (product, quantity) => setItems((current) => {
      const id = `preset-${product.id}`
      const existing = current.find((item) => item.id === id)
      if (existing) return current.map((item) => item.id === id ? { ...item, quantity: item.quantity + quantity } : item)
      return [...current, { id, kind: 'preset', productId: product.id, name: product.name, type: product.type, unitPrice: product.price, quantity, imageUrl: product.imageUrl }]
    }),
    addCustom: (type, quantity, price, imageDataUrl, imageName) => setItems((current) => [...current, {
      id: `custom-${crypto.randomUUID()}`, kind: 'custom', name: `Custom ${type === 'magnet' ? 'Magnet' : type === 'badge' ? 'Badge' : 'Custom'}`,
      type, unitPrice: price, quantity, imageUrl: imageDataUrl, customImageDataUrl: imageDataUrl, customImageName: imageName,
    }]),
    updateQuantity: (id, quantity) => setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity: Math.min(quantity, 999) } : item)),
    updateItemName: (id, name) => setItems((current) => current.map((item) => item.id === id && item.kind === 'custom' ? { ...item, name: name || item.name } : item)),
    updateItemType: (id, type) => setItems((current) => current.map((item) => item.id === id && item.kind === 'custom' ? { ...item, type, unitPrice: type === 'magnet' ? 30 : type === 'badge' ? 30 : type === 'both' ? 60 : item.unitPrice } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
