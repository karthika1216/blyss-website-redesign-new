'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function AdminOrderDetail() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { data, error } = useSWR(orderNumber ? `/api/orders/detail?orderNumber=${encodeURIComponent(orderNumber)}` : null, fetcher)
  if (error || data?.error) return <section className="admin-content"><Link href="/admin/orders">Back to orders</Link><h1>Order unavailable</h1><p className="form-error">This order could not be loaded.</p></section>
  if (!data) return <section className="admin-content"><p className="eyebrow">ORDER DETAIL</p><h1>Loading order…</h1></section>
  const order = data.order
  return <section className="admin-content"><Link href="/admin/orders">← Back to orders</Link><div className="admin-page-heading"><div><p className="eyebrow">ORDER DETAIL</p><h1>{order.order_number}</h1><p className="admin-muted">Placed {new Date(order.created_at).toLocaleString('en-IN')}</p></div><span className="order-status-chip">{order.order_status}</span></div><div className="admin-detail-grid"><section className="admin-panel"><h2>Customer</h2><p><strong>{order.customer_name}</strong><br />{order.email}<br />{order.phone || 'No phone provided'}<br />{order.country || 'India'}</p><p>{order.shipping_address || 'No shipping address provided'}</p></section><section className="admin-panel"><h2>Payment</h2><p><strong>₹{Number(order.total_amount || 0).toLocaleString('en-IN')}</strong><br />Payment: {order.payment_status}<br />Order: {order.order_status}</p></section><section className="admin-panel"><h2>Customization</h2><div className="admin-design-summary">{[['Front Neck',order.front_neck],['Back Neck',order.back_neck],['Sleeves',order.sleeve],['Fabric',order.fabric_name],['Size',order.standard_size],['Lining',order.lining],['Padding',order.padding]].map(([label,value]) => <p key={String(label)}><small>{label}</small><strong>{value || '—'}</strong></p>)}</div></section><section className="admin-panel"><h2>Measurements</h2><pre className="admin-measurements">{typeof order.measurements === 'string' ? order.measurements : JSON.stringify(order.measurements || {}, null, 2)}</pre></section></div></section>
}
