'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { listarPedidos } from './actions'
import { DataTable } from './_components/data-table'
import { createColumns, Pedido } from './_components/columns'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    }
  }

  const columns = createColumns(handleDeletePedido)

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
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable columns={columns} data={pedidos} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
