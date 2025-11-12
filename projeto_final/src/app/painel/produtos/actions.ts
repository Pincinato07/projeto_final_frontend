'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'

type ProdutoInput = {
  nome: string
  descricao?: string
  preco: number
  categoriaId: string
}

export async function criarProduto(formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const preco = parseFloat(formData.get('preco') as string)
  const categoriaId = formData.get('categoriaId') as string

  if (!nome || nome.trim() === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (isNaN(preco) || preco <= 0) {
    return { error: 'Preço inválido' }
  }

  if (!categoriaId) {
    return { error: 'Categoria é obrigatória' }
  }

  try {
    await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco,
        categoriaId,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const preco = parseFloat(formData.get('preco') as string)
  const categoriaId = formData.get('categoriaId') as string

  if (!nome || nome.trim() === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (isNaN(preco) || preco <= 0) {
    return { error: 'Preço inválido' }
  }

  if (!categoriaId) {
    return { error: 'Categoria é obrigatória' }
  }

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco,
        categoriaId,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return { error: 'Erro ao atualizar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}

export async function buscarProdutoPorId(id: string) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    })
    return produto
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }
}

export async function listarCategorias() {
  try {
    return await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    })
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    return []
  }
}
