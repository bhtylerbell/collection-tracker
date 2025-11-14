import { getUser } from '@/lib/auth/actions'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default async function CollectionDetailPage({
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
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!collection) {
    notFound()
  }

  // Check if user owns this collection
  const isOwner = collection.userId === user.id

  if (!isOwner && !collection.isPublic) {
    notFound()
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            asChild
            className="mb-4"
          >
            <Link href="/collections">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Collections
            </Link>
          </Button>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{collection.category}</Badge>
                {collection.isPublic && (
                  <Badge variant="outline">Public</Badge>
                )}
                {!isOwner && (
                  <Badge>Shared</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-muted-foreground text-lg">
                  {collection.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Created by {collection.user.name || collection.user.email}
              </p>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/collections/${collection.id}/items/new`}>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Item
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/collections/${collection.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collection.items.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {collection.category.replace('-', ' ')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collection.isPublic ? 'Public' : 'Private'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              {collection.items.length === 0
                ? 'No items yet. Add your first item to get started.'
                : `${collection.items.length} item${collection.items.length === 1 ? '' : 's'} in this collection`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collection.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  className="h-16 w-16 text-muted-foreground mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-muted-foreground mb-4">
                  This collection is empty
                </p>
                {isOwner && (
                  <Button asChild>
                    <Link href={`/collections/${collection.id}/items/new`}>
                      Add Your First Item
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {collection.items.map((item: typeof collection.items[number]) => (
                  <Card key={item.id} className="border-border/50 hover:border-border transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <Badge variant="outline" className="capitalize">
                            {item.status}
                          </Badge>
                        </div>
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 ml-4 relative">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {(item.description || item.notes) && (
                      <CardContent>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
