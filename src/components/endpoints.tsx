import { getShikiLang } from '@/lib/shiki'
import { Endpoints } from '@/types/project'
import { Check, Copy, Eye, EyeOff, Key, Link2, Terminal } from 'lucide-react'
import { useState } from 'react'
import { CodeBlock } from './ui/code-block'

/* ─────────────────────────────────────────
   Secure Endpoint Field Component
───────────────────────────────────────── */
function EndpointField({
	label,
	value,
	isSecret = false,
}: {
	label: string
	value: string
	isSecret?: boolean
}) {
	const [copied, setCopied] = useState(false)
	const [revealed, setRevealed] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(value)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Display value calculation
	const displayedText =
		isSecret && !revealed
			? `••••••••••••••••••••••••••••••••${value.slice(-8)}`
			: value

	return (
		<div className='flex flex-col gap-1.5 sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-bg-input/40 border border-border group transition-all duration-200 hover:border-border-hi'>
			<div className='flex flex-col gap-0.5 min-w-0 flex-1 pr-4'>
				<span className='text-[11px] font-medium text-text-muted tracking-wider uppercase flex items-center gap-1.5'>
					{isSecret ? (
						<Key size={10} className='text-amber-500/70' />
					) : (
						<Link2 size={10} className='text-accent/70' />
					)}
					{label}
				</span>
				<code
					className={`font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 ${isSecret && !revealed ? 'text-amber-500/60 select-none' : `${isSecret ? 'text-success' : 'text-text'}`}`}
				>
					{displayedText}
				</code>
			</div>

			<div className='flex items-center gap-2 mt-2 sm:mt-0 shrink-0'>
				{/* Toggle Mask button for Secrets */}
				{isSecret && (
					<button
						onClick={() => setRevealed(!revealed)}
						className='p-1.5 rounded-lg border border-border bg-bg text-text-sub hover:text-text hover:border-border-hi transition-all cursor-pointer'
						title={revealed ? 'Hide sensitive key' : 'Reveal sensitive key'}
					>
						{revealed ? <EyeOff size={13} /> : <Eye size={13} />}
					</button>
				)}

				{/* Action Copy Button */}
				<button
					onClick={handleCopy}
					className={`flex items-center gap-1.5 font-medium text-xs py-1.5 px-3 rounded-lg border transition-all cursor-pointer
            ${
							copied
								? 'bg-success/10 border-success/25 text-success'
								: 'bg-bg border-border text-text-sub hover:text-text hover:border-border-hi'
						}
          `}
				>
					{copied ? <Check size={12} /> : <Copy size={12} />}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
		</div>
	)
}

type Lang = 'curl' | 'javascript' | 'go' | 'python'

export function ApiUsageBlock({
	apiKey,
	targetUrl,
}: {
	apiKey: string
	targetUrl: string
}) {
	const [activeTab, setActiveTab] = useState<Lang>('curl')
	const [copied, setCopied] = useState(false)

	// Masking the long API key slightly for cleaner code snippet presentations
	const cleanKey = apiKey.length > 24 ? `${apiKey.slice(0, 20)}...` : apiKey

	const snippets: Record<Lang, string> = {
		curl: `curl -X GET "${targetUrl}" \\\n  -H "X-API-Key: ${cleanKey}" \\\n  -H "Accept: application/json"`,

		javascript: `const response = await fetch("${targetUrl}", {\n  method: "GET",\n  headers: {\n    "X-API-Key": "${cleanKey}",\n    "Accept": "application/json"\n  }\n});\nconst data = await response.json();`,

		go: `req, _ := http.NewRequest("GET", "${targetUrl}", nil)\nreq.Header.Set("X-API-Key", "${cleanKey}")\nreq.Header.Set("Accept", "application/json")\n\nresp, err := http.DefaultClient.Do(req)`,

		python: `import requests\n\nheaders = {\n    "X-API-Key": "${cleanKey}",\n    "Accept": "application/json"\n}\n\nresponse = requests.get("${targetUrl}", headers=headers)\ndata = response.json()`,
	}

	const handleCopyCode = () => {
		// Copies the real API key to clip, not the truncated placeholder
		const realSnippet = snippets[activeTab].replace(cleanKey, apiKey)
		navigator.clipboard.writeText(realSnippet)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className='mt-4 bg-[#090d16] border border-border rounded-xl overflow-hidden'>
			{/* Tab bar header switcher */}
			<div className='flex items-center justify-between border-b border-border bg-bg-card/60 px-4 py-2'>
				<div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none'>
					<Terminal size={12} className='text-text-muted shrink-0' />
					{(
						[
							{ id: 'curl', label: 'cURL' },
							{ id: 'javascript', label: 'JavaScript' },
							{ id: 'go', label: 'Go' },
							{ id: 'python', label: 'Python' },
						] as const
					).map(tab => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`text-xs font-mono px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
								activeTab === tab.id
									? 'bg-bg-input text-accent border border-border font-semibold'
									: 'text-text-sub hover:text-text'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				<button
					onClick={handleCopyCode}
					className={`flex items-center gap-1 font-medium text-[11px] font-mono py-1 px-2.5 rounded-md border transition-all cursor-pointer shrink-0 ${
						copied
							? 'bg-success/10 border-success/25 text-success'
							: 'bg-bg-input border-border text-text-sub hover:text-text'
					}`}
				>
					{copied ? <Check size={11} /> : <Copy size={11} />}
					{copied ? 'Copied' : 'Copy Code'}
				</button>
			</div>

			{/* Code viewport wrapper */}
			<div className='p-4 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre bg-bg'>
				{/* {snippets[activeTab]} */}
				<CodeBlock code={snippets[activeTab]} lang={getShikiLang(activeTab)} />
			</div>
		</div>
	)
}

/* ─────────────────────────────────────────
   Main Endpoints Block Component
───────────────────────────────────────── */
export function EndpointsSection({
	endpoints,
}: {
	endpoints: Endpoints | null
}) {
	if (!endpoints) return null

	// Ensure path strings append accurately to your server base url environment definition
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

	return (
		<div className='bg-bg-card border border-border rounded-[18px] overflow-hidden'>
			{/* Block Header */}
			<div className='flex items-center gap-2.5 padding px-5 py-4.5 border-b border-border'>
				<Terminal size={15} className='text-accent' />
				<h2 className='font-display font-semibold text-sm text-text'>
					Developer API Endpoints
				</h2>
				<span className='ml-auto font-mono text-[10px] bg-bg-input border border-border px-2 py-0.5 rounded-md text-text-muted uppercase tracking-wide'>
					REST Client reference
				</span>
			</div>

			{/* Field Stack Container */}
			<div className='p-5 flex flex-col gap-3'>
				<EndpointField
					label='Ingestion Secret API Key'
					value={endpoints.api_key}
					isSecret={true}
				/>
				<EndpointField
					label='Summary Dashboard URL'
					value={`${baseUrl}${endpoints.dashboard}`}
				/>
				<EndpointField
					label='Daily Analytics Payload URL'
					value={`${baseUrl}${endpoints.daily_chart}`}
				/>
				<EndpointField
					label='Monthly Analytics Payload URL'
					value={`${baseUrl}${endpoints.monthly_chart}`}
				/>

				{/* ── NEW USAGE BLOCK DROPPED HERE ── */}
				<ApiUsageBlock
					apiKey={endpoints.api_key}
					targetUrl={`${baseUrl}${endpoints.dashboard}`}
				/>
			</div>
		</div>
	)
}
