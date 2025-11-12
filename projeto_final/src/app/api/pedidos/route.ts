import { NextResponse } from 'next/server'
import { listarPedidos } from '@/app/painel/pedidos/actions'

export async function GET() {
  try {
    const pedidos = await listarPedidos()
    return NextResponse.json(pedidos)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
