import { useEffect, useState } from 'react'
import { firebaseConfigured } from '../lib/firebase'
import { starterProducts, customDefaults } from '../data/catalogDefaults'
import { subscribeToProducts } from '../services/products'
import type { Product } from '../types'

const localProducts: Product[] = [
  ...starterProducts.map((product, index) => ({ ...product, id: `local-${index + 1}` })),
  ...customDefaults.map((product, index) => ({ ...product, id: `custom-${index + 1}`, imagePath: '', imageUrl: '', active: true })),
]

function useProductSubscription(filterActive: boolean) {
  const [products, setProducts] = useState<Product[]>(firebaseConfigured ? [] : localProducts)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!firebaseConfigured) return
    const unsubscribe = subscribeToProducts((nextProducts) => {
      setProducts(nextProducts)
      setLoading(false)
    }, () => {
      console.error('Product subscription failed')
      setError('We could not load the catalog right now. Please try again.')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { products: filterActive ? products.filter((product) => product.active) : products, loading, error }
}

export function useProducts() {
  return useProductSubscription(true)
}

/** Admin catalog view: includes hidden products so owners can manage every record. */
export function useAdminProducts() {
  return useProductSubscription(false)
}
