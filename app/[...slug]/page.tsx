'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Check, ChevronDown, Menu, ShoppingBag, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import StepCustomizer from '@/components/step-customizer'
import { BrowsePage, browseSets, DesignDetail } from '@/components/browse-catalogue'

const nav = [['Shop', '/shop'], ['Custom Stitching', '/custom-stitching'], ['Design Library', '/design-library'], ['Fabrics', '/fabrics'], ['How It Works', '/how-it-works'], ['About', '/about'], ['Journal', '/journal']]
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const measurements = ['Bust', 'Under Bust', 'Waist', 'Shoulder', 'Armhole', 'Blouse Length', 'Sleeve Length', 'Sleeve Round', 'Elbow Round']
const detailOptions = {
  'Front neck': ['Round Neck', 'U Neck', 'Deep U', 'V Neck', 'Deep V', 'Square Neck', 'Sweetheart', 'Boat Neck', 'High Neck', 'Keyhole', 'Scalloped', 'Designer Neck'],
  'Back neck': ['U Back', 'V Back', 'Deep V', 'Square Back', 'Round Back', 'Keyhole', 'Dori Back', 'Tie-up Back', 'Cut-out Back', 'Designer Back'],
  Sleeves: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', '3/4 Sleeve', 'Full Sleeve', 'Puff Sleeve', 'Bell Sleeve', 'Frill Sleeve', 'Petal Sleeve', 'Slit Sleeve', 'Designer Sleeve'],
}
const baseDetails = { 'Front neck': 'Round Neck', 'Back neck': 'U Back', Sleeves: 'Elbow Sleeve', Lining: 'With lining', Padding: 'Light padding' }

const fabrics = [
  { name: 'Silk', image: '/blyss-categories.png', position: '0% 0%' },
  { name: 'Organza', image: '/blyss-categories.png', position: '100% 0%' },
  { name: 'Tissue', image: '/blyss-categories.png', position: '0% 100%' },
  { name: 'Velvet', image: '/blyss-categories.png', position: '100% 100%' },
  { name: 'Chanderi', image: '/blyss-products.png', position: '0% 0%' },
  { name: 'Raw Silk', image: '/blyss-products.png', position: '100% 0%' },
]

const librarySections = [
  { title: 'Front neck', items: ['Round Neck', 'U Neck', 'Deep U', 'V Neck', 'Deep V', 'Square Neck', 'Sweetheart', 'Boat Neck', 'High Neck', 'Keyhole', 'Scalloped', 'Designer Neck'] },
  { title: 'Back neck', items: ['U Back', 'V Back', 'Deep V', 'Square Back', 'Round Back', 'Keyhole', 'Dori Back', 'Tie-up Back', 'Cut-out Back', 'Designer Back'] },
  { title: 'Sleeves', items: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', '3/4 Sleeve', 'Full Sleeve', 'Puff Sleeve', 'Bell Sleeve', 'Frill Sleeve', 'Petal Sleeve', 'Slit Sleeve', 'Designer Sleeve'] },
]

function Header({ open, setOpen, setCart }: { open: boolean; setOpen: (value: boolean) => void; setCart: (value: boolean) => void }) {
  return <><div className="announcement">Complimentary shipping on orders over ₹8,000 <span>·</span> Worldwide delivery</div><header className="site-header"><button className="mobile-menu-button" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={21} /></button><Link className="brand-mark" href="/"><span className="brand-symbol">B</span><span>BLYSS</span></Link><nav className={`main-nav ${open ? 'is-open' : ''}`}><div className="mobile-nav-top"><span className="nav-label">Explore</span><button onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label === 'Design Library' ? 'Designs' : label}</Link>)}<div className="mobile-nav-account"><Link href="/account" onClick={() => setOpen(false)}>Account <span>Login / Register</span></Link><Link href="/my-orders" onClick={() => setOpen(false)}>My Orders</Link><Link href="/cart" onClick={() => setOpen(false)}>Cart</Link></div></nav><div className="header-actions"><Link href="/account" className="account-link">Account</Link><button className="cart-button" aria-label="Open cart" onClick={() => setCart(true)}><ShoppingBag size={18} /><b>1</b></button></div><Link className="header-cta" href="/custom-stitching">Create your blouse <ArrowRight size={15} /></Link></header></>
}

