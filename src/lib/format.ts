import type { Order, ProductType } from '../types'

export const formatPrice = (amount?: number | null) => `₹${(amount ?? 0).toLocaleString('en-IN')}`

export const typeLabel = (type: ProductType) => type === 'magnet' ? 'Temple magnet' : type === 'badge' ? 'Event badge' : 'Magnet & Badge Set'

export const titleFromFileName = (fileName: string) => fileName
  .replace(/\.[^/.]+$/, '')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ')

export const formatDate = (value: Order['createdAt']) => {
  if (!value || typeof value !== 'object' || !('seconds' in value)) return '—'
  return new Date((value.seconds as number) * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export const getOrderLineText = (order: Order) => (order.lines || [])
  .map((line) => `${line.name || 'Item'} - ${formatPrice(line.unitPrice)} × ${line.quantity || 1} pcs = ${formatPrice(line.lineTotal)}`)
  .join('\n')

export const buildWhatsAppMessage = (order: Order) => [
  'NEW MAGNET & BADGE ORDER',
  '',
  `Order ID: #${order.id}`,
  '',
  `Customer: ${order.customerName}`,
  `Phone: ${order.phone}`,
  '',
  'ORDER DETAILS',
  '',
  getOrderLineText(order),
  '',
  `Magnet Quantity: ${order.magnetQuantity} pcs`,
  `Custom Image Quantity: ${order.customQuantity} pcs`,
  '',
  `Total Amount: ${formatPrice(order.total)}`,
  '',
  'Special Request:',
  order.specialRequest || 'None',
  '',
  'Status: Pending',
].join('\n')
