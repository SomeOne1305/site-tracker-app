'use client'

import { EndpointsSection } from '@/components/endpoints'
import TrackrLogo from '@/components/logo'
import { CodeBlock } from '@/components/ui/code-block'
import { Loader } from '@/components/ui/loader'
import { dashboardApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { ChartData, Dashboard, Endpoints, TopPage } from '@/types/project'
import {
	ArrowLeft,
	Calendar,
	Check,
	Copy,
	Eye,
	Globe,
	LogOut,
	Minus,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)
	const copy = () => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	return (
		<button
			onClick={copy}
			className='flex items-center gap-1.5 shrink-0'
			style={{
				fontSize: 12,
				padding: '6px 12px',
				borderRadius: 8,
				cursor: 'pointer',
				background: copied ? 'rgba(16,185,129,0.1)' : '#111827',
				border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : '#1a2535'}`,
				color: copied ? '#10b981' : '#8899b4',
				transition: 'all 0.2s',
			}}
		>
			{copied ? <Check size={12} /> : <Copy size={12} />}
			{copied ? 'Copied!' : 'Copy'}
		</button>
	)
}

/* ─────────────────────────────────────────
   Stat card
───────────────────────────────────────── */
function StatCard({
	label,
	value,
	sub,
	icon,
	delta,
	deltaLabel,
}: {
	label: string
	value: string | number
	sub?: string
	icon: React.ReactNode
	delta?: number
	deltaLabel?: string
}) {
	const positive = delta !== undefined && delta > 0
	const negative = delta !== undefined && delta < 0

	return (
		<div
			style={{
				background: '#0d111c',
				border: '1px solid #1a2535',
				borderRadius: 18,
				padding: 22,
				display: 'flex',
				flexDirection: 'column',
				gap: 14,
			}}
		>
			{/* label + icon */}
			<div className='flex items-center justify-between'>
				<span style={{ fontSize: 12, color: '#8899b4', fontWeight: 500 }}>
					{label}
				</span>
				<div
					style={{
						width: 30,
						height: 30,
						borderRadius: 8,
						background: 'rgba(79,126,255,0.08)',
						border: '1px solid rgba(79,126,255,0.15)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#4f7eff',
					}}
				>
					{icon}
				</div>
			</div>

			{/* value */}
			<div>
				<span
					className='font-display font-bold'
					style={{
						fontSize: 28,
						color: '#e8edf5',
						letterSpacing: '-0.03em',
						lineHeight: 1,
					}}
				>
					{value}
				</span>
				{sub && (
					<span style={{ fontSize: 12, color: '#3d4f6a', marginLeft: 6 }}>
						{sub}
					</span>
				)}
			</div>

			{/* delta badge */}
			{delta !== undefined && (
				<div className='flex items-center gap-1.5'>
					<div
						className='flex items-center gap-1'
						style={{
							fontSize: 12,
							padding: '3px 8px',
							borderRadius: 99,
							background: positive
								? 'rgba(16,185,129,0.1)'
								: negative
									? 'rgba(244,63,94,0.1)'
									: 'rgba(255,255,255,0.05)',
							border: `1px solid ${positive ? 'rgba(16,185,129,0.25)' : negative ? 'rgba(244,63,94,0.25)' : '#1a2535'}`,
							color: positive ? '#10b981' : negative ? '#f43f5e' : '#3d4f6a',
						}}
					>
						{positive ? (
							<TrendingUp size={11} />
						) : negative ? (
							<TrendingDown size={11} />
						) : (
							<Minus size={11} />
						)}
						{positive ? '+' : ''}
						{delta}%
					</div>
					{deltaLabel && (
						<span style={{ fontSize: 11, color: '#3d4f6a' }}>{deltaLabel}</span>
					)}
				</div>
			)}
		</div>
	)
}

/* ─────────────────────────────────────────
   Custom chart tooltip
───────────────────────────────────────── */
function ChartTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean
	payload?: { value: number; name: string; color: string }[]
	label?: string
}) {
	if (!active || !payload?.length) return null
	return (
		<div
			style={{
				background: '#0d111c',
				border: '1px solid #243347',
				borderRadius: 10,
				padding: '10px 14px',
				fontFamily: 'JetBrains Mono, monospace',
				fontSize: 12,
			}}
		>
			<p style={{ color: '#8899b4', marginBottom: 6 }}>{label}</p>
			{payload.map(p => (
				<p key={p.name} style={{ color: p.color }}>
					{p.name}:{' '}
					<strong style={{ color: '#e8edf5' }}>
						{p.value.toLocaleString()}
					</strong>
				</p>
			))}
		</div>
	)
}

/* ─────────────────────────────────────────
   Chart section
───────────────────────────────────────── */
function ChartSection({
	daily,
	monthly,
}: {
	daily: ChartData
	monthly: ChartData
}) {
	const [range, setRange] = useState<'7d' | '12m'>('7d')

	const active = range === '7d' ? daily : monthly
	const chartData = active.data_points.map(d => ({
		label: d.label,
		views: d.value,
		growth: d.growth ?? 0,
	}))

	const hasData = chartData.some(d => d.views > 0)

	return (
		<div
			style={{
				background: '#0d111c',
				border: '1px solid #1a2535',
				borderRadius: 18,
				padding: '24px',
			}}
		>
			{/* header */}
			<div
				className='flex items-center justify-between flex-wrap gap-3'
				style={{ marginBottom: 24 }}
			>
				<div>
					<h2
						className='font-display font-semibold'
						style={{ fontSize: 15, color: '#e8edf5' }}
					>
						Page views
					</h2>
					<p style={{ fontSize: 12, color: '#8899b4', marginTop: 3 }}>
						{range === '7d'
							? `Last 7 days · ${active.summary.total_views.toLocaleString()} total`
							: `Last 12 months · ${active.summary.total_views.toLocaleString()} total`}
					</p>
				</div>

				{/* range toggle */}
				<div
					className='flex'
					style={{
						background: '#111827',
						border: '1px solid #1a2535',
						borderRadius: 10,
						padding: 3,
						gap: 2,
					}}
				>
					{(['7d', '12m'] as const).map(r => (
						<button
							key={r}
							onClick={() => setRange(r)}
							className='font-display font-medium'
							style={{
								padding: '5px 14px',
								borderRadius: 8,
								fontSize: 12,
								cursor: 'pointer',
								border: 'none',
								background: range === r ? '#4f7eff' : 'transparent',
								color: range === r ? '#fff' : '#8899b4',
								transition: 'all 0.15s',
							}}
						>
							{r === '7d' ? '7 days' : '12 months'}
						</button>
					))}
				</div>
			</div>

			{/* summary pills */}
			<div className='flex flex-wrap gap-3' style={{ marginBottom: 24 }}>
				{[
					{
						label: 'Total views',
						value: active.summary.total_views.toLocaleString(),
						color: '#4f7eff',
					},
					{
						label: 'Unique visitors',
						value: active.summary.total_unique.toLocaleString(),
						color: '#06b6d4',
					},
					{
						label: 'Peak',
						value: active.summary.highest_day || '—',
						color: '#8899b4',
					},
					{
						label: 'Peak views',
						value: active.summary.highest_day_views.toLocaleString(),
						color: '#10b981',
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							padding: '6px 14px',
							borderRadius: 99,
							background: '#111827',
							border: '1px solid #1a2535',
							display: 'flex',
							alignItems: 'center',
							gap: 7,
						}}
					>
						<span style={{ fontSize: 11, color: '#3d4f6a' }}>{s.label}</span>
						<span
							className='font-mono font-medium'
							style={{ fontSize: 12, color: s.color }}
						>
							{s.value}
						</span>
					</div>
				))}
			</div>

			{/* chart */}
			{!hasData ? (
				<div
					className='flex flex-col items-center justify-center'
					style={{
						height: 200,
						border: '1px dashed #1a2535',
						borderRadius: 12,
						gap: 8,
					}}
				>
					<div style={{ fontSize: 28 }}>📭</div>
					<p style={{ fontSize: 13, color: '#3d4f6a' }}>
						No data for this period
					</p>
				</div>
			) : (
				<ResponsiveContainer width='100%' height={200}>
					<AreaChart
						data={chartData}
						margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
					>
						<defs>
							<linearGradient id='gViews' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#4f7eff' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#4f7eff' stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='#1a2535'
							vertical={false}
						/>
						<XAxis
							dataKey='label'
							tick={{
								fill: '#3d4f6a',
								fontSize: 11,
								fontFamily: 'JetBrains Mono',
							}}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							tick={{
								fill: '#3d4f6a',
								fontSize: 11,
								fontFamily: 'JetBrains Mono',
							}}
							axisLine={false}
							tickLine={false}
							allowDecimals={false}
						/>
						<Tooltip content={<ChartTooltip />} />
						<Area
							type='monotone'
							dataKey='views'
							stroke='#4f7eff'
							strokeWidth={2}
							fill='url(#gViews)'
							name='Views'
							dot={false}
							activeDot={{ r: 4, fill: '#4f7eff', strokeWidth: 0 }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	)
}

/* ─────────────────────────────────────────
   Top pages table
───────────────────────────────────────── */
function TopPages({ pages }: { pages: TopPage[] }) {
	const max = pages[0]?.pageviews || 1

	return (
		<div
			style={{
				background: '#0d111c',
				border: '1px solid #1a2535',
				borderRadius: 18,
				overflow: 'hidden',
			}}
		>
			{/* header */}
			<div
				className='flex items-center gap-2.5'
				style={{
					padding: '18px 22px',
					borderBottom: '1px solid #1a2535',
				}}
			>
				<Globe size={15} style={{ color: '#4f7eff' }} />
				<h2
					className='font-display font-semibold'
					style={{ fontSize: 15, color: '#e8edf5' }}
				>
					Top pages
				</h2>
				<span
					className='font-mono'
					style={{
						marginLeft: 'auto',
						fontSize: 11,
						color: '#3d4f6a',
					}}
				>
					{pages.length} paths
				</span>
			</div>

			{pages.length === 0 ? (
				<div
					className='flex flex-col items-center justify-center'
					style={{ padding: '48px 24px', gap: 8 }}
				>
					<div style={{ fontSize: 28 }}>📭</div>
					<p style={{ fontSize: 13, color: '#3d4f6a' }}>
						No page data yet — install the script to start tracking.
					</p>
				</div>
			) : (
				<div style={{ padding: '8px' }}>
					{/* col headers */}
					<div
						className='grid'
						style={{
							gridTemplateColumns: '1fr 100px 100px',
							padding: '6px 14px 10px',
							gap: 8,
						}}
					>
						{['Path', 'Views', 'Unique'].map(h => (
							<span
								key={h}
								style={{
									fontSize: 11,
									color: '#3d4f6a',
									fontWeight: 500,
									textAlign: h === 'Path' ? 'left' : 'right',
									letterSpacing: '0.05em',
								}}
							>
								{h.toUpperCase()}
							</span>
						))}
					</div>

					{/* rows */}
					{pages.map((page, i) => {
						const pct = (page.pageviews / max) * 100
						return (
							<div
								key={i}
								className='grid relative overflow-hidden'
								style={{
									gridTemplateColumns: '1fr 100px 100px',
									padding: '11px 14px',
									marginTop: 4,
									borderRadius: 10,
									gap: 8,
									cursor: 'default',
								}}
								onMouseEnter={e => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
								}}
								onMouseLeave={e => {
									e.currentTarget.style.background = 'transparent'
								}}
							>
								{/* progress bar */}
								<div
									style={{
										position: 'absolute',
										left: 0,
										top: 0,
										bottom: 0,
										width: `${pct * 0.55}%`,
										background: 'rgba(79,126,255,0.05)',
										borderRadius: 10,
										transition: 'width 0.4s ease',
									}}
								/>

								{/* path */}
								<span
									className='font-mono relative'
									style={{
										fontSize: 13,
										color: '#e8edf5',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{page.path}
								</span>

								{/* views */}
								<span
									className='font-mono relative'
									style={{ fontSize: 13, color: '#4f7eff', textAlign: 'right' }}
								>
									{page.pageviews.toLocaleString()}
								</span>

								{/* unique */}
								<span
									className='font-mono relative'
									style={{ fontSize: 13, color: '#8899b4', textAlign: 'right' }}
								>
									{page.unique_visitors.toLocaleString()}
								</span>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

/* ─────────────────────────────────────────
   Skeleton
───────────────────────────────────────── */
function Skeleton() {
	return (
		<div className='flex flex-col gap-5 animate-pulse'>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map(i => (
					<div
						key={i}
						style={{
							height: 130,
							borderRadius: 18,
							background: '#0d111c',
							border: '1px solid #1a2535',
						}}
					/>
				))}
			</div>
			<div
				style={{
					height: 340,
					borderRadius: 18,
					background: '#0d111c',
					border: '1px solid #1a2535',
				}}
			/>
			<div
				style={{
					height: 260,
					borderRadius: 18,
					background: '#0d111c',
					border: '1px solid #1a2535',
				}}
			/>
		</div>
	)
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function ProjectPage() {
	const { projectId } = useParams<{ projectId: string }>()
	const { user, loading, logout } = useAuth()
	const router = useRouter()

	const [data, setData] = useState<Dashboard | null>(null)
	const [daily, setDaily] = useState<ChartData | null>(null)
	const [monthly, setMonthly] = useState<ChartData | null>(null)
	const [endpoints, setEndpoints] = useState<Endpoints | null>(null)
	const [fetching, setFetching] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!loading && !user) router.push('/auth/login')
	}, [user, loading, router])

	useEffect(() => {
		if (!user || !projectId) return

		Promise.all([
			dashboardApi.summary(projectId),
			dashboardApi.daily(projectId),
			dashboardApi.monthly(projectId),
			dashboardApi.endpoints(projectId),
		])
			.then(([summary, d, m, e]) => {
				setData(summary as unknown as Dashboard)
				setDaily(d as unknown as ChartData)
				setMonthly(m as unknown as ChartData)
				setEndpoints(e as unknown as Endpoints)
			})
			.catch(() => setError('Failed to load dashboard data.'))
			.finally(() => setFetching(false))
	}, [user, projectId])

	if (loading || !user) return <Loader />

	const initials = `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase()
	const scriptTag = `<script src="${process.env.NEXT_PUBLIC_API_URL}/t/${projectId}.js" defer></script>`

	return (
		<div className='min-h-screen' style={{ background: '#07090f' }}>
			{/* ── NAV ── */}
			<nav
				className='sticky top-0 z-30 flex items-center justify-between px-6 md:px-8'
				style={{
					height: 56,
					borderBottom: '1px solid #1a2535',
					background: 'rgba(7,9,15,0.9)',
					backdropFilter: 'blur(14px)',
				}}
			>
				<div className='flex items-center gap-3'>
					<Link
						href='/dashboard'
						className='flex items-center gap-1.5 transition-opacity hover:opacity-70'
					>
						<ArrowLeft size={14} style={{ color: '#8899b4' }} />
						<span style={{ fontSize: 13, color: '#8899b4' }}>Projects</span>
					</Link>
					<span style={{ color: '#1a2535' }}>/</span>
					<div className='flex items-center gap-2'>
						<TrackrLogo size={20} />
						<span
							className='font-display font-semibold'
							style={{ fontSize: 15, color: '#e8edf5' }}
						>
							{data?.project_name ?? 'Project'}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-3'>
					<div
						className='flex items-center justify-center font-display font-bold shrink-0'
						style={{
							width: 30,
							height: 30,
							borderRadius: '50%',
							background: 'linear-gradient(135deg,#4f7eff,#06b6d4)',
							color: '#fff',
							fontSize: 11,
						}}
					>
						{initials}
					</div>
					<button
						onClick={logout}
						className='flex items-center gap-1.5'
						style={{
							fontSize: 12,
							padding: '6px 12px',
							borderRadius: 8,
							color: '#8899b4',
							border: '1px solid #1a2535',
							background: 'none',
							cursor: 'pointer',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.borderColor = '#243347'
							e.currentTarget.style.color = '#e8edf5'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.borderColor = '#1a2535'
							e.currentTarget.style.color = '#8899b4'
						}}
					>
						<LogOut size={12} /> Sign out
					</button>
				</div>
			</nav>

			{/* ── BODY ── */}
			<div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>
				{error ? (
					<div
						style={{
							padding: '12px 16px',
							borderRadius: 12,
							background: 'rgba(244,63,94,0.08)',
							border: '1px solid rgba(244,63,94,0.2)',
							color: '#f43f5e',
							fontSize: 14,
						}}
					>
						{error}
					</div>
				) : fetching ? (
					<Skeleton />
				) : data && daily && monthly ? (
					<div className='flex flex-col gap-5'>
						{/* page title */}
						<div className='flex items-start justify-between flex-wrap gap-4'>
							<div>
								<div
									className='flex items-center gap-2'
									style={{ marginBottom: 4 }}
								>
									<span
										className='font-mono'
										style={{
											fontSize: 10,
											padding: '2px 8px',
											borderRadius: 99,
											background: 'rgba(79,126,255,0.08)',
											border: '1px solid rgba(79,126,255,0.15)',
											color: '#4f7eff',
											letterSpacing: '0.06em',
										}}
									>
										PROJECT
									</span>
									<span
										className='font-mono'
										style={{ fontSize: 11, color: '#3d4f6a' }}
									>
										{projectId}
									</span>
								</div>
								<h1
									className='font-display font-bold'
									style={{
										fontSize: '1.55rem',
										color: '#e8edf5',
										letterSpacing: '-0.025em',
									}}
								>
									{data.project_name}
								</h1>
							</div>
						</div>

						{/* script banner */}
						<div
							className='flex items-center justify-between gap-4 flex-wrap'
							style={{
								background: '#0d111c',
								border: '1px solid #1a2535',
								borderRadius: 14,
								padding: '14px 18px',
							}}
						>
							<div className='flex flex-col gap-1 min-w-0'>
								<span
									style={{ fontSize: 11, color: '#3d4f6a', fontWeight: 500 }}
								>
									Tracking script
								</span>
								<code
									className='font-mono'
									style={{
										fontSize: 12,
										color: '#4f7eff',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									<CodeBlock code={scriptTag} lang='html' />
								</code>
							</div>
							<CopyButton text={scriptTag} />
						</div>

						{/* ── ENDPOINTS ── */}
						<EndpointsSection endpoints={endpoints} />

						{/* ── STAT CARDS ── */}
						<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
							<StatCard
								label='All-time views'
								value={data.total_all_time.toLocaleString()}
								icon={<Eye size={14} />}
							/>
							<StatCard
								label='All-time unique'
								value={data.unique_all_time.toLocaleString()}
								icon={<Users size={14} />}
							/>
							<StatCard
								label={data.current_month_stats.month_name}
								value={data.current_month_stats.pageviews.toLocaleString()}
								sub='views'
								icon={<Calendar size={14} />}
								delta={data.comparison_current_month.percent}
								deltaLabel={`vs ${data.previous_month_stats.month_name}`}
							/>
							<StatCard
								label='This week'
								value={data.current_week_stats.pageviews.toLocaleString()}
								sub='views'
								icon={<TrendingUp size={14} />}
								delta={data.current_week_stats.growth_percent}
								deltaLabel='vs last week'
							/>
						</div>

						{/* month comparison strip */}
						<div className='grid grid-cols-2 gap-4'>
							{[
								{
									label: data.current_month_stats.month_name,
									views: data.current_month_stats.pageviews,
									unique: data.current_month_stats.unique_visitors,
									avg: data.current_month_stats.avg_daily_pageviews,
									badge: 'Current',
									badgeColor: '#4f7eff',
								},
								{
									label: data.previous_month_stats.month_name,
									views: data.previous_month_stats.pageviews,
									unique: data.previous_month_stats.unique_visitors,
									avg: data.previous_month_stats.avg_daily_pageviews,
									badge: 'Previous',
									badgeColor: '#3d4f6a',
								},
							].map(m => (
								<div
									key={m.label}
									style={{
										background: '#0d111c',
										border: '1px solid #1a2535',
										borderRadius: 18,
										padding: 22,
									}}
								>
									<div
										className='flex items-center justify-between'
										style={{ marginBottom: 16 }}
									>
										<span style={{ fontSize: 13, color: '#8899b4' }}>
											{m.label}
										</span>
										<span
											style={{
												fontSize: 11,
												padding: '2px 8px',
												borderRadius: 99,
												background: `${m.badgeColor}18`,
												border: `1px solid ${m.badgeColor}40`,
												color: m.badgeColor,
											}}
										>
											{m.badge}
										</span>
									</div>
									<div className='grid grid-cols-3 gap-3'>
										{[
											{ l: 'Views', v: m.views.toLocaleString() },
											{ l: 'Unique', v: m.unique.toLocaleString() },
											{ l: 'Avg/day', v: m.avg.toFixed(1) },
										].map(s => (
											<div key={s.l}>
												<span
													className='font-display font-bold block'
													style={{
														fontSize: 20,
														color: '#e8edf5',
														letterSpacing: '-0.02em',
													}}
												>
													{s.v}
												</span>
												<span style={{ fontSize: 11, color: '#3d4f6a' }}>
													{s.l}
												</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>

						{/* ── CHART ── */}
						<ChartSection
							daily={data.last_7_days_chart}
							monthly={data.last_12_months_chart}
						/>
						{/* ── TOP PAGES ── */}
						<TopPages pages={data.top_5_pages} />
					</div>
				) : null}
			</div>
		</div>
	)
}
