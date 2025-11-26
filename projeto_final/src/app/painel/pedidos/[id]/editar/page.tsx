'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Pedido {
  id: string
  clienteNome: string
  email?: string
  endereco: string
  telefone: string
  status: string
  itens: Array<{
    id: string
    quantidade: number
    preco: number
    produto: {
      nome: string
    }
  }>
}

export default function EditarPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [clienteNome, setClienteNome] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')
  const [status, setStatus] = useState('pendente')

  useEffect(() => {
    async function carregarPedido() {
      try {
        const res = await fetch(`/api/pedidos/${id}`)
        if (!res.ok) throw new Error('Erro ao carregar pedido')
        const { data } = await res.json()
        setPedido(data)
        setClienteNome(data.clienteNome)
        setEmail(data.email || '')
        setEndereco(data.endereco)
        setTelefone(data.telefone)
        setStatus(data.status || 'pendente')
      } catch (err) {
        toast.error('Erro ao carregar pedido')
        router.push('/painel/pedidos')
      } finally {
        setLoading(false)
      }
    }
    carregarPedido()
  }, [id, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNome,
          email,
          endereco,
          telefone,
          status,
        }),
      })

      if (!res.ok) throw new Error('Erro ao salvar')

      toast.success('Pedido atualizado!')
      router.push('/painel/pedidos')
    } catch (err) {
      toast.error('Erro ao salvar pedido')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!pedido) return null

  const total = pedido.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/painel/pedidos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Editar Pedido</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="clienteNome">Nome</Label>
                  <Input
                    id="clienteNome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereco</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_preparo">Em Preparo</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantidade}x {item.produto.nome}</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.preco * item.quantidade)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

