export function Avatar({ initials }: { initials: string }) {
	return (
		<div
			className='flex items-center justify-center font-display font-bold shrink-0'
			style={{
				width: 30,
				height: 30,
				borderRadius: '50%',
				background: 'linear-gradient(135deg,#4f7eff,#06b6d4)',
				color: '#fff',
				fontSize: 11,
				letterSpacing: '0.02em',
			}}
		>
			{initials}
		</div>
	)
}
