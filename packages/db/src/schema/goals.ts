import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const goals = sqliteTable('goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletAddress: text('wallet_address').notNull(),
  name: text('name').notNull(),
  target: real('target').notNull(),
  current: real('current').default(0).notNull(),
  symbol: text('symbol').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').notNull(),
})
