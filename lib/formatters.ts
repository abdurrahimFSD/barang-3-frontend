/**
 * Utility formatters untuk currency dan tanggal di seluruh aplikasi.
 */
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

/**
 * Format angka atau string numerik ke format Rupiah (IDR).
 * Contoh: 15000 -> "Rp 15.000"
 */
export function formatRupiah(val: number | string | null | undefined): string {
    const num = Number(val) || 0
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(num)
}

/**
 * Alias untuk formatRupiah.
 */
export const formatCurrency = formatRupiah

/**
 * Format string tanggal (ISO / timestamp) ke format tanggal lokal Indonesia.
 * Contoh: "2026-11-07T12:00:00Z" -> "07 Nov 2026"
 */
export function formatDate(
    dateStr?: string | Date | null,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!dateStr) return "-"
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
    if (isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat(
        "id-ID",
        options || {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date)
}

/**
 * Format string tanggal (ISO / timestamp) ke format tanggal + waktu lokal Indonesia.
 * Contoh: "2026-11-07T12:00:00Z" -> "07 November 2026, 12.00"
 */
export function formatDateTime(
    dateStr?: string | Date | null,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!dateStr) return "-"
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
    if (isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat(
        "id-ID",
        options || {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date)
}

/**
 * Format Date object atau string ke format input HTML date (YYYY-MM-DD).
 * Jika tidak diberikan nilai, default ke tanggal hari ini.
 * Contoh: new Date() -> "2026-11-09"
 */
export function formatDateInput(val?: Date | string | null): string {
    const date = !val ? new Date() : typeof val === "string" ? new Date(val) : val
    if (isNaN(date.getTime())) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

/**
 * Format string tanggal (ISO / timestamp) atau Date ke waktu relatif lokal Indonesia.
 * Contoh: "2026-11-07T12:00:00Z" -> "5 hari yang lalu"
 */
export function formatRelativeTime(dateStr?: string | Date | null): string {
    if (!dateStr) return "-"
    try {
        const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
        if (isNaN(date.getTime())) return "-"
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: idLocale,
        })
    } catch {
        return "-"
    }
}


