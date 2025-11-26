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
import { Edit } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editarCategoria } from '../actions'
import { toast } from 'sonner'

interface EditCategoriaProps {
  categoria: {
    id: string
    nome: string
    slug: string
    cor: string
    imagem: string | null
  }
}

export default function EditCategoria({ categoria }: EditCategoriaProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState(categoria.nome)
  const [slug, setSlug] = useState(categoria.slug)
  const [cor, setCor] = useState(categoria.cor)

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await editarCategoria(categoria.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Categoria atualizada com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Altere as informações da categoria.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: pizzas"
                required
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Será usado na URL: /categoria/{slug || 'exemplo'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="cor"
                  name="cor"
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isPending}
                />
                <Input
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagem">URL da Imagem (opcional)</Label>
              <Input
                id="imagem"
                name="imagem"
                type="url"
                defaultValue={categoria.imagem || ''}
                placeholder="https://exemplo.com/imagem.jpg"
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
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
