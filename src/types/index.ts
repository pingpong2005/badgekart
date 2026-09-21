export type ProductType = 'magnet' | 'badge' | 'both'
export type CartItemKind = 'preset' | 'custom'
export type OrderStatus = 'pending' | 'confirmed' | 'completed'

export interface Product {
  id: string
  name: string
  slug: string
  type: ProductType
  price: number
  imagePath: string
  imageUrl: string
  sourceFileName?: string
  active: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

export interface CartItem {
  id: string
  kind: CartItemKind
  name: string
  type: ProductType
  unitPrice: number
  quantity: number
  imageUrl: string
  productId?: string
  customImageDataUrl?: string
  customImageName?: string
}

export interface OrderLine {
  id: string
  name: string
  type: ProductType
  unitPrice: number
  quantity: number
  lineTotal: number
  imageUrl: string
  kind: CartItemKind
  customImageName?: string
}

export interface Order {
  id: string
  customerName: string
  phone: string
  lines: OrderLine[]
  specialRequest: string
  magnetQuantity: number
  customQuantity: number
  total: number
  status: OrderStatus
  createdAt?: { seconds: number; nanoseconds: number } | unknown
  customerUid?: string
  cleared?: boolean
  firestoreId?: string
}
