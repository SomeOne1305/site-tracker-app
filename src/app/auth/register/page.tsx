'use client'

import { ErrorBanner } from '@/components/ui/error-banner'
import { InputField } from '@/components/ui/input-field'
import { Spinner } from '@/components/ui/spinner'
import { authApi } from '@/lib/api'
import { Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/* ── password strength ── */
function PasswordStrength({ password }: { password: string }) {
	if (!password) return null

	const checks = [
		password.length >= 8,
		/[A-Z]/.test(password),
		/[0-9]/.test(password),
		/[^A-Za-z0-9]/.test(password),
	]
	const score = checks.filter(Boolean).length

	const label = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score]
	const color = ['#f43f5e', '#f43f5e', '#f59e0b', '#4f7eff', '#10b981'][score]

	return (
		<div className='flex flex-col gap-1.5' style={{ marginTop: 2 }}>
			<div className='flex gap-1'>
				{[0, 1, 2, 3].map(i => (
					<div
						key={i}
						style={{
							flex: 1,
							height: 3,
							borderRadius: 99,
							background: i < score ? color : '#1a2535',
							transition: 'background 0.2s',
						}}
					/>
				))}
			</div>
			<span style={{ fontSize: 11, color }}>{label}</span>
		</div>
	)
}

export default function RegisterPage() {
	const router = useRouter()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (password.length < 8) {
			setError('Password must be at least 8 characters.')
			return
		}

		setLoading(true)
		try {
			await authApi.register({
				first_name: firstName,
				last_name: lastName,
				email,
				password,
			})
			// pass email to verify page via query param
			router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: 'Registration failed. Please try again.',
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-full' style={{ maxWidth: 400 }}>
			{/* Logo */}
			<Link href='/' className='inline-flex items-center gap-2 mb-10'>
				<svg width='26' height='26' viewBox='0 0 28 28' fill='none'>
					<rect
						x='1'
						y='1'
						width='26'
						height='26'
						rx='7'
						stroke='#4f7eff'
						strokeWidth='1.5'
					/>
					<polyline
						points='6,20 10,13 14,16 18,9 22,12'
						stroke='#4f7eff'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeLinejoin='round'
						fill='none'
					/>
					<circle cx='22' cy='12' r='2' fill='#06b6d4' />
				</svg>
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
					Create your account
				</h1>
				<p style={{ fontSize: 14, color: '#8899b4', marginTop: 4 }}>
					Start tracking your sites in minutes
				</p>
			</div>

			{/* Divider */}
			<div style={{ height: 1, background: '#1a2535', marginBottom: 28 }} />

			{/* Form */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				{/* Name row */}
				<div className='grid grid-cols-2 gap-3'>
					<InputField
						label='First name'
						value={firstName}
						onChange={setFirstName}
						placeholder='Ada'
						icon={<User size={14} />}
					/>
					<InputField
						label='Last name'
						value={lastName}
						onChange={setLastName}
						placeholder='Lovelace'
					/>
				</div>

				<InputField
					label='Email'
					type='email'
					value={email}
					onChange={setEmail}
					placeholder='you@example.com'
					icon={<Mail size={14} />}
				/>

				<div className='flex flex-col gap-1'>
					<InputField
						label='Password'
						type='password'
						value={password}
						onChange={setPassword}
						placeholder='Min. 8 characters'
						icon={<Lock size={14} />}
					/>
					<PasswordStrength password={password} />
				</div>

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
					{loading ? 'Creating account…' : 'Create account'}
				</button>
			</form>

			{/* Terms note */}
			<p
				style={{
					fontSize: 12,
					color: '#3d4f6a',
					textAlign: 'center',
					marginTop: 16,
					lineHeight: 1.6,
				}}
			>
				By creating an account you agree to our{' '}
				<span style={{ color: '#8899b4' }}>Terms of Service</span> and{' '}
				<span style={{ color: '#8899b4' }}>Privacy Policy</span>.
			</p>

			{/* Footer */}
			<p
				style={{
					fontSize: 13,
					color: '#8899b4',
					textAlign: 'center',
					marginTop: 20,
				}}
			>
				Already have an account?{' '}
				<Link
					href='/auth/login'
					className='font-medium'
					style={{
						color: '#4f7eff',
						textDecoration: 'underline',
						textUnderlineOffset: 3,
					}}
				>
					Sign in
				</Link>
			</p>
		</div>
	)
}
