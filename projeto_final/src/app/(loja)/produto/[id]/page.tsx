import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft } from 'lucide-react'
import Header from '../../_components/header'
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

  // Buscar produtos relacionados da mesma categoria
  const produtosRelacionados = await prisma.produto.findMany({
    where: {
      categoriaId: produto.categoriaId,
      id: { not: produto.id },
    },
    take: 4,
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={`/categoria/${produto.categoria.slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para {produto.categoria.nome}
        </Link>
      </div>

      {/* Produto */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Imagem */}
            <div className="relative aspect-square md:aspect-auto">
              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full min-h-[400px] flex items-center justify-center"
                  style={{ backgroundColor: produto.categoria.cor + '15' }}
                >
                  <span className="text-9xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <Link
                href={`/categoria/${produto.categoria.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium mb-4 w-fit"
                style={{ color: produto.categoria.cor }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: produto.categoria.cor }}
                />
                {produto.categoria.nome}
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {produto.nome}
              </h1>

              {produto.descricao && (
                <div className="mb-6">
                  <h2 className="font-semibold text-gray-700 mb-2">Descrição</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {produto.descricao}
                  </p>
                </div>
              )}

              <div className="mt-auto pt-6 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Preço</p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: produto.categoria.cor }}
                    >
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
        </div>
      </section>

      {/* Produtos Relacionados */}
      {produtosRelacionados.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produtosRelacionados.map((prod) => (
              <Link
                key={prod.id}
                href={`/produto/${prod.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
              >
                {prod.imagem ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={prod.imagem}
                      alt={prod.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-video flex items-center justify-center"
                    style={{ backgroundColor: produto.categoria.cor + '15' }}
                  >
                    <span className="text-3xl">🍽️</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 truncate group-hover:text-orange-500 transition-colors">
                    {prod.nome}
                  </h3>
                  <p className="text-orange-500 font-bold mt-1">
                    {formatCurrency(prod.preco)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
