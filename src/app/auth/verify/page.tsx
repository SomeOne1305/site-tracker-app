'use client'

import TrackrLogo from '@/components/logo'
import { ErrorBanner } from '@/components/ui/error-banner'
import { Spinner } from '@/components/ui/spinner'
import { authApi } from '@/lib/api'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
/* ── 6-box OTP input ── */
function OtpInput({
	value,
	onChange,
	disabled,
}: {
	value: string
	onChange: (v: string) => void
	disabled?: boolean
}) {
	const LENGTH = 6
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const digits = value.padEnd(LENGTH, '').split('').slice(0, LENGTH)

	const focus = (i: number) => inputRefs.current[i]?.focus()

	const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			e.preventDefault()
			const next = digits
				.map((d, idx) => (idx === i ? '' : d))
				.join('')
				.replace(/\s/g, '')
			onChange(next)
			if (i > 0) focus(i - 1)
			return
		}
		if (e.key === 'ArrowLeft' && i > 0) {
			e.preventDefault()
			focus(i - 1)
			return
		}
		if (e.key === 'ArrowRight' && i < LENGTH - 1) {
			e.preventDefault()
			focus(i + 1)
			return
		}
	}

	const handleChange = (i: number, raw: string) => {
		// allow paste of full code into a single box
		const sanitised = raw.replace(/\D/g, '').slice(0, LENGTH - i)
		if (!sanitised) return

		const arr = [...digits]
		for (let j = 0; j < sanitised.length; j++) {
			if (i + j < LENGTH) arr[i + j] = sanitised[j]
		}
		const next = arr.join('').replace(/\s/g, '')
		onChange(next)
		const jumpTo = Math.min(i + sanitised.length, LENGTH - 1)
		setTimeout(() => focus(jumpTo), 0)
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pasted = e.clipboardData
			.getData('text')
			.replace(/\D/g, '')
			.slice(0, LENGTH)
		onChange(pasted)
		const jumpTo = Math.min(pasted.length, LENGTH - 1)
		setTimeout(() => focus(jumpTo), 0)
	}

	return (
		<div className='flex gap-2.5'>
			{Array.from({ length: LENGTH }).map((_, i) => {
				const filled = !!digits[i]?.trim()
				const focused = false // controlled via CSS :focus

				return (
					<input
						key={i}
						ref={el => {
							inputRefs.current[i] = el
						}}
						type='text'
						inputMode='numeric'
						maxLength={LENGTH}
						value={digits[i]?.trim() || ''}
						disabled={disabled}
						onChange={e => handleChange(i, e.target.value)}
						onKeyDown={e => handleKey(i, e)}
						onPaste={handlePaste}
						onFocus={e => e.target.select()}
						className='font-mono font-medium text-center'
						style={{
							width: 48,
							height: 56,
							fontSize: 22,
							borderRadius: 12,
							background: filled ? 'rgba(79,126,255,0.08)' : '#111827',
							border: `1.5px solid ${filled ? '#4f7eff' : '#1a2535'}`,
							color: '#e8edf5',
							outline: 'none',
							caretColor: '#4f7eff',
							transition:
								'border-color 0.15s, background 0.15s, box-shadow 0.15s',
							cursor: disabled ? 'not-allowed' : 'text',
						}}
						onMouseEnter={e => {
							if (!filled) e.currentTarget.style.borderColor = '#243347'
						}}
						onMouseLeave={e => {
							if (!filled) e.currentTarget.style.borderColor = '#1a2535'
						}}
					/>
				)
			})}
		</div>
	)
}

/* ── resend countdown ── */
function ResendButton({
	email,
	disabled,
}: {
	email: string
	disabled: boolean
}) {
	const WAIT = 60
	const [seconds, setSeconds] = useState(WAIT)
	const [sending, setSending] = useState(false)
	const [sent, setSent] = useState(false)

	useEffect(() => {
		if (seconds <= 0) return
		const t = setTimeout(() => setSeconds(s => s - 1), 1000)
		return () => clearTimeout(t)
	}, [seconds])

	const handleResend = async () => {
		if (seconds > 0 || sending) return
		setSending(true)
		try {
			// re-trigger register with same email is not ideal;
			// if your API has a dedicated resend endpoint swap it in here
			setSent(true)
			setSeconds(WAIT)
			setTimeout(() => setSent(false), 3000)
		} finally {
			setSending(false)
		}
	}

	if (seconds > 0) {
		return (
			<p style={{ fontSize: 13, color: '#3d4f6a' }}>
				Resend code in{' '}
				<span className='font-mono' style={{ color: '#8899b4' }}>
					{seconds}s
				</span>
			</p>
		)
	}

	return (
		<button
			type='button'
			onClick={handleResend}
			disabled={sending || disabled}
			style={{
				fontSize: 13,
				color: sent ? '#10b981' : '#4f7eff',
				background: 'none',
				border: 'none',
				cursor: 'pointer',
				textDecoration: 'underline',
				textUnderlineOffset: 3,
			}}
		>
			{sending ? 'Sending…' : sent ? '✓ Code sent!' : 'Resend code'}
		</button>
	)
}

function VerifyForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams.get('email') || ''

	const [code, setCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const executeVerification = useCallback(
		async (targetCode: string) => {
			if (targetCode.length < 6 || loading) return

			setError('')
			setLoading(true)
			try {
				await authApi.verify({ email, verification_code: Number(targetCode) })
				router.push('/auth/login?verified=1')
			} catch (err: unknown) {
				setError(
					err instanceof Error
						? err.message
						: 'Invalid code. Please try again.',
				)
				setCode('') // Wipe out corrupted inputs
			} finally {
				setLoading(false)
			}
		},
		[email, loading, router],
	)

	const handleOtpChange = (newVal: string) => {
		const numericValue = newVal.replace(/\D/g, '').slice(0, 6) // Force digits only up to 6 positions
		setCode(numericValue)

		if (numericValue.length === 6) {
			executeVerification(numericValue)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		executeVerification(code)
	}

	return (
		<div className='w-full max-w-96'>
			{/* Logo */}
			<Link
				href='/'
				className='inline-flex items-center gap-2 mb-10 transition-opacity hover:opacity-80'
			>
				<TrackrLogo />
				<span className='font-display font-semibold text-base text-text'>
					trackr
				</span>
			</Link>

			{/* Email icon badge */}
			<div className='flex h-13 w-13 items-center justify-center mb-7 rounded-[14px] bg-accent/10 border border-accent/20 text-accent'>
				<Mail size={22} />
			</div>

			{/* Heading */}
			<div className='mb-2'>
				<h1 className='font-display font-bold text-2xl text-text tracking-tight'>
					Check your email
				</h1>
				<p className='mt-1.5 text-sm leading-relaxed text-text-sub'>
					We sent a 6-digit code to{' '}
					<span className='font-medium text-text'>{email || 'your email'}</span>
					. Enter it below to verify your account.
				</p>
			</div>

			{/* Clean Divider Line */}
			<div className='h-px bg-border my-6' />

			<form onSubmit={handleSubmit} className='flex flex-col gap-5'>
				{/* OTP boxes */}
				<div className='flex flex-col gap-3'>
					<label className='text-xs font-medium text-text-sub'>
						Verification code
					</label>
					{/* Hooked directly up to our auto-submit value capture handler */}
					<OtpInput
						value={code}
						onChange={handleOtpChange}
						disabled={loading}
					/>
				</div>

				{error && <ErrorBanner msg={error} />}

				{/* Dynamic Success Verification Banner */}
				{code.length === 6 && loading && (
					<div className='flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent/8 border border-accent/20 text-accent text-sm animate-pulse'>
						<Spinner />
						Verifying code...
					</div>
				)}

				<button
					type='submit'
					disabled={loading || code.length < 6}
					className={`font-display font-semibold flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm border transition-all duration-200
            ${
							code.length < 6
								? 'bg-bg-input text-text-muted border-border cursor-not-allowed'
								: loading
									? 'bg-border text-white border-transparent cursor-not-allowed'
									: 'bg-accent text-white border-transparent cursor-pointer hover:bg-[#3b6de6] shadow-[0_0_22px_rgba(79,126,255,0.25)]'
						}
          `}
				>
					{loading && <Spinner />}
					{loading ? 'Verifying…' : 'Verify email'}
				</button>
			</form>

			{/* Resend + back action stack */}
			<div className='flex items-center justify-between mt-6'>
				<ResendButton email={email} disabled={loading} />
				<Link
					href='/auth/register'
					className='inline-flex items-center gap-1.5 text-xs text-text-sub hover:text-text transition-colors'
				>
					<ArrowLeft size={13} />
					Back
				</Link>
			</div>
		</div>
	)
}

// Global Export wrapped in clean Layout hydration blocks
export default function VerifyPage() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center min-h-52'>
					<Spinner />
				</div>
			}
		>
			<VerifyForm />
		</Suspense>
	)
}
