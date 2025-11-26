'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function CartButton() {
  const { totalItems } = useCart()

  return (
    <Button asChild variant="outline" className="relative">
      <Link href="/carrinho">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  )
}

