'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Inicializar o Prisma Client
const prisma = new PrismaClient()

// Tipos para os dados de retorno
type SuccessResponse = { success: true; data?: any }
type ErrorResponse = { success: false; error: string }
type ActionResponse = SuccessResponse | ErrorResponse

// Schema de validação para itens do pedido
const itemPedidoSchema = z.object({
  produtoId: z.string().min(1, 'Selecione um produto'),
  quantidade: z.number()
    .int('A quantidade deve ser um número inteiro')
    .positive('A quantidade deve ser maior que zero'),
  preco: z.number().positive('O preço deve ser maior que zero')
})

// Schema de validação para o pedido
const pedidoSchema = z.object({
  clienteNome: z.string()
    .min(3, 'O nome do cliente deve ter pelo menos 3 caracteres')
    .max(100, 'O nome do cliente não pode ter mais de 100 caracteres'),
  
  endereco: z.string()
    .min(5, 'O endereço deve ter pelo menos 5 caracteres')
    .max(200, 'O endereço não pode ter mais de 200 caracteres'),
  
  telefone: z.string()
    .min(10, 'O telefone deve ter pelo menos 10 dígitos')
    .max(20, 'O telefone não pode ter mais de 20 dígitos'),
  
  itens: z.array(itemPedidoSchema)
    .min(1, 'O pedido deve conter pelo menos um item'),
  
  status: z.string()
    .default('PENDENTE')
    .optional()
    .transform(val => val ? val.toUpperCase() : 'PENDENTE')
})

type PedidoInput = z.infer<typeof pedidoSchema> & {
  itens: Array<{
    produtoId: string;
    quantidade: number;
    preco: number;
  }>;
}

export async function criarPedido(formData: FormData): Promise<ActionResponse> {
  try {
    // Converter FormData para objeto
    const rawData = {
      clienteNome: formData.get('clienteNome') as string,
      endereco: formData.get('endereco') as string,
      telefone: formData.get('telefone') as string,
      itens: JSON.parse(formData.get('itens') as string) || []
    }

    // Validar os dados com Zod
    const result = pedidoSchema.safeParse(rawData)

    // Se a validação falhar, retornar os erros
    if (!result.success) {
      const error = result.error.issues[0]?.message || 'Dados inválidos'
      return { success: false, error }
    }

    // Iniciar uma transação para garantir a integridade dos dados
    await prisma.$transaction(async (tx) => {
      // Criar o pedido
      const pedido = await tx.pedido.create({
        data: {
          clienteNome: result.data.clienteNome.trim(),
          endereco: result.data.endereco.trim(),
          telefone: result.data.telefone.trim(),
        },
      })

      // Adicionar os itens do pedido
      for (const item of result.data.itens) {
        // Buscar o preço atual do produto usando a sintaxe correta do Prisma
        const produtos = await tx.$queryRaw<Array<{ preco: number }>>`
          SELECT preco FROM "Produto" WHERE id = ${item.produtoId} LIMIT 1
        `
        
        if (!produtos || produtos.length === 0) {
          throw new Error(`Produto com ID ${item.produtoId} não encontrado`)
        }
        
        const preco = produtos[0]?.preco;
        
        if (!preco) {
          throw new Error(`Preço não encontrado para o produto com ID ${item.produtoId}`)
        }
        
        await tx.pedidoItem.create({
          data: {
            quantidade: item.quantidade,
            preco: preco, // Usar o preço atual do produto
            produtoId: item.produtoId,
            pedidoId: pedido.id,
          },
        })
      }
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao criar pedido' 
    }
  }
}

export async function atualizarPedido(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
    })

    if (!pedidoExistente) {
      return { success: false, error: 'Pedido não encontrado' }
    }

    // Converter FormData para objeto
    const rawData = {
      clienteNome: formData.get('clienteNome') as string,
      endereco: formData.get('endereco') as string,
      telefone: formData.get('telefone') as string,
      itens: JSON.parse(formData.get('itens') as string) || []
    }

    // Validar os dados com Zod
    const result = pedidoSchema.safeParse(rawData)

    // Se a validação falhar, retornar os erros
    if (!result.success) {
      const error = result.error.issues[0]?.message || 'Dados inválidos'
      return { success: false, error }
    }

    // Iniciar uma transação para garantir a integridade dos dados
    await prisma.$transaction(async (tx) => {
      // Atualizar o pedido
      await tx.pedido.update({
        where: { id },
        data: {
          clienteNome: result.data.clienteNome.trim(),
          endereco: result.data.endereco.trim(),
          telefone: result.data.telefone.trim(),
        },
      })

      // Remover itens antigos
      await tx.pedidoItem.deleteMany({
        where: { pedidoId: id },
      })

      // Adicionar os novos itens do pedido
      for (const item of result.data.itens) {
        // Buscar o preço atual do produto
        const produtos = await tx.$queryRaw<Array<{ preco: number }>>`
          SELECT preco FROM "Produto" WHERE id = ${item.produtoId} LIMIT 1
        `
        
        if (!produtos || produtos.length === 0) {
          throw new Error(`Produto com ID ${item.produtoId} não encontrado`)
        }
        
        const preco = produtos[0]?.preco;
        
        if (!preco) {
          throw new Error(`Preço não encontrado para o produto com ID ${item.produtoId}`)
        }
        
        await tx.pedidoItem.create({
          data: {
            quantidade: item.quantidade,
            preco: preco, // Usar o preço atual do produto
            produtoId: item.produtoId,
            pedidoId: id,
          },
        })
      }
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao atualizar pedido' 
    }
  }
}

export async function excluirPedido(id: string): Promise<ActionResponse> {
  try {
    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    })

    if (!pedido) {
      return { success: false, error: 'Pedido não encontrado' }
    }

    // Excluir o pedido
    await prisma.pedido.delete({
      where: { id }
    })
    
    // Limpar os itens do pedido (opcional, pois o onDelete: CASCADE já deve cuidar disso)
    await prisma.pedidoItem.deleteMany({
      where: { pedidoId: id }
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao excluir pedido' 
    }
  }
}

export async function buscarPedidoPorId(id: string): Promise<ActionResponse> {
  try {
    // Buscar o pedido com os itens
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    if (!pedido) {
      return { success: false, error: 'Pedido não encontrado' }
    }

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao buscar pedido' 
    }
  }
}

export async function listarPedidos(): Promise<ActionResponse> {
  try {
    // Buscar todos os pedidos com os itens
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    return { success: true, data: pedidos }
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao listar pedidos' 
    }
  }
}

export async function listarProdutos(): Promise<ActionResponse> {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        preco: true,
      },
    })

    return { success: true, data: produtos }
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao listar produtos' 
    }
  }
}
