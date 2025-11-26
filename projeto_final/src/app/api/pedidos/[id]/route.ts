import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma-client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.pedidoItem.deleteMany({
      where: { pedidoId: id },
    })

    await prisma.pedido.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir pedido' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const pedido = await prisma.pedido.update({
      where: { id },
      data: {
        clienteNome: body.clienteNome,
        email: body.email,
        endereco: body.endereco,
        telefone: body.telefone,
        status: body.status,
      },
    })

    return NextResponse.json({ success: true, data: pedido })
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido nao encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: pedido })
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    )
  }
}
