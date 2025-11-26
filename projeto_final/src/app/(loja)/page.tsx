import Link from 'next/link'
import prisma from '@/lib/prisma-client'
import { Pizza, ChevronRight } from 'lucide-react'
import Header from './_components/header'

export default async function HomePage() {
  const banners = await prisma.banner.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
  })

  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: 'asc' },
    include: {
      _count: {
        select: { produtos: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Banner */}
      {banners.length > 0 ? (
        <section className="relative">
          <div className="aspect-[2/1] md:aspect-[3/1] relative overflow-hidden">
            <img
              src={banners[0].imagem}
              alt={banners[0].titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-tight">
                  {banners[0].titulo}
                </h1>
                <p className="text-white/80 mt-4 text-lg max-w-xl">
                  Sabor artesanal, entrega rápida. Peça agora!
                </p>
                <Link
                  href="#categorias"
                  className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  Ver Cardápio
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-20 md:py-28">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pizza className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pizza Express
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
              As melhores pizzas da cidade, feitas com ingredientes selecionados
            </p>
            <Link
              href="#categorias"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-semibold rounded-lg transition-all shadow-lg hover:bg-stone-100"
            >
              Ver Cardápio
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Categorias */}
      <section id="categorias" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
            Nosso Cardápio
          </h2>
          <p className="text-stone-500 mt-2">
            Escolha sua categoria favorita
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-stone-200">
            <Pizza className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">
              Nenhuma categoria disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-xl hover:border-stone-300 transition-all duration-300 transform hover:-translate-y-1">
                  <div
                    className="aspect-square relative overflow-hidden"
                  >
                    {categoria.imagem ? (
                      <img
                        src={categoria.imagem}
                        alt={categoria.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-stone-100"
                      >
                        <Pizza className="h-12 w-12 text-stone-400" />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: categoria.cor }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <h3 className="font-semibold text-stone-800 truncate text-sm">
                        {categoria.nome}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500">
                      {categoria._count.produtos} {categoria._count.produtos === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
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
