'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCollection(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const isPublic = formData.get('isPublic') === 'true'

  if (!name || !category) {
    throw new Error('Name and category are required')
  }

  const collection = await prisma.collection.create({
    data: {
      name,
      category,
      description: description || null,
      isPublic,
      userId: user.id,
    },
  })

  revalidatePath('/collections')
  redirect(`/collections/${collection.id}`)
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const isPublic = formData.get('isPublic') === 'true'

  // Verify ownership
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!collection || collection.userId !== user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.collection.update({
    where: { id },
    data: {
      name,
      category,
      description: description || null,
      isPublic,
    },
  })

  revalidatePath('/collections')
  revalidatePath(`/collections/${id}`)
  redirect(`/collections/${id}`)
}

export async function deleteCollection(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!collection || collection.userId !== user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.collection.delete({
    where: { id },
  })

  revalidatePath('/collections')
  redirect('/collections')
}
