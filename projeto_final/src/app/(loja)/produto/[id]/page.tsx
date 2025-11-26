import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartButton from '../../_components/cart-button'
import AddToCartButton from '../../_components/add-to-cart-button'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const produto = await prisma.produto.findUnique({
    where: { id },
    include: {
      categoria: true,
    },
  })

  if (!produto) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/categoria/${produto.categoria.slug}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link href="/" className="text-2xl font-bold text-primary">
              🍕 Delivery
            </Link>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Produto */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagem */}
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: produto.categoria.cor + '20' }}
              >
                <span className="text-8xl">🍽️</span>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/categoria/${produto.categoria.slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: produto.categoria.cor }}
                />
                {produto.categoria.nome}
              </Link>
              <h1 className="text-3xl font-bold mt-2">{produto.nome}</h1>
            </div>

            {produto.descricao && (
              <div>
                <h2 className="font-semibold mb-2">Descrição</h2>
                <p className="text-muted-foreground">{produto.descricao}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Preço</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(produto.preco)}
                  </p>
                </div>
                <AddToCartButton
                  produto={{
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

