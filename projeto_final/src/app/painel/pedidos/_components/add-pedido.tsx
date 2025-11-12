'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Minus, X, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { criarPedido } from '../actions'
import { toast } from 'sonner'

type ProdutoSelecionado = {
  id: string
  nome: string
  preco: number
  quantidade: number
}

type Categoria = {
  id: string
  nome: string
}

type Produto = {
  id: string
  nome: string
  preco: number
  categoria: Categoria
}

export default function AddPedido() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carregar produtos ao iniciar o componente
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch('/api/produtos')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao carregar produtos')
        }
        const data = await response.json()
        setProdutos(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        toast.error(error instanceof Error ? error.message : 'Não foi possível carregar os produtos')
      } finally {
        setIsLoading(false)
      }
    }

    carregarProdutos()
  }, [])

  const adicionarProduto = () => {
    try {
      if (!produtoSelecionado) {
        toast.error('Selecione um produto')
        return
      }

      if (quantidade < 1) {
        toast.error('A quantidade deve ser maior que zero')
        return
      }

      const produto = produtos.find(p => p.id === produtoSelecionado)
      if (!produto) {
        toast.error('Produto não encontrado')
        return
      }

      // Verificar se o produto já foi adicionado
      setProdutosSelecionados(prev => {
        const produtoExistente = prev.find(p => p.id === produtoSelecionado)
        
        if (produtoExistente) {
          // Atualizar quantidade se o produto já foi adicionado
          return prev.map(p =>
            p.id === produtoSelecionado
              ? { ...p, quantidade: p.quantidade + quantidade }
              : p
          )
        } else {
          // Adicionar novo produto
          return [
            ...prev,
            {
              id: produto.id,
              nome: produto.nome,
              preco: produto.preco,
              quantidade,
            },
          ]
        }
      })

      // Resetar seleção
      setProdutoSelecionado('')
      setQuantidade(1)
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
      toast.error('Erro ao adicionar produto ao pedido')
    }
  }

  const removerProduto = (id: string) => {
    try {
      setProdutosSelecionados(prev => {
        const newItems = prev.filter(p => p.id !== id)
        if (newItems.length === prev.length) {
          toast.error('Produto não encontrado no pedido')
        }
        return newItems
      })
    } catch (error) {
      console.error('Erro ao remover produto:', error)
      toast.error('Erro ao remover produto do pedido')
    }
  }

  const atualizarQuantidade = (id: string, novaQuantidade: number) => {
    try {
      if (novaQuantidade < 1) {
        toast.error('A quantidade deve ser maior que zero')
        return
      }
      
      setProdutosSelecionados(prev => {
        const produto = prev.find(p => p.id === id)
        if (!produto) {
          toast.error('Produto não encontrado no pedido')
          return prev
        }
        
        return prev.map(p =>
          p.id === id ? { ...p, quantidade: novaQuantidade } : p
        )
      })
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
      toast.error('Erro ao atualizar quantidade do produto')
    }
  }

  const calcularTotal = () => {
    return produtosSelecionados.reduce(
      (total, produto) => total + produto.preco * produto.quantidade,
      0
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      // Validar dados do formulário
      const form = e.currentTarget
      const formData = new FormData(form)
      
      // Validar campos obrigatórios
      const clienteNome = formData.get('clienteNome') as string
      const telefone = formData.get('telefone') as string
      const endereco = formData.get('endereco') as string
      
      if (!clienteNome?.trim()) {
        toast.error('O nome do cliente é obrigatório')
        return
      }
      
      if (!telefone?.trim()) {
        toast.error('O telefone é obrigatório')
        return
      }
      
      if (!endereco?.trim()) {
        toast.error('O endereço de entrega é obrigatório')
        return
      }
      
      // Validar itens do pedido
      if (produtosSelecionados.length === 0) {
        toast.error('Adicione pelo menos um item ao pedido')
        return
      }

      // Preparar itens para envio
      const itensParaEnvio = produtosSelecionados.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        preco: item.preco
      }))
      
      // Adicionar itens ao formData
      formData.set('itens', JSON.stringify(itensParaEnvio))
      
      // Enviar dados
      setIsSubmitting(true)
      const result = await criarPedido(formData)
      
      if (!result.success) {
        throw new Error(result.error || 'Não foi possível criar o pedido')
      }
      
      // Redirecionar após sucesso
      toast.success('Pedido criado com sucesso!')
      router.push('/painel/pedidos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      
      // Mensagens de erro mais amigáveis
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ocorreu um erro ao processar o pedido. Tente novamente.'
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Novo Pedido</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Preencha os dados do cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clienteNome">Nome do Cliente *</Label>
                <Input
                  id="clienteNome"
                  name="clienteNome"
                  placeholder="Nome completo"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço de Entrega *</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  placeholder="Rua, número, complemento, bairro"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
              <CardDescription>Adicione os itens do pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select
                    value={produtoSelecionado}
                    onValueChange={setProdutoSelecionado}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map(produto => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome} - {produto.categoria.nome} -{' '}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(produto.preco)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none h-10"
                      onClick={() => setQuantidade(prev => Math.max(1, prev - 1))}
                      disabled={isSubmitting}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={e => setQuantidade(Number(e.target.value) || 1)}
                      className="rounded-none text-center w-16 h-10"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none h-10"
                      onClick={() => setQuantidade(prev => prev + 1)}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={adicionarProduto}
                disabled={!produtoSelecionado || isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>

              {produtosSelecionados.length > 0 ? (
                <div className="border rounded-lg divide-y">
                  {produtosSelecionados.map(item => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.preco)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            atualizarQuantidade(item.id, item.quantidade - 1)
                          }
                          disabled={isSubmitting}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            atualizarQuantidade(item.id, item.quantidade + 1)
                          }
                          disabled={isSubmitting}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removerProduto(item.id)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-center">
                    Nenhum item adicionado ao pedido
                    <br />
                    <span className="text-sm">
                      Adicione produtos ao carrinho para continuar
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Itens</span>
                  <span className="text-sm font-medium">
                    {produtosSelecionados.reduce(
                      (total, item) => total + item.quantidade,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Valor dos Itens
                  </span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(calcularTotal())}
                  </span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(calcularTotal())}
                  </span>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Finalizar Pedido'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
