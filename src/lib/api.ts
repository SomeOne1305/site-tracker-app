const API_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(
	path: string,
	options: RequestInit = {},
	isRetry = false,
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	})

	if (res.status === 401) {
		if (isRetry) {
			// Second 401 → not authenticated
			if (typeof window !== 'undefined') {
				window.location.href = '/auth'
			}
			throw new Error('Unauthorized')
		}
		// First 401 → retry once (backend auto-refreshes token on second request)
		return request<T>(path, options, true)
	}

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: 'Request failed' }))
		throw new Error(error.message || 'Request failed')
	}

	return res.json()
}

export const api = {
	get: <T>(path: string) => request<T>(path, { method: 'GET' }),
	post: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
		}),
	put: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: 'PUT',
			body: body ? JSON.stringify(body) : undefined,
		}),
	delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// Auth
export const authApi = {
	check: () => api.get<{ valid: boolean }>('/api/v1/auth/check'),
	register: (data: {
		first_name: string
		last_name: string
		email: string
		password: string
	}) => api.post('/api/v1/auth/register', data),
	verify: (data: { email: string; verification_code: number }) =>
		api.post('/api/v1/auth/verify', data),
	login: (data: { email: string; password: string }) =>
		api.post('/api/v1/auth/login', data),
}

// User
export const userApi = {
	me: () =>
		api.get<{
			message: string
			user: {
				id: string
				first_name: string
				last_name: string
				email: string
				created_at: string
				updated_at: string
			}
		}>('/api/v1/user/me'),
	update: (data: { first_name?: string; last_name?: string }) =>
		api.put('/api/v1/user/update-me', data),
}

// Projects
export const projectApi = {
	create: (data: { name: string; description?: string }) =>
		api.post<{ id: string; name: string; description: string }>(
			'/api/v1/project/create',
			data,
		),
	all: () =>
		api.get<{
			data: {
				id: string
				name: string
				description: string
				created_at: string
			}[]
			message: string
		}>('/api/v1/project/all'),
}

// Dashboard
export const dashboardApi = {
	summary: (projectId: string) =>
		api.get<{
			total_visits: number
			unique_visitors: number
			avg_session_duration: number
			bounce_rate: number
			top_page: string
		}>(`/api/v1/projects/${projectId}/dashboard`),
	daily: (projectId: string) =>
		api.get<{ date: string; visits: number; unique: number }[]>(
			`/api/v1/projects/${projectId}/chart/daily`,
		),
	monthly: (projectId: string) =>
		api.get<{ month: string; visits: number; unique: number }[]>(
			`/api/v1/projects/${projectId}/chart/monthly`,
		),
	endpoints: (projectId: string) =>
		api.get<{ path: string; visits: number; avg_duration: number }[]>(
			`/api/v1/projects/${projectId}/endpoints`,
		),
}
