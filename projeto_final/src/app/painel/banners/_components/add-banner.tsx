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
import { useState, useTransition } from 'react'
import { criarBanner } from '../actions'
import { toast } from 'sonner'

export default function AddBanner() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [ativo, setAtivo] = useState(true)

  async function handleSubmit(formData: FormData) {
    formData.set('ativo', ativo.toString())
    
    startTransition(async () => {
      const result = await criarBanner(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Banner criado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Banner</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Banner</DialogTitle>
          <DialogDescription>
            Adicione um novo banner para exibir na página inicial.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ex: Promoção de Verão"
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
                placeholder="https://exemplo.com/banner.jpg"
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
                defaultValue="0"
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
              {isPending ? 'Criando...' : 'Criar Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

