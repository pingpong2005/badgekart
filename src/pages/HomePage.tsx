import { ArrowRight, Award, Image, Magnet, MapPin, MessageCircle, ShieldCheck, Star, ThumbsUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  {
    title: 'Temple Magnets',
    text: 'Keep divine blessings close to you',
    icon: Magnet,
    href: '/shop/magnets',
    className: 'category-card-warm',
    action: 'View Products',
  },
  {
    title: 'Event Badges',
    text: 'Perfect for temple events & occasions',
    icon: Award,
    href: '/shop/badges',
    className: 'category-card-green',
    action: 'View Products',
  },
  {
    title: 'Custom Magnet',
    text: 'Your image, your keepsake',
    icon: Image,
    href: '/custom/magnet',
    className: 'category-card-blue',
    action: 'Create Now',
  },
  {
    title: 'Custom Badge',
    text: 'Personalised for every celebration',
    icon: Star,
    href: '/custom/badge',
    className: 'category-card-lilac',
    action: 'Create Now',
  },
]

const trustPoints = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Ordering',
    subtitle: 'Place your order easily on WhatsApp',
  },
  {
    icon: Users,
    title: 'Bulk Orders',
    subtitle: 'Special pricing for temples & events',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    subtitle: '100% safe & trusted checkout',
  },
]

export function HomePage() {
  return <main className="page-main home-page">
    <div className="container">
      {/* Hero Container Card */}
      <section className="hero-banner-card">
        <div className="hero-card-copy">
          <p className="eyebrow">THOUGHTFUL TEMPLE KEEPSAKES</p>
          <h1>Carry a Blessing <br /><em>Every Day</em></h1>
          <p className="hero-description">
            Beautiful temple magnets and badges made for your home, family, and every special moment.
          </p>

          <div className="hero-card-actions">
            <Link className="btn btn-primary hero-btn-primary" to="/shop">
              Shop Collection <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-trust-bar">
            <div className="hero-trust-item">
              <span className="hero-trust-icon"><ThumbsUp size={16} /></span>
              <div>
                <strong>Premium Quality</strong>
                <small>Long-lasting &amp; durable</small>
              </div>
            </div>
            <div className="hero-trust-item">
              <span className="hero-trust-icon"><ThumbsUp size={16} /></span>
              <div>
                <strong>Easy Ordering</strong>
                <small>Simple &amp; hassle-free</small>
              </div>
            </div>
            <div className="hero-trust-item">
              <span className="hero-trust-icon"><MapPin size={16} /></span>
              <div>
                <strong>Safe Delivery</strong>
                <small>Across India</small>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-card-media">
          <img src="/assets/badgekart-hero-keepsakes-v2.png" alt="Temple deity magnets and badges" />
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="home-category-section" aria-labelledby="category-heading">
        <h2 id="category-heading" className="section-title">Shop by Category</h2>
        <div className="home-category-grid">
          {categories.map(({ title, text, icon: Icon, href, className, action }) => (
            <Link className={`home-cat-card ${className}`} to={href} key={title}>
              <div className="cat-card-icon-wrap">
                <Icon size={26} />
              </div>
              <div className="cat-card-body">
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="cat-card-action">
                  {action} <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="home-trust-banner">
        {trustPoints.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="home-trust-col">
            <div className="trust-col-icon">
              <Icon size={26} />
            </div>
            <div>
              <strong>{title}</strong>
              <p>{subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Devotional Tagline */}
      <section className="devotional-tagline-section">
        <div className="devotional-icon">🪷</div>
        <h2>Bringing Devotion Closer to You</h2>
        <p>Thank you for supporting handmade with love ❤️</p>
      </section>
    </div>
  </main>
}

