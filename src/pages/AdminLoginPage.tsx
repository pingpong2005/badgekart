import { LockKeyhole, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminLoginPage() {
  const { login, isAdmin, authorizationError, firebaseConfigured } = useAuth()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (isAdmin) return <Navigate to="/admin" replace />
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { await login(email, password) } catch (loginError) { console.error('Admin sign-in failed', loginError); const code = loginError && typeof loginError === 'object' && 'code' in loginError ? String((loginError as { code?: unknown }).code) : ''; setError(code === 'missing-admin' || code === 'invalid-admin-role' ? 'This account is not set up for owner access.' : code === 'firestore-authorization-failed' ? 'We could not verify owner access. Please check your connection and try again.' : 'We could not sign you in. Please check your email and password and try again.') } finally { setBusy(false) } }
  const displayedError = error || authorizationError?.message
  return <main className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="brand-mark"><Sparkles size={20} /></span><strong>Badgekart</strong></div><p className="eyebrow">Owner access</p><h1>Welcome back.</h1><p className="muted">Sign in to manage designs, prices, and incoming orders.</p>{!firebaseConfigured && <div className="notice notice-error">Firebase is not configured. Add your `.env` values to enable owner access.</div>}<form onSubmit={submit}><div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div><div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></div>{displayedError && <p className="form-error" role="alert">{displayedError}</p>}<button className="btn btn-primary btn-block" disabled={busy || !firebaseConfigured} type="submit"><LockKeyhole size={17} />{busy ? 'Signing in…' : 'Sign in securely'}</button></form><a className="text-link" href="/">← Back to storefront</a></div></main>
}
