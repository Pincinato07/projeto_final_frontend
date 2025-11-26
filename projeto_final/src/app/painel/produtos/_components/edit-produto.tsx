'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useTransition, useEffect } from 'react'
import { editarProduto, listarCategorias } from '../actions'
import { toast } from 'sonner'

type Produto = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  imagem: string | null
  categoriaId: string
  categoria: {
    id: string
    nome: string
  }
}

export default function EditProduto({ produto }: { produto: Produto }) {
  const [open, setOpen] = useState(false)
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const carregarCategorias = async () => {
      const categoriasData = await listarCategorias()
      setCategorias(categoriasData)
    }
    
    if (open) {
      carregarCategorias()
    }
  }, [open])

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await editarProduto(produto.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto atualizado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Editar
      </Button>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize as informações do produto. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome*
              </Label>
              <Input
                id="nome"
                name="nome"
                defaultValue={produto.nome}
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                defaultValue={produto.descricao || ''}
                className="col-span-3"
                disabled={isPending}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preco" className="text-right">
                Preço*
              </Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={produto.preco}
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoriaId" className="text-right">
                Categoria*
              </Label>
              <Select 
                name="categoriaId" 
                defaultValue={produto.categoriaId}
                required 
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagem" className="text-right">
                Imagem
              </Label>
              <Input
                id="imagem"
                name="imagem"
                type="url"
                defaultValue={produto.imagem || ''}
                placeholder="https://exemplo.com/imagem.jpg"
                className="col-span-3"
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
              {isPending ? 'Atualizando...' : 'Atualizar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
