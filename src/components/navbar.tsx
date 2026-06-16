'use client'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import TrackrLogo from './logo'

export const Navbar = () => {
	const { user } = useAuth()
	return (
		<nav
			className='relative flex items-center justify-between px-6! md:px-10 h-14'
			style={{
				zIndex: 10,
				borderBottom: '1px solid #1a2535',
				background: 'rgba(7,9,15,0.85)',
				backdropFilter: 'blur(14px)',
			}}
		>
			<div className='flex items-center gap-2.5'>
				<TrackrLogo size={24} />
				<span
					className='font-display font-semibold'
					style={{ color: '#e8edf5', fontSize: 15, letterSpacing: '-0.01em' }}
				>
					trackr
				</span>
				<span
					className='font-mono'
					style={{
						fontSize: 9,
						padding: '2px 7px',
						borderRadius: 5,
						background: 'rgba(79,126,255,0.12)',
						color: '#4f7eff',
						border: '1px solid rgba(79,126,255,0.25)',
						letterSpacing: '0.1em',
					}}
				>
					BETA
				</span>
			</div>

			<div className='flex items-center gap-2'>
				{user ? (
					<Link
						href='/dashboard'
						className='font-display font-medium'
						style={{
							fontSize: 14,
							padding: '6px 16px',
							borderRadius: 8,
							color: '#4f7eff',
							border: '1px solid rgba(79,126,255,0.25)',
						}}
					>
						Dashboard
					</Link>
				) : (
					<>
						<Link
							href='/auth/login'
							style={{
								color: '#8899b4',
								fontSize: 14,
								padding: '6px 14px',
								borderRadius: 10,
							}}
							className='font-display transition-colors hover:text-white'
						>
							Sign in
						</Link>
						<Link
							href='/auth/register'
							className='font-display font-medium'
							style={{
								fontSize: 14,
								padding: '6px 16px',
								borderRadius: 10,
								background: '#4f7eff',
								color: '#fff',
								boxShadow: '0 0 20px rgba(79,126,255,0.35)',
							}}
						>
							Get started
						</Link>
					</>
				)}
			</div>
		</nav>
	)
}
