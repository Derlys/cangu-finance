import { solanaAuthClient } from '@cangu-finance/better-auth-solana/client'
import { env } from '@cangu-finance/env/web'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [solanaAuthClient()],
})
