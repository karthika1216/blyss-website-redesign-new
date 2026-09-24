'use client'

import { ArrowRight, Check, Ruler, Upload, X } from 'lucide-react'
import { useState } from 'react'

const sizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46']
type State = { fit: string; size: string; front: string; back: string; sleeves: string; lining: string; padding: string; fabric: string; aari: string; color: string; instructions: string; referenceImage: string }

const patternCards = [
  ['Round Neck', '/designs/front-round-neck.png', 'A timeless neckline with a clean, graceful finish.'], ['U Neck', '/designs/front-u-neck.png', 'Soft curves that frame the collarbone beautifully.'], ['V Neck', '/designs/front-v-neck.png', 'A refined angle for an elegant, lengthened line.'], ['Deep V', '/designs/front-deep-v.png', 'A statement silhouette made for evening dressing.'], ['Square Neck', '/designs/front-square-neck.png', 'Structured and modern with a classic point of view.'], ['Sweetheart Neck', '/designs/front-sweetheart.png', 'A softly sculpted shape with romantic character.'], ['Boat Neck', '/designs/front-boat-neck.png', 'A wide, poised neckline with editorial polish.'], ['High Neck', '/designs/front-high-neck.png', 'Clean coverage and a beautifully tailored finish.'],
]
const backCards = [
  ['U Back', '/designs/back-u.png', 'A graceful open back with an easy curve.'], ['V Back', '/designs/back-v.png', 'A sharp, elegant line for a considered reveal.'], ['Deep V Back', '/designs/back-deep-v.png', 'A confident back detail for special occasions.'], ['Dori Back', '/designs/back-dori.png', 'Fine tie details that bring a handcrafted finish.'], ['Cut-out Back', '/designs/back-cutout.png', 'A precise cut-out with a modern silhouette.'], ['Designer Back', '/designs/back-designer.png', 'An expressive back designed to be remembered.'],
]
const sleeveCards = [
  ['Sleeveless', '/designs/sleeve-sleeveless.png', 'Minimal, clean and beautifully versatile.'], ['Short Sleeve', '/designs/sleeve-short.png', 'A polished everyday proportion with ease.'], ['Elbow Sleeve', '/designs/sleeve-elbow.png', 'A balanced length with a quietly classic feel.'], ['3/4 Sleeve', '/designs/sleeve-three-quarter.png', 'Graceful coverage with room to move.'], ['Puff Sleeve', '/designs/sleeve-puff.png', 'A soft volume that adds a little drama.'], ['Bell Sleeve', '/designs/sleeve-bell.png', 'Fluid movement and a distinctly feminine finish.'],
]
const aariCards = [
  ['Bridal Aari Work', '/designs/finish-heavy-padding.png', 'Rich, intricate detailing for your most treasured blouse.'], ['Floral Aari Work', '/designs/front-scalloped.png', 'Botanical-inspired craft with a delicate rhythm.'], ['Peacock Motif', '/designs/front-designer-neck.png', 'A signature motif with graceful movement and colour.'], ['Zari & Aari', '/designs/finish-lining.png', 'Metallic accents paired with considered handwork.'], ['Stone & Aari', '/designs/finish-light-padding.png', 'Subtle shimmer that catches the light beautifully.'], ['Temple Motifs', '/designs/back-designer.png', 'Heritage-inspired details with modern restraint.'], ['Minimal Aari Work', '/designs/finish-no-padding.png', 'A quiet detail for a refined everyday statement.'], ['Heavy Bridal Work', '/designs/finish-no-lining.png', 'A generous, celebratory finish for the altar and beyond.'],
]
const fabricCards = [
  ['Raw Silk', '', 'Structured, elegant and ideal for classic blouse designs.'], ['Silk', '', 'Fluid lustre with a soft, luxurious drape.'], ['Banarasi', '', 'A woven heritage texture with festive depth.'], ['Velvet', '', 'Plush, rich and made for evening silhouettes.'], ['Satin', '', 'A smooth surface with a polished, modern glow.'], ['Organza', '', 'Light, airy structure for sculptural details.'], ['Cotton', '', 'Breathable comfort with a crisp, beautiful finish.'], ['Brocade', '', 'Decorative texture that brings occasion dressing alive.'], ['Tissue', '', 'A luminous, lightweight layer with subtle body.'], ['Linen', '', 'Natural texture for effortless, considered dressing.'], ['Georgette', '', 'Soft movement and an elegant, fluid fall.'], ['Net', '', 'An airy layer for delicate overlays and sleeves.'],
]
const colourCards = [['Navy Blue', '#102b50'], ['Royal Blue', '#2559a0'], ['Wine', '#642d3e'], ['Maroon', '#691d2b'], ['Emerald Green', '#17624e'], ['Bottle Green', '#17483b'], ['Mustard', '#c39532'], ['Peach', '#e9a18d'], ['Blush Pink', '#d995a1'], ['Lavender', '#a59abb'], ['Black', '#17191d'], ['Ivory', '#eee9dc'], ['Gold', '#c5a15b'], ['Silver', '#9da2a7']]

