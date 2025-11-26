'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export default function CartButton() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/carrinho"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white hover:from-red-500 hover:to-orange-400 transition-all hover:scale-105 shadow-md"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}
