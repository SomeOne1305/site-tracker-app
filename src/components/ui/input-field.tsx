import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function InputField({
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	icon,
	hint,
}: {
	label: string
	type?: string
	value: string
	onChange: (v: string) => void
	placeholder?: string
	icon?: React.ReactNode
	hint?: string
}) {
	const [focused, setFocused] = useState(false)
	const [show, setShow] = useState(false)
	const isPassword = type === 'password'

	return (
		<div className='flex flex-col gap-1.5'>
			<label style={{ fontSize: 12, fontWeight: 500, color: '#8899b4' }}>
				{label}
			</label>
			<div className='relative'>
				{icon && (
					<span
						className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors'
						style={{ color: focused ? '#4f7eff' : '#3d4f6a' }}
					>
						{icon}
					</span>
				)}
				<input
					type={isPassword && show ? 'text' : type}
					value={value}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
					required
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					style={{
						width: '100%',
						background: '#111827',
						border: `1px solid ${focused ? '#4f7eff' : '#1a2535'}`,
						borderRadius: 10,
						color: '#e8edf5',
						fontSize: 14,
						padding: `10px ${isPassword ? '40px' : '12px'} 10px ${icon ? '36px' : '12px'}`,
						outline: 'none',
						boxShadow: focused ? '0 0 0 3px rgba(79,126,255,0.1)' : 'none',
						transition: 'border-color 0.15s, box-shadow 0.15s',
					}}
				/>
				{isPassword && (
					<button
						type='button'
						onClick={() => setShow(s => !s)}
						className='absolute right-3 top-1/2 -translate-y-1/2 transition-colors'
						style={{ color: '#3d4f6a' }}
						onMouseEnter={e => (e.currentTarget.style.color = '#8899b4')}
						onMouseLeave={e => (e.currentTarget.style.color = '#3d4f6a')}
					>
						{show ? <EyeOff size={15} /> : <Eye size={15} />}
					</button>
				)}
			</div>
			{hint && <p style={{ fontSize: 11, color: '#3d4f6a' }}>{hint}</p>}
		</div>
	)
}
