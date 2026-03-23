import type { RouterClient } from '@orpc/server'
import { o, protectedProcedure, publicProcedure } from '../index' // Importa la 'o' también
import { solanaRouter } from './solana'
import { todoRouter } from './todo'
import { vaultsRouter } from './vaults'

// USA o.router() PARA ENVOLVER TODO EL OBJETO
export const appRouter = o.router({
  healthCheck: publicProcedure.handler(() => {
    return 'OK'
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: 'This is private',
      user: context.session?.user,
    }
  }),
  todo: todoRouter,
  solana: solanaRouter,
  vaults: vaultsRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
