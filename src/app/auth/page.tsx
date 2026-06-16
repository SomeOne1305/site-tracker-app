'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { authApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

type Mode = 'login' | 'register' | 'verify'

function AuthForm() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const { login } = useAuth()

	const [mode, setMode] = useState<Mode>(
		(searchParams.get('mode') as Mode) || 'login',
	)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [pendingEmail, setPendingEmail] = useState('')

	// Register fields
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [code, setCode] = useState('')

	useEffect(() => {
		const m = searchParams.get('mode') as Mode
		if (m) setMode(m)
	}, [searchParams])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await login(email, password)
			router.push('/dashboard')
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await authApi.register({
				first_name: firstName,
				last_name: lastName,
				email,
				password,
			})
			setPendingEmail(email)
			setMode('verify')
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await authApi.verify({
				email: pendingEmail,
				verification_code: Number(code),
			})
			setMode('login')
			setEmail(pendingEmail)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Verification failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-full max-w-sm'>
			{/* Logo */}
			<Link href='/' className='flex items-center gap-2 mb-10'>
				<svg width='24' height='24' viewBox='0 0 28 28' fill='none'>
					<rect
						x='1'
						y='1'
						width='26'
						height='26'
						rx='6'
						stroke='#3b82f6'
						strokeWidth='1.5'
					/>
					<path
						d='M7 21L11 14L15 17L19 10L21 13'
						stroke='#3b82f6'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<circle cx='21' cy='10' r='2' fill='#06b6d4' />
				</svg>
				<span className='font-display text-base font-semibold text-slate-100'>
					trackr
				</span>
			</Link>

			{mode === 'login' && (
				<>
					<h1 className='font-display text-2xl font-semibold mb-2 text-slate-100'>
						Welcome back
					</h1>
					<p className='text-sm mb-8 text-slate-400'>
						Sign in to your dashboard
					</p>
					<form onSubmit={handleLogin} className='flex flex-col gap-4'>
						<FormField
							label='Email'
							type='email'
							value={email}
							onChange={setEmail}
							placeholder='you@example.com'
							required
						/>
						<FormField
							label='Password'
							type='password'
							value={password}
							onChange={setPassword}
							placeholder='••••••••'
							required
						/>
						{error && (
							<Alert
								variant='destructive'
								className='border-red-500/50 bg-red-500/10'
							>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button
							type='submit'
							disabled={loading}
							loading={loading}
							className='w-full mt-2'
						>
							{loading ? 'Signing in' : 'Sign in'}
						</Button>
					</form>
					<p className='text-sm mt-6 text-center text-slate-400'>
						No account?{' '}
						<button
							onClick={() => setMode('register')}
							className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
						>
							Create one
						</button>
					</p>
				</>
			)}

			{mode === 'register' && (
				<>
					<h1 className='font-display text-2xl font-semibold mb-2 text-slate-100'>
						Create account
					</h1>
					<p className='text-sm mb-8 text-slate-400'>
						Start tracking your sites in minutes
					</p>
					<form onSubmit={handleRegister} className='flex flex-col gap-4'>
						<div className='grid grid-cols-2 gap-3'>
							<FormField
								label='First name'
								value={firstName}
								onChange={setFirstName}
								placeholder='Ada'
								required
							/>
							<FormField
								label='Last name'
								value={lastName}
								onChange={setLastName}
								placeholder='Lovelace'
								required
							/>
						</div>
						<FormField
							label='Email'
							type='email'
							value={email}
							onChange={setEmail}
							placeholder='you@example.com'
							required
						/>
						<FormField
							label='Password'
							type='password'
							value={password}
							onChange={setPassword}
							placeholder='Min 8 characters'
							required
						/>
						{error && (
							<Alert
								variant='destructive'
								className='border-red-500/50 bg-red-500/10'
							>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button
							type='submit'
							disabled={loading}
							loading={loading}
							className='w-full mt-2'
						>
							{loading ? 'Creating account' : 'Create account'}
						</Button>
					</form>
					<p className='text-sm mt-6 text-center text-slate-400'>
						Already have an account?{' '}
						<button
							onClick={() => setMode('login')}
							className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
						>
							Sign in
						</button>
					</p>
				</>
			)}

			{mode === 'verify' && (
				<>
					<h1 className='font-display text-2xl font-semibold mb-2 text-slate-100'>
						Check your email
					</h1>
					<p className='text-sm mb-2 text-slate-400'>
						We sent a code to{' '}
						<span className='text-slate-100 font-medium'>{pendingEmail}</span>
					</p>
					<p className='text-sm mb-8 text-slate-400'>
						Enter it below to verify your account.
					</p>
					<form onSubmit={handleVerify} className='flex flex-col gap-4'>
						<FormField
							label='Verification code'
							type='text'
							value={code}
							onChange={setCode}
							placeholder='123456'
							className='font-mono tracking-widest'
							required
						/>
						{error && (
							<Alert
								variant='destructive'
								className='border-red-500/50 bg-red-500/10'
							>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button
							type='submit'
							disabled={loading}
							loading={loading}
							className='w-full mt-2'
						>
							{loading ? 'Verifying' : 'Verify email'}
						</Button>
					</form>
				</>
			)}
		</div>
	)
}

export default function AuthPage() {
	return (
		<div className='min-h-screen flex' style={{ background: 'var(--bg)' }}>
			{/* Left panel — decorative */}
			<div
				className='hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden'
				style={{
					background: 'var(--bg-2)',
					borderRight: '1px solid var(--border)',
				}}
			>
				{/* Decorative SVG lines */}
				<svg
					className='absolute inset-0 w-full h-full opacity-30'
					viewBox='0 0 600 800'
					fill='none'
					preserveAspectRatio='xMidYMid slice'
				>
					<line
						x1='0'
						y1='200'
						x2='600'
						y2='400'
						stroke='#3b82f6'
						strokeWidth='0.5'
					/>
					<line
						x1='0'
						y1='400'
						x2='600'
						y2='200'
						stroke='#06b6d4'
						strokeWidth='0.5'
					/>
					<line
						x1='100'
						y1='0'
						x2='200'
						y2='800'
						stroke='#3b82f6'
						strokeWidth='0.5'
					/>
					<line
						x1='400'
						y1='0'
						x2='300'
						y2='800'
						stroke='#06b6d4'
						strokeWidth='0.5'
					/>
					<circle
						cx='300'
						cy='300'
						r='120'
						stroke='#3b82f6'
						strokeWidth='0.5'
					/>
					<circle
						cx='300'
						cy='300'
						r='200'
						stroke='#3b82f6'
						strokeWidth='0.3'
					/>
					<circle
						cx='300'
						cy='300'
						r='280'
						stroke='#3b82f6'
						strokeWidth='0.2'
					/>
					{[60, 130, 200, 270, 340].map((y, i) => (
						<g key={i}>
							<line
								x1='50'
								y1={y}
								x2='550'
								y2={y}
								stroke='#1e2d45'
								strokeWidth='0.5'
							/>
							<rect
								x='50'
								y={y - 3}
								width={80 + i * 30}
								height='6'
								rx='3'
								fill='#3b82f6'
								opacity='0.4'
							/>
						</g>
					))}
				</svg>

				<div className='relative z-10'>
					<div
						className='font-mono text-xs px-3 py-1 rounded-full inline-flex items-center gap-2 mb-8'
						style={{
							background: 'rgba(59,130,246,0.1)',
							border: '1px solid rgba(59,130,246,0.2)',
							color: 'var(--accent)',
						}}
					>
						<span className='w-1.5 h-1.5 rounded-full bg-current animate-pulse' />
						Live data
					</div>
					<p
						className='font-display text-3xl font-semibold leading-snug'
						style={{ color: 'var(--text)' }}
					>
						Understand your
						<br />
						visitors in real time.
					</p>
				</div>

				<div className='relative z-10 space-y-4'>
					{[
						{ n: '12,841', label: 'Page views today' },
						{ n: '3,209', label: 'Unique visitors' },
						{ n: '94ms', label: 'Avg tracking latency' },
					].map(s => (
						<div key={s.label} className='flex items-center gap-4'>
							<span
								className='font-mono text-xl font-medium'
								style={{ color: 'var(--accent)' }}
							>
								{s.n}
							</span>
							<span className='text-sm' style={{ color: 'var(--text-dim)' }}>
								{s.label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Right panel — form */}
			<div className='flex flex-1 items-center justify-center px-8 py-12'>
				<Suspense>
					<AuthForm />
				</Suspense>
			</div>
		</div>
	)
}
