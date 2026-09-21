export const isValidPhone = (phone: string) => /^[+\d][\d\s-]{8,14}$/.test(phone.trim())
export const isValidName = (name: string) => name.trim().length >= 2 && name.trim().length <= 100
export const maxProductImageSize = 10 * 1024 * 1024
export const isValidImage = (file: File) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= maxProductImageSize
export const isValidQuantity = (quantity: number) => Number.isInteger(quantity) && quantity >= 1 && quantity <= 999
