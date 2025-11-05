import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProdutosPage() {
  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Produtos</h1>
      </div>

      <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
        <p>Página de produtos em construção</p>
        <p className="text-sm">Esta página será implementada em breve.</p>
      </div>
    </div>
  )
}