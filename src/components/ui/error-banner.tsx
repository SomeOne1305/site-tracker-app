export function ErrorBanner({ msg }: { msg: string }) {
	return (
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
			{msg}
		</div>
	)
}
