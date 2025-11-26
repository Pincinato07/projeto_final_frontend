import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/cart-context'

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}

