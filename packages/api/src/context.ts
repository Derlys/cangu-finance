import { auth } from '@cangu-finance/auth'
import { db } from '@cangu-finance/db'
import { env } from '@cangu-finance/env/server'
import { createSolanaClient } from '@cangu-finance/solana-client'
import type { Context as HonoContext } from 'hono'

export type CreateContextOptions = {
  context: HonoContext
}

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  })

  const solana = createSolanaClient({
    url: env.SOLANA_ENDPOINT,
  })

  return {
    session,
    solana,
    db,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
