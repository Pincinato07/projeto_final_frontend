import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft, Pizza } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '../../_components/header'
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
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Categoria Header */}
      <section
        className="py-12 relative overflow-hidden border-b border-stone-200"
        style={{ backgroundColor: categoria.cor + '10' }}
      >
        <div className="container mx-auto px-4 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: categoria.cor }}
            >
              <Pizza className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800">
                {categoria.nome}
              </h1>
              <p className="text-stone-600 mt-1">
                {categoria.produtos.length} {categoria.produtos.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="container mx-auto px-4 py-10">
        {categoria.produtos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-stone-200">
            <Pizza className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg mb-4">
              Nenhum produto disponível nesta categoria.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Voltar ao cardápio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoria.produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300 flex flex-col"
              >
                <Link href={`/produto/${produto.id}`} className="block">
                  {produto.imagem ? (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-video flex items-center justify-center bg-stone-100"
                    >
                      <Pizza className="h-12 w-12 text-stone-300" />
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/produto/${produto.id}`}>
                    <h3 className="font-bold text-lg text-stone-800 hover:text-red-600 transition-colors">
                      {produto.nome}
                    </h3>
                  </Link>
                  {produto.descricao && (
                    <p className="text-stone-500 text-sm mt-2 line-clamp-2 flex-1">
                      {produto.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <span className="text-xl font-bold text-red-600">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
