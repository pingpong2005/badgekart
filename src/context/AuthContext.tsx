import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../lib/firebase'

export type AuthorizationStatus = 'idle' | 'checking' | 'authorized' | 'denied'
export type AuthErrorCode = 'authentication-failed' | 'missing-admin' | 'invalid-admin-role' | 'firestore-authorization-failed'

export class AuthFlowError extends Error {
  constructor(public readonly code: AuthErrorCode, message: string) {
    super(message)
    this.name = 'AuthFlowError'
  }
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  authorizationStatus: AuthorizationStatus
  authorizationError: AuthFlowError | null
  firebaseConfigured: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toAuthenticationError(error: unknown) {
  if (error instanceof AuthFlowError) return error
  return new AuthFlowError(
    'authentication-failed',
    'Email/password authentication failed. Check your email and password and try again.',
  )
}

function toFirestoreAuthorizationError(error: unknown) {
  if (error instanceof AuthFlowError) return error
  return new AuthFlowError(
    'firestore-authorization-failed',
    'We could not verify admin authorization in Firestore. Check your connection and try again.',
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatus>('idle')
  const [authorizationError, setAuthorizationError] = useState<AuthFlowError | null>(null)
  const [loading, setLoading] = useState(true)
  const authorizationRequestRef = useRef(0)
  const authorizedUidRef = useRef<string | null>(null)
  const pendingAdminCheckRef = useRef<{ uid: string; promise: Promise<void> } | null>(null)
  const adminLoginInProgressRef = useRef(false)
  const adminLoginUidRef = useRef<string | null>(null)
  const anonymousSignInInProgressRef = useRef(false)

  const checkAdminAuthorization = (nextUser: User): Promise<void> => {
    const pendingCheck = pendingAdminCheckRef.current
    if (pendingCheck?.uid === nextUser.uid) return pendingCheck.promise

    const requestId = ++authorizationRequestRef.current
    authorizedUidRef.current = null
    setAuthorizationStatus('checking')
    setAuthorizationError(null)
    setLoading(true)

    const promise = (async () => {
      try {
        const adminRecord = await getDoc(doc(db, 'admins', nextUser.uid))
        if (!adminRecord.exists()) {
          throw new AuthFlowError(
            'missing-admin',
            'This account is authenticated, but no admins/{uid} document was found for it.',
          )
        }
        if (adminRecord.data()?.role !== 'admin') {
          throw new AuthFlowError(
            'invalid-admin-role',
            'This account is authenticated, but its admins/{uid} document does not contain role: "admin".',
          )
        }

        if (authorizationRequestRef.current !== requestId) return
        authorizedUidRef.current = nextUser.uid
        setIsAdmin(true)
        setAuthorizationStatus('authorized')
        setAuthorizationError(null)
        setLoading(false)
      } catch (error) {
        const flowError = toFirestoreAuthorizationError(error)
        if (authorizationRequestRef.current === requestId) {
          authorizedUidRef.current = null
          setIsAdmin(false)
          setAuthorizationStatus('denied')
          setAuthorizationError(flowError)
          setLoading(false)
        }
        throw flowError
      }
    })()

    pendingAdminCheckRef.current = { uid: nextUser.uid, promise }
    promise.then(
      () => {
        if (pendingAdminCheckRef.current?.promise === promise) pendingAdminCheckRef.current = null
      },
      () => {
        if (pendingAdminCheckRef.current?.promise === promise) pendingAdminCheckRef.current = null
      },
    )
    return promise
  }

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      // An anonymous sign-in started before an admin login may finish later. Do not
      // let that stale result replace the administrator being authenticated.
      if (adminLoginInProgressRef.current && (!nextUser || nextUser.isAnonymous)) return
      if (adminLoginUidRef.current && nextUser?.uid === adminLoginUidRef.current) {
        adminLoginUidRef.current = null
      }
      if (!nextUser) adminLoginUidRef.current = null

      setUser(nextUser)
      if (!nextUser || nextUser.isAnonymous) {
        authorizationRequestRef.current += 1
        authorizedUidRef.current = null
        pendingAdminCheckRef.current = null
        setIsAdmin(false)
        setAuthorizationStatus('idle')
        setAuthorizationError(null)
        setLoading(false)
        return
      }

      if (authorizedUidRef.current === nextUser.uid) {
        setIsAdmin(true)
        setAuthorizationStatus('authorized')
        setAuthorizationError(null)
        setLoading(false)
        return
      }

      void checkAdminAuthorization(nextUser).catch(() => undefined)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const onAdminRoute = location.pathname.startsWith('/admin')
    if (
      !firebaseConfigured ||
      onAdminRoute ||
      user ||
      adminLoginInProgressRef.current ||
      anonymousSignInInProgressRef.current
    ) return

    anonymousSignInInProgressRef.current = true
    void signInAnonymously(auth)
      .catch(() => undefined)
      .finally(() => {
        anonymousSignInInProgressRef.current = false
      })
  }, [location.pathname, user])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAdmin,
    authorizationStatus,
    authorizationError,
    firebaseConfigured,
    login: async (email, password) => {
      if (!firebaseConfigured) {
        const error = new AuthFlowError('authentication-failed', 'Firebase is not configured. Add the Firebase environment values and try again.')
        setAuthorizationError(error)
        setAuthorizationStatus('denied')
        setLoading(false)
        throw error
      }

      adminLoginInProgressRef.current = true
      adminLoginUidRef.current = null
      authorizedUidRef.current = null
      setIsAdmin(false)
      setAuthorizationStatus('checking')
      setAuthorizationError(null)
      setLoading(true)

      try {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
        adminLoginUidRef.current = credential.user.uid
        setUser(credential.user)
        await checkAdminAuthorization(credential.user)
      } catch (error) {
        const flowError = error instanceof AuthFlowError ? error : toAuthenticationError(error)
        if (flowError.code === 'authentication-failed') {
          adminLoginUidRef.current = null
          const currentUser = auth.currentUser
          setUser(currentUser)
          setIsAdmin(false)
          setAuthorizationStatus('denied')
          setLoading(false)
        }
        setAuthorizationError(flowError)
        throw flowError
      } finally {
        adminLoginInProgressRef.current = false
      }
    },
    logout: async () => {
      adminLoginUidRef.current = null
      authorizationRequestRef.current += 1
      pendingAdminCheckRef.current = null
      await signOut(auth)
    },
  }), [authorizationError, authorizationStatus, isAdmin, loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
