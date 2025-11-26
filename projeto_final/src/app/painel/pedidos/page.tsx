'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { listarPedidos } from './actions'
import { DataTable } from './_components/data-table'
import { createColumns, Pedido } from './_components/columns'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  function handleDeletePedido(id: string) {
    setDeleteId(id)
  }

  async function confirmDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/pedidos/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir pedido')
      }

      setPedidos(pedidos.filter(pedido => pedido.id !== deleteId))
      toast.success('Pedido excluido com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pedido')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pedido? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
