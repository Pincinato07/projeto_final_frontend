'use client'

import Link from 'next/link'
import { Settings, User, Pizza } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartButton from './cart-button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Pizza className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-stone-800 hidden sm:inline">
            Pizza Express
          </span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="text-stone-500 hover:text-stone-800 hover:bg-amber-50 rounded-full">
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-stone-500 hover:text-stone-800 hover:bg-amber-50 rounded-full">
            <Link href="/painel">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
