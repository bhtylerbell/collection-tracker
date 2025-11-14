import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
    </div>
  )
}
