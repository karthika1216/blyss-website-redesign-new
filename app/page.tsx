'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react'

const categories = [
  { title: 'Designer Blouses', eyebrow: 'THE EDIT', href: '/shop/designer-blouses', image: '/designs/front-designer-neck.png' },
  { title: 'Custom Stitching', eyebrow: 'MADE FOR YOU', href: '/custom-stitching', image: '/designs/front-round-neck.png' },
  { title: 'Stretchable Blouses', eyebrow: 'EASE & FIT', href: '/shop/stretchable-blouses', image: '/designs/sleeve-elbow.png' },
  { title: 'Ready Designs', eyebrow: 'SIGNATURES', href: '/shop/ready-designs', image: '/designs/front-sweetheart.png' },
]

const products = [
  { name: 'Ivory Aari Blouse', price: '₹4,800', detail: 'Raw silk · Fine Aari work', image: '/designs/front-scalloped.png', slug: 'ivory-sculpt' },
  { name: 'Royal Blue Bridal Blouse', price: '₹6,200', detail: 'Silk blend · Embroidered', image: '/designs/front-designer-neck.png', slug: 'royal-heirloom' },
  { name: 'Maroon Zari Work Blouse', price: '₹5,800', detail: 'Brocade · Zari detail', image: '/designs/front-high-neck.png', slug: 'maroon-zari' },
  { name: 'Emerald Cutwork Blouse', price: '₹5,400', detail: 'Raw silk · Contemporary cutwork', image: '/designs/front-square-neck.png', slug: 'emerald-cutwork' },
]

