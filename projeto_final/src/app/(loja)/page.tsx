import Link from 'next/link'
import prisma from '@/lib/prisma-client'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartButton from './_components/cart-button'

export default async function HomePage() {
  const banners = await prisma.banner.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
  })

  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            🍕 Delivery
          </Link>
          <CartButton />
        </div>
      </header>

      {/* Banner */}
      {banners.length > 0 && (
        <section className="relative">
          <div className="aspect-[3/1] md:aspect-[4/1] relative overflow-hidden">
            <img
              src={banners[0].imagem}
              alt={banners[0].titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                {banners[0].titulo}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Categorias */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Categorias</h2>
        
        {categorias.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma categoria disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group relative overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="aspect-square relative"
                  style={{ backgroundColor: categoria.cor + '20' }}
                >
                  {categoria.imagem ? (
                    <img
                      src={categoria.imagem}
                      alt={categoria.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: categoria.cor + '30' }}
                    >
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: categoria.cor }}
                  />
                </div>
                <div className="p-4 bg-background">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <h3 className="font-semibold truncate">{categoria.nome}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

