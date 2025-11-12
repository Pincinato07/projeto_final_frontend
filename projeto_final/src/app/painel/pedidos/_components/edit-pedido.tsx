'use client'

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buscarPedidoPorId, atualizarPedido } from '../actions'
import { useRouter } from 'next/navigation'

// Simulação do hook useToast que não está disponível
const useToast = () => ({
  toast: (options: { title: string; description: string; variant?: string }) => {
    if (options.variant === 'destructive') {
      console.error(`[${options.title}] ${options.description}`)
    } else {
      console.log(`[${options.title}] ${options.description}`)
    }
  },
})

export default function EditPedidoForm({ id }: { id: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [state, formAction] = useFormState(
    async (prevState: { error: string | null; success: boolean }, formData: FormData) => {
      try {
        const result = await atualizarPedido(id, formData);
        if (!result.success) {
          return { error: result.error || 'Erro ao atualizar pedido', success: false };
        }
        return { error: null, success: true };
      } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        return { 
          error: error instanceof Error ? error.message : 'Erro ao atualizar pedido', 
          success: false 
        };
      }
    },
    { error: null, success: false }
  )
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarPedido() {
      try {
        const resultado = await buscarPedidoPorId(id)
        if ('error' in resultado) {
          toast({
            title: 'Erro',
            description: resultado.error || 'Erro ao carregar pedido',
            variant: 'destructive',
          })
          return
        }
        setPedido(resultado.data)
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao carregar pedido',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    carregarPedido()
  }, [id, toast])

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Sucesso',
        description: 'Pedido atualizado com sucesso!',
      })
      router.push('/painel/pedidos')
      router.refresh()
    } else if (state?.error) {
      toast({
        title: 'Erro',
        description: state.error,
        variant: 'destructive',
      })
    }
  }, [state, router, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Pedido não encontrado</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clienteNome">Nome do Cliente</Label>
            <Input
              id="clienteNome"
              name="clienteNome"
              placeholder="Digite o nome do cliente"
              required
              defaultValue={pedido.clienteNome}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="Digite o telefone"
              required
              defaultValue={pedido.telefone}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Textarea
            id="endereco"
            name="endereco"
            placeholder="Digite o endereço de entrega"
            required
            rows={3}
            defaultValue={pedido.endereco}
          />
        </div>
        <div className="space-y-2">
          <Label>Itens do Pedido</Label>
          <div className="border rounded-md p-4 space-y-4">
            {pedido.itens.map((item: any, index: number) => (
              <div key={item.id} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <Label>Produto</Label>
                  <Input
                    name={`itens[${index}].produtoId`}
                    value={item.produto.id}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    name={`itens[${index}].quantidade`}
                    min="1"
                    required
                    defaultValue={item.quantidade}
                  />
                </div>
                <div>
                  <Label>Preço Unitário</Label>
                  <Input
                    value={item.produto.preco.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input
                    value={(item.quantidade * item.produto.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                    readOnly
                    className="bg-muted font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/painel/pedidos')}
        >
          Cancelar
        </Button>
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        'Salvar Alterações'
      )}
    </Button>
  )
}
