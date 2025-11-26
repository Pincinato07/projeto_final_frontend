import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft, Pizza, Phone, MapPin } from 'lucide-react'
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
    include: { categoria: true },
  })

  if (!produto) {
    notFound()
  }

  const relacionados = await prisma.produto.findMany({
    where: {
      categoriaId: produto.categoriaId,
      id: { not: produto.id },
    },
    take: 4,
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      <div className="container mx-auto px-6 py-6">
        <Link
          href={`/categoria/${produto.categoria.slug}`}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {produto.categoria.nome}
        </Link>
      </div>

      {/* Detalhes do produto */}
      <section className="container mx-auto px-6 pb-12">
        <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* Foto */}
            <div className="aspect-square md:aspect-auto relative">
              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                  <Pizza className="h-20 w-20 text-amber-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 md:p-10 flex flex-col">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full w-fit mb-4">
                {produto.categoria.nome}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800">
                {produto.nome}
              </h1>

              {produto.descricao && (
                <p className="text-stone-600 mt-5 leading-relaxed text-lg">
                  {produto.descricao}
                </p>
              )}

              <div className="mt-auto pt-8 border-t border-amber-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-sm text-stone-500 block mb-1">Preco</span>
                    <span className="text-4xl font-bold text-red-600">
                      {formatCurrency(produto.preco)}
                    </span>
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

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="container mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Mais de {produto.categoria.nome}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relacionados.map((item) => (
              <Link
                key={item.id}
                href={`/produto/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                {item.imagem ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                    <Pizza className="h-10 w-10 text-amber-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 text-sm truncate">
                    {item.nome}
                  </h3>
                  <p className="text-red-600 font-bold mt-1">
                    {formatCurrency(item.preco)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Rodape */}
      <footer className="bg-stone-900 text-white mt-8">
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
