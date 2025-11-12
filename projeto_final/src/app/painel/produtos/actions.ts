'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema de validação com Zod
const produtoSchema = z.object({
  nome: z.string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome não pode ter mais de 100 caracteres'),
  descricao: z.string()
    .max(500, 'A descrição não pode ter mais de 500 caracteres')
    .optional()
    .or(z.literal('')),
  preco: z.coerce
    .number({
      invalid_type_error: 'O preço deve ser um número',
    })
    .positive('O preço deve ser maior que zero')
    .min(0.01, 'O preço deve ser maior que zero'),
  categoriaId: z.string().min(1, 'Selecione uma categoria')
})

type ProdutoInput = z.infer<typeof produtoSchema>

export async function criarProduto(formData: FormData) {
  // Converter FormData para objeto
  const rawData = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || '',
    preco: formData.get('preco') ? Number(formData.get('preco')) : 0,
    categoriaId: formData.get('categoriaId') as string
  }

  // Validar os dados com Zod
  const result = produtoSchema.safeParse(rawData)

  // Se a validação falhar, retornar os erros
  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    await prisma.$executeRaw`
      INSERT INTO produto (nome, descricao, preco, categoria_id, created_at, updated_at)
      VALUES (
        ${result.data.nome.trim()},
        ${result.data.descricao?.trim() || null},
        ${Number(result.data.preco)},
        ${result.data.categoriaId},
        NOW(),
        NOW()
      )
    `

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  // Converter FormData para objeto
  const rawData = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || '',
    preco: formData.get('preco') ? formData.get('preco') : '0',
    categoriaId: formData.get('categoriaId') as string
  }

  // Validar os dados com Zod
  const result = produtoSchema.safeParse(rawData)

  // Se a validação falhar, retornar os erros
  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    await prisma.$executeRaw`
      UPDATE produto
      SET 
        nome = ${result.data.nome.trim()},
        descricao = ${result.data.descricao?.trim() || null},
        preco = ${Number(result.data.preco)},
        categoria_id = ${result.data.categoriaId},
        updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return { error: 'Erro ao atualizar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    // Verificar se existem pedidos vinculados a este produto
    const pedidosVinculados = await prisma.$queryRaw<Array<{count: number}>>`
      SELECT COUNT(*) as count
      FROM pedido_item
      WHERE produto_id = ${id}
    `

    if (pedidosVinculados[0].count > 0) {
      return { error: 'Não é possível excluir este produto pois existem pedidos vinculados a ele.' }
    }

    await prisma.$executeRaw`
      DELETE FROM produto
      WHERE id = ${id}
    `

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Não foi possível excluir o produto. Verifique se não existem pedidos vinculados a ele.' }
  }
}

export async function buscarProdutoPorId(id: string) {
  try {
    // Validar o ID
    if (!id || typeof id !== 'string') {
      return { error: 'ID do produto inválido' }
    }

    const produtos = await prisma.$queryRaw<Array<{
      id: string
      nome: string
      descricao: string | null
      preco: number
      categoria_id: string
      categoria: string
    }>>`
      SELECT p.*, c.nome as categoria
      FROM produto p
      JOIN categoria c ON p.categoria_id = c.id
      WHERE p.id = ${id}
    `

    if (produtos.length === 0) {
      return { error: 'Produto não encontrado' }
    }

    const produto = produtos[0]

    return { 
      data: {
        ...produto,
        categoriaId: produto.categoria_id,
        categoria: {
          id: produto.categoria_id,
          nome: produto.categoria
        }
      } 
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return { error: 'Erro ao buscar produto' }
  }
}

export async function listarCategorias() {
  try {
    const categorias = await prisma.$queryRaw<Array<{
      id: string
      nome: string
    }>>`
      SELECT id, nome
      FROM categoria
      ORDER BY nome ASC
    `
    
    return categorias
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}
