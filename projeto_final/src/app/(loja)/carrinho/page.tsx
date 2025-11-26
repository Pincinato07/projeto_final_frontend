'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Pizza, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import Header from '../_components/header'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">Seu carrinho</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">
              Carrinho vazio
            </h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto">
              Adicione itens do cardapio para fazer seu pedido
            </p>
            <Button asChild className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-full px-8">
              <Link href="/">Ver cardapio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-amber-100 p-5 flex gap-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl flex items-center justify-center">
                      <Pizza className="h-10 w-10 text-amber-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-800 text-lg">{item.nome}</h3>
                    <p className="text-red-600 font-bold text-lg mt-1">
                      {formatCurrency(item.preco)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center bg-stone-100 rounded-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-stone-200"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-stone-800">
                        {item.quantidade}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-stone-200"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div>
              <div className="bg-white rounded-3xl border border-amber-100 p-6 sticky top-24 shadow-sm">
                <h2 className="font-semibold text-stone-800 text-lg mb-5">Resumo do pedido</h2>
                
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
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

                <Button asChild className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-full py-6 text-base font-semibold">
                  <Link href="/checkout">Finalizar pedido</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
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
