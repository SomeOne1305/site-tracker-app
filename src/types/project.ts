/* ─────────────────────────────────────────
	 Types (matching real API response)
───────────────────────────────────────── */
export interface DataPoint {
	label: string
	value: number
	date: string
	growth?: number
}

export interface ChartData {
	type: string
	period: string
	data_points: DataPoint[]
	summary: {
		total_views: number
		total_unique: number
		average_per_day: number
		highest_day: string
		highest_day_views: number
		growth_percent: number
	}
}

export interface TopPage {
	path: string
	pageviews: number
	unique_visitors: number
}

export interface Dashboard {
	project_id: string
	project_name: string
	total_all_time: number
	unique_all_time: number
	current_month_stats: {
		month: string
		month_name: string
		pageviews: number
		unique_visitors: number
		avg_daily_pageviews: number
		growth_percent: number
	}
	previous_month_stats: {
		month: string
		month_name: string
		pageviews: number
		unique_visitors: number
		avg_daily_pageviews: number
		growth_percent: number
	}
	current_week_stats: {
		week: string
		start_date: string
		end_date: string
		pageviews: number
		unique_visitors: number
		avg_daily_pageviews: number
		growth_percent: number
	}
	last_7_days_chart: ChartData
	last_12_months_chart: ChartData
	top_5_pages: TopPage[]
	comparison_current_month: {
		current: number
		previous: number
		change: number
		percent: number
	}
}

export interface Endpoints {
	api_key: string
	daily_chart: string
	monthly_chart: string
	dashboard: string
}
