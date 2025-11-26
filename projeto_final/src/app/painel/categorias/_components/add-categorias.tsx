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
import { useState, useTransition } from 'react'
import { criarCategoria } from '../actions'
import { toast } from 'sonner'

function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AddCategorias() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [cor, setCor] = useState('#3b82f6')

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await criarCategoria(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Categoria criada com sucesso!')
        setOpen(false)
        setNome('')
        setSlug('')
        setCor('#3b82f6')
      }
    })
  }

  function handleNomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const novoNome = e.target.value
    setNome(novoNome)
    setSlug(generateSlug(novoNome))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para organizar seus produtos.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                value={nome}
                onChange={handleNomeChange}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="ex: pizzas"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
              {isPending ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
