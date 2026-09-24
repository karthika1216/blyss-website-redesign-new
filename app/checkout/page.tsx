'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Upload, X } from 'lucide-react'

function CheckoutPage() {
  const params = useSearchParams()
  const [status, setStatus] = useState('')
  const [orderId, setOrderId] = useState('')
  const [proof, setProof] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  async function chooseProof(file: File | undefined) {
    if (!file) return
    if (!['image/jpeg','image/png'].includes(file.type)) return setStatus('Please upload a JPG or PNG image.')
    setProof(file); setUploading(true); setStatus('Uploading payment proof…')
    const form = new FormData(); form.append('file', file); form.append('orderId', `pending-${Date.now()}`)
    const response = await fetch('/api/upload', { method:'POST', body:form }); const result = await response.json(); setUploading(false)
    if (!response.ok) return setStatus(result.error || 'Upload failed.')
    setProofUrl(result.url); setStatus('Payment proof uploaded. It will be verified by Blyss.')
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('Creating your order…')
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries())
    const response = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...payload, cartId:params.get('cartId'), fitType:params.get('fitType')||'standard', standardSize:params.get('standardSize')||null, frontNeck:params.get('frontNeck')||'Round Neck', backNeck:params.get('backNeck')||'U Back', sleeves:params.get('sleeves')||'Elbow Sleeve', lining:params.get('lining')||'With lining', padding:params.get('padding')||'Light padding', fabricType:params.get('fabricType')||'Blyss Fabric', fabricName:params.get('fabric')||null, referenceImage:params.get('referenceImage')||null, specialInstructions:params.get('instructions')||null, paymentProofUrl:proofUrl||null, quantity:1, stitchingPrice:4800, fabricPrice:0, shippingFee:0, totalAmount:4800 }) })
    const result = await response.json(); if (!response.ok) return setStatus(result.error || 'Order could not be created.'); setOrderId(result.orderId); setStatus('Order placed. Payment proof is awaiting verification.')
  }
  if (orderId) return <main className="route-shell"><section className="route-content checkout-success"><p className="eyebrow">ORDER CONFIRMATION</p><h1>Thank you for trusting Blyss.</h1><div className="confirmation-card"><p><small>ORDER ID</small><strong>{orderId}</strong></p><p><small>PAYMENT STATUS</small><strong>{proofUrl ? 'Proof Uploaded' : 'Pending'}</strong></p><p><small>ORDER STATUS</small><strong>Order Received</strong></p><p><small>TOTAL</small><strong>₹4,800</strong></p></div><div className="confirmation-actions"><a className="button button-navy" href={`/my-orders?orderId=${orderId}`}>View Order <ArrowRight size={16}/></a><a className="button button-outline" href="/account">My Account</a></div></section></main>
  return <main className="route-shell"><section className="route-content checkout-page"><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete your order.</h1><p className="muted-copy">Your order is securely stored. Payment proof is reviewed manually before confirmation.</p><form onSubmit={submit} className="checkout-form"><label>Full name<input name="customerName" required /></label><label>Email<input name="email" type="email" required /></label><label>Phone<input name="phone" required /></label><label>Country<input name="country" defaultValue="India" required /></label><label>Delivery address<textarea name="shippingAddress" required /></label><label>Payment reference<input name="paymentReference" placeholder="Optional reference" /></label><div className="payment-upload"><p className="eyebrow">PAYMENT REFERENCE</p><strong>Upload payment screenshot</strong><label className="upload-field"><Upload size={17}/><span>{proof ? proof.name : 'Upload Screenshot'}<small>Supported formats: JPG, JPEG, PNG</small></span><input type="file" accept="image/jpeg,image/png" onChange={event=>chooseProof(event.target.files?.[0])}/></label>{proof&&<div className="proof-preview"><img src={proofUrl} alt="Payment proof preview"/><button type="button" onClick={()=>{setProof(null);setProofUrl('');setStatus('Payment proof removed.')}} aria-label="Remove payment proof"><X size={15}/></button></div>}</div><button className="button button-navy" type="submit" disabled={uploading}>Place order · ₹4,800 <ArrowRight size={16}/></button>{status&&<p role="status">{status}</p>}</form></section></main>
}
export default function CheckoutRoute(){return <Suspense fallback={<main className="route-shell"><section className="route-content checkout-page"><h1>Loading checkout.</h1></section></main>}><CheckoutPage/></Suspense>}
