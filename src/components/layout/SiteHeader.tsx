import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu, MessageCircle, ShoppingBag, Sparkles, User, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop', hasDropdown: true },
  { label: 'Custom Order', to: '/custom/magnet' },
  { label: 'Bulk Order', to: '/bulk-order' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function SiteHeader() {
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)
  return <header className="site-header">
    <div className="announcement-bar"><div className="container announcement-inner"><span>🧡 Made with devotion in India</span><span>🪷 Bulk orders for temples &amp; events</span><a href="https://wa.me/919886448576" target="_blank" rel="noreferrer"><MessageCircle size={15} /> Need help? WhatsApp us</a></div></div>
    <div className="container header-inner">
      <Link to="/" className="brand" aria-label="Badgekart home" onClick={closeMobile}><span className="brand-mark"><Sparkles size={20} /></span><span><strong>Badgekart</strong><small>Temple keepsakes, made easy</small></span></Link>
      <nav className="public-nav" aria-label="Main navigation">{publicLinks.filter(link => link.label !== 'Custom Order').map(({ label, to, hasDropdown }) => <NavLink key={to} to={to} end={to === '/'}>{label}{hasDropdown && <ChevronDown size={14} className="nav-chevron" />}</NavLink>)}</nav>
      <div className="header-actions">
        <Link className="owner-login-btn" to="/admin/login"><User size={17} /><span>Owner Login</span></Link>
        <Link className="cart-btn" to="/cart" aria-label={`Cart with ${itemCount} items`}><ShoppingBag size={18} /><span>Cart</span>{itemCount > 0 && <b>{itemCount}</b>}</Link>
        <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {mobileOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">{publicLinks.filter(link => link.label !== 'Custom Order').map(({ label, to }) => <NavLink key={to} to={to} end={to === '/'} onClick={closeMobile}>{label}</NavLink>)}<NavLink className="owner-link" to="/admin/login" onClick={closeMobile}>Owner Login</NavLink></nav>}
  </header>
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner"><div><Link className="footer-brand" to="/"><strong>Badgekart</strong></Link><p>Small keepsakes for big moments.</p></div><nav className="footer-links" aria-label="Footer navigation">{publicLinks.slice(1).map(({ label, to }) => <Link key={to} to={to}>{label}</Link>)}<Link to="/cart">Cart</Link><Link to="/admin/login">Owner Login</Link></nav><p>Made for temple events, family celebrations, and everyday devotion.</p></div></footer>
}

