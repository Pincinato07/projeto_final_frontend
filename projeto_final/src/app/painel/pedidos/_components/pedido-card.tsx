'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

type Pedido = {
  id: string
  clienteNome: string
  endereco: string
  telefone: string
  status?: string
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
}

type PedidoCardProps = {
  pedido: Pedido
  onDelete: (id: string) => void
  isDeleting: boolean
}

export default function PedidoCard({ pedido, onDelete, isDeleting }: PedidoCardProps) {
  // Usar o preço do item se disponível, caso contrário, usar o preço do produto
  const total = pedido.itens.reduce((acc, item) => {
    const preco = item.preco || item.produto?.preco || 0
    return acc + (preco * item.quantidade)
  }, 0)

  const totalItens = pedido.itens.reduce((acc, item) => acc + item.quantidade, 0)

  // Garantir que o status tenha um valor padrão
  const status = pedido.status || 'pendente'
  
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'em andamento':
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'concluido':
      case 'concluído':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Pedido #{pedido.id.slice(0, 8).toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(pedido.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>
          <Badge className={getStatusVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="font-medium">{pedido.clienteNome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p className="font-medium">{pedido.telefone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
            <p className="font-medium">{pedido.endereco}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Itens</p>
              <p className="text-sm font-medium">{totalItens} itens</p>
            </div>
            <div className="space-y-2">
              {pedido.itens.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantidade}x {item.produto.nome}
                  </span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.produto.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/painel/pedidos/${pedido.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(pedido.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
