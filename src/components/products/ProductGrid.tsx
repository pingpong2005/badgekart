import { ProductCard } from './ProductCard'
import type { Product } from '../../types'

export function ProductGrid({ products, emptyMessage = 'No products yet' }: { products: Product[]; emptyMessage?: string }) {
  if (!products.length) return <div className="empty-state"><h3>{emptyMessage}</h3><p className="muted">Please check back soon, or choose another category.</p></div>
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}
