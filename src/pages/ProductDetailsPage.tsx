import { ArrowLeft, Check, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { QuantityControl } from '../components/ui/QuantityControl'
import { Toast } from '../components/ui/Toast'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { formatPrice, typeLabel } from '../lib/format'

export function ProductDetailsPage() {
  const { productId } = useParams()
  const { products } = useProducts()
  const product = products.find((item) => item.id === productId)
  const { addProduct } = useCart()
  const navigate = useNavigate()
  const backPath = product?.type === 'badge' ? '/shop/badges' : '/shop/magnets'
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  if (!product) return <main className="page-main container"><div className="empty-state"><h2>That design isn’t available</h2><Link className="btn btn-primary" to="/shop">Back to shop</Link></div></main>
  const add = () => { addProduct(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 2200) }
  return <main className="page-main"><div className="container"><Link className="back-link" to={backPath}><ArrowLeft size={17} /> Back to {product.type === 'badge' ? 'badges' : 'magnets'}</Link><div className="details-layout"><div className="details-image"><img src={product.imageUrl} alt={product.name} /></div><div className="details-copy"><p className="eyebrow">{typeLabel(product.type)}</p><h1>{product.name}</h1><p className="details-price">{formatPrice(product.price)} <span>per piece</span></p><p className="muted">A thoughtful little keepsake for your home, pooja room, or next temple celebration.</p><div className="quantity-row"><span>How many?</span><QuantityControl value={quantity} onChange={setQuantity} /></div><button className="btn btn-primary btn-block" type="button" onClick={add}><ShoppingBag size={18} /> Add {quantity} to cart</button><button className="btn btn-secondary btn-block" type="button" onClick={() => { add(); navigate('/cart') }}>Buy now</button><ul className="details-list"><li><Check size={16} /> Clear image preview before ordering</li><li><Check size={16} /> Order directly through WhatsApp</li><li><Check size={16} /> Personal help for special requests</li></ul></div></div></div>{added && <Toast message="Added to your cart" />}</main>
}
