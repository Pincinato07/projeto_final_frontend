import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CartButton from '../../_components/cart-button'
import AddToCartButton from '../../_components/add-to-cart-button'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const categoria = await prisma.categoria.findUnique({
    where: { slug },
    include: {
      produtos: {
        orderBy: { nome: 'asc' },
      },
    },
  })

  if (!categoria) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/">
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

      {/* Categoria Header */}
      <section
        className="py-8"
        style={{ backgroundColor: categoria.cor + '15' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: categoria.cor }}
            />
            <h1 className="text-3xl font-bold">{categoria.nome}</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {categoria.produtos.length} produto(s) disponível(is)
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section className="container mx-auto px-4 py-8">
        {categoria.produtos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum produto disponível nesta categoria.</p>
            <Button asChild className="mt-4">
              <Link href="/">Voltar para categorias</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoria.produtos.map((produto) => (
              <Card key={produto.id} className="overflow-hidden flex flex-col">
                <Link href={`/produto/${produto.id}`}>
                  {produto.imagem ? (
                    <div className="aspect-video relative">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-video flex items-center justify-center"
                      style={{ backgroundColor: categoria.cor + '20' }}
                    >
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                </Link>
                <CardHeader className="pb-2">
                  <Link href={`/produto/${produto.id}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {produto.nome}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  {produto.descricao && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {produto.descricao}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(produto.preco)}
                  </span>
                  <AddToCartButton
                    produto={{
                      id: produto.id,
                      nome: produto.nome,
                      preco: produto.preco,
                      imagem: produto.imagem,
                    }}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

