export interface DashboardKpi {
    total_items: number
    total_transactions: number
    pending_requests: number
    low_stock_items: number
    today_transactions?: number
}

export interface MonthlyMovement {
    date?: string
    label?: string
    month?: string
    masuk: number
    keluar: number
}

export interface RecentActivityItem {
    id: number
    code?: string
    name: string
    unit?: string
}

export interface RecentActivityUser {
    id: number
    name: string
}

export interface RecentActivity {
    id: number
    transaction_code?: string
    type: "masuk" | "keluar" | "transaction" | "request"
    title?: string
    item?: RecentActivityItem
    quantity?: number
    user?: RecentActivityUser
    user_name?: string
    reference_id?: number
    date?: string
    created_at: string
}

export type DashboardPeriod = "7d" | "30d" | "6m" | "1y"

export interface DashboardMetrics {
    summary?: DashboardKpi
    kpi?: DashboardKpi
    stock_movement?: MonthlyMovement[]
    monthly_movement?: MonthlyMovement[]
    selected_period?: DashboardPeriod
    recent_activities: RecentActivity[]
}
