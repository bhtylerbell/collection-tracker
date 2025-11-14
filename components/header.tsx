import Link from 'next/link'
import { getUser } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'

export async function Header() {
  const user = await getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href={user ? '/dashboard' : '/'} className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">CT</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Collection Tracker
            </span>
          </Link>
          {user && (
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
              <Link
                href="/collections"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Collections
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
