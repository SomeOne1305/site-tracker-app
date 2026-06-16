import { AuthProvider } from '@/lib/auth-context'
import { ReactNode } from 'react'
function LeftPanel() {
	return (
		<div className='relative hidden min-h-screen w-[42%] flex-col justify-between border-r border-border bg-[#07090f] p-12 lg:flex overflow-hidden'>
			{/* ── HIGH-END AMBIENT GPU HARDWARE-ACCELERATED ANIMATIONS ── */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @keyframes networkPulse {
          0%, 100% { opacity: 0.25; stroke-width: 0.6px; }
          50% { opacity: 0.65; stroke-width: 1.2px; text-shadow: 0 0 10px #4f7eff; }
        }
        @keyframes orbitalRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes lightStream {
          0% { stroke-dashoffset: 1200; opacity: 0; }
          10% { opacity: 1; }
          70% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes pulseHalo {
          0% { r: 4px; opacity: 1; stroke-width: 1px; }
          100% { r: 18px; opacity: 0; stroke-width: 0.5px; }
        }
        @keyframes floatMesh {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        .anim-mesh { animation: floatMesh 12s ease-in-out infinite; }
        .anim-edge { stroke-dasharray: 150 350; animation: lightStream 8s linear infinite; }
        .anim-grid-line { animation: networkPulse 6s ease-in-out infinite; }
        .anim-orbit { animation: orbitalRotate 40s linear infinite; }
        .anim-halo { animation: pulseHalo 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      `,
				}}
			/>

			{/* ── GRAPHIC BACKGROUND LAYER ── */}
			<div className='absolute inset-0 z-0 pointer-events-none'>
				{/* Subtle high-end radial light drop */}
				<div className='absolute top-1/4 left-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]' />
				<div className='absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-2/5 blur-[120px]' />

				{/* Clean SVG Matrix */}
				<svg
					className='absolute inset-0 h-full w-full anim-mesh'
					viewBox='0 0 500 800'
					fill='none'
					preserveAspectRatio='xMidYMid slice'
				>
					{/* Defined glow filters to prevent vector clipping */}
					<defs>
						<linearGradient id='streamGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
							<stop offset='0%' stopColor='#4f7eff' stopOpacity='0' />
							<stop offset='50%' stopColor='#06b6d4' stopOpacity='1' />
							<stop offset='100%' stopColor='#4f7eff' stopOpacity='0' />
						</linearGradient>
					</defs>

					{/* Concentric Planetary Coordinates (Glow Systems) */}
					<g className='anim-orbit' style={{ transformOrigin: '260px 420px' }}>
						{[100, 180, 280, 390].map((r, i) => (
							<circle
								key={i}
								cx='260'
								cy='420'
								r={r}
								stroke='currentColor'
								className='text-border-hi/40'
								strokeWidth='0.7'
								strokeDasharray={i % 2 === 0 ? '4 8' : '40 12'}
							/>
						))}
						{/* Tiny satellite data points rotating on rings */}
						<circle
							cx='260'
							cy='240'
							r='2'
							className='fill-accent-2/60 shadow-lg'
						/>
						<circle cx='150' cy='500' r='1.5' className='fill-accent/60' />
					</g>

					{/* Structural Network Mesh Backplane */}
					<g className='text-border/60'>
						<line
							x1='60'
							y1='180'
							x2='200'
							y2='280'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '0.5s' }}
						/>
						<line
							x1='200'
							y1='280'
							x2='110'
							y2='460'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '1.2s' }}
						/>
						<line
							x1='200'
							y1='280'
							x2='340'
							y2='220'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '2s' }}
						/>
						<line
							x1='340'
							y1='220'
							x2='410'
							y2='410'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '0.2s' }}
						/>
						<line
							x1='110'
							y1='460'
							x2='290'
							y2='520'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '2.5s' }}
						/>
						<line
							x1='410'
							y1='410'
							x2='290'
							y2='520'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '1.7s' }}
						/>
						<line
							x1='290'
							y1='520'
							x2='380'
							y2='680'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '0.9s' }}
						/>
						<line
							x1='110'
							y1='460'
							x2='140'
							y2='690'
							stroke='currentColor'
							className='anim-grid-line'
							style={{ animationDelay: '3.1s' }}
						/>
					</g>

					{/* Dynamic Light Streams travelling along the lines */}
					<line
						x1='60'
						y1='180'
						x2='200'
						y2='280'
						stroke='url(#streamGrad)'
						strokeWidth='1.5'
						className='anim-edge'
						style={{ animationDuration: '6s', animationDelay: '1s' }}
					/>
					<line
						x1='340'
						y1='220'
						x2='410'
						y2='410'
						stroke='url(#streamGrad)'
						strokeWidth='1.5'
						className='anim-edge'
						style={{ animationDuration: '7s', animationDelay: '3s' }}
					/>
					<line
						x1='110'
						y1='460'
						x2='290'
						y2='520'
						stroke='url(#streamGrad)'
						strokeWidth='1.5'
						className='anim-edge'
						style={{ animationDuration: '5s', animationDelay: '0s' }}
					/>
					<line
						x1='410'
						y1='410'
						x2='290'
						y2='520'
						stroke='url(#streamGrad)'
						strokeWidth='1.5'
						className='anim-edge'
						style={{ animationDuration: '8s', animationDelay: '4s' }}
					/>

					{/* Interactive Core Cluster Nodes */}
					{[
						{ cx: 60, cy: 180, delay: '0s' },
						{ cx: 200, cy: 280, delay: '0.7s' },
						{ cx: 340, cy: 220, delay: '1.4s' },
						{ cx: 110, cy: 460, delay: '2.1s' },
						{ cx: 410, cy: 410, delay: '0.4s' },
						{ cx: 290, cy: 520, delay: '1.8s' },
						{ cx: 380, cy: 680, delay: '2.8s' },
						{ cx: 140, cy: 690, delay: '1.1s' },
					].map((node, idx) => (
						<g key={idx}>
							{/* Radar Pulsing Halo Rings */}
							<circle
								cx={node.cx}
								cy={node.cy}
								r='6'
								stroke='#4f7eff'
								className='anim-halo'
								fill='none'
								style={{ animationDelay: node.delay }}
							/>
							{/* Sharp Center Core */}
							<circle
								cx={node.cx}
								cy={node.cy}
								r='3'
								fill='#07090f'
								stroke='#4f7eff'
								strokeWidth='1.5'
							/>
							<circle cx={node.cx} cy={node.cy} r='1' fill='#e8edf5' />
						</g>
					))}
				</svg>
			</div>

			{/* ── TOP SECTION: LOGO + HERO ── */}
			<div className='relative z-10'>
				<div className='mb-14 flex items-center gap-2.5'>
					<svg
						width='26'
						height='26'
						viewBox='0 0 28 28'
						fill='none'
						className='text-accent drop-shadow-[0_0_8px_rgba(79,126,255,0.5)]'
					>
						<rect
							x='1'
							y='1'
							width='26'
							height='26'
							rx='7'
							stroke='currentColor'
							strokeWidth='1.5'
						/>
						<polyline
							points='6,20 10,13 14,16 18,9 22,12'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
							fill='none'
						/>
						<circle cx='22' cy='12' r='2' className='fill-accent-2' />
					</svg>
					<span className='font-display text-base font-semibold tracking-tight text-text'>
						trackr
					</span>
				</div>

				<div className='mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3.5 py-1 font-mono text-[10px] tracking-wide text-accent backdrop-blur-sm'>
					<span className='h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_#4f7eff]' />
					NETWORK INGEST ACTIVE
				</div>

				<h2 className='font-display text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl'>
					Understand your
					<br />
					visitors in real time.
				</h2>
				<p className='mt-4 max-w-xs text-sm leading-relaxed text-text-sub'>
					Lightweight, privacy-first analytics. One script tag, instant insights
					without database overhead.
				</p>
			</div>

			{/* ── BOTTOM SECTION: PREMIUM METRIC STACK ── */}
			<div className='relative z-10 flex flex-col gap-4'>
				{[
					{
						icon: '📊',
						n: '12,841',
						label: 'Page views today',
						gradient: 'from-accent/10 to-accent/2',
						borderClass: 'border-accent/10',
						glowClass: 'text-accent',
					},
					{
						icon: '👥',
						n: '3,209',
						label: 'Unique visitors',
						gradient: 'from-accent-2/10 to-accent-2/2',
						borderClass: 'border-accent-2/10',
						glowClass: 'text-accent-2',
					},
					{
						icon: '⚡',
						n: '< 1s',
						label: 'Avg tracking latency',
						gradient: 'from-success/10 to-success/2',
						borderClass: 'border-success/10',
						glowClass: 'text-success',
					},
				].map(s => (
					<div
						key={s.label}
						className={`flex items-center justify-between rounded-xl border border-border bg-gradient-to-r ${s.gradient} p-4 backdrop-blur-md transition-all duration-300 hover:border-border-hi`}
					>
						<div className='flex items-center gap-4'>
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-[#07090f]/60 text-base shadow-inner ${s.borderClass}`}
							>
								{s.icon}
							</div>
							<div className='flex flex-col'>
								<span className='text-xs font-medium text-text-sub'>
									{s.label}
								</span>
								<span
									className={`font-mono text-xl font-semibold tracking-tight ${s.glowClass}`}
								>
									{s.n}
								</span>
							</div>
						</div>

						{/* Tiny live activity wave icon on the right side of the card */}
						<div className='flex items-end gap-0.5 h-4 opacity-40'>
							<span
								className='w-0.5 bg-current animate-[dataGrow_2s_infinite] h-2 text-text-muted'
								style={{ animationDelay: '0.1s' }}
							/>
							<span
								className='w-0.5 bg-current animate-[dataGrow_1.5s_infinite] h-4 text-text-muted'
								style={{ animationDelay: '0.4s' }}
							/>
							<span
								className='w-0.5 bg-current animate-[dataGrow_1.8s_infinite] h-3 text-text-muted'
								style={{ animationDelay: '0.2s' }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className='min-h-screen flex' style={{ background: '#07090f' }}>
			<LeftPanel />
			{/* right slot */}
			<AuthProvider>
				<div className='flex flex-1 items-center justify-center px-8 py-12'>
					{children}
				</div>
			</AuthProvider>
		</div>
	)
}
