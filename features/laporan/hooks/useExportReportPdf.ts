import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ReportPdfParams } from "@/types/report"

export function useExportReportPdf() {
    return useMutation<boolean, Error, ReportPdfParams>({
        mutationFn: async (params: ReportPdfParams) => {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value))
                }
            })

            const queryString = searchParams.toString()
            const url = `/api/v1/reports/pdf${queryString ? `?${queryString}` : ""}`
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/pdf, application/json",
                },
            })

            if (!response.ok) {
                let errorMsg = "Gagal mengunduh dokumen PDF laporan"
                try {
                    const errorJson = await response.json()
                    if (errorJson.message) errorMsg = errorJson.message
                } catch {
                    // Ignore non-json responses
                }
                throw new Error(errorMsg)
            }

            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)
            window.open(blobUrl, "_blank")
            return true
        },
        onError: (error: Error) => {
            toast.error(error.message || "Gagal mencetak dokumen PDF")
        },
    })
}
