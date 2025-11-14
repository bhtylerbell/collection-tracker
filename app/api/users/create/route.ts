import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { id, email, name } = await request.json()

    // Verify the request is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== id) {
      console.error('Auth error:', authError)
      console.error('User mismatch:', { requestId: id, userId: user?.id })
      return NextResponse.json({ error: 'Unauthorized', details: authError?.message }, { status: 401 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (existingUser) {
      return NextResponse.json({ user: existingUser, message: 'User already exists' })
    }

    // Create user in database
    const dbUser = await prisma.user.create({
      data: {
        id,
        email,
        name,
      },
    })

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