const aariHighlights = [
  { title: 'Bridal Aari Work', detail: 'Dense handwork for the most treasured occasions.', image: '/designs/finish-heavy-padding.png', href: '/designs/bridal-aari' },
  { title: 'Floral Embroidery', detail: 'Soft botanical motifs in silk thread.', image: '/designs/front-scalloped.png', href: '/designs/floral-threadwork' },
  { title: 'Zari & Aari', detail: 'Metallic light and considered handwork.', image: '/designs/finish-lining.png', href: '/designs/zari-aari' },
  { title: 'Traditional Motifs', detail: 'Heritage craft with a modern restraint.', image: '/designs/back-designer.png', href: '/designs/temple-motifs' },
]

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function addToCart() {
    setAdded(true)
    setCartOpen(true)
  }

  return (
    <main className="blyss-site">
      <div className="announcement">Complimentary shipping on orders over ₹8,000 <span>·</span> Worldwide delivery</div>
      <header className="site-header">
        <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
        <Link className="brand-mark" href="/" aria-label="Blyss home">
          <span className="brand-symbol">B</span><span>BLYSS</span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <div className="mobile-nav-top"><span className="nav-label">Explore</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
          {['Shop', 'Custom Stitching', 'Designs', 'Fabrics', 'How It Works', 'About', 'Journal'].map((item) => (
            <Link key={item} href={item === 'Shop' ? '/shop' : item === 'Journal' ? '/blog' : `/${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{item}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button aria-label="Search"><Search size={18} /></button>
          <Link href="/account" aria-label="Account" className="account-link"><span>Account</span></Link>
          <button aria-label="Cart" className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><b>{added ? quantity : 0}</b></button>
        </div>
        <Link className="header-cta" href="/custom-stitching">Create your blouse <ArrowRight size={15} /></Link>
      </header>

      <section className="hero">
        <div className="hero-image-wrap"><Image src="/blyss-hero.png" alt="Woman wearing a navy silk blouse with gold detailing" fill priority sizes="(max-width: 760px) 100vw, 58vw" className="hero-image" /></div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow light">CUSTOM BLOUSE STITCHING</p>
          <h1>Made for your fit.<br /><em>Designed by you.</em></h1>
          <p className="hero-description">Beautifully crafted blouses, personalized to your measurements, your fabric, and your style.</p>
          <div className="hero-actions"><Link className="button button-light hero-create-cta" href="/custom-stitching">Create your blouse <ArrowRight size={16} /></Link><Link className="text-button light-text" href="/shop/designer-blouses">Browse designs <span>↗</span></Link></div>
          <div className="hero-note"><span className="gold-line" />Custom measurements · Your fabric · Worldwide orders</div>
        </div>
        <div className="hero-side-note">01 <span /> 04</div>
      </section>

      <section className="intro-section section-pad">
        <div><p className="eyebrow">THE BLYSS STANDARD</p><h2>Every detail,<br /><em>entirely yours.</em></h2></div>
        <div className="intro-body"><p>From the first sketch to the final stitch, we create blouses that feel as considered as they look. Choose a design, make it yours, and let our craft do the rest.</p><Link className="underlined-link" href="/about">Our approach <ArrowRight size={15} /></Link></div>
      </section>

      <section className="category-section section-pad">
        <div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Find your perfect style</h2></div><Link className="underlined-link" href="/shop">View all pieces <ArrowRight size={15} /></Link></div>
        <div className="category-grid">{categories.map((category) => <Link className="category-card" href={category.href} key={category.title}><div className="category-image"><Image src={category.image} alt={category.title} fill sizes="(max-width: 760px) 100vw, 25vw" /></div><div className="category-overlay" /><div className="category-content"><p>{category.eyebrow}</p><h3>{category.title}</h3><span className="category-arrow"><ArrowRight size={18} /></span></div></Link>)}</div>
      </section>

      <section className="aari-home-section section-pad"><div className="section-heading"><div><p className="eyebrow">HANDWORK, REIMAGINED</p><h2>Aari Work &amp; Embroidery</h2></div><Link className="underlined-link" href="/aari-work">Explore the handwork <ArrowRight size={15} /></Link></div><p className="aari-home-intro">Intricate handwork, timeless motifs and detailed craftsmanship designed for your special occasions.</p><div className="aari-home-grid">{aariHighlights.map(item => <Link className="aari-home-card" href={item.href} key={item.title}><div className="aari-home-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 25vw" /></div><div><p className="eyebrow">AARI WORK</p><h3>{item.title}</h3><p>{item.detail}</p><span>View designs <ArrowRight size={14} /></span></div></Link>)}</div></section>

      <section className="values-section section-pad"><div className="section-heading"><div><p className="eyebrow">WHY BLYSS</p><h2>Crafted around you</h2></div></div><div className="values-grid">{[['01', 'Perfect fit', 'Every blouse is shaped around the way you move.'], ['02', 'Your fabric or ours', 'Bring the fabric you love, or discover something new.'], ['03', 'The finer details', 'Thoughtful finishing, from first stitch to final press.'], ['04', 'Made with care', 'Your piece is made slowly, carefully, and just for you.']].map(([number, title, text]) => <div className="value-card" key={number}><span>{number}</span><Sparkles size={19} /><h3>{title}</h3><p>{text}</p></div>)}</div></section>

      <section className="featured-section section-pad"><div className="section-heading"><div><p className="eyebrow">THE SIGNATURE EDIT</p><h2>Pieces to make your own</h2></div><Link className="underlined-link" href="/shop/ready-designs">Shop ready designs <ArrowRight size={15} /></Link></div><div className="product-grid">{products.map((product) => <article className="product-card" key={product.name}><Link href={`/designs/${product.slug}`} className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw" /><span className="quick-view">View design</span></Link><div className="product-info"><div><h3>{product.name}</h3><p>{product.detail}</p></div><span>{product.price}</span></div></article>)}</div></section>

      <section className="custom-banner"><div className="custom-banner-copy"><p className="eyebrow light">YOUR VISION, OUR CRAFT</p><h2>Start with a neckline.<br /><em>End with a signature.</em></h2><p>Build a blouse that is unmistakably yours. Choose every detail, from front neck to finishing.</p><Link className="button button-light" href="/custom-stitching">Begin your design <ArrowRight size={16} /></Link></div><div className="banner-detail" aria-hidden="true"><span>01</span><div className="thread-line" /><span>08</span></div></section>

      <footer className="site-footer"><div className="footer-top"><div><div className="footer-brand"><span className="brand-symbol">B</span><span>BLYSS</span></div><p>Your design · Your fit · Our craft</p></div><div className="newsletter"><p className="eyebrow light">THE BLYSS LETTER</p><h3>Notes on craft, style &amp; the details in between.</h3><div className="newsletter-form"><input placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={17} /></button></div></div></div><div className="footer-bottom"><span>© 2026 Blyss. Made with intention.</span><div><Link href="/contact">Contact</Link><Link href="/how-it-works">Shipping &amp; care</Link><Link href="/privacy">Privacy</Link><Link className="footer-admin-link" href="/admin/login" aria-label="Admin Login">Admin Login</Link></div><span>INR <ChevronDown size={13} /></span></div></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>({added ? quantity : 0})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={20} /></button></div>{added ? <><div className="drawer-item"><div className="drawer-product-image"><Image src="/blyss-products.png" alt="The Ivory Sculpt" fill style={{ objectPosition: '0% 50%' }} /></div><div><h3>The Ivory Sculpt</h3><p>Raw silk · Custom fit</p><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div><strong>₹{(4800 * quantity).toLocaleString('en-IN')}</strong></div><div className="drawer-summary"><div><span>Subtotal</span><strong>₹{(4800 * quantity).toLocaleString('en-IN')}</strong></div><p>Shipping and taxes calculated at checkout.</p><Link href="/cart" className="button button-navy">View your bag <ArrowRight size={16} /></Link><Link href="/checkout" className="drawer-checkout">Proceed to checkout</Link></div></> : <div className="empty-bag"><ShoppingBag size={28} /><p>Your bag is waiting to be filled.</p><Link href="/shop" className="underlined-link">Explore the edit <ArrowRight size={15} /></Link></div>}</aside></div>}
    </main>
  )
}
