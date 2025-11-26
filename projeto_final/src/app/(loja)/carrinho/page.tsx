'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/cart-context'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Link href="/" className="text-2xl font-bold text-primary">
            🍕 Delivery
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Seu carrinho está vazio
              </p>
              <Button asChild>
                <Link href="/">Ver categorias</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.imagem ? (
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.nome}</h3>
                        <p className="text-primary font-bold">
                          {formatCurrency(item.preco)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantidade - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantidade}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantidade + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumo */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Finalizar Pedido</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

