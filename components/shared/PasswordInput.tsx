"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends React.ComponentProps<"input"> {
    startIcon?: React.ReactNode
}

export function PasswordInput({
    className,
    startIcon,
    disabled,
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <div className="relative">
            {startIcon && (
                <div className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground">
                    {startIcon}
                </div>
            )}
            <Input
                type={showPassword ? "text" : "password"}
                className={cn("pr-9", startIcon && "pl-9", className)}
                disabled={disabled}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={disabled}
                className="absolute top-2.5 right-3 cursor-pointer text-muted-foreground outline-none hover:text-foreground focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
                tabIndex={-1}
                aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                }
            >
                {showPassword ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    )
}
