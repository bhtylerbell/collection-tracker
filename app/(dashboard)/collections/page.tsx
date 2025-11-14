import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type CollectionWithItems = {
  id: string
  name: string
  category: string
  description: string | null
  isPublic: boolean
  items: unknown[]
}

export default async function CollectionsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="flex-1">
      <div className="container mx-auto py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your collections
            </p>
          </div>
          <Link href="/collections/new">
            <Button size="lg">
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
              Create Collection
            </Button>
          </Link>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-sm">
                Start organizing your items by creating your first collection
              </p>
              <Link href="/collections/new">
                <Button>Create Your First Collection</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection: CollectionWithItems) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{collection.category}</Badge>
                      {collection.isPublic && (
                        <Badge variant="outline" className="ml-2">
                          Public
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{collection.name}</CardTitle>
                    {collection.description && (
                      <CardDescription className="line-clamp-2">
                        {collection.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter className="text-sm text-muted-foreground">
                    {collection.items.length}{' '}
                    {collection.items.length === 1 ? 'item' : 'items'}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
