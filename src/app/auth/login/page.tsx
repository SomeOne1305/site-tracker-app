'use client'

import TrackrLogo from '@/components/logo'
import { ErrorBanner } from '@/components/ui/error-banner'
import { InputField } from '@/components/ui/input-field'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth-context'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const { login } = useAuth()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await login(email, password)
			router.push('/dashboard')
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : 'Invalid email or password.',
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-full' style={{ maxWidth: 380 }}>
			{/* Logo */}
			<Link href='/' className='inline-flex items-center gap-2 mb-10'>
				<TrackrLogo />
				<span
					className='font-display font-semibold'
					style={{ fontSize: 16, color: '#e8edf5' }}
				>
					trackr
				</span>
			</Link>

			{/* Heading */}
			<div className='mb-7'>
				<h1
					className='font-display font-bold'
					style={{
						fontSize: '1.65rem',
						color: '#e8edf5',
						letterSpacing: '-0.025em',
					}}
				>
					Welcome back
				</h1>
				<p style={{ fontSize: 14, color: '#8899b4', marginTop: 4 }}>
					Sign in to your dashboard
				</p>
			</div>

			{/* Divider */}
			<div style={{ height: 1, background: '#1a2535', marginBottom: 28 }} />

			{/* Form */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<InputField
					label='Email'
					type='email'
					value={email}
					onChange={setEmail}
					placeholder='you@example.com'
					icon={<Mail size={14} />}
				/>
				<InputField
					label='Password'
					type='password'
					value={password}
					onChange={setPassword}
					placeholder='Your password'
					icon={<Lock size={14} />}
				/>

				{error && <ErrorBanner msg={error} />}

				<button
					type='submit'
					disabled={loading}
					className='font-display font-semibold flex items-center justify-center gap-2'
					style={{
						marginTop: 4,
						width: '100%',
						padding: '11px',
						borderRadius: 12,
						background: loading ? '#1a2535' : '#4f7eff',
						color: '#fff',
						fontSize: 14,
						cursor: loading ? 'not-allowed' : 'pointer',
						border: 'none',
						boxShadow: loading ? 'none' : '0 0 22px rgba(79,126,255,0.3)',
						opacity: loading ? 0.7 : 1,
						transition: 'background 0.15s, opacity 0.15s',
					}}
				>
					{loading && <Spinner />}
					{loading ? 'Signing in…' : 'Sign in'}
				</button>
			</form>

			{/* Footer */}
			<p
				style={{
					fontSize: 13,
					color: '#8899b4',
					textAlign: 'center',
					marginTop: 24,
				}}
			>
				No account?{' '}
				<Link
					href='/auth/register'
					className='font-medium'
					style={{
						color: '#4f7eff',
						textDecoration: 'underline',
						textUnderlineOffset: 3,
					}}
				>
					Create one
				</Link>
			</p>
		</div>
	)
}
