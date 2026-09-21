import type { Product, ProductType } from '../types'

const imageFiles = [
  'Arunachalaeshwar shiva.jpeg', 'Ayyappa swamy.jpeg', 'Ganesha.jpeg', 'Heigriva lakshmi.jpeg',
  'Mahadeshwara.jpeg', 'Mariamman.jpeg', 'Murugan Vel.jpeg', 'Murugan.jpeg', 'Sai baba.jpeg', 'Shiva linga.jpeg'
]

const displayName = (file: string) => file.replace(/\.jpeg$/i, '').replace(/\s+/g, ' ').trim()

export const starterProducts: Omit<Product, 'id'>[] = imageFiles.map((file, index) => ({
  name: displayName(file), slug: `starter-${index + 1}`,
  type: index % 3 === 0 ? 'badge' as ProductType : 'magnet' as ProductType,
  price: 20, imagePath: `/products/${file}`, imageUrl: `/products/${file}`,
  sourceFileName: file, active: true,
}))

export const customDefaults = [
  { name: 'Custom Magnet', slug: 'custom-magnet', type: 'magnet' as ProductType, price: 30 },
  { name: 'Custom Badge', slug: 'custom-badge', type: 'badge' as ProductType, price: 30 },
  { name: 'Custom Both', slug: 'custom-both', type: 'both' as ProductType, price: 60 },
]
