'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Create user record in our database
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Insert user into our users table
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        name: data.options.data.name,
      })

    if (dbError) {
      console.error('Error creating user record:', dbError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
