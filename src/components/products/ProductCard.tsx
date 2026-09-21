import { Link } from 'react-router-dom'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice, typeLabel } from '../../lib/format'
import type { Product } from '../../types'
import { Toast } from '../ui/Toast'

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart()
  const [added, setAdded] = useState(false)
  const isCustom = product.slug.startsWith('custom-')
  const handleAdd = () => { addProduct(product, 1); setAdded(true); window.setTimeout(() => setAdded(false), 1800) }
  return <article className="product-card">
    <Link to={isCustom ? `/custom/${product.type}` : `/products/${product.id}`} className="product-image-wrap">
      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : <div className="custom-image-placeholder"><span>Upload your image</span></div>}
      <span className="type-pill">{product.type === 'magnet' ? 'MAGNET' : 'BADGE'}</span>
    </Link>
    <div className="product-card-body"><div><p className="product-type">{typeLabel(product.type)}</p><h3><Link to={isCustom ? `/custom/${product.type}` : `/products/${product.id}`}>{product.name}</Link></h3></div><strong className="price">{formatPrice(product.price)}</strong></div>
    <button className="btn btn-secondary add-btn" type="button" onClick={isCustom ? () => window.location.assign(`/custom/${product.type}`) : handleAdd}><ShoppingBag size={16} />{isCustom ? 'Personalize' : 'Add to cart'}</button>
    {added && <Toast message="Added to your cart" />}
    <Link className="card-arrow" to={isCustom ? `/custom/${product.type}` : `/products/${product.id}`} aria-label={`View ${product.name}`}><ArrowUpRight size={17} /></Link>
  </article>
}
