'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createItem(collectionId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify user owns the collection
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  })

  if (!collection || collection.userId !== user.id) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const notes = formData.get('notes') as string
  const imageUrl = formData.get('imageUrl') as string
  const customFieldsStr = formData.get('customFields') as string

  if (!title) {
    throw new Error('Title is required')
  }

  let customFields = null
  if (customFieldsStr) {
    try {
      customFields = JSON.parse(customFieldsStr)
    } catch {
      // Invalid JSON, ignore
    }
  }

  await prisma.item.create({
    data: {
      title,
      description: description || null,
      status: status || 'owned',
      notes: notes || null,
      imageUrl: imageUrl || null,
      customFields,
      collectionId,
    },
  })

  revalidatePath(`/collections/${collectionId}`)
  redirect(`/collections/${collectionId}`)
}

export async function updateItem(itemId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify user owns the item's collection
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      collection: {
        select: { userId: true, id: true },
      },
    },
  })

  if (!item || item.collection.userId !== user.id) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const notes = formData.get('notes') as string
  const imageUrl = formData.get('imageUrl') as string
  const customFieldsStr = formData.get('customFields') as string

  let customFields = null
  if (customFieldsStr) {
    try {
      customFields = JSON.parse(customFieldsStr)
    } catch {
      // Invalid JSON, ignore
    }
  }

  await prisma.item.update({
    where: { id: itemId },
    data: {
      title,
      description: description || null,
      status: status || 'owned',
      notes: notes || null,
      imageUrl: imageUrl || null,
      customFields,
    },
  })

  revalidatePath(`/collections/${item.collection.id}`)
  redirect(`/collections/${item.collection.id}`)
}

export async function deleteItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify user owns the item's collection
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      collection: {
        select: { userId: true, id: true },
      },
    },
  })

  if (!item || item.collection.userId !== user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.item.delete({
    where: { id: itemId },
  })

  revalidatePath(`/collections/${item.collection.id}`)
  return { success: true }
}
