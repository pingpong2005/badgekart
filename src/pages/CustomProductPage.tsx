import { ArrowLeft, ImagePlus, Upload } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import { QuantityControl } from '../components/ui/QuantityControl'
import { Toast } from '../components/ui/Toast'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { isValidImage } from '../lib/validation'
import { formatPrice } from '../lib/format'
import type { ProductType } from '../types'
import { customDefaults } from '../data/catalogDefaults'

async function compressImage(file: File) {
  if (file.size <= 250 * 1024) return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas'); canvas.width = bitmap.width * scale; canvas.height = bitmap.height * scale
  const context = canvas.getContext('2d'); context?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', .78))
}

export function CustomProductPage() {
  const { productType = 'magnet' } = useParams<{ productType: ProductType }>()
  const [type, setType] = useState<ProductType>(productType)
  const { products } = useProducts()
  const pricing = products.find((product) => product.slug === `custom-${type}`)
  const { addCustom } = useCart()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const chooseFile = async (file?: File) => {
    if (!file) return
    if (!isValidImage(file)) { setFileError('Please choose a JPG, PNG, or WEBP image under 10 MB.'); return }
    try { const processed = await compressImage(file); const reader = new FileReader(); reader.onload = () => { setPreview(String(reader.result)); setFileName(file.name); setFileError(''); }; reader.readAsDataURL(processed) } catch { setFileError('We could not read that image. Please try another one.') }
  }
  const add = () => {
    const effectivePricing = pricing ?? customDefaults.find(p => p.slug === `custom-${type}`);
    if (!preview || !effectivePricing) { setFileError('Please upload your image first.'); return };
    addCustom(type, quantity, effectivePricing.price, preview, fileName);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }
  return <main className="page-main"><div className="container"><Link className="back-link" to="/"><ArrowLeft size={17} /> Back to collection</Link><div className="custom-layout"><div className="custom-preview-panel"><div className="custom-preview-box">{preview ? <img src={preview} alt="Your custom upload preview" /> : <div><ImagePlus size={36} /><p>Your image will appear here</p><small>Preview before you order</small></div>}</div><div className="preview-caption"><span>1</span><p><strong>Upload your image</strong><small>Use a clear JPG, PNG, or WEBP</small></p></div></div><div className="custom-copy"><p className="eyebrow">Make it personal</p><h1>Custom {type === 'both' ? 'magnet & badge' : type === 'magnet' ? 'magnet' : 'badge'}</h1><p className="muted">Turn a special photo, family moment, or temple image into something you can keep close.</p><div className="upload-dropzone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void chooseFile(event.dataTransfer.files[0]) }}><Upload size={22} /><strong>{fileName || 'Choose an image to upload'}</strong><small>Tap to browse, or drag and drop</small><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => void chooseFile(event.target.files?.[0])} /></div>{fileError && <p className="form-error">{fileError}</p>}<div className="form-field"><span>Product type</span><div className="type-options" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}><label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" value="magnet" checked={type === 'magnet'} onChange={(e) => setType('magnet')} style={{ width: 16, height: 16 }} /> Magnet</label><label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" value="badge" checked={type === 'badge'} onChange={(e) => setType('badge')} style={{ width: 16, height: 16 }} /> Badge</label><label className="type-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" value="both" checked={type === 'both'} onChange={(e) => setType('both')} style={{ width: 16, height: 16 }} /> Both</label></div></div><div className="custom-price-row"><span>Price per piece</span><strong>{formatPrice(pricing?.price || 30)}</strong></div><div className="quantity-row"><span>Quantity</span><QuantityControl value={quantity} onChange={setQuantity} /></div><button className="btn btn-primary btn-block" type="button" onClick={add}>{type === 'both' ? 'Add magnet & badge to cart' : `Add custom ${type} to cart`}</button><button className="btn btn-secondary btn-block" type="button" onClick={() => { add(); if (preview) navigate('/cart') }}>Continue to checkout</button></div></div></div>{added && <Toast message="Custom item added to your cart" />}</main>
}
