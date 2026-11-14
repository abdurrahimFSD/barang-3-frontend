export type NotificationType =
    "request_submitted" | "request_approved" | "request_rejected" | "low_stock"

export interface NotificationData {
    item_request_id?: number
    item_id?: number
    [key: string]: unknown
}

export interface AppNotification {
    id: number
    user_id: number
    title: string
    message: string
    type: NotificationType
    data: NotificationData | null
    is_read: boolean
    read_at: string | null
    created_at: string
    updated_at?: string
}

export interface UnreadCountResponse {
    unread_count: number
}