function Hero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) { return <section className="route-hero"><div className="route-hero-inner"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="route-intro">{intro}</p></div><div className="route-index">BLYSS / MADE WITH INTENTION</div></section> }

function VisualOptions({ title, options, selected, onSelect }: { title: string; options: string[]; selected: string; onSelect: (value: string) => void }) {
  const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const imageFor = (index: number) => ({ backgroundImage: `url(/blyss-products.png)`, backgroundPosition: `${(index % 4) * 33.333}% ${Math.floor(index / 4) % 3 * 50}%` })
  const category = title === 'Sleeves' ? 'SLEEVE DESIGN' : title === 'Front neck' ? 'FRONT NECK' : title === 'Back neck' ? 'BACK NECK' : 'FINISHING'
  return <div className="visual-picker"><div className="picker-heading"><h4>{title}</h4><span>{options.length} options</span></div><div className="picker-grid">{options.map((option, index) => <button type="button" className={`detail-card ${selected === option ? 'selected' : ''}`} key={option} onClick={() => onSelect(option)} aria-label={`Select ${option}`}><span className="detail-card-image" style={imageFor(index)} role="img" aria-label={`${option} Blyss blouse reference`} /><span className="detail-card-category">{category}</span><span className="detail-name">{option}</span>{selected === option && <span className="selection-check"><Check size={13} /></span>}</button>)}</div></div>
}

