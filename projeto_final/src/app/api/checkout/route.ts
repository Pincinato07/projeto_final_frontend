import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma-client'
import { z } from 'zod'

const checkoutSchema = z.object({
  clienteNome: z.string().min(3).max(100),
  email: z.string().email(),
  telefone: z.string().min(10).max(20),
  endereco: z.string().min(10).max(200),
  itens: z.array(
    z.object({
      produtoId: z.string(),
      quantidade: z.number().int().positive(),
      preco: z.number().positive(),
    })
  ).min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados
    const result = checkoutSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    const { clienteNome, email, telefone, endereco, itens } = result.data

    // Criar pedido com transação
    const pedido = await prisma.$transaction(async (tx) => {
      // Criar o pedido
      const novoPedido = await tx.pedido.create({
        data: {
          clienteNome,
          email,
          telefone,
          endereco,
          status: 'pendente',
        },
      })

      // Adicionar itens
      for (const item of itens) {
        // Buscar preço atual do produto
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        })

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`)
        }

        await tx.pedidoItem.create({
          data: {
            pedidoId: novoPedido.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco: produto.preco,
          },
        })
      }

      return novoPedido
    })

    return NextResponse.json({ success: true, pedidoId: pedido.id })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}

