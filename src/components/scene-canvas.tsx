'use client'
import { useEffect, useRef } from 'react'

export default function SceneCanvas() {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')!
		let frame = 0,
			raf: number

		const resize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		resize()
		window.addEventListener('resize', resize)

		const nodes = [
			{ rx: 0.08, ry: 0.18 },
			{ rx: 0.22, ry: 0.72 },
			{ rx: 0.4, ry: 0.35 },
			{ rx: 0.6, ry: 0.65 },
			{ rx: 0.75, ry: 0.22 },
			{ rx: 0.9, ry: 0.58 },
			{ rx: 0.33, ry: 0.85 },
			{ rx: 0.68, ry: 0.12 },
			{ rx: 0.04, ry: 0.52 },
			{ rx: 0.96, ry: 0.38 },
		]

		const edges = [
			[0, 2],
			[2, 4],
			[4, 5],
			[5, 3],
			[3, 1],
			[1, 6],
			[2, 3],
			[4, 9],
			[0, 8],
			[6, 3],
			[7, 4],
			[7, 2],
		]

		const draw = () => {
			const W = canvas.width,
				H = canvas.height
			ctx.clearRect(0, 0, W, H)

			// dot grid
			ctx.fillStyle = 'rgba(26,37,53,0.5)'
			for (let x = 0; x < W; x += 44)
				for (let y = 0; y < H; y += 44) {
					ctx.beginPath()
					ctx.arc(x, y, 0.75, 0, Math.PI * 2)
					ctx.fill()
				}

			// edges + travelling dots
			edges.forEach(([ai, bi], ei) => {
				const a = nodes[ai],
					b = nodes[bi]
				const x1 = a.rx * W,
					y1 = a.ry * H
				const x2 = b.rx * W,
					y2 = b.ry * H

				ctx.strokeStyle = 'rgba(26,37,53,0.95)'
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(x1, y1)
				ctx.lineTo(x2, y2)
				ctx.stroke()

				const t = (frame * 0.004 + ei * 0.19) % 1
				const px = x1 + (x2 - x1) * t
				const py = y1 + (y2 - y1) * t

				const g = ctx.createRadialGradient(px, py, 0, px, py, 10)
				g.addColorStop(0, 'rgba(79,126,255,0.9)')
				g.addColorStop(1, 'rgba(79,126,255,0)')
				ctx.fillStyle = g
				ctx.beginPath()
				ctx.arc(px, py, 10, 0, Math.PI * 2)
				ctx.fill()

				ctx.fillStyle = '#c0d4ff'
				ctx.beginPath()
				ctx.arc(px, py, 1.6, 0, Math.PI * 2)
				ctx.fill()
			})

			// nodes
			nodes.forEach(({ rx, ry }) => {
				const nx = rx * W,
					ny = ry * H
				const pulse = Math.sin(frame * 0.025 + rx * 10) * 0.5 + 0.5

				ctx.strokeStyle = `rgba(79,126,255,${0.1 + pulse * 0.2})`
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.arc(nx, ny, 7 + pulse * 4, 0, Math.PI * 2)
				ctx.stroke()

				ctx.fillStyle = '#07090f'
				ctx.beginPath()
				ctx.arc(nx, ny, 4, 0, Math.PI * 2)
				ctx.fill()

				ctx.fillStyle = `rgba(79,126,255,${0.5 + pulse * 0.5})`
				ctx.beginPath()
				ctx.arc(nx, ny, 2, 0, Math.PI * 2)
				ctx.fill()
			})

			frame++
			raf = requestAnimationFrame(draw)
		}

		draw()
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', resize)
		}
	}, [])

	return (
		<canvas
			ref={ref}
			className='fixed inset-0 pointer-events-none'
			style={{ zIndex: 0 }}
		/>
	)
}
