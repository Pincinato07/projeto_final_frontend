import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma-client'
import AddProduto from './_components/add-produto'
import EditProduto from './_components/edit-produto'
import DeleteProduto from './_components/delete-produto'
import { formatCurrency } from '@/lib/utils'

type Produto = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoriaId: string
  categoria: {
    id: string
    nome: string
  }
}

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    include: {
      categoria: true,
    },
    orderBy: {
      nome: 'asc'
    }
  })

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Produtos</h1>
        <AddProduto />
      </div>

      {produtos.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum produto cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Produto" para criar seu primeiro produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto: Produto) => (
            <Card key={produto.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{produto.nome}</CardTitle>
                <p className="text-sm text-muted-foreground">{produto.categoria.nome}</p>
              </CardHeader>
              <CardContent className="pb-3">
                {produto.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {produto.descricao}
                  </p>
                )}
                <p className="text-lg font-semibold">{formatCurrency(produto.preco)}</p>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2 pt-0'>
                <EditProduto produto={{
                  id: produto.id,
                  nome: produto.nome,
                  descricao: produto.descricao,
                  preco: produto.preco,
                  categoriaId: produto.categoriaId,
                  categoria: {
                    id: produto.categoria.id,
                    nome: produto.categoria.nome
                  }
                }} />
                <DeleteProduto produto={{
                  id: produto.id,
                  nome: produto.nome
                }} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}