import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma-client'
import AddBanner from './_components/add-banner'
import EditBanner from './_components/edit-banner'
import DeleteBanner from './_components/delete-banner'

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: {
      ordem: 'asc'
    }
  })

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Banners</h1>
        <AddBanner />
      </div>

      {banners.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum banner cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Banner" para criar seu primeiro banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="aspect-[3/1] relative">
                <img
                  src={banner.imagem}
                  alt={banner.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{banner.titulo}</CardTitle>
                  <Badge variant={banner.ativo ? 'default' : 'secondary'}>
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">Ordem: {banner.ordem}</p>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                <EditBanner banner={banner} />
                <DeleteBanner banner={banner} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

