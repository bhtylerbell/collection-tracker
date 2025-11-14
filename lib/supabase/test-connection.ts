import { createClient } from '@/lib/supabase/client'

/**
 * Test Supabase connection from the client side
 * Run this in a browser console or component
 */
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  const supabase = createClient()

  try {
    // Test 1: Check if we can connect to Supabase
    const { error } = await supabase.from('_prisma_migrations').select('count').limit(1)
    
    if (error) {
      // If _prisma_migrations doesn't exist, that's okay - try a simple query
      console.log('⚠️  Prisma migrations table not found (expected if Prisma not set up yet)')
      
      // Test basic connection
      const { error: healthError } = await supabase.from('').select('*').limit(0)
      
      if (healthError && !healthError.message.includes('FROM')) {
        console.error('❌ Connection failed:', healthError)
        return { success: false, error: healthError }
      }
    }

    console.log('✅ Supabase connection successful!')

    // Test 2: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️  No user logged in (expected):', authError.message)
    } else if (user) {
      console.log('✅ User authenticated:', user.email)
    } else {
      console.log('ℹ️  No user currently logged in')
    }

    // Test 3: Check environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
    }
    
    console.log('🔐 Environment Variables:', envVars)

    return { 
      success: true, 
      user: user || null,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL 
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return { success: false, error: err }
  }
}