function Customizer() {
  const router = useRouter()
  const [fit, setFit] = useState<'standard' | 'custom'>('standard')
  const [size, setSize] = useState('M')
  const [activeDetail, setActiveDetail] = useState('Front neck')
  const [details, setDetails] = useState(baseDetails)
  const [unit, setUnit] = useState('Inches')
  const [fabric, setFabric] = useState('Blyss Fabric')
  const [reference, setReference] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectDetail = (value: string) => setDetails(current => ({ ...current, [activeDetail]: value }))
  const activeOptions = detailOptions[activeDetail as keyof typeof detailOptions] || ['With lining', 'Without lining']
  const addToCart = () => { const params = new URLSearchParams({ fitType: fit, standardSize: fit === 'standard' ? size : '', frontNeck: details['Front neck'], backNeck: details['Back neck'], sleeves: details.Sleeves, lining: details.Lining, padding: details.Padding, fabricType: fabric, referenceImage: reference ? 'Uploaded reference image' : '' }); router.push(`/checkout?${params.toString()}`) }

  return <section className="route-content customizer"><div className="customizer-grid"><div className="builder-panel"><p className="eyebrow">YOUR DETAILS</p><h2>Build it<br /><em>beautifully.</em></h2><p className="muted-copy">Choose every element of your blouse, then review the complete selection before adding it to your bag.</p>
    <div className="option-group"><div className="section-label"><h3>01 / Fit</h3><Link href="/size-guide" className="guide-link">View size chart <ArrowRight size={14} /></Link></div><div className="choice-row"><button type="button" className={`choice ${fit === 'standard' ? 'active' : ''}`} onClick={() => setFit('standard')}>{fit === 'standard' && <Check size={14} />} Standard size</button><button type="button" className={`choice ${fit === 'custom' ? 'active' : ''}`} onClick={() => setFit('custom')}>{fit === 'custom' && <Check size={14} />} My measurements</button></div>{fit === 'standard' ? <select className="field" value={size} onChange={event => setSize(event.target.value)} aria-label="Select standard size">{sizes.map(value => <option key={value}>{value}</option>)}</select> : <div className="measurement-fields"><div className="unit-toggle">{['Inches', 'CM'].map(value => <button type="button" key={value} className={unit === value ? 'active' : ''} onClick={() => setUnit(value)}>{value}</button>)}</div>{measurements.map(label => <label key={label}>{label}<input type="number" min="0" placeholder="—" aria-label={`${label} in ${unit}`} /></label>)}<button type="button" className="save-measurements" onClick={() => setSaved(true)}>{saved ? <Check size={14} /> : null}{saved ? 'Measurements saved' : 'Save measurements'}</button><Link className="guide-link" href="/measurement-guide">How to measure <ArrowRight size={14} /></Link></div>}</div>
    <div className="option-group"><div className="section-label"><h3>02 / Design details</h3><span className="selection-note">Select an element to customise</span></div><div className="mini-options">{['Front neck', 'Back neck', 'Sleeves', 'Lining', 'Padding'].map((label, index) => <button type="button" className={`mini-option ${activeDetail === label ? 'active' : ''}`} key={label} onClick={() => setActiveDetail(label)}><span>0{index + 1}</span>{label}<strong>{details[label as keyof typeof details]}</strong><ArrowRight size={13} /></button>)}</div><VisualOptions title={activeDetail} options={activeOptions} selected={details[activeDetail as keyof typeof details]} onSelect={selectDetail} /></div>
    <div className="option-group"><div className="section-label"><h3>03 / Fabric</h3></div><div className="fabric-choices"><button type="button" className={fabric === 'Blyss Fabric' ? 'active' : ''} onClick={() => setFabric('Blyss Fabric')}><span className="fabric-swatch silk" /><span><b>Blyss Fabric</b><small>Browse our considered textiles</small></span>{fabric === 'Blyss Fabric' && <Check size={15} />}</button><button type="button" className={fabric === 'My Own Fabric' ? 'active' : ''} onClick={() => setFabric('My Own Fabric')}><span className="fabric-swatch own" /><span><b>My Own Fabric</b><small>Send your fabric to our studio</small></span>{fabric === 'My Own Fabric' && <Check size={15} />}</button></div>{fabric === 'Blyss Fabric' ? <Link className="guide-link" href="/fabrics">Browse all fabrics <ArrowRight size={14} /></Link> : <div className="fabric-note">Post your clean, unstitched fabric to our studio after placing your order. We will share the address and packing guide by email.</div>}</div>
    <div className="option-group"><div className="section-label"><h3>04 / Reference design</h3></div><label className="upload-field"><Upload size={17} /><span>{reference ? 'Reference image added' : 'Upload reference image'}<small>JPG or PNG · up to 10 MB</small></span><input type="file" accept="image/*" onChange={() => setReference(true)} /></label><label className="form-label">Special instructions<textarea placeholder="Tell our makers anything they should know" /></label></div><button type="button" className="button button-navy add-button" onClick={addToCart}>Add to cart · ₹4,800 <ArrowRight size={16} /></button>
  </div><aside className="summary-card"><p className="eyebrow">YOUR PREVIEW</p><div className="summary-image" /><h3>The Ivory Sculpt</h3><p>{fabric} · {fit === 'standard' ? `Size ${size}` : 'Custom fit'}</p><div className="summary-lines">{[['Front neck', details['Front neck']], ['Back neck', details['Back neck']], ['Sleeves', details.Sleeves], ['Finish', `${details.Lining}, ${details.Padding}`], ['Reference', reference ? 'Image attached' : 'Not added']].map(([label, value]) => <div className="summary-line" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="summary-total"><span>Design and stitching</span><strong>₹4,800</strong></div><p className="delivery-note">Estimated delivery<br /><b>14–18 working days</b></p><button type="button" className="button button-navy" onClick={addToCart}>Review your cart <ArrowRight size={16} /></button></aside></div></section>
}

function Footer() { return <footer className="site-footer"><div className="footer-bottom"><span>© 2026 Blyss. Made with intention.</span><div><Link href="/contact">Contact</Link><Link href="/how-it-works">Shipping &amp; care</Link><Link href="/privacy">Privacy</Link></div><span>INR <ChevronDown size={13} /></span></div></footer> }

export default function BlyssRoute() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [path, setPath] = useState('home')
  const currentPath = pathname.replace(/^\//, '') || 'home'
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setPath(pathname.replace(/^\//, '') || 'home')
  }, [pathname])
  const [cart, setCart] = useState(false)
    if (currentPath === 'aari-work') return <BrowsePage set="aari-work" />
    if (currentPath === 'shop/designer-blouses' || currentPath === 'shop/stretchable-blouses' || currentPath === 'shop/ready-designs') return <BrowsePage set={currentPath.split('/')[1] as 'designer-blouses' | 'stretchable-blouses' | 'ready-designs'} />
    if (currentPath.startsWith('designs/')) {
      const design = Object.values(browseSets).flatMap(set => set.designs).find(item => item.slug === currentPath.slice('designs/'.length))
      if (design) return <DesignDetail design={design} />
    }
  return <main className="route-shell"><Header open={open} setOpen={setOpen} setCart={setCart} />{path === 'custom-stitching' ? <><Hero eyebrow="MADE FOR YOU" title="Your vision, our craft." intro="Build your blouse step by step. Choose the shape, fabric, finishing and fit that make it yours." /><StepCustomizer initial={{ front: searchParams.get('frontNeck') || undefined, back: searchParams.get('backNeck') || undefined, sleeves: searchParams.get('sleeves') || undefined, fabric: searchParams.get('fabric') || undefined }} /></> : path === 'fabrics' ? <><Hero eyebrow="THE FABRIC EDIT" title="Material with a point of view." intro="Explore tactile, considered textiles selected for the way they drape, hold and catch the light." /><section className="route-content fabric-grid">{fabrics.map((fabric, index) => <article className="fabric-card" key={fabric.name}><div className="fabric-image" style={{ backgroundImage: `url(${fabric.image})`, backgroundPosition: fabric.position }} /><p className="eyebrow">{index < 5 ? 'AVAILABLE' : 'LIMITED'}</p><h2>{fabric.name}</h2><p>Selected for its texture, drape and quiet character.</p><div className="fabric-meta"><strong>₹{1250 + index * 150} / m</strong><Link href={`/custom-stitching?fabric=${encodeURIComponent(fabric.name)}`}>Select this fabric <ArrowRight size={14} /></Link></div></article>)}</section></> : path === 'design-library' ? <><Hero eyebrow="THE DESIGN LIBRARY" title="Made with intention." intro="Explore the shapes, backs and sleeves that give every Blyss blouse its point of view." /><section className="route-content library-content"><div className="library-tabs" aria-label="Design library categories"><a href="#front-neck">ALL</a>{librarySections.map(section => <a key={section.title} href={`#${section.title.replace(' ', '-')}`}>{section.title.toUpperCase()}</a>)}</div>{librarySections.map(section => <div className="library-section" id={section.title.replace(' ', '-')} key={section.title}><div className="section-label"><h2>{section.title}</h2><span>{section.items.length} designs</span></div><div className="library-grid">{section.items.map(name => <article className="library-card" key={name}><div className={`library-image design-visual design-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} aria-label={`${name} ${section.title} design`} role="img"><span className="design-bodice" /><span className="design-neckline" /><span className="design-stitch" /></div><p className="eyebrow">{section.title}</p><h3>{name}</h3><Link href={`/custom-stitching?${section.title === 'Front neck' ? 'frontNeck' : section.title === 'Back neck' ? 'backNeck' : 'sleeves'}=${encodeURIComponent(name)}`} className="library-select">Use this design <ArrowRight size={13} /></Link></article>)}</div></div>)}</section></> : <><Hero eyebrow="THE BLYSS JOURNAL" title="Made with intention." intro="Discover our signature edits, thoughtful process and the details that make a blouse feel like yours." /><section className="route-content editorial-copy"><p>Every Blyss blouse begins with a point of view: a considered shape, a beautiful textile and the personal details that make it yours.</p><Link className="button button-navy" href="/custom-stitching">Create your blouse <ArrowRight size={16} /></Link></section></>}<Footer />{cart && <div className="drawer-backdrop" onClick={() => setCart(false)}><aside className="cart-drawer" onClick={event => event.stopPropagation()}><div className="drawer-header"><h2>Your bag <span>01</span></h2><button onClick={() => setCart(false)} aria-label="Close cart"><X size={20} /></button></div><div className="drawer-item"><div className="drawer-product-image" /><div><h3>The Ivory Sculpt</h3><p>Custom blouse · Size M</p><strong>₹4,800</strong></div></div><Link className="button button-navy" href="/cart" onClick={() => setCart(false)}>Go to cart <ArrowRight size={16} /></Link></aside></div>}</main>
}

export { Customizer }
export { detailOptions }

