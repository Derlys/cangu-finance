import { goals } from '@cangu-finance/db/schema/index'
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
    const walletAddress = context.session.user.id
    const realBalance = 1250.5

    const [result] = await context.db
      .select({
        totalSaved: sql<number>`CAST(SUM(${goals.current}) AS FLOAT)`,
      })
      .from(goals)
      .where(eq(goals.walletAddress, walletAddress))

    const totalSaved = result?.totalSaved || 0

    return {
      realBalance,
      totalSaved,
      availableBalance: realBalance - totalSaved,
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
