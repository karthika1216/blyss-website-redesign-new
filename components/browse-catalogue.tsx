'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

export type BrowseDesign = {
  slug: string
  name: string
  image: string
  detail: string
  price: string
  category: string
}

const nav = [['Shop', '/shop'], ['Custom Stitching', '/custom-stitching'], ['Designs', '/design-library'], ['Fabrics', '/fabrics'], ['How It Works', '/how-it-works'], ['About', '/about'], ['Journal', '/journal']]

export const browseSets: Record<string, { eyebrow: string; title: string; intro: string; image: string; designs: BrowseDesign[] }> = {
  'designer-blouses': {
    eyebrow: 'THE DESIGNER EDIT', title: 'Designer blouses.', intro: 'Distinctive necklines, sculpted sleeves and considered details for a blouse with presence.', image: '/designs/front-designer-neck.png', designs: [
      { slug: 'ivory-sculpt', name: 'Ivory Sculpt', image: '/designs/front-square-neck.png', detail: 'Raw silk · Square neck · Tailored fit', price: 'From ₹4,800', category: 'Designer blouse' },
      { slug: 'deep-v-statement', name: 'Deep V Statement', image: '/designs/front-deep-v.png', detail: 'Silk blend · Deep V · Evening edit', price: 'From ₹5,200', category: 'Designer blouse' },
      { slug: 'boat-neck-line', name: 'The Boat Neck Line', image: '/designs/front-boat-neck.png', detail: 'Organza · Boat neck · Elbow sleeve', price: 'From ₹4,650', category: 'Designer blouse' },
      { slug: 'sweetheart-heirloom', name: 'Sweetheart Heirloom', image: '/designs/front-sweetheart.png', detail: 'Brocade · Sweetheart · Bridal edit', price: 'From ₹6,200', category: 'Designer blouse' },
      { slug: 'high-neck-atelier', name: 'High Neck Atelier', image: '/designs/front-high-neck.png', detail: 'Velvet · High neck · Full sleeve', price: 'From ₹5,450', category: 'Designer blouse' },
      { slug: 'scalloped-detail', name: 'Scalloped Detail', image: '/designs/front-scalloped.png', detail: 'Silk · Scalloped edge · Aari ready', price: 'From ₹5,800', category: 'Designer blouse' },
    ],
  },
  'stretchable-blouses': {
    eyebrow: 'EASE & FIT', title: 'Stretchable blouses.', intro: 'Comfort-led silhouettes in flexible fabrics, designed to move beautifully with you.', image: '/designs/sleeve-elbow.png', designs: [
      { slug: 'everyday-u-neck', name: 'Everyday U Neck', image: '/designs/front-u-neck.png', detail: 'Cotton silk · Soft stretch · Easy fit', price: 'From ₹3,200', category: 'Stretchable blouse' },
      { slug: 'stretch-v-line', name: 'Stretch V Line', image: '/designs/front-v-neck.png', detail: 'Stretch satin · V neck · Short sleeve', price: 'From ₹3,450', category: 'Stretchable blouse' },
      { slug: 'comfort-round-neck', name: 'Comfort Round Neck', image: '/designs/front-round-neck.png', detail: 'Jersey silk · Round neck · Everyday', price: 'From ₹3,100', category: 'Stretchable blouse' },
      { slug: 'easy-puff', name: 'Easy Puff', image: '/designs/sleeve-puff.png', detail: 'Stretch velvet · Puff sleeve · Soft fit', price: 'From ₹3,900', category: 'Stretchable blouse' },
    ],
  },
  'ready-designs': {
    eyebrow: 'SIGNATURES, READY TO CHOOSE', title: 'Ready designs.', intro: 'A considered selection of blouse signatures, ready to personalise with your fit and finishing.', image: '/designs/front-sweetheart.png', designs: [
      { slug: 'royal-heirloom', name: 'Royal Heirloom', image: '/designs/front-designer-neck.png', detail: 'Silk blend · Embroidered · Bridal ready', price: '₹6,200', category: 'Ready design' },
      { slug: 'maroon-zari', name: 'Maroon Zari Work', image: '/designs/front-high-neck.png', detail: 'Brocade · Zari detail · High neck', price: '₹5,800', category: 'Ready design' },
      { slug: 'emerald-cutwork', name: 'Emerald Cutwork', image: '/designs/front-scalloped.png', detail: 'Raw silk · Cutwork · Elbow sleeve', price: '₹5,400', category: 'Ready design' },
      { slug: 'contemporary-square', name: 'Contemporary Square', image: '/designs/front-square-neck.png', detail: 'Satin · Square neck · Made to measure', price: '₹4,450', category: 'Ready design' },
    ],
  },
  'aari-work': {
    eyebrow: 'AARI WORK & EMBROIDERY', title: 'Handwork with a point of view.', intro: 'Intricate handwork, timeless motifs and detailed craftsmanship designed for your special occasions.', image: '/designs/front-designer-neck.png', designs: [
      { slug: 'bridal-aari', name: 'Bridal Aari Work', image: '/designs/finish-heavy-padding.png', detail: 'Dense handwork · Zari · Bridal finish', price: 'From ₹7,800', category: 'Aari work' },
      { slug: 'floral-threadwork', name: 'Floral Threadwork', image: '/designs/front-scalloped.png', detail: 'Floral motifs · Silk thread · Soft colour', price: 'From ₹5,900', category: 'Embroidery' },
      { slug: 'peacock-motif', name: 'Peacock Motif', image: '/designs/front-designer-neck.png', detail: 'Peacock motif · Beadwork · Statement back', price: 'From ₹6,800', category: 'Aari work' },
      { slug: 'zari-aari', name: 'Zari & Aari', image: '/designs/finish-lining.png', detail: 'Metallic zari · Hand embroidery · Silk', price: 'From ₹6,400', category: 'Zari work' },
      { slug: 'stone-aari', name: 'Stone & Aari', image: '/designs/finish-light-padding.png', detail: 'Stone accents · Fine thread · Evening', price: 'From ₹6,900', category: 'Stone work' },
      { slug: 'temple-motifs', name: 'Traditional Motifs', image: '/designs/back-designer.png', detail: 'Temple motifs · Heritage craft · Back detail', price: 'From ₹7,200', category: 'Traditional motifs' },
      { slug: 'minimal-aari', name: 'Minimal Aari Work', image: '/designs/finish-no-padding.png', detail: 'Fine outline · Minimal handwork · Modern', price: 'From ₹4,900', category: 'Embroidery' },
      { slug: 'heavy-bridal-work', name: 'Heavy Bridal Work', image: '/designs/finish-no-lining.png', detail: 'Full surface work · Bridal · Custom fit', price: 'From ₹9,500', category: 'Bridal work' },
    ],
  },
}

