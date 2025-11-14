'use client'

import { useState } from 'react'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'

type TestResult = {
  success: boolean
  error?: string
  user?: { email?: string } | null
  url?: string
}

export function TestConnection() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)
    
    const testResult = await testSupabaseConnection()
    // Convert error to string for display
    const displayResult: TestResult = {
      ...testResult,
      error: testResult.error ? String(testResult.error) : undefined,
    }
    setResult(displayResult)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <button
        onClick={handleTest}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Testing...' : 'Test Supabase Connection'}
      </button>

      {result && (
        <div
          className={`rounded-lg p-4 ${
            result.success
              ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800'
              : 'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-xl">
              {result.success ? '✅' : '❌'}
            </span>
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-sm">
                {result.success ? 'Connection Successful!' : 'Connection Failed'}
              </p>
              
              {result.success && (
                <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                  <p>✓ Connected to: {result.url}</p>
                  {result.user ? (
                    <p>✓ Logged in as: {result.user.email}</p>
                  ) : (
                    <p>ℹ️ No user currently logged in</p>
                  )}
                </div>
              )}

              {result.error && (
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {result.error}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Open browser console (F12) to see detailed logs
      </p>
    </div>
  )
}
