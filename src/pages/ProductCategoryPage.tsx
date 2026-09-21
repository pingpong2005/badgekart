import { ArrowLeft, ArrowRight, BadgeCheck, Magnet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ProductGrid } from '../components/products/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import type { ProductType } from '../types'

const categoryContent: Record<ProductType, { title: string; support: string; empty: string }> = {
  magnet: { title: 'Temple Magnets', support: 'Choose a divine keepsake for your home or pooja room.', empty: 'No temple magnets are available right now.' },
  badge: { title: 'Event Badges', support: 'Find a thoughtful badge for your temple event or special occasion.', empty: 'No event badges are available right now.' },
  both: { title: 'Magnet & Badge Sets', support: 'Choose a complete set with both a magnet and badge featuring the same design.', empty: 'No magnet & badge sets are available right now.' },
}

export function ProductCategoryPage({ type }: { type: ProductType }) {
  const { products, loading, error } = useProducts()
  const content = categoryContent[type]
  const categoryProducts = products.filter((product) => product.type === type)
  const [searchTerm, setSearchTerm] = useState('')
  const Icon = type === 'magnet' ? Magnet : BadgeCheck

  // Filter products by search term (case-insensitive, product name only)
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return <main className="page-main category-page"><div className="container">
    <Link className="back-link" to="/shop"><ArrowLeft size={17} /> Back to categories</Link>
    <header className="category-page-heading">
      <div>
        <span className="category-heading-icon"><Icon size={25} /></span>
        <div>
          <p className="eyebrow">{type === 'magnet' ? 'Temple keepsakes' : 'For your occasions'}</p>
          <h1>{content.title}</h1>
          <p className="muted">{content.support}</p>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="category-search">Search magnets...</label>
        <input
          id="category-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search magnets..."
          className="form-input"
        />
      </div>
    </header>
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    {loading ? <div className="loading-grid" aria-label={`Loading ${content.title.toLowerCase()}`}><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div> :
      filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} emptyMessage={content.empty} />
      ) : (
        <div className="empty-state">
          <h3>{content.empty}</h3>
          <p className="muted">Try a different search or check back soon.</p>
        </div>
      )
    }
  </div></main>
}
