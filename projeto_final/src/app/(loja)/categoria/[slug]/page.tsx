import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import { ArrowLeft, Pizza, Phone, MapPin } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 text-white">
        <div className="container mx-auto px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardapio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            {categoria.nome}
          </h1>
          <p className="text-stone-400 mt-2">
            {categoria.produtos.length} {categoria.produtos.length === 1 ? 'produto disponivel' : 'produtos disponiveis'}
          </p>
        </div>
      </div>

      {/* Lista de produtos */}
      <section className="container mx-auto px-6 py-10">
        {categoria.produtos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pizza className="h-8 w-8 text-stone-400" />
            </div>
            <p className="text-stone-500 mb-4">Sem produtos nessa categoria.</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Ver outras categorias</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoria.produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <Link href={`/produto/${produto.id}`} className="block">
                  {produto.imagem ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                      <Pizza className="h-12 w-12 text-amber-300" />
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/produto/${produto.id}`}>
                    <h3 className="font-semibold text-stone-800 text-lg hover:text-red-600 transition-colors">
                      {produto.nome}
                    </h3>
                  </Link>
                  {produto.descricao && (
                    <p className="text-stone-500 text-sm mt-2 line-clamp-2 flex-1 leading-relaxed">
                      {produto.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-amber-100">
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
