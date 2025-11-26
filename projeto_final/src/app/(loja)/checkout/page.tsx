'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Pizza, ShoppingCart, Phone, MapPin, Lock } from 'lucide-react'
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

const schema = z.object({
  nome: z.string().min(3, 'Nome muito curto').max(100),
  email: z.string().email('Email invalido'),
  telefone: z.string().min(10, 'Telefone invalido').max(20),
  endereco: z.string().min(10, 'Endereco muito curto').max(200),
})

type Errors = { nome?: string; email?: string; telefone?: string; endereco?: string }

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    if (items.length === 0) {
      toast.error('Carrinho vazio')
      return
    }

    const form = new FormData(e.currentTarget)
    const data = {
      nome: form.get('nome') as string,
      email: form.get('email') as string,
      telefone: form.get('telefone') as string,
      endereco: form.get('endereco') as string,
    }

    const result = schema.safeParse(data)
    if (!result.success) {
      const errs: Errors = {}
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof Errors] = i.message
      })
      setErrors(errs)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNome: result.data.nome,
          email: result.data.email,
          telefone: result.data.telefone,
          endereco: result.data.endereco,
          itens: items.map((i) => ({
            produtoId: i.id,
            quantidade: i.quantidade,
            preco: i.preco,
          })),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao enviar pedido')
      }

      clearCart()
      setDone(true)
      toast.success('Pedido enviado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-amber-100 p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">Pedido confirmado!</h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Recebemos seu pedido e ja estamos preparando. Voce recebera um email com os detalhes.
          </p>
          <Button asChild className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-full px-8">
            <Link href="/">Voltar ao inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-amber-100 p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">Carrinho vazio</h1>
          <p className="text-stone-500 mb-8">
            Adicione produtos antes de finalizar.
          </p>
          <Button asChild className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-full px-8">
            <Link href="/">Ver cardapio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">Finalizar pedido</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-amber-100 p-6 md:p-8 shadow-sm">
                <h2 className="font-semibold text-stone-800 text-lg mb-6">Dados para entrega</h2>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="nome" className="text-stone-700 font-medium">Nome completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Seu nome"
                      className="mt-2 rounded-xl border-amber-200 focus:border-red-500 focus:ring-red-500"
                      disabled={loading}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1.5">{errors.nome}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-stone-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="mt-2 rounded-xl border-amber-200 focus:border-red-500 focus:ring-red-500"
                      disabled={loading}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="text-stone-700 font-medium">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      className="mt-2 rounded-xl border-amber-200 focus:border-red-500 focus:ring-red-500"
                      disabled={loading}
                    />
                    {errors.telefone && <p className="text-red-500 text-xs mt-1.5">{errors.telefone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="endereco" className="text-stone-700 font-medium">Endereco completo</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, numero, bairro, cidade"
                      className="mt-2 rounded-xl border-amber-200 focus:border-red-500 focus:ring-red-500"
                      disabled={loading}
                    />
                    {errors.endereco && <p className="text-red-500 text-xs mt-1.5">{errors.endereco}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div>
              <div className="bg-white rounded-3xl border border-amber-100 p-6 sticky top-24 shadow-sm">
                <h2 className="font-semibold text-stone-800 text-lg mb-5">Resumo do pedido</h2>

                <div className="space-y-3 text-sm mb-5 max-h-52 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-stone-600 py-2 border-b border-amber-50 last:border-0">
                      <span className="truncate pr-2">{item.quantidade}x {item.nome}</span>
                      <span className="font-medium whitespace-nowrap">{formatCurrency(item.preco * item.quantidade)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-amber-100 pt-4 space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxa de entrega</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>

                <div className="border-t border-amber-100 pt-5 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-800">Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-full py-6 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Confirmar pedido'}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-stone-400 text-xs">
                  <Lock className="h-3 w-3" />
                  <span>Pagamento seguro</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Rodape */}
      <footer className="bg-stone-900 text-white mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Pizza className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">Pizza Express</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Pizzas artesanais feitas com ingredientes selecionados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-3 text-stone-400 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Rua das Pizzas, 123</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horario</h4>
              <div className="space-y-2 text-stone-400 text-sm">
                <p>Segunda a Sexta: 18h - 23h</p>
                <p>Sabado e Domingo: 17h - 00h</p>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500 text-sm">
              2025 Pizza Express. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
