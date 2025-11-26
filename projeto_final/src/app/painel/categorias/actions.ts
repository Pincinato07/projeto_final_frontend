'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const categoriaSchema = z.object({
  nome: z.string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome não pode ter mais de 50 caracteres'),
  slug: z.string()
    .min(2, 'O slug deve ter pelo menos 2 caracteres')
    .max(50, 'O slug não pode ter mais de 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O slug deve conter apenas letras minúsculas, números e hífens'),
  cor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  imagem: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
})

export async function criarCategoria(formData: FormData) {
  const nome = formData.get('nome') as string
  const slugInput = formData.get('slug') as string
  const cor = formData.get('cor') as string || '#3b82f6'
  const imagem = formData.get('imagem') as string || ''

  const slug = slugInput?.trim() || generateSlug(nome)

  const result = categoriaSchema.safeParse({ nome, slug, cor, imagem })

  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    // Verificar se slug já existe
    const existente = await prisma.categoria.findUnique({ where: { slug } })
    if (existente) {
      return { error: 'Já existe uma categoria com este slug' }
    }

    await prisma.categoria.create({
      data: {
        nome: result.data.nome.trim(),
        slug: result.data.slug,
        cor: result.data.cor,
        imagem: result.data.imagem || null,
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return { error: 'Erro ao criar categoria' }
  }
}

export async function editarCategoria(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const slugInput = formData.get('slug') as string
  const cor = formData.get('cor') as string || '#3b82f6'
  const imagem = formData.get('imagem') as string || ''

  const slug = slugInput?.trim() || generateSlug(nome)

  const result = categoriaSchema.safeParse({ nome, slug, cor, imagem })

  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    // Verificar se slug já existe em outra categoria
    const existente = await prisma.categoria.findUnique({ where: { slug } })
    if (existente && existente.id !== id) {
      return { error: 'Já existe uma categoria com este slug' }
    }

    await prisma.categoria.update({
      where: { id },
      data: {
        nome: result.data.nome.trim(),
        slug: result.data.slug,
        cor: result.data.cor,
        imagem: result.data.imagem || null,
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar categoria:', error)
    return { error: 'Erro ao editar categoria' }
  }
}

export async function excluirCategoria(id: string) {
  try {
    await prisma.categoria.delete({
      where: { id },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return { error: 'Erro ao excluir categoria' }
  }
}