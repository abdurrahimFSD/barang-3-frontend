export type TransactionType = "masuk" | "keluar"

export interface TransactionItem {
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

export interface TransactionUser {
    id: number
    name: string
    email: string
}

export interface TransactionItemRequest {
    id: number
    request_code: string
}

export interface Transaction {
    id: number
    transaction_code: string
    type: TransactionType
    item_id: number
    user_id: number
    item_request_id: number | null
    quantity: number
    date: string
    notes: string | null
    created_at: string
    updated_at?: string
    item?: TransactionItem
    user?: TransactionUser
    item_request?: TransactionItemRequest | null
}

export interface TransactionPayload {
    type: TransactionType
    item_id: number
    quantity: number
    date: string
    notes?: string
}

export interface TransactionQueryParams {
    type?: string
    start_date?: string
    end_date?: string
    item_id?: number
    user_id?: number | string
    search?: string
    page?: number
    per_page?: number
}
