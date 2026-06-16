import { Navbar } from '@/components/navbar'
import SceneCanvas from '@/components/scene-canvas'
import { CodeBlock } from '@/components/ui/code-block'
import Link from 'next/link'

export default function HomePage() {
	return (
		<div
			className='relative min-h-screen overflow-x-hidden'
			style={{ background: '#07090f' }}
		>
			<SceneCanvas />

			{/* radial center glow */}
			<div
				className='fixed inset-0 pointer-events-none'
				style={{
					background:
						'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(79,126,255,0.07) 0%, transparent 70%)',
					zIndex: 1,
				}}
			/>

			{/* ── NAVBAR ── */}
			<Navbar />
			{/* ── HERO ── */}
			<section
				className='relative flex flex-col items-center text-center px-6 pt-24 pb-20 gap-4'
				style={{ zIndex: 10 }}
			>
				{/* eyebrow */}
				<div
					className='inline-flex items-center gap-2 mb-8 mt-4 font-mono'
					style={{
						fontSize: 11,
						padding: '6px 14px',
						borderRadius: 99,
						background: 'rgba(79,126,255,0.08)',
						border: '1px solid rgba(79,126,255,0.2)',
						color: '#4f7eff',
					}}
				>
					<span
						className='w-1.5 h-1.5 rounded-full animate-pulse'
						style={{ background: '#4f7eff' }}
					/>
					Real-time visitor tracking
				</div>

				{/* headline */}
				<h1
					className='font-display font-bold leading-none mb-5'
					style={{
						fontSize: 'clamp(2.8rem, 7vw, 5.4rem)',
						letterSpacing: '-0.035em',
						color: '#e8edf5',
					}}
				>
					Know who visits.
					<br />
					<span style={{ color: '#4f7eff' }}>Act on the data.</span>
				</h1>

				{/* subtext */}
				<p
					className='max-w-md mb-10'
					style={{ fontSize: '1.05rem', color: '#8899b4', lineHeight: 1.75 }}
				>
					Drop a single script tag on your site. Get instant analytics — page
					views, sessions, and top paths. No bloat. No third-party data leaks.
				</p>

				{/* CTAs */}
				<div className='flex flex-wrap items-center justify-center gap-3 mb-16'>
					<Link
						href='/auth/register'
						className='font-display font-semibold'
						style={{
							fontSize: 15,
							padding: '10px 24px',
							borderRadius: 12,
							background: '#4f7eff',
							color: '#fff',
							boxShadow: '0 0 30px rgba(79,126,255,0.38)',
						}}
					>
						Start tracking — it&apos;s free
					</Link>
					<Link
						href='/auth/login'
						className='font-display'
						style={{
							fontSize: 15,
							padding: '10px 24px',
							borderRadius: 12,
							color: '#8899b4',
							border: '1px solid #1a2535',
						}}
					>
						Sign in to dashboard
					</Link>
				</div>

				{/* stats strip */}
				<div
					className='flex flex-wrap justify-center overflow-hidden'
					style={{
						borderRadius: 14,
						border: '1px solid #1a2535',
					}}
				>
					{[
						{ v: '< 2 min', l: 'Setup time' },
						{ v: '~1.2 KB', l: 'Script size' },
						{ v: '< 1s', l: 'Data latency' },
					].map((s, i) => (
						<div
							key={i}
							className='flex flex-col items-center gap-1'
							style={{
								padding: '18px 40px',
								background: '#0d111c',
								borderRight: i < 2 ? '1px solid #1a2535' : undefined,
							}}
						>
							<span
								className='font-mono font-medium'
								style={{ fontSize: 20, color: '#4f7eff' }}
							>
								{s.v}
							</span>
							<span style={{ fontSize: 12, color: '#8899b4' }}>{s.l}</span>
						</div>
					))}
				</div>
			</section>

			{/* ── CODE SNIPPET ── */}
			<section
				className='relative flex justify-center px-6 pt-4! pb-28'
				style={{ zIndex: 10 }}
			>
				<div className='w-full max-w-xl overflow-hidden border border-border rounded-lg bg-bg-card'>
					{/* window chrome */}
					<div className='flex items-center gap-2 px-2! py-3 border border-border rounded-t-lg bg-white/5'>
						<span
							className='w-3 h-3 rounded-full'
							style={{ background: '#f43f5e' }}
						/>
						<span
							className='w-3 h-3 rounded-full'
							style={{ background: '#f59e0b' }}
						/>
						<span
							className='w-3 h-3 rounded-full'
							style={{ background: '#10b981' }}
						/>
						<span
							className='font-mono ml-2'
							style={{ fontSize: 13, color: '#3d4f6f' }}
						>
							index.html
						</span>
					</div>

					{/* code */}
					<CodeBlock code='<!-- paste inside <head> -->' lang='html' />
					<CodeBlock
						code='<script src="https://trackr.io/t/YOUR_PROJECT_ID.js" defer></script>'
						lang='html'
					/>
				</div>
			</section>
		</div>
	)
}
