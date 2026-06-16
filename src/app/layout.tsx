import { AuthProvider } from '@/lib/auth-context'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

export const metadata = {
	title: 'Trackr',
	description: 'A privacy-first analytics tool for developers.',
}

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body
				className={`${inter.className} ${spaceGrotesk.className} ${jetBrainsMono.className}`}
			>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	)
}
