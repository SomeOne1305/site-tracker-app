'use client'

import TrackrLogo from '@/components/logo'
import { Avatar } from '@/components/ui/avatar'
import { Loader } from '@/components/ui/loader'
import { Spinner } from '@/components/ui/spinner'
import { projectApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import {
	Activity,
	BarChart2,
	ExternalLink,
	FolderOpen,
	LogOut,
	Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Project {
	id: string
	name: string
	description: string
	created_at: string
}

/* ── create modal ── */
function CreateModal({
	onClose,
	onCreated,
}: {
	onClose: () => void
	onCreated: (p: Project) => void
}) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [nameFocused, setNameFocused] = useState(false)
	const [descFocused, setDescFocused] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const p = await projectApi.create({ name, description })
			onCreated(p as Project)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to create project.')
		} finally {
			setLoading(false)
		}
	}

	// close on backdrop click
	const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose()
	}

	return (
		<div
			className='fixed inset-0 flex items-center justify-center p-4'
			style={{
				background: 'rgba(0,0,0,0.7)',
				backdropFilter: 'blur(6px)',
				zIndex: 50,
			}}
			onClick={handleBackdrop}
		>
			<div
				className='w-full'
				style={{
					maxWidth: 440,
					background: '#0d111c',
					border: '1px solid #243347',
					borderRadius: 20,
					padding: 28,
				}}
			>
				{/* header */}
				<div className='flex items-center gap-3 mb-1'>
					<div
						className='flex items-center justify-center'
						style={{
							width: 34,
							height: 34,
							borderRadius: 10,
							background: 'rgba(79,126,255,0.1)',
							border: '1px solid rgba(79,126,255,0.2)',
						}}
					>
						<Activity size={16} style={{ color: '#4f7eff' }} />
					</div>
					<h2
						className='font-display font-bold'
						style={{ fontSize: 18, color: '#e8edf5' }}
					>
						New project
					</h2>
				</div>
				<p
					style={{
						fontSize: 13,
						color: '#8899b4',
						marginBottom: 24,
						marginLeft: 46,
					}}
				>
					Add a site to start collecting analytics.
				</p>

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					{/* name */}
					<div className='flex flex-col gap-1.5'>
						<label style={{ fontSize: 12, fontWeight: 500, color: '#8899b4' }}>
							Project name
						</label>
						<input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='My Website'
							required
							minLength={2}
							maxLength={100}
							onFocus={() => setNameFocused(true)}
							onBlur={() => setNameFocused(false)}
							style={{
								background: '#111827',
								border: `1px solid ${nameFocused ? '#4f7eff' : '#1a2535'}`,
								borderRadius: 10,
								color: '#e8edf5',
								fontSize: 14,
								padding: '10px 12px',
								outline: 'none',
								boxShadow: nameFocused
									? '0 0 0 3px rgba(79,126,255,0.1)'
									: 'none',
								transition: 'border-color 0.15s, box-shadow 0.15s',
							}}
						/>
					</div>

					{/* description */}
					<div className='flex flex-col gap-1.5'>
						<label style={{ fontSize: 12, fontWeight: 500, color: '#8899b4' }}>
							Description{' '}
							<span style={{ color: '#3d4f6a', fontWeight: 400 }}>
								(optional)
							</span>
						</label>
						<textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='What site is this tracking?'
							rows={3}
							maxLength={500}
							onFocus={() => setDescFocused(true)}
							onBlur={() => setDescFocused(false)}
							style={{
								background: '#111827',
								border: `1px solid ${descFocused ? '#4f7eff' : '#1a2535'}`,
								borderRadius: 10,
								color: '#e8edf5',
								fontSize: 14,
								padding: '10px 12px',
								outline: 'none',
								resize: 'none',
								boxShadow: descFocused
									? '0 0 0 3px rgba(79,126,255,0.1)'
									: 'none',
								transition: 'border-color 0.15s, box-shadow 0.15s',
								fontFamily: 'inherit',
							}}
						/>
						<p style={{ fontSize: 11, color: '#3d4f6a', textAlign: 'right' }}>
							{description.length}/500
						</p>
					</div>

					{error && (
						<div
							className='flex items-start gap-2'
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								background: 'rgba(244,63,94,0.08)',
								border: '1px solid rgba(244,63,94,0.2)',
								color: '#f43f5e',
								fontSize: 13,
							}}
						>
							<span style={{ marginTop: 1 }}>⚠</span>
							{error}
						</div>
					)}

					{/* actions */}
					<div className='flex gap-3' style={{ marginTop: 4 }}>
						<button
							type='button'
							onClick={onClose}
							style={{
								flex: 1,
								padding: '10px',
								borderRadius: 12,
								background: '#111827',
								border: '1px solid #1a2535',
								color: '#8899b4',
								fontSize: 14,
								cursor: 'pointer',
								fontFamily: 'inherit',
							}}
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='font-display font-semibold flex items-center justify-center gap-2'
							style={{
								flex: 1,
								padding: '10px',
								borderRadius: 12,
								background: loading ? '#1a2535' : '#4f7eff',
								border: 'none',
								color: '#fff',
								fontSize: 14,
								cursor: loading ? 'not-allowed' : 'pointer',
								opacity: loading ? 0.7 : 1,
								boxShadow: loading ? 'none' : '0 0 18px rgba(79,126,255,0.25)',
								transition: 'all 0.15s',
							}}
						>
							{loading && <Spinner />}
							{loading ? 'Creating…' : 'Create project'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

/* ── project card ── */
function ProjectCard({ project }: { project: Project }) {
	const [hovered, setHovered] = useState(false)

	const date = new Date(project.created_at).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

	return (
		<Link
			href={`/dashboard/${project.id}`}
			className='flex flex-col gap-4'
			style={{
				background: '#0d111c',
				border: `1px solid ${hovered ? '#243347' : '#1a2535'}`,
				borderRadius: 18,
				padding: 20,
				textDecoration: 'none',
				transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
				transition: 'border-color 0.15s, transform 0.2s',
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* top row */}
			<div className='flex items-start justify-between'>
				<div
					className='flex items-center justify-center'
					style={{
						width: 36,
						height: 36,
						borderRadius: 10,
						background: 'rgba(79,126,255,0.1)',
						border: '1px solid rgba(79,126,255,0.2)',
					}}
				>
					<Activity size={16} style={{ color: '#4f7eff' }} />
				</div>
				<ExternalLink
					size={13}
					style={{
						color: '#3d4f6a',
						opacity: hovered ? 1 : 0,
						transition: 'opacity 0.15s',
					}}
				/>
			</div>

			{/* name + desc */}
			<div style={{ flex: 1 }}>
				<h3
					className='font-display font-semibold'
					style={{ fontSize: 15, color: '#e8edf5' }}
				>
					{project.name}
				</h3>
				{project.description ? (
					<p
						style={{
							fontSize: 12,
							color: '#8899b4',
							marginTop: 4,
							lineHeight: 1.6,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{project.description}
					</p>
				) : (
					<p
						style={{
							fontSize: 12,
							color: '#3d4f6a',
							marginTop: 4,
							fontStyle: 'italic',
						}}
					>
						No description
					</p>
				)}
			</div>

			{/* footer */}
			<div
				className='flex items-center justify-between'
				style={{ borderTop: '1px solid #1a2535', paddingTop: 14 }}
			>
				<div className='flex items-center gap-1.5'>
					<BarChart2 size={12} style={{ color: '#3d4f6a' }} />
					<span
						className='font-mono'
						style={{ fontSize: 11, color: '#3d4f6a' }}
					>
						{date}
					</span>
				</div>
				<span
					style={{
						fontSize: 11,
						padding: '2px 8px',
						borderRadius: 99,
						background: 'rgba(16,185,129,0.1)',
						border: '1px solid rgba(16,185,129,0.2)',
						color: '#10b981',
					}}
				>
					Active
				</span>
			</div>
		</Link>
	)
}

/* ── skeleton card ── */
function SkeletonCard() {
	return (
		<div
			className='animate-pulse'
			style={{
				background: '#0d111c',
				border: '1px solid #1a2535',
				borderRadius: 18,
				padding: 20,
				height: 172,
			}}
		>
			<div
				style={{
					width: 36,
					height: 36,
					borderRadius: 10,
					background: '#1a2535',
				}}
			/>
			<div
				style={{
					height: 14,
					width: '55%',
					background: '#1a2535',
					borderRadius: 6,
					marginTop: 20,
				}}
			/>
			<div
				style={{
					height: 11,
					width: '80%',
					background: '#111827',
					borderRadius: 6,
					marginTop: 10,
				}}
			/>
			<div
				style={{ height: 1, background: '#1a2535', margin: '18px 0 14px' }}
			/>
			<div
				style={{
					height: 11,
					width: '35%',
					background: '#111827',
					borderRadius: 6,
				}}
			/>
		</div>
	)
}

/* ── empty state ── */
function EmptyState({ onCreate }: { onCreate: () => void }) {
	return (
		<div
			className='flex flex-col items-center text-center'
			style={{
				border: '1px dashed #1a2535',
				borderRadius: 20,
				padding: '72px 32px',
				background: '#0d111c',
			}}
		>
			<div
				className='flex items-center justify-center mb-5'
				style={{
					width: 52,
					height: 52,
					borderRadius: 16,
					background: 'rgba(79,126,255,0.08)',
					border: '1px solid rgba(79,126,255,0.15)',
				}}
			>
				<FolderOpen size={24} style={{ color: '#4f7eff' }} />
			</div>
			<h3
				className='font-display font-semibold'
				style={{ fontSize: 18, color: '#e8edf5', marginBottom: 8 }}
			>
				No projects yet
			</h3>
			<p
				style={{
					fontSize: 14,
					color: '#8899b4',
					lineHeight: 1.7,
					maxWidth: 280,
					marginBottom: 28,
				}}
			>
				Create your first project to get a tracking script and start seeing
				visitor data.
			</p>
			<button
				onClick={onCreate}
				className='font-display font-medium flex items-center gap-2'
				style={{
					padding: '10px 22px',
					borderRadius: 12,
					background: '#4f7eff',
					color: '#fff',
					border: 'none',
					fontSize: 14,
					cursor: 'pointer',
					boxShadow: '0 0 22px rgba(79,126,255,0.25)',
				}}
			>
				<Plus size={15} />
				Create a project
			</button>
		</div>
	)
}

/* ── page ── */
export default function DashboardPage() {
	const { user, loading, logout } = useAuth()
	const router = useRouter()

	const [projects, setProjects] = useState<Project[]>([])
	const [fetching, setFetching] = useState(true)
	const [showCreate, setShowCreate] = useState(false)

	useEffect(() => {
		if (!loading && !user) router.push('/auth/login')
	}, [user, loading, router])
	useEffect(() => {
		if (user) {
			projectApi
				.all()
				.then(projectList => {
					setProjects(projectList.data as Project[])
				})
				.catch(() => {
					// Handle unexpected network drop errors safely
					setProjects([])
				})
				.finally(() => {
					setFetching(false)
				})
		}
	}, [user])

	if (loading || !user) return <Loader />

	const initials = `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase()

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
				<Link href='/' className='flex items-center gap-2.5'>
					<TrackrLogo size={22} />
					<span
						className='font-display font-semibold'
						style={{ fontSize: 15, color: '#e8edf5' }}
					>
						trackr
					</span>
				</Link>

				<div className='flex items-center gap-3'>
					<Avatar initials={initials} />
					<span
						className='hidden sm:block'
						style={{ fontSize: 13, color: '#8899b4' }}
					>
						{user.first_name} {user.last_name}
					</span>
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
							transition: 'border-color 0.15s, color 0.15s',
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
			<div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
				{/* page header */}
				<div
					className='flex items-end justify-between'
					style={{ marginBottom: 32 }}
				>
					<div>
						<h1
							className='font-display font-bold'
							style={{
								fontSize: '1.6rem',
								color: '#e8edf5',
								letterSpacing: '-0.025em',
							}}
						>
							Projects
						</h1>
						<p style={{ fontSize: 13, color: '#8899b4', marginTop: 4 }}>
							{fetching
								? 'Loading…'
								: `${projects.length} project${projects.length !== 1 ? 's' : ''} tracked`}
						</p>
					</div>

					<button
						onClick={() => setShowCreate(true)}
						className='font-display font-medium flex items-center gap-2'
						style={{
							padding: '9px 18px',
							borderRadius: 12,
							background: '#4f7eff',
							color: '#fff',
							border: 'none',
							fontSize: 13,
							cursor: 'pointer',
							boxShadow: '0 0 20px rgba(79,126,255,0.25)',
							transition: 'box-shadow 0.15s',
						}}
						onMouseEnter={e =>
							(e.currentTarget.style.boxShadow =
								'0 0 28px rgba(79,126,255,0.4)')
						}
						onMouseLeave={e =>
							(e.currentTarget.style.boxShadow =
								'0 0 20px rgba(79,126,255,0.25)')
						}
					>
						<Plus size={15} />
						New project
					</button>
				</div>

				{/* content */}
				{fetching ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{[1, 2, 3].map(i => (
							<SkeletonCard key={i} />
						))}
					</div>
				) : projects.length === 0 ? (
					<EmptyState onCreate={() => setShowCreate(true)} />
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{projects !== null &&
							projects.map(p => <ProjectCard key={p.id} project={p} />)}
					</div>
				)}
			</div>

			{/* ── MODAL ── */}
			{showCreate && (
				<CreateModal
					onClose={() => setShowCreate(false)}
					onCreated={p => {
						setProjects(prev => [...prev, p])
						setShowCreate(false)
					}}
				/>
			)}
		</div>
	)
}
