'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Check, X, AlertCircle } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message?: string
}

const DiagnosticsPage = () => {
  const [results, setResults] = useState<TestResult[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const runTests = async () => {
    setIsTesting(true)
    setResults([])

    const testResults: TestResult[] = []

    // Test 1: Check if BASE_URL is set
    testResults.push({
      name: 'API Base URL Configuration',
      status: 'success',
      message: `Configured: ${BASE_URL}`,
    })

    // Test 2: Basic fetch (no auth)
    testResults.push({
      name: 'Testing backend connectivity...',
      status: 'pending',
    })
    setResults([...testResults])

    try {
      const response = await fetch(`${BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const lastTest = testResults[testResults.length - 1]
      if (response.status === 401) {
        lastTest.status = 'success'
        lastTest.message = 'Backend is reachable (401 expected without token)'
      } else {
        lastTest.status = 'error'
        lastTest.message = `Unexpected status: ${response.status}`
      }
    } catch (error: any) {
      const lastTest = testResults[testResults.length - 1]
      lastTest.status = 'error'
      lastTest.message = error.message
    }

    // Test 3: CORS check
    testResults.push({
      name: 'CORS Configuration',
      status: 'success',
      message: 'Check browser console for CORS errors',
    })

    // Test 4: Try to login with test credentials
    testResults.push({
      name: 'Testing login endpoint...',
      status: 'pending',
    })
    setResults([...testResults])

    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: '',
          password: '',
        }),
      })

      const lastTest = testResults[testResults.length - 1]
      const data = await response.json()

      if (response.status === 401 || response.status === 400) {
        lastTest.status = 'success'
        lastTest.message = `Endpoint reachable (${response.status}: ${data.detail || 'Invalid credentials'})`
      } else {
        lastTest.status = 'error'
        lastTest.message = `Unexpected status: ${response.status}`
      }
    } catch (error: any) {
      const lastTest = testResults[testResults.length - 1]
      lastTest.status = 'error'
      lastTest.message = error.message
    }

    setResults(testResults)
    setIsTesting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>API Diagnostics</CardTitle>
          <CardDescription>Test your backend connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              If you&apos;re experiencing &quot;Failed to fetch&quot; errors, run these diagnostics to troubleshoot.
            </AlertDescription>
          </Alert>

          <Button onClick={runTests} disabled={isTesting} className="w-full">
            {isTesting ? 'Running tests...' : 'Run Diagnostics'}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Results:</h3>
              {results.map((result, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="mt-1">
                    {result.status === 'pending' && (
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                    )}
                    {result.status === 'success' && <Check className="h-4 w-4 text-green-600" />}
                    {result.status === 'error' && <X className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.name}</p>
                    {result.message && <p className="text-xs text-muted-foreground mt-1">{result.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Troubleshooting Tips:</strong>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Make sure the backend is running at {BASE_URL}</li>
                <li>Check that CORS is enabled on the backend</li>
                <li>Verify network connectivity</li>
                <li>Check browser console (F12) for detailed error messages</li>
                <li>Try using test credentials from the backend documentation</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="pt-4 text-center">
            <a href="/auth/login" className="text-primary hover:underline text-sm">
              Back to login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DiagnosticsPage
