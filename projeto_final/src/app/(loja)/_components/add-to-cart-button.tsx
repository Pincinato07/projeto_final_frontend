'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'

type Produto = {
  id: string
  nome: string
  preco: number
  imagem: string | null
}

export default function AddToCartButton({ produto }: { produto: Produto }) {
  const { addItem } = useCart()

  function handleAddToCart() {
    addItem(produto)
    toast.success(`${produto.nome} adicionado ao carrinho!`)
  }

  return (
    <Button size="sm" onClick={handleAddToCart}>
      <Plus className="h-4 w-4 mr-1" />
      Adicionar
    </Button>
  )
}

