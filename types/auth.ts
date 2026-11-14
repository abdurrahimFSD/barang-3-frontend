export type UserRole = "admin" | "staff"

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
    created_at?: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponseData {
    token: string
    user: User
}

export interface CreateUserPayload {
    name: string
    email: string
    password: string
    role: UserRole
}

export interface UpdateUserPayload {
    name: string
    email: string
    password?: string
    role: UserRole
}
