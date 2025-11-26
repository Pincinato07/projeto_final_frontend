'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'
import { z } from 'zod'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const checkoutSchema = z.object({
  nome: z.string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome não pode ter mais de 100 caracteres'),
  email: z.string()
    .email('Email inválido'),
  telefone: z.string()
    .min(10, 'O telefone deve ter pelo menos 10 dígitos')
    .max(20, 'O telefone não pode ter mais de 20 dígitos'),
  endereco: z.string()
    .min(10, 'O endereço deve ter pelo menos 10 caracteres')
    .max(200, 'O endereço não pode ter mais de 200 caracteres'),
})

type FormErrors = {
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio')
      return
    }

    const formData = new FormData(e.currentTarget)
    const data = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      endereco: formData.get('endereco') as string,
    }

    // Validar com Zod
    const result = checkoutSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar dados do pedido
      const pedidoData = {
        clienteNome: result.data.nome,
        email: result.data.email,
        telefone: result.data.telefone,
        endereco: result.data.endereco,
        itens: items.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
          preco: item.preco,
        })),
      }

      // Enviar para API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao finalizar pedido')
      }

      // Sucesso
      clearCart()
      setSuccess(true)
      toast.success('Pedido realizado com sucesso!')
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao finalizar pedido'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi realizado com sucesso. Em breve você receberá a confirmação.
            </p>
            <Button asChild>
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8">
            <p className="text-muted-foreground mb-4">
              Seu carrinho está vazio
            </p>
            <Button asChild>
              <Link href="/">Ver categorias</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/carrinho">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Link href="/" className="text-2xl font-bold text-primary">
            🍕 Delivery
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dados para Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Seu nome completo"
                      disabled={isSubmitting}
                    />
                    {errors.nome && (
                      <p className="text-sm text-destructive">{errors.nome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      disabled={isSubmitting}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-destructive">{errors.telefone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo *</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, número, complemento, bairro, cidade"
                      disabled={isSubmitting}
                    />
                    {errors.endereco && (
                      <p className="text-sm text-destructive">{errors.endereco}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantidade}x {item.nome}
                      </span>
                      <span>{formatCurrency(item.preco * item.quantidade)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Itens</span>
                      <span>{totalItems}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Finalizando...' : 'Confirmar Pedido'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

