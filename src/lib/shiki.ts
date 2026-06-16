type TabLang = 'curl' | 'javascript' | 'go' | 'python'

/**
 * Maps frontend interactive UI tabs to valid Shiki highlighting grammars.
 */
export function getShikiLang(activeTab: TabLang): string {
	const languageMap: Record<TabLang, string> = {
		curl: 'bash', // cURL scripts use Bash syntax highlighting
		javascript: 'ts', // Handles template strings and async/await cleanest
		go: 'go',
		python: 'py',
	}

	return languageMap[activeTab] || 'text'
}
