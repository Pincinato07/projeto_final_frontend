'use client'

import Link from 'next/link'
import { Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartButton from './cart-button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-3xl">🍕</span>
          <span className="hidden sm:inline">Delivery</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Link href="/login" title="Área do Cliente">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Link href="/painel" title="Painel Administrativo">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <CartButton />
        </div>
      </div>
    </header>
  )
}

