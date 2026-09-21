import { ArrowLeft, CheckCircle2, Copy, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { QuantityControl } from '../components/ui/QuantityControl'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { buildWhatsAppMessage, formatPrice } from '../lib/format'
import { isValidName, isValidPhone } from '../lib/validation'
import { cartToLines, createOrder, generateOrderId } from '../services/orders'
import type { Order } from '../types'

const OWNER_WHATSAPP_NUMBER = '919886448576'

function reserveWhatsAppWindow() {
  try {
    const popup = window.open('about:blank', '_blank')
    if (popup) popup.opener = null
    return popup
  } catch {
    return null
  }
}

function openWhatsApp(url: string) {
  try {
    return Boolean(window.open(url, '_blank', 'noopener,noreferrer'))
  } catch {
    return false
  }
}

function navigateReservedWindow(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false
  try {
    popup.location.href = url
    return true
  } catch {
    return false
  }
}

function getSubmitErrorMessage(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code?: unknown }).code)
    : ''

  if (code === 'permission-denied') {
    return 'We could not authorize this order. Please wait for customer sign-in and try again.'
  }
  if (code === 'invalid-argument') {
    return 'This order contains unsupported data. Please review your cart and try again.'
  }
  return 'We could not submit your order. Please try again.'
}

export function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart, updateItemName, updateItemType } = useCart()
  const { user, loading: authLoading, firebaseConfigured } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState('')
  const [summary, setSummary] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!isValidName(name)) nextErrors.name = 'Please enter your full name.'
    if (!isValidPhone(phone)) nextErrors.phone = 'Please enter a valid phone number.'
    if (!items.length) nextErrors.cart = 'Add at least one item before ordering.'
    if (!firebaseConfigured) nextErrors.firebase = 'Connect Firebase in .env to place a live order.'
    if (authLoading) nextErrors.auth = 'Please wait for customer sign-in to finish, then try again.'
    const customerUid = user?.uid
    if (!customerUid) nextErrors.auth = 'Customer sign-in is not ready. Please refresh and try again.'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }

    // Reserve the popup during the original click. Browsers may block a new
    // window opened only after the asynchronous Firestore request completes.
    if (!customerUid) return

    const reservedWindow = reserveWhatsAppWindow()
    setSubmitting(true)
    setErrors({})
    try {
      const orderId = generateOrderId()
      const order: Order = {
        id: orderId,
        customerName: name.trim(),
        phone: phone.trim(),
        lines: cartToLines(items),
        specialRequest: specialRequest.trim(),
        magnetQuantity: items.filter((item) => item.type === 'magnet').reduce((sum, item) => sum + item.quantity, 0),
        customQuantity: items.filter((item) => item.kind === 'custom').reduce((sum, item) => sum + item.quantity, 0),
        total,
        status: 'pending',
        customerUid,
      }

      await createOrder(order)
      const message = buildWhatsAppMessage(order)
      const encodedWhatsAppUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      setSummary(message)
      setWhatsappUrl(encodedWhatsAppUrl)
      setSubmitted(orderId)
      clearCart()

      if (!navigateReservedWindow(reservedWindow, encodedWhatsAppUrl)) {
        reservedWindow?.close()
      }
    } catch (error) {
      reservedWindow?.close()
      setErrors({ submit: getSubmitErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  const copySummary = async () => { await navigator.clipboard.writeText(summary); setErrors({ copied: 'Order summary copied.' }) }
  const sendViaWhatsApp = () => {
    if (!whatsappUrl) return
    if (!openWhatsApp(whatsappUrl)) setErrors({ whatsapp: 'Your browser blocked WhatsApp. Allow pop-ups and try again.' })
  }

  if (submitted) return <main className="page-main"><div className="container success-page"><CheckCircle2 size={52} /><p className="eyebrow">Order received</p><h1>Thank you, {name.split(' ')[0]}.</h1><p className="muted">Your order <strong>#{submitted}</strong> has been saved. WhatsApp should open with the complete order message. If it did not open, use the button below.</p><pre className="order-summary-copy">{summary}</pre>{whatsappUrl && <button className="btn btn-primary" type="button" onClick={sendViaWhatsApp}>Send via WhatsApp</button>}<button className="btn btn-secondary" type="button" onClick={() => void copySummary()}><Copy size={18} /> Copy order summary</button>{errors.whatsapp && <p className="notice notice-error">{errors.whatsapp}</p>}{errors.copied && <p className="notice">{errors.copied}</p>}<Link className="text-link" to="/">Back to shopping</Link></div></main>
  return <main className="page-main"><div className="container"><Link className="back-link" to="/"><ArrowLeft size={17} /> Continue shopping</Link><div className="cart-heading"><div><p className="eyebrow">Your selection</p><h1>Your cart</h1></div><span className="muted">{items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span></div>{errors.cart && <div className="notice notice-error">{errors.cart}</div>}{!items.length ? <div className="empty-state"><h2>Your cart is waiting for something special</h2><p className="muted">Browse our temple collection or create a custom keepsake.</p><Link className="btn btn-primary" to="/">Explore designs</Link></div> : <div className="cart-layout"><div className="cart-items">{items.map((item) => (
  <div className="cart-item" key={item.id}>
    <img src={item.imageUrl} alt={item.name} />
    <div className="cart-item-info">
      {item.kind === 'custom' ? (
        <>
          <div className="form-field">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItemName(item.id, e.target.value)}
              placeholder="Enter product name"
              className="form-input"
            />
          </div>
          <div className="form-field">
            <span>Product type</span>
            <div className="type-options" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="magnet"
                  checked={item.type === 'magnet'}
                  onChange={(e) => updateItemType(item.id, 'magnet')}
                  style={{ width: 16, height: 16 }}
                />
                Magnet
              </label>
              <label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="badge"
                  checked={item.type === 'badge'}
                  onChange={(e) => updateItemType(item.id, 'badge')}
                  style={{ width: 16, height: 16 }}
                />
                Badge
              </label>
              <label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="both"
                  checked={item.type === 'both'}
                  onChange={(e) => updateItemType(item.id, 'both')}
                  style={{ width: 16, height: 16 }}
                />
                Both
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="product-type">{item.type.toUpperCase()}</p>
          <h3>{item.name}</h3>
        </>
      )}
      <span className="muted">{formatPrice(item.unitPrice)} each</span>
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <QuantityControl value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} />
        </div>
        <button className="remove-btn" type="button" onClick={() => removeItem(item.id)}>
          <Trash2 size={15} /> Remove
        </button>
      </div>
    </div>
    <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
  </div>
))}</div><form className="checkout-card" onSubmit={submit}><div className="checkout-card-heading"><p className="eyebrow">Almost there</p><h2>Order details</h2><p className="muted small">We’ll save your order and prepare a shareable summary.</p></div><div className="form-field"><label htmlFor="name">Full name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" />{errors.name && <span className="form-error">{errors.name}</span>}</div><div className="form-field"><label htmlFor="phone">Phone number</label><input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="10-digit phone number" inputMode="tel" autoComplete="tel" />{errors.phone && <span className="form-error">{errors.phone}</span>}</div><div className="form-field"><label htmlFor="request">Special request <span className="muted">(optional)</span></label><textarea id="request" value={specialRequest} onChange={(event) => setSpecialRequest(event.target.value)} maxLength={500} placeholder="Write any special instructions for your order here..." /></div><div className="total-row"><span>Total amount</span><strong>{formatPrice(total)}</strong></div>{(errors.firebase || errors.auth || errors.submit) && <p className="form-error">{errors.firebase || errors.auth || errors.submit}</p>}<button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? 'Saving your order…' : 'Submit order'}</button><p className="small muted checkout-note">Your order is saved securely before the summary is shown.</p></form></div>}</div></main>
}
