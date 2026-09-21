import { ArrowLeft, ArrowRight, BadgeCheck, ImagePlus, Magnet, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const choices = [
  { title: 'Temple Magnets', text: 'Keep divine blessings close to you', action: 'View Products', to: '/shop/magnets', icon: Magnet, className: 'category-warm' },
  { title: 'Event Badges', text: 'Perfect for temple events & occasions', action: 'View Products', to: '/shop/badges', icon: BadgeCheck, className: 'category-green' },
  { title: 'Custom Magnet', text: 'Your image, your keepsake', action: 'Create Now', to: '/custom/magnet', icon: ImagePlus, className: 'category-blue' },
  { title: 'Custom Badge', text: 'Personalised for every celebration', action: 'Create Now', to: '/custom/badge', icon: Sparkles, className: 'category-lilac' },
]

export function ShopPage() {
  return <main className="page-main shop-page"><div className="container narrow-content">
    <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to home</Link>
    <header className="page-intro"><p className="eyebrow">Find your keepsake</p><h1>What would you like to shop?</h1><p className="muted">Choose one category to see the right products for your temple, event, or celebration.</p></header>
    <div className="shop-choice-grid">{choices.map(({ title, text, action, to, icon: Icon, className }) => <Link className={`category-card ${className}`} to={to} key={title}><span className="category-icon"><Icon size={27} /></span><span><strong>{title}</strong><small>{text}</small><b>{action} <ArrowRight size={16} /></b></span></Link>)}</div>
  </div></main>
}
