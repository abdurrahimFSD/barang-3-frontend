export interface StockReportCategory {
    id: number
    name?: string
}

export interface StockReportUnit {
    id: number
    name?: string
    abbreviation?: string
}

export interface StockReportItem {
    id: number
    code: string
    name: string
    category?: StockReportCategory
    category_name?: string
    unit?: StockReportUnit
    unit_name?: string
    price: number | string
    stock: number
    minimum_stock: number
    is_low_stock?: boolean
    status?: "normal" | "rendah" | "habis"
}

export interface TransactionReportNestedItem {
    id: number
    code?: string
    name?: string
    stock?: number
}

export interface TransactionReportUser {
    id: number
    name?: string
    role?: string
}

export interface TransactionReportItem {
    id: number
    transaction_code: string
    date: string
    type: "masuk" | "keluar"
    item?: TransactionReportNestedItem
    item_code?: string
    item_name?: string
    quantity: number
    unit?: StockReportUnit
    unit_name?: string
    user?: TransactionReportUser
    user_name?: string
    notes: string | null
}

export interface ItemRequestReportUser {
    id: number
    name?: string
    email?: string
}

export interface ItemRequestReportNestedItem {
    id: number
    code?: string
    name?: string
    stock?: number
    unit?: {
        abbreviation?: string
    }
}

export interface ItemRequestReportApprover {
    id: number
    name?: string
}

export interface ItemRequestReportItem {
    id: number
    request_code: string
    created_at: string
    user?: ItemRequestReportUser
    user_name?: string
    item?: ItemRequestReportNestedItem
    item_name?: string
    quantity: number
    unit_name?: string
    purpose: string
    status: "pending" | "approved" | "rejected"
    approver?: ItemRequestReportApprover | null
    reviewer_name?: string | null
}

export interface ReportPdfParams {
    type: "stock" | "transactions" | "item-requests"
    start_date?: string
    end_date?: string
    category_id?: string | number
    transaction_type?: string
    status?: string
}
