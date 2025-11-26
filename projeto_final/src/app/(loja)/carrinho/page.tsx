'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Pizza } from 'lucide-react'
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
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-red-600 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">
          Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-stone-500 mb-6">
              Adicione pizzas deliciosas ao seu carrinho!
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700 rounded-lg px-8">
              <Link href="/">Ver Cardápio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex gap-4 items-center"
                >
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Pizza className="h-8 w-8 text-stone-300" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-800">{item.nome}</h3>
                    <p className="text-red-600 font-bold text-lg">
                      {formatCurrency(item.preco)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold text-stone-800">
                        {item.quantidade}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-white"
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
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-800 mb-6">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Itens ({totalItems})</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxa de entrega</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-stone-800">Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-6 text-lg"
                >
                  <Link href="/checkout">Finalizar Pedido</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
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
