import { ArrowLeft, ArrowRight, MessageCircle, PackageCheck, Phone, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const OWNER_WHATSAPP_NUMBER = '919886448576'
const OWNER_PHONE = '+91 9886448576'
const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}`


type InfoPageKind = 'bulk-order' | 'about' | 'contact'

const pageContent: Record<InfoPageKind, { eyebrow: string; title: string; intro: string }> = {
  'bulk-order': { eyebrow: 'For temples and events', title: 'Bulk orders made simple', intro: 'Planning a temple gathering, celebration, or event? We can help you choose keepsakes and quantities that fit your occasion.' },
  about: { eyebrow: 'A little about us', title: 'Keepsakes made with devotion', intro: 'Badgekart brings together meaningful temple magnets and event badges for homes, families, temples, and celebrations.' },
  contact: { eyebrow: 'We are happy to help', title: 'Contact Badgekart', intro: 'Have a question about a product, custom order, or delivery? Reach out and we will guide you through the next step.' },
}

export function InfoPage({ page }: { page: InfoPageKind }) {
  const content = pageContent[page]
  return <main className="page-main info-page"><div className="container narrow-content">
    <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to home</Link>
    <header className="page-intro"><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p className="intro-lead muted">{content.intro}</p></header>
    {page === 'bulk-order' && <><div className="info-card-grid"><article className="info-card"><PackageCheck size={25} /><h2>Tell us what you need</h2><p className="muted">Share your event date, preferred product, and approximate quantity. We will help you plan your order.</p></article><article className="info-card"><ShieldCheck size={25} /><h2>Clear, friendly help</h2><p className="muted">We will confirm availability, pricing, and the details before your order is placed.</p></article></div><div className="info-cta"><div><h2>Ready to talk about your order?</h2><p className="muted">Send us a message and tell us about your temple or event.</p></div><a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a></div></>}
    {page === 'about' && <div className="info-copy"><p>We believe a small keepsake can hold a big feeling. Our collection is made to help you carry devotion home and remember the moments that bring people together.</p><p>From a temple magnet in your pooja room to badges for a special gathering, we keep the experience simple, personal, and easy to order.</p><div className="info-cta"><div><h2>Find something meaningful</h2><p className="muted">Take a look at the collection whenever you are ready.</p></div><Link className="btn btn-primary" to="/shop">Shop the collection <ArrowRight size={18} /></Link></div></div>}
    {page === 'contact' && <div className="contact-options"><a className="contact-option" href={whatsappUrl} target="_blank" rel="noreferrer"><span><MessageCircle size={23} /></span><strong>WhatsApp us<small>Ask a question or discuss an order</small></strong><ArrowRight size={18} /></a><a className="contact-option" href={`tel:${OWNER_PHONE.replace(/\s/g, '')}`}><span><Phone size={23} /></span><strong>Call us<small>Speak with us about your order</small></strong><ArrowRight size={18} /></a></div>}
  </div></main>
}
