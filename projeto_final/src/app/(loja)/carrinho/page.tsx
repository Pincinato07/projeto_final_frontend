'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 mb-6">
              Adicione produtos deliciosos ao seu carrinho!
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 rounded-full px-8">
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
                  className="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center"
                >
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">🍽️</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.nome}</h3>
                    <p className="text-orange-500 font-bold text-lg">
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
                    
                    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">
                        {item.quantidade}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white"
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
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Itens ({totalItems})</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de entrega</span>
                    <span className="text-green-500">Grátis</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-500">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-lg"
                >
                  <Link href="/checkout">Finalizar Pedido</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
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
