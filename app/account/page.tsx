'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import useSWR from 'swr'
import { FormEvent, useState } from 'react'

const fetcher = (url: string) => fetch(url).then(async response => { if (!response.ok) return null; return response.json() })

export default function AccountPage() {
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [loggedOut, setLoggedOut] = useState(false)
  const { data: customer, mutate } = useSWR(loggedOut ? null : '/api/account', fetcher)

  async function logout() {
    await fetch('/api/auth/customer', { method: 'DELETE' })
    setLoggedOut(true)
    mutate(null, false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries())
    const response = await fetch('/api/auth/customer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, action: registering ? 'register' : 'login' }) })
    const result = await response.json()
    if (!response.ok) return setError(result.error || 'Unable to access your account.')
    window.location.href = '/'
  }

  return (
    <main className="auth-shell">
      <header className="auth-header">
        <Link className="brand-mark" href="/"><span className="brand-symbol">B</span><span>BLYSS</span></Link>
        <Link className="auth-return" href="/">Return to Blyss <ArrowRight size={14} /></Link>
      </header>
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">{registering ? 'WELCOME TO BLYSS' : 'YOUR BLYSS ACCOUNT'}</p>
        <h1 id="auth-title">{registering ? 'Create your account.' : 'Welcome back.'}</h1>
        {customer ? <>
          <p className="auth-intro">Welcome back, {customer.name}. Your saved profile and measurements are connected to your Blyss account.</p>
          <div className="account-profile" aria-label="Saved account details"><p><strong>{customer.email}</strong><br />{customer.phone || 'No phone saved'}</p><p>{customer.country || 'India'}<br />{customer.shipping_address || 'No shipping address saved'}</p><p className="account-measurements">Measurements: {customer.bust ? `${customer.bust} bust` : 'Not saved'}{customer.waist ? ` · ${customer.waist} waist` : ''}</p></div>
          <button className="button button-navy auth-submit" type="button" onClick={logout}>Log out <ArrowRight size={16} /></button>
        </> : <>
        <p className="auth-intro">{registering ? 'Save your measurements, follow your orders and make every blouse yours.' : 'Sign in to continue your blouse, view orders, and save your measurements.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {registering && <label>Full Name<input name="name" type="text" autoComplete="name" required /></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          {registering && <label>Mobile Number<input name="phone" type="tel" autoComplete="tel" required /></label>}
          <label>Password<input name="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} required />{error && <span className="auth-error" role="alert">{error}</span>}</label>
          {registering && <label>Confirm Password<input name="confirmPassword" type="password" autoComplete="new-password" required /></label>}
          <button className="button button-navy auth-submit" type="submit">{registering ? 'Create account' : 'Login'} <ArrowRight size={16} /></button>
        </form>
        {!registering && <button className="auth-google" type="button">Continue with Google</button>}
        {!registering && <Link className="auth-forgot" href="/account?forgot=true">Forgot Password?</Link>}
        <p className="auth-switch">{registering ? 'Already have an account?' : 'New to Blyss?'} <button type="button" onClick={() => { setRegistering(value => !value); setError('') }}>{registering ? 'Sign in' : 'Create an Account'}</button></p>
        </>}
      </section>
    </main>
  )
}
