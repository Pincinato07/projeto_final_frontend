'use client'

import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'

interface Props {
  produto: {
    id: string
    nome: string
    preco: number
    imagem: string | null
  }
}

export default function AddToCartButton({ produto }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(produto)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Button
      onClick={handleAdd}
      size="sm"
      className={`rounded-full transition-all ${
        added
          ? 'bg-green-500 hover:bg-green-500'
          : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400'
      }`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Adicionado
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </>
      )}
    </Button>
  )
}
