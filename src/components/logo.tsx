export default function TrackrLogo({ size = 26 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox='0 0 28 28' fill='none'>
			<rect
				x='1'
				y='1'
				width='26'
				height='26'
				rx='7'
				stroke='#4f7eff'
				strokeWidth='1.5'
			/>
			<polyline
				points='6,20 10,13 14,16 18,9 22,12'
				stroke='#4f7eff'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				fill='none'
			/>
			<circle cx='22' cy='12' r='2' fill='#06b6d4' />
		</svg>
	)
}
