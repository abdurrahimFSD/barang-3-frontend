"use client"

import * as React from "react"

import { PermintaanDetailCard } from "./PermintaanDetailCard"
import { RejectModalDialog } from "./RejectModalDialog"
import { ApproveConfirmDialog } from "./ApproveConfirmDialog"
import { useItemRequestDetail } from "../hooks/useItemRequestDetail"

interface PermintaanDetailViewProps {
    id: number
}

export function PermintaanDetailView({ id }: PermintaanDetailViewProps) {
    const { data: response, isLoading } = useItemRequestDetail(id)
    const request = response?.data

    return (
        <div className="space-y-6">
            <PermintaanDetailCard request={request} isLoading={isLoading} />

            <RejectModalDialog />
            <ApproveConfirmDialog />
        </div>
    )
}
