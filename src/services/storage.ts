import { firebaseConfigured } from '../lib/firebase'

const UPLOAD_TIMEOUT_MS = 30000 // 30 seconds

async function uploadWithTimeout(url: string, formData: FormData): Promise<any> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })
    clearTimeout(timeout)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }
    return await response.json()
  } catch (err: unknown) {
    clearTimeout(timeout)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Image upload timed out after 30 seconds. Please check your connection and try again.')
    }
    throw err
  }
}

export async function uploadProductImage(productId: string, file: File): Promise<{ path: string; url: string }> {
  if (!firebaseConfigured) {
    throw new Error('firebase-not-configured')
  }
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  // Optional: set folder if you want to enforce via preset; we can also add folder here if preset doesn't restrict.
  // formData.append('folder', 'badgekart/products')
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const result = await uploadWithTimeout(uploadUrl, formData)
  // Cloudinary returns: { public_id, version, signature, width, height, format, resource_type, created_at, tags, bytes, type, etag, url, secure_url, ... }
  return {
    path: result.public_id, // Store public ID for potential deletion (if needed later)
    url: result.secure_url   // HTTPS URL for image display
  }
}

/**
 * Custom image upload is not used in the current flow; custom images are stored as data URLs.
 * Keeping the function signature for compatibility but throwing an error if called.
 */
export async function uploadCustomImage(orderId: string, dataUrl: string, fileName: string): Promise<{ path: string; url: string }> {
  throw new Error('Custom image upload uses data URLs, not Cloudinary. This function should not be called.')
}