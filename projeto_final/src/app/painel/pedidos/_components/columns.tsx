'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export type Pedido = {
  id: string
  clienteNome: string
  endereco: string
  telefone: string
  createdAt: string
  status?: string
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
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function calcularTotal(itens: Pedido['itens']) {
  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0)
}

function getStatusBadge(status?: string) {
  const statusLower = status?.toLowerCase() || 'pendente'
  
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pendente: { variant: 'secondary', label: 'Pendente' },
    em_preparo: { variant: 'default', label: 'Em Preparo' },
    entregue: { variant: 'outline', label: 'Entregue' },
    cancelado: { variant: 'destructive', label: 'Cancelado' },
  }
  
  const config = variants[statusLower] || variants.pendente
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const createColumns = (
  onDelete: (id: string) => void
): ColumnDef<Pedido>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return <span className="font-mono text-xs">{id.slice(0, 8)}...</span>
    },
  },
  {
    accessorKey: 'clienteNome',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
  },
  {
    accessorKey: 'endereco',
    header: 'Endereço',
    cell: ({ row }) => {
      const endereco = row.getValue('endereco') as string
      return (
        <span className="max-w-[200px] truncate block" title={endereco}>
          {endereco}
        </span>
      )
    },
  },
  {
    accessorKey: 'itens',
    header: 'Itens',
    cell: ({ row }) => {
      const itens = row.original.itens
      const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0)
      return <span>{totalItens} item(s)</span>
    },
  },
  {
    id: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const total = calcularTotal(row.original.itens)
      return <span className="font-medium">{formatCurrency(total)}</span>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const pedido = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/painel/pedidos/${pedido.id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(pedido.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

