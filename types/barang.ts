export interface ItemTransactionHistory {
    id: number
    transaction_code: string
    type: "masuk" | "keluar"
    quantity: number
    date: string
    user_name: string
    notes: string | null
}

export interface Item {
    id: number
    code: string
    name: string
    category_id: number
    unit_id: number
    price: number | string
    stock: number
    minimum_stock: number
    description: string | null
    created_at?: string
    updated_at?: string
    category?: {
        id: number
        name: string
    }
    unit?: {
        id: number
        name: string
        abbreviation: string | null
    }
    transactions_history?: ItemTransactionHistory[]
}

export interface ItemPayload {
    code?: string
    name: string
    category_id: number
    unit_id: number
    price: number
    stock?: number
    minimum_stock?: number
    description?: string
}
