import Link from 'next/link'
import prisma from '@/lib/prisma-client'
import { Pizza, ChevronRight, Clock, Truck, MapPin, Phone } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      {/* Banner */}
      {banners.length > 0 ? (
        <section className="relative">
          <div className="aspect-[2.5/1] md:aspect-[3.5/1] relative overflow-hidden">
            <img
              src={banners[0].imagem}
              alt={banners[0].titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full mb-4">
                    Novidade
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    {banners[0].titulo}
                  </h1>
                  <p className="text-white/80 mt-4 text-lg">
                    Massa artesanal, ingredientes frescos. Entrega em ate 45 minutos.
                  </p>
                  <Link
                    href="#cardapio"
                    className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-600/30"
                  >
                    Ver cardapio
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-600 py-20 md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          <div className="container mx-auto px-6 text-center text-white relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur rounded-full mb-6">
              <Pizza className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Pizza Express
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
              A melhor pizza da cidade, direto na sua casa
            </p>
            <Link
              href="#cardapio"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-amber-50 transition-all hover:scale-105 shadow-xl"
            >
              Fazer pedido
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Info bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm">
            <div className="flex items-center gap-2.5 text-stone-600">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="h-4 w-4 text-green-600" />
              </div>
              <span>Entrega gratis acima de R$ 50</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-600">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <span>Aberto das 18h as 23h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cardapio */}
      <section id="cardapio" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-red-600 font-medium text-sm uppercase tracking-wider">
            Nosso Menu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
            Escolha sua categoria
          </h2>
          <p className="text-stone-500 mt-3 max-w-md mx-auto">
            Selecione uma categoria para ver todas as opcoes disponiveis
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pizza className="h-8 w-8 text-stone-400" />
            </div>
            <p className="text-stone-500">
              Nenhuma categoria cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square relative overflow-hidden">
                    {categoria.imagem ? (
                      <img
                        src={categoria.imagem}
                        alt={categoria.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                        <Pizza className="h-12 w-12 text-amber-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-800 text-sm group-hover:text-red-600 transition-colors">
                      {categoria.nome}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      {categoria._count.produtos} {categoria._count.produtos === 1 ? 'opcao' : 'opcoes'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">
                Primeira compra?
              </h3>
              <p className="text-white/90 mt-2">
                Ganhe 10% de desconto usando o cupom PRIMEIRA10
              </p>
            </div>
            <Link
              href="#cardapio"
              className="inline-flex items-center gap-2 mt-6 md:mt-0 px-6 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-amber-50 transition-all"
            >
              Pedir agora
            </Link>
          </div>
        </div>
      </section>

      {/* Rodape */}
      <footer className="bg-stone-900 text-white">
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
                Pizzas artesanais feitas com ingredientes selecionados e muito carinho.
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
