'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, Mail, User, Pizza, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'
import { z } from 'zod'
import Header from '../_components/header'

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

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao finalizar pedido')
      }

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-stone-500 mb-8">
            Seu pedido foi realizado com sucesso. Em breve você receberá a confirmação por email.
          </p>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 rounded-lg px-8"
          >
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-8 w-8 text-stone-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            Carrinho Vazio
          </h1>
          <p className="text-stone-500 mb-6">
            Adicione produtos antes de finalizar o pedido.
          </p>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 rounded-lg px-8"
          >
            <Link href="/">Ver Cardápio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-red-600 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">
          Finalizar Pedido
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                  Dados para Entrega
                </h2>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="nome" className="flex items-center gap-2 mb-2 text-stone-700">
                      <User className="h-4 w-4 text-stone-400" />
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Digite seu nome completo"
                      className="rounded-lg h-12 border-stone-300 focus:border-red-500 focus:ring-red-500"
                      disabled={isSubmitting}
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-stone-700">
                      <Mail className="h-4 w-4 text-stone-400" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="rounded-lg h-12 border-stone-300 focus:border-red-500 focus:ring-red-500"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="flex items-center gap-2 mb-2 text-stone-700">
                      <Phone className="h-4 w-4 text-stone-400" />
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      className="rounded-lg h-12 border-stone-300 focus:border-red-500 focus:ring-red-500"
                      disabled={isSubmitting}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endereco" className="flex items-center gap-2 mb-2 text-stone-700">
                      <MapPin className="h-4 w-4 text-stone-400" />
                      Endereço Completo
                    </Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, número, complemento, bairro, cidade"
                      className="rounded-lg h-12 border-stone-300 focus:border-red-500 focus:ring-red-500"
                      disabled={isSubmitting}
                    />
                    {errors.endereco && (
                      <p className="text-sm text-red-500 mt-1">{errors.endereco}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-800 mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.quantidade}x {item.nome}
                      </span>
                      <span className="font-medium text-stone-800">
                        {formatCurrency(item.preco * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({totalItems} itens)</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxa de entrega</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                    <span className="text-lg font-bold text-stone-800">Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Finalizando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-full">
                <Pizza className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">Pizza Express</span>
            </div>
            <p className="text-stone-400 text-sm">
              2025 Pizza Express. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
