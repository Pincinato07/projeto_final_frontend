'use client'

import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [senhaError, setSenhaError] = useState("")

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const senha = formData.get("senha") as string

    setError("")
    setNameError("")
    setEmailError("")
    setSenhaError("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let hasError = false
    if (!name || name.trim().length < 2) {
      setNameError("Informe um nome válido.")
      hasError = true
    }
    if (!email || !emailRegex.test(email)) {
      setEmailError("Informe um email válido.")
      hasError = true
    }
    if (!senha || senha.length < 6) {
      setSenhaError("A senha deve ter ao menos 6 caracteres.")
      hasError = true
    }
    if (hasError) return

    try {
      await authClient.signUp.email(
        {
          name: name,
          email: email,
          password: senha,
        },
        {
          onSuccess: () => redirect("/login"),
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
          onError: (ctx) => setError(ctx.error.message || "Falha ao registrar. Tente novamente."),
        }
      )
    } catch (e) {
      setLoading(false)
      setError("Não foi possível conectar. Verifique sua conexão e tente novamente.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Crie sua conta</h1>
            <FieldDescription>
              Já possui conta? <a href="/login">Entrar</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="Seu nome" required />
            {nameError && (
              <FieldDescription className="text-destructive">{nameError}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {emailError && (
              <FieldDescription className="text-destructive">{emailError}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="senha">Senha</FieldLabel>
            <Input id="senha" name="senha" type="password" placeholder="••••••••" required />
            {senhaError && (
              <FieldDescription className="text-destructive">{senhaError}</FieldDescription>
            )}
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Registrar"}
            </Button>
          </Field>
          {error && (
            <Field>
              <FieldDescription className="text-destructive" aria-live="polite">{error}</FieldDescription>
            </Field>
          )}
        </FieldGroup>
      </form>
    </div>
  )
}