function BrowseHeader() {
  const [open, setOpen] = useState(false)
  return <><div className="announcement">Complimentary shipping on orders over ₹8,000 <span>·</span> Worldwide delivery</div><header className="site-header browse-header"><button className="mobile-menu-button" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={21} /></button><Link className="brand-mark" href="/" aria-label="Blyss home"><span className="brand-symbol">B</span><span>BLYSS</span></Link><nav className={`main-nav ${open ? 'is-open' : ''}` }><div className="mobile-nav-top"><span className="nav-label">Explore</span><button onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>{nav.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label === 'Designs' ? 'Designs' : label}</Link>)}</nav><Link className="header-cta" href="/custom-stitching">Create your blouse <ArrowRight size={15} /></Link></header></>
}

export function DesignGrid({ designs }: { designs: BrowseDesign[] }) {
  return <div className="browse-design-grid">{designs.map(design => <article className="browse-design-card" key={design.slug}><Link href={`/designs/${design.slug}`} className="browse-design-image"><Image src={design.image} alt={design.name} fill sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw" /></Link><div className="browse-design-copy"><p className="eyebrow">{design.category}</p><h3>{design.name}</h3><p>{design.detail}</p><div><span>{design.price}</span><Link href={`/designs/${design.slug}`}>View Design <ArrowRight size={14} /></Link></div></div></article>)}</div>
}

export function BrowsePage({ set }: { set: keyof typeof browseSets }) {
  const data = browseSets[set]
  return <main className="route-shell"><BrowseHeader /><section className="browse-hero"><div className="browse-hero-image"><Image src={data.image} alt="" fill priority sizes="(max-width: 700px) 100vw, 42vw" /></div><div className="browse-hero-copy"><p className="eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p>{data.intro}</p><Link className="underlined-link" href="/custom-stitching">Create your blouse <ArrowRight size={15} /></Link></div></section><section className="route-content browse-content"><div className="browse-toolbar"><div><p className="eyebrow">BROWSE THE EDIT</p><h2>{data.designs.length} considered designs</h2></div><Link className="underlined-link" href="/shop">Shop all pieces <ArrowRight size={15} /></Link></div><DesignGrid designs={data.designs} /></section></main>
}

export function DesignDetail({ design }: { design: BrowseDesign }) {
  return <main className="route-shell"><BrowseHeader /><section className="design-detail"><div className="design-detail-image"><Image src={design.image} alt={design.name} fill priority sizes="(max-width: 700px) 100vw, 54vw" /></div><div className="design-detail-copy"><p className="eyebrow">{design.category}</p><h1>{design.name}</h1><p className="design-detail-description">{design.detail}. Made with considered proportions and finished around your fit.</p><strong className="design-detail-price">{design.price}</strong><div className="design-detail-actions"><Link className="button button-navy" href={`/custom-stitching?frontNeck=${encodeURIComponent(design.name.includes('Deep V') ? 'Deep V' : design.name.includes('Square') ? 'Square Neck' : 'Round Neck')}`}>Customize This Design <ArrowRight size={16} /></Link><Link className="underlined-link" href="/shop">Back to browse <ArrowRight size={15} /></Link></div><div className="design-detail-notes"><span>01 / Choose the detail</span><span>02 / Make it yours</span><span>03 / We stitch with care</span></div></div></section></main>
}
