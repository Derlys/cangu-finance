import { goals, walletAddress } from '@cangu-finance/db/schema/index'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import { desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { protectedProcedure, publicProcedure } from '../index'

export const getGoals = publicProcedure
  .input(z.object({ walletAddress: z.string() }))
  .handler(async ({ input, context }) => {
    return await context.db
      .select()
      .from(goals)
      .where(eq(goals.walletAddress, input.walletAddress))
      .orderBy(desc(goals.createdAt))
  })

export const createGoal = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      target: z.number(),
      symbol: z.string(),
    }),
  )
  .handler(async ({ input, context }) => {
    const walletAddress = context.session.user.id

    await context.db.insert(goals).values({
      walletAddress,
      name: input.name,
      target: input.target,
      symbol: input.symbol,
      current: 0,
      createdAt: new Date().toISOString(),
    })

    return { success: true }
  })

export const addProgress = protectedProcedure
  .input(
    z.object({
      goalId: z.number(), // Cambiado de z.string() a z.number()
      amount: z.number(),
    }),
  )
  .handler(async ({ input, context }) => {
    await context.db
      .update(goals)
      .set({
        current: sql`${goals.current} + ${input.amount}`,
      })
      .where(eq(goals.id, input.goalId))

    return { success: true }
  })

export const completeGoal = protectedProcedure
  .input(
    z.object({
      goalId: z.number(), // Cambiado de z.string() a z.number()
    }),
  )
  .handler(async ({ input, context }) => {
    await context.db
      .update(goals)
      .set({
        completed: true,
      })
      .where(eq(goals.id, input.goalId))

    return { success: true }
  })

export const getWalletSummary = protectedProcedure.handler(
  async ({ context }) => {
    const userId = context.session.user.id
    console.log('[getWalletSummary] userId from session:', userId)

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    let solBalance = 0
    let solPriceInUsd = 0
    let walletAddressStr = ''

    try {
      // 1. Obtener la wallet del usuario desde la DB
      const wallets = await context.db
        .select()
        .from(walletAddress)
        .where(eq(walletAddress.userId, userId))
        .limit(1)

      console.log('[getWalletSummary] Found wallets:', wallets)

      if (!wallets || wallets.length === 0) {
        console.log('[getWalletSummary] No wallet found for userId:', userId)
        return {
          solBalance: 0,
          solPriceInUsd: 0,
          totalBalanceUsd: 0,
          totalSavedUsd: 0,
          availableUsd: 0,
          currency: 'USD',
          walletAddress: null,
        }
      }

      const wallet = wallets[0]!
      walletAddressStr = wallet.address
      console.log('[getWalletSummary] Using wallet address:', walletAddressStr)

      // 2. Obtener Balance Real de Solana
      const publicKey = new PublicKey(walletAddressStr)
      console.log('[getWalletSummary] Fetching balance from Solana...')
      const balanceInLamports = await connection.getBalance(publicKey)
      solBalance = balanceInLamports / 1e9
      console.log('[getWalletSummary] Balance in SOL:', solBalance)

      // 3. Obtener Precio de SOL (Coinbase API - Gratis y sin Key)
      const priceRes = await fetch(
        'https://api.coinbase.com/v2/prices/SOL-USD/spot',
      )
      const priceData = (await priceRes.json()) as { data: { amount: string } }
      solPriceInUsd = Number.parseFloat(priceData.data.amount)
      console.log('[getWalletSummary] SOL price in USD:', solPriceInUsd)
    } catch (e) {
      console.error('Error fetching wallet data:', e)
    }

    // 4. Obtener Ahorros (en USD según tus metas)
    const [result] = await context.db
      .select({
        totalSaved: sql<number>`CAST(SUM(${goals.current}) AS FLOAT)`,
      })
      .from(goals)
      .where(eq(goals.walletAddress, walletAddressStr))

    const totalSavedUsd = result?.totalSaved || 0
    const totalBalanceUsd = solBalance * solPriceInUsd

    const availableUsd = totalBalanceUsd - totalSavedUsd

    return {
      solBalance,
      solPriceInUsd,
      totalBalanceUsd,
      totalSavedUsd,
      availableUsd: Math.max(0, availableUsd),
      currency: 'USD',
      walletAddress: walletAddressStr,
    }
  },
)
export const vaultsRouter = {
  getGoals,
  createGoal,
  addProgress,
  completeGoal,
  getWalletSummary,
}
