import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/actions";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="container flex flex-col items-center gap-8 pt-24 pb-16 md:pt-32 md:pb-24">
          <Badge variant="secondary" className="mb-4">
            Track Everything You Love
          </Badge>
          <h1 className="text-center text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Organize Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Collections
            </span>
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
            Track your personal collections of board games, video games, books, movies, and more. 
            Keep everything organized in one beautiful place.
          </p>
          <div className="flex gap-4 mt-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-6 w-6 text-primary-foreground"
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
              </div>
              <h3 className="text-xl font-semibold">Multiple Categories</h3>
              <p className="text-muted-foreground">
                Track board games, video games, books, movies, and any other collection type you can imagine.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Smart Organization</h3>
              <p className="text-muted-foreground">
                Use custom tags, categories, and filters to organize your collections exactly how you want.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Track Everything</h3>
              <p className="text-muted-foreground">
                Track what you own, what&apos;s on your wishlist, what you&apos;ve borrowed, and more.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="container py-16 md:py-24">
            <div className="flex flex-col items-center gap-6 rounded-lg border border-border/50 bg-card p-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to Get Organized?
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                Start tracking your collections today. It&apos;s free and takes less than a minute.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
