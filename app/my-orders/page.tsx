'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

function OrdersPage(){
  const params=useSearchParams(); const [orders,setOrders]=useState<any[]>([]); const [email,setEmail]=useState(''); const [loading,setLoading]=useState(false)
  async function load(){if(!email)return;setLoading(true);const r=await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);const d=await r.json();if(r.ok)setOrders(d);setLoading(false)}
  useEffect(()=>{const value=params.get('email');if(value){setEmail(value);void fetch(`/api/my-orders?email=${encodeURIComponent(value)}`).then(r=>r.json()).then(d=>setOrders(Array.isArray(d)?d:[]))}},[params])
  return <main className="route-shell"><section className="route-content orders-page"><p className="eyebrow">BLYSS ACCOUNT</p><h1>My orders.</h1><p className="muted-copy">Enter the email used at checkout to retrieve your MySQL-backed order history.</p><div className="orders-lookup"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"/><button className="button button-navy" onClick={load}>{loading?'Loading…':'View orders'} <ArrowRight size={16}/></button></div><div className="customer-orders">{orders.length===0?<p className="muted-copy">No orders found yet.</p>:orders.map(order=><article className="customer-order" key={order.order_number}><div><small>{new Date(order.created_at).toLocaleDateString()}</small><h3>{order.order_number}</h3><p>{order.front_neck} · {order.back_neck} · {order.sleeve}</p></div><div><strong>₹{order.total_amount}</strong><span>{order.payment_status}</span><span>{order.order_status}</span></div><a className="button button-outline" href={`/my-orders?email=${encodeURIComponent(email)}&orderId=${order.order_number}`}>View Order</a></article>)}</div></section></main>
}
export default function MyOrders(){return <Suspense fallback={<main className="route-shell"><section className="route-content"><h1>Loading orders.</h1></section></main>}><OrdersPage/></Suspense>}
