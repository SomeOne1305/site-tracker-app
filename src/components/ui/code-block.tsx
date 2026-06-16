'use client'

import { useEffect, useState } from 'react'

interface CodeBlockProps {
	code: string
	lang: string
	theme?: string
}

export function CodeBlock({ code, lang, theme = 'dracula' }: CodeBlockProps) {
	const [htmlString, setHtmlString] = useState<string | null>(null)
	const trimmedCode = code.trim()

	useEffect(() => {
		let isMounted = true

		async function highlight() {
			try {
				// 1. Shiki/wasm handles all the complex engine initialization internally
				const { createHighlighter } = await import('shiki')

				const loaders: Record<string, () => Promise<any>> = {
					bash: () => import('shiki/langs/bash.mjs'),
					ts: () => import('shiki/langs/typescript.mjs'),
					py: () => import('shiki/langs/python.mjs'),
					go: () => import('shiki/langs/go.mjs'),
					js: () => import('shiki/langs/javascript.mjs'),
					json: () => import('shiki/langs/json.mjs'),
					rust: () => import('shiki/langs/rust.mjs'),
					java: () => import('shiki/langs/java.mjs'),
					cpp: () => import('shiki/langs/cpp.mjs'),
					csharp: () => import('shiki/langs/csharp.mjs'),
					php: () => import('shiki/langs/php.mjs'),
					ruby: () => import('shiki/langs/ruby.mjs'),
					swift: () => import('shiki/langs/swift.mjs'),
					kotlin: () => import('shiki/langs/kotlin.mjs'),
					dart: () => import('shiki/langs/dart.mjs'),
					html: () => import('shiki/langs/html.mjs'),
					css: () => import('shiki/langs/css.mjs'),
					scss: () => import('shiki/langs/scss.mjs'),
					less: () => import('shiki/langs/less.mjs'),
					sass: () => import('shiki/langs/sass.mjs'),
					tsx: () => import('shiki/langs/tsx.mjs'),
					jsx: () => import('shiki/langs/jsx.mjs'),
				}

				const targetLang = loaders[lang] ? lang : 'text'

				// 2. Initialize using the cleaner high-level bundle generator
				const highlighter = await createHighlighter({
					themes: [
						theme === 'dracula'
							? () => import('shiki/themes/dracula.mjs')
							: () => import('shiki/themes/github-dark.mjs'),
					],
					langs: loaders[targetLang] ? [loaders[targetLang]] : [],
				})

				const generatedHtml = highlighter.codeToHtml(trimmedCode, {
					lang: targetLang,
					theme: theme,
				})

				if (isMounted) {
					setHtmlString(generatedHtml)
				}
			} catch (error) {
				console.error(
					`[CodeBlock] Failed to parse syntax highlighting for lang: ${lang}`,
					error,
				)
			}
		}

		highlight()
		return () => {
			isMounted = false
		}
	}, [trimmedCode, lang, theme])

	if (!htmlString) {
		return (
			<pre className='overflow-x-auto font-mono text-[14px] p-2 leading-relaxed whitespace-pre-wrap break-all bg-zinc-950 text-zinc-400 rounded-lg'>
				<code>{trimmedCode}</code>
			</pre>
		)
	}

	return (
		<div
			dangerouslySetInnerHTML={{ __html: htmlString }}
			className='
        font-mono 
        text-[14px] 
        leading-relaxed
        [&>pre]:bg-transparent! 
        [&>pre]:m-0!
        [&>pre]:p-2
        [&>pre]:whitespace-pre-wrap 
        [&>pre]:break-all
        [&>pre_code]:whitespace-pre-wrap 
        [&>pre_code]:break-all
      '
		/>
	)
}
