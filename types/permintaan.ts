export type ItemRequestStatus = "pending" | "approved" | "rejected"

export interface ItemRequestItem {
    id: number
    code: string
    name: string
    stock: number
    unit?: {
        id: number
        name: string
        abbreviation: string | null
    }
}

export interface ItemRequestApprover {
    id: number
    name?: string
}

export interface ItemRequestUser {
    id: number
    name: string
    email: string
}

export interface ItemRequest {
    id: number
    request_code: string
    user_id: number
    item_id: number
    quantity: number
    status: ItemRequestStatus
    purpose: string
    approved_by?: number | null
    approved_at: string | null
    rejection_reason: string | null
    created_at: string
    updated_at?: string
    item?: ItemRequestItem
    user?: ItemRequestUser
    approver?: ItemRequestApprover | null
    reviewer?: ItemRequestUser | null
}

export interface ItemRequestPayload {
    item_id: number
    quantity: number
    purpose: string
}

export interface RejectItemRequestPayload {
    rejection_reason: string
}

export interface ItemRequestQueryParams {
    status?: string
    user_id?: string | number
    start_date?: string
    end_date?: string
    search?: string
    page?: number
    per_page?: number
}
