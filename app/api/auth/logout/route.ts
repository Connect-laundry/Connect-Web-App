import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd invalidate the token
    // For now, just return success
    return NextResponse.json({
      message: 'Successfully logged out',
    })
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
