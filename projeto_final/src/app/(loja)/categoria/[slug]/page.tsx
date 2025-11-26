import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />

      {/* Categoria Header */}
      <section
        className="py-12 relative overflow-hidden"
        style={{ backgroundColor: categoria.cor + '20' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${categoria.cor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="container mx-auto px-4 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{ backgroundColor: categoria.cor }}
            >
              🍽️
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {categoria.nome}
              </h1>
              <p className="text-gray-600 mt-1">
                {categoria.produtos.length} {categoria.produtos.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="container mx-auto px-4 py-10">
        {categoria.produtos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-gray-500 text-lg mb-4">
              Nenhum produto disponível nesta categoria.
            </p>
            <Button asChild>
              <Link href="/">Voltar ao cardápio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoria.produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link href={`/produto/${produto.id}`} className="block">
                  {produto.imagem ? (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-video flex items-center justify-center"
                      style={{ backgroundColor: categoria.cor + '15' }}
                    >
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/produto/${produto.id}`}>
                    <h3 className="font-bold text-lg text-gray-800 hover:text-orange-500 transition-colors">
                      {produto.nome}
                    </h3>
                  </Link>
                  {produto.descricao && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
                      {produto.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: categoria.cor }}
                    >
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
