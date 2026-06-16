export function Loader() {
	return (
		<div
			className='min-h-screen flex items-center justify-center'
			style={{ background: '#07090f' }}
		>
			<div className='flex items-center gap-2'>
				{[0, 1, 2].map(i => (
					<div
						key={i}
						className='rounded-full animate-bounce'
						style={{
							width: 8,
							height: 8,
							background: '#4f7eff',
							animationDelay: `${i * 120}ms`,
						}}
					/>
				))}
			</div>
		</div>
	)
}
