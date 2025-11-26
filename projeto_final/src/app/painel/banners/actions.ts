'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const bannerSchema = z.object({
  titulo: z.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode ter mais de 100 caracteres'),
  imagem: z.string()
    .url('A URL da imagem deve ser válida')
    .min(1, 'A URL da imagem é obrigatória'),
  ativo: z.boolean().default(true),
  ordem: z.coerce.number().int().min(0).default(0),
})

export async function criarBanner(formData: FormData) {
  const rawData = {
    titulo: formData.get('titulo') as string,
    imagem: formData.get('imagem') as string,
    ativo: formData.get('ativo') === 'true',
    ordem: Number(formData.get('ordem')) || 0,
  }

  const result = bannerSchema.safeParse(rawData)

  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    await prisma.banner.create({
      data: {
        titulo: result.data.titulo.trim(),
        imagem: result.data.imagem.trim(),
        ativo: result.data.ativo,
        ordem: result.data.ordem,
      },
    })

    revalidatePath('/painel/banners')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return { error: 'Erro ao criar banner' }
  }
}

export async function editarBanner(id: string, formData: FormData) {
  const rawData = {
    titulo: formData.get('titulo') as string,
    imagem: formData.get('imagem') as string,
    ativo: formData.get('ativo') === 'true',
    ordem: Number(formData.get('ordem')) || 0,
  }

  const result = bannerSchema.safeParse(rawData)

  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Dados inválidos'
    return { error }
  }

  try {
    await prisma.banner.update({
      where: { id },
      data: {
        titulo: result.data.titulo.trim(),
        imagem: result.data.imagem.trim(),
        ativo: result.data.ativo,
        ordem: result.data.ordem,
      },
    })

    revalidatePath('/painel/banners')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar banner:', error)
    return { error: 'Erro ao editar banner' }
  }
}

export async function excluirBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    })

    revalidatePath('/painel/banners')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir banner:', error)
    return { error: 'Erro ao excluir banner' }
  }
}

