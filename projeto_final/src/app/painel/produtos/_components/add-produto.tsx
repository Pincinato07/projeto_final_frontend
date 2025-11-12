'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import Link from 'next/link'
import { criarProduto, listarCategorias } from '../actions'
import { toast } from 'sonner'

export default function AddProduto() {
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
      const result = await criarProduto(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto criado com sucesso!')
        setOpen(false)
      }
    })
  }

  if (categorias.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Adicionar Produto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nenhuma Categoria Encontrada</DialogTitle>
            <DialogDescription>
              Você precisa cadastrar pelo menos uma categoria antes de adicionar produtos.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Por favor, crie uma categoria primeiro para poder adicionar produtos.
            </p>
            <Button asChild className="w-full">
              <Link href="/painel/categorias">
                Ir para Categorias
              </Link>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Produto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao catálogo. Preencha os campos abaixo.
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
                placeholder="Nome do produto"
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
                placeholder="Descrição do produto"
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
                placeholder="0.00"
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoriaId" className="text-right">
                Categoria*
              </Label>
              <Select name="categoriaId" required disabled={isPending}>
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
              {isPending ? 'Criando...' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
