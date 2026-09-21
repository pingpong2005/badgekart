import { ArrowLeft, Check, ChevronDown, Package, Phone, ShoppingBag, UserRound, X } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { AdminHeader } from '../components/admin/AdminHeader'
import { formatDate, formatPrice, typeLabel } from '../lib/format'
import { subscribeToOrders, updateOrderStatus, clearOrder } from '../services/orders'
import type { Order, OrderStatus } from '../types'

function friendlyOrderError(error: unknown, fallback: string) {
  console.error('Admin order action failed', error)
  const code = error && typeof error === 'object' && 'code' in error ? String((error as { code?: unknown }).code) : ''
  return code === 'permission-denied' ? 'You do not have permission to update orders.' : fallback
}

function OrderDetails({ order, onClose, onNotice }: { order: Order; onClose: () => void; onNotice: (message: string) => void }) {

  const lines = order.lines || []
  const customerName = order.customerName || 'Customer'
  const phone = order.phone || 'N/A'

  const handleDownloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      onNotice('Image downloaded successfully!')
    } catch (error) {
      console.error('Failed to download image:', error)
      onNotice('Failed to download image. Please try again.')
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="order-details-dialog" role="dialog" aria-modal="true" aria-labelledby="order-details-title">
      <button className="icon-btn dialog-close" type="button" onClick={onClose} aria-label="Close order details"><X size={19} /></button>
      <p className="eyebrow">Order details</p>
      <h2 id="order-details-title">Order #{order.id}</h2>
      <div className="order-customer"><div><UserRound size={20} /><span><strong>{customerName}</strong><small>Customer</small></span></div><a href={`tel:${phone}`}><Phone size={18} /> {phone}</a></div>
      <div className="order-detail-section"><h3>Order items</h3>{lines.map((line, index) => <div className="order-line" key={line?.id || index}><div className="order-line-image">{line?.imageUrl ? <img src={line.imageUrl} alt="" /> : <ShoppingBag size={20} />}</div><div>{line?.kind === 'custom' ? (<><div><strong>{line?.name || 'Item'}</strong></div><div className="custom-line-label"><span>{typeLabel(line.type)}</span>{line?.customImageName ? (
<>
  <br />
  Custom Image: {line.customImageName}
</>
) : null}{line.type === 'both' && (
<>
  <br />
  Production:
  <br />
  🧲 {line.quantity} Magnets
  <br />
  🏷️ {line.quantity} Badges
</>
)}</div></>) : (<><div><strong>{line?.type === 'magnet' ? '🧲' : '🏷️'} {line?.name || 'Item'}</strong></div><div><span>{line.type === 'magnet' ? 'Magnet' : 'Badge'} · {formatPrice(line?.unitPrice)} × {line?.quantity || 1}</span></div><div><strong>{formatPrice(line?.lineTotal)}</strong></div></>)}</div><strong>{formatPrice(line?.lineTotal)}</strong>{line?.kind === 'custom' && line?.imageUrl && <div style={{ marginTop: '8px' }}><button className="btn btn-secondary" onClick={() => { const baseName = line.customImageName || line.name || 'custom'; const safeName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-_.]/g, ''); const fileName = `${order.id}-${safeName}.jpg`; handleDownloadImage(line.imageUrl, fileName); }}>Download image</button></div>}</div>)}</div>
      <div className="order-request"><strong>Special request</strong><p>{order.specialRequest || 'No special request'}</p></div>
      <div className="order-total"><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
      <div className="dialog-actions"><button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button></div>
    </section>
  </div>
}

export function AdminOrdersPage() {
  const location = useLocation()
  const { filter } = useParams<{ filter?: string }>()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  useEffect(() => subscribeToOrders(setOrders, () => { console.error('Order subscription failed'); setError('Orders could not be loaded. Please check your connection and try again.') }), [])
  const customOnly = filter === 'custom' || location.pathname.endsWith('/custom')
  const visibleOrders = useMemo(() => {
    const filtered = customOnly ? orders.filter((order) => (order.lines || []).some((line) => line?.kind === 'custom')) : orders;
    return filtered.filter((order) => !order.cleared);
  }, [customOnly, orders])
  return <main className="admin-page"><AdminHeader /><div className="container admin-content"><Link className="back-link" to="/admin"><ArrowLeft size={17} /> Back to dashboard</Link><div className="admin-title-row"><div><p className="eyebrow">Fulfilment</p><h1>{customOnly ? 'Custom orders' : 'Orders'}</h1><p className="muted">Open an order to see the customer, items, and request.</p></div><div className="order-count"><Package size={21} /><strong>{visibleOrders.length}</strong><span>{customOnly ? 'Custom orders' : 'Orders to manage'}</span></div></div><div className="admin-tabs" role="tablist" aria-label="Order type"><Link className={!customOnly ? 'active' : ''} to="/admin/orders">All orders</Link><Link className={customOnly ? 'active' : ''} to="/admin/orders/custom">Custom orders</Link></div>{notice && <div className="notice" role="status">{notice}</div>}{error && <div className="notice notice-error" role="alert">{error}</div>}{!visibleOrders.length ? <div className="empty-state"><ShoppingBag size={32} /><h2>No {customOnly ? 'custom ' : ''}orders yet</h2><p className="muted">New customer orders will appear here.</p></div> : <div className="orders-card-list">{visibleOrders.map((order) => {
    const lines = order.lines || []
    const customerName = order.customerName || 'Customer'
    const phone = order.phone || 'N/A'
    const status = order.status || 'pending'
    return <article className="order-card" key={order.id}><div className="order-card-top"><div><p className="eyebrow">Order #{order.id}</p><h2>{customerName}</h2></div></div><div className="order-card-info"><span><Phone size={17} /> {phone}</span><span><Package size={17} /> {lines.length} item{lines.length === 1 ? '' : 's'}</span><span>{formatDate(order.createdAt)}</span><strong>{formatPrice(order.total)}</strong></div><div className="order-card-actions"><button className="btn btn-secondary" type="button" onClick={async () => { if (window.confirm('Clear this order from the active orders list?')) { try { await clearOrder(order.firestoreId ?? order.id); setNotice('Order cleared.'); } catch (err) { let msg = 'Unknown error'; if (err && typeof err === 'object' && 'code' in err && 'message' in err) { msg = `[${err.code}] ${err.message}`; } else if (err instanceof Error) { msg = err.message; } else if (typeof err === 'string') { msg = err; } setError(`Failed to clear order: ${msg}`); } } }}>Clear order</button><button className="btn btn-secondary" type="button" onClick={() => setSelected(order)}>View order <ChevronDown size={17} /></button></div></article>
  })}</div>}{selected && <OrderDetails order={selected} onClose={() => setSelected(null)} onNotice={setNotice} />}</div></main>
}

