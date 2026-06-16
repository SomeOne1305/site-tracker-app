'use client'

import { authApi, userApi } from '@/lib/api'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

interface User {
	id: string
	first_name: string
	last_name: string
	email: string
}

interface AuthContextType {
	user: User | null
	loading: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// 1. Wrap refresh in useCallback so it's a stable reference dependency
	const refresh = useCallback(async () => {
		try {
			const { valid } = await authApi.check()
			if (valid) {
				const me = await userApi.me()
				setUser(me?.user ?? null)
			} else {
				setUser(null)
			}
		} catch {
			setUser(null)
		}
	}, [])

	// 2. Clear out explicit synchronous cascading updates inside mount sequence
	useEffect(() => {
		let isMounted = true

		const initializeAuth = async () => {
			try {
				await refresh()
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		initializeAuth()

		return () => {
			isMounted = false // Prevents memory leaks if the component unmounts mid-request
		}
	}, [refresh])

	const login = async (email: string, password: string) => {
		await authApi.login({ email, password })
		const me = await userApi.me()
		setUser(me?.user ?? null)
	}

	const logout = () => {
		setUser(null)
		window.location.href = '/auth'
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
