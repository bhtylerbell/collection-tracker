import { getUser } from '@/lib/auth/actions'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import NewItemForm from '@/components/new-item-form'

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const collection = await prisma.collection.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      category: true,
      userId: true,
    },
  })

  if (!collection) {
    notFound()
  }

  // Check if user owns this collection
  if (collection.userId !== user.id) {
    notFound()
  }

  return (
    <NewItemForm 
      collectionId={collection.id} 
      collectionName={collection.name}
      collectionCategory={collection.category}
    />
  )
}
