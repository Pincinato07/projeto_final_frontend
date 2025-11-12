'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import PedidoCard from './_components/pedido-card'
import { toast } from 'sonner'
import { listarPedidos } from './actions'

type Pedido = {
  id: string
  clienteNome: string
  endereco: string
  telefone: string
  createdAt: string
  itens: Array<{
    id: string
    quantidade: number
    preco: number
    produto: {
      id: string
      nome: string
      preco: number
    }
  }>
  total: number
  status?: string
}

export default function PedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.telefone.includes(searchTerm) ||
    (pedido.status && pedido.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pedido.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const resultado = await listarPedidos()
        if ('error' in resultado) {
          throw new Error(resultado.error || 'Erro ao carregar pedidos')
        }
        setPedidos(resultado.data || [])
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err)
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os pedidos. Tente novamente mais tarde.')
        toast.error('Erro ao carregar pedidos')
      } finally {
        setIsLoading(false)
      }
    }

    carregarPedidos()
  }, [])

  async function handleDeletePedido(id: string) {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return
    
    try {
      setIsDeleting(id)
      const response = await fetch(`/api/pedidos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir pedido')
      }

      setPedidos(pedidos.filter(pedido => pedido.id !== id))
      toast.success('Pedido excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pedido')
    } finally {
      setIsDeleting(null)
    }
  }

  // Funções de formatação movidas para o componente PedidoCard

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Button asChild>
          <Link href="/painel/pedidos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pedidos..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? 'pedido' : 'pedidos'} encontrados
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum pedido encontrado' : 'Nenhum pedido cadastrado'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? (
                  'Tente ajustar sua busca ou crie um novo pedido.'
                ) : (
                  'Clique em "Novo Pedido" para começar.'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosFiltrados.map((pedido: Pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onDelete={handleDeletePedido}
                  isDeleting={isDeleting === pedido.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}