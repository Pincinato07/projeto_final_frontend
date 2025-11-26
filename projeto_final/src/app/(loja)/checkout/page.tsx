'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-500 mb-8">
            Seu pedido foi realizado com sucesso. Em breve você receberá a confirmação por email.
          </p>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 rounded-full px-8"
          >
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Carrinho Vazio
          </h1>
          <p className="text-gray-500 mb-6">
            Adicione produtos antes de finalizar o pedido.
          </p>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 rounded-full px-8"
          >
            <Link href="/">Ver Cardápio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Finalizar Pedido
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  Dados para Entrega
                </h2>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="nome" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Digite seu nome completo"
                      className="rounded-xl h-12"
                      disabled={isSubmitting}
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="rounded-xl h-12"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      className="rounded-xl h-12"
                      disabled={isSubmitting}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endereco" className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      Endereço Completo
                    </Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, número, complemento, bairro, cidade"
                      className="rounded-xl h-12"
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
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantidade}x {item.nome}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.preco * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} itens)</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de entrega</span>
                    <span className="text-green-500">Grátis</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-500">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-lg"
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
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl mb-2">🍕 Delivery</p>
          <p className="text-gray-400 text-sm">
            © 2025 - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}
