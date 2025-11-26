'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Pencil } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editarBanner } from '../actions'
import { toast } from 'sonner'

type Banner = {
  id: string
  titulo: string
  imagem: string
  ativo: boolean
  ordem: number
}

export default function EditBanner({ banner }: { banner: Banner }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [ativo, setAtivo] = useState(banner.ativo)

  async function handleSubmit(formData: FormData) {
    formData.set('ativo', ativo.toString())
    
    startTransition(async () => {
      const result = await editarBanner(banner.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Banner atualizado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Banner</DialogTitle>
          <DialogDescription>
            Atualize as informações do banner.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                defaultValue={banner.titulo}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagem">URL da Imagem</Label>
              <Input
                id="imagem"
                name="imagem"
                type="url"
                defaultValue={banner.imagem}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem de Exibição</Label>
              <Input
                id="ordem"
                name="ordem"
                type="number"
                min="0"
                defaultValue={banner.ordem}
                disabled={isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo">Banner Ativo</Label>
              <Switch
                id="ativo"
                checked={ativo}
                onCheckedChange={setAtivo}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