export default function StepCustomizer({ initial }: { initial?: Partial<State> }) {
  const [design, setDesign] = useState<State>({ fit: initial?.fit ?? 'standard', size: initial?.size ?? '32', front: initial?.front ?? 'Round Neck', back: initial?.back ?? 'U Back', sleeves: initial?.sleeves ?? 'Elbow Sleeve', lining: initial?.lining ?? 'With lining', padding: initial?.padding ?? 'Light padding', fabric: initial?.fabric ?? 'Raw Silk', aari: initial?.aari ?? 'Minimal Aari Work', color: initial?.color ?? 'Navy Blue', instructions: initial?.instructions ?? '', referenceImage: initial?.referenceImage ?? '' })
  const [tab, setTab] = useState('patterns')
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const update = (patch: Partial<State>) => setDesign(value => ({ ...value, ...patch }))
  const checkoutUrl = () => `/checkout?${new URLSearchParams({ fitType: design.fit, standardSize: design.fit === 'standard' ? design.size : '', frontNeck: design.front, backNeck: design.back, sleeves: design.sleeves, lining: design.lining, padding: design.padding, fabricType: design.fabric, referenceImage: design.referenceImage, instructions: design.instructions }).toString()}`
  async function addToBag() {
    setSubmitting(true)
    const configuration = { ...design, referenceImage: design.referenceImage || null }
    try {
      const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: 1, configuration }), signal: AbortSignal.timeout(15000) })
      const result = await response.json()
      if (!response.ok || !result.cartId) throw new Error(result.error || 'Unable to save your design.')
      window.location.href = `/checkout?cartId=${encodeURIComponent(result.cartId)}&${checkoutUrl().split('?')[1]}`
    } catch (error) {
      console.error('Cart persistence failed; continuing to checkout without cartId.', error)
      window.location.href = checkoutUrl()
    }
  }
  const tabs = [['patterns', 'Blouse patterns'], ['back', 'Back designs'], ['sleeves', 'Sleeves'], ['aari', 'Aari work'], ['fabrics', 'Fabrics & materials'], ['colours', 'Colours']]
  const cards = tab === 'patterns' ? patternCards : tab === 'back' ? backCards : tab === 'sleeves' ? sleeveCards : tab === 'aari' ? aariCards : tab === 'fabrics' ? fabricCards : colourCards.map(([name, colour]) => [name, '', 'A considered shade for your signature blouse.', colour])
  const selected = tab === 'patterns' ? design.front : tab === 'back' ? design.back : tab === 'sleeves' ? design.sleeves : tab === 'aari' ? design.aari : tab === 'fabrics' ? design.fabric : design.color
  const choose = (name: string) => { if (tab === 'patterns') update({ front: name === 'Sweetheart Neck' ? 'Sweetheart' : name }); if (tab === 'back') update({ back: name }); if (tab === 'sleeves') update({ sleeves: name }); if (tab === 'aari') update({ aari: name }); if (tab === 'fabrics') update({ fabric: name }); if (tab === 'colours') update({ color: name }) }
  return <section className="route-content blouse-catalogue">
    <div className="catalogue-intro"><div><p className="eyebrow">THE BLYSS EDIT</p><h2>Design your blouse.</h2><p>Choose your blouse style, fabric, colour and handcrafted details.</p></div><div className="catalogue-step-note"><span>01</span><p>Build your signature<br />one detail at a time.</p></div></div>
    <nav className="catalogue-tabs" aria-label="Blouse catalogue categories">{tabs.map(([id, label]) => <button type="button" className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="catalogue-grid">{cards.map(card => <button type="button" className={`catalogue-card ${selected === card[0] || (card[0] === 'Sweetheart Neck' && selected === 'Sweetheart') ? 'selected' : ''}`} key={card[0]} onClick={() => choose(card[0])}><span className={`catalogue-card-image ${tab === 'colours' ? 'colour-swatch' : tab === 'fabrics' ? 'fabric-texture' : ''}`} style={tab === 'colours' ? { backgroundColor: card[3] } : tab === 'fabrics' ? undefined : { backgroundImage: `url(${card[1]})` }} /><span className="catalogue-card-copy"><strong>{card[0]}</strong><small>{card[2]}</small><em>{tab === 'fabrics' ? 'From ₹1,250 / m' : tab === 'aari' ? 'From ₹1,800' : 'View design'}</em></span>{(selected === card[0] || (card[0] === 'Sweetheart Neck' && selected === 'Sweetheart')) && <Check size={16} />}</button>)}</div>
    <div className="catalogue-fit"><div className="catalogue-fit-heading"><div><p className="eyebrow">YOUR FIT</p><h3>Choose your blouse size</h3><p>Standard blouse measurements shown in inches.</p></div><button type="button" className="size-chart-trigger" onClick={() => setSizeChartOpen(true)}><Ruler size={16} /> View Size Chart</button></div><div className="size-picker">{sizes.map(size => <button type="button" key={size} className={design.size === size && design.fit === 'standard' ? 'active' : ''} onClick={() => update({ fit: 'standard', size })}>{size}</button>)}</div><div className="custom-fit-note"><span>Need a custom fit?</span><button type="button" onClick={() => update({ fit: 'custom' })}>Use your own measurements <ArrowRight size={14} /></button>{design.fit === 'custom' && <small>Custom measurements selected.</small>}</div>{design.fit === 'custom' && <div className="catalogue-measurements">{['Bust','Under Bust','Waist','Shoulder','Armhole','Blouse Length','Sleeve Length','Sleeve Round'].map(label => <label key={label}>{label}<input type="number" min="0" placeholder="Inches" /></label>)}</div>}</div>
    <div className="catalogue-footer"><label className="catalogue-upload"><Upload size={17} /><span>{design.referenceImage ? 'Reference image added' : 'Add a reference image'}<small>JPG or PNG · up to 10 MB</small></span><input type="file" accept="image/*" onChange={() => update({ referenceImage: 'Uploaded reference image' })} /></label><div className="catalogue-submit"><button type="button" className="button button-navy" onClick={addToBag} disabled={submitting}>{submitting ? 'Saving your design...' : 'Continue with this design'} {!submitting && <ArrowRight size={16} />}</button></div></div>
    {sizeChartOpen && <div className="size-chart-backdrop" onClick={() => setSizeChartOpen(false)}><div className="size-chart-modal" role="dialog" aria-modal="true" aria-labelledby="size-chart-title" onClick={event => event.stopPropagation()}><button type="button" className="size-chart-close" onClick={() => setSizeChartOpen(false)} aria-label="Close size chart"><X size={18} /></button><p className="eyebrow">THE BLYSS FIT GUIDE</p><h3 id="size-chart-title">Size Chart</h3><p>Measurements are in inches. For the most precise fit, choose custom measurements.</p><table><thead><tr><th>Blouse Size</th><th>Bust Measurement</th><th>Waist Measurement</th></tr></thead><tbody>{sizes.map(size => <tr key={size}><td>{size}</td><td>{size}&quot;</td><td>{Number(size) - 4}&quot;</td></tr>)}</tbody></table><button type="button" className="button button-navy" onClick={() => { setSizeChartOpen(false); update({ fit: 'custom' }) }}>Use your own measurements <ArrowRight size={16} /></button></div></div>}
  </section>
}

export type { State as DesignState }