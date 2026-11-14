"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock, Mail, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { loginSchema, type LoginFormValues } from "../schemas/authSchema"
import { useLogin } from "../hooks/useLogin"
import { mapServerErrorsToForm } from "@/lib/api-client"

export function LoginForm() {
    const { mutate: login, isPending, error } = useLogin()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: LoginFormValues) => {
        login(values, {
            onError: (err) => {
                if (err.errors) {
                    mapServerErrorsToForm(err.errors, setError)
                }
            },
        })
    }

    return (
        <Card className="w-full max-w-md border-border/80 shadow-md">
            <CardHeader className="space-y-1.5 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Inventory System
                </CardTitle>
                <CardDescription>
                    Masukkan kredensial Anda untuk mengakses sistem
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && !error.errors && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                        <ShieldAlert className="size-4 shrink-0" />
                        <span>
                            {error.message ||
                                "Email atau password tidak sesuai"}
                        </span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@instansi.com"
                                className="pl-9"
                                disabled={isPending}
                                aria-invalid={!!errors.email}
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="••••••••"
                            startIcon={<Lock className="size-4" />}
                            disabled={isPending}
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-10 w-full font-medium"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
