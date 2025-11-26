import Link from 'next/link'
import prisma from '@/lib/prisma-client'
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-tight">
                  {banners[0].titulo}
                </h1>
                <p className="text-white/80 mt-4 text-lg max-w-xl">
                  Peça agora e receba em casa com rapidez e qualidade!
                </p>
                <Link
                  href="#categorias"
                  className="inline-block mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  Ver Cardápio
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🍕 Bem-vindo ao Delivery
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Os melhores sabores na sua casa!
            </p>
            <Link
              href="#categorias"
              className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Cardápio
            </Link>
          </div>
        </section>
      )}

      {/* Categorias */}
      <section id="categorias" className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Nosso Cardápio
          </h2>
          <p className="text-gray-500 mt-2">
            Escolha sua categoria favorita
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-gray-500 text-lg">
              Nenhuma categoria disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div
                    className="aspect-square relative overflow-hidden"
                    style={{ backgroundColor: categoria.cor + '15' }}
                  >
                    {categoria.imagem ? (
                      <img
                        src={categoria.imagem}
                        alt={categoria.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: categoria.cor + '25' }}
                      >
                        <span className="text-6xl group-hover:scale-125 transition-transform duration-300">🍽️</span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: categoria.cor }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <h3 className="font-bold text-gray-800 truncate">
                        {categoria.nome}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      {categoria._count.produtos} {categoria._count.produtos === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>
                </div>
              </Link>
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
