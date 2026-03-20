import { expo } from '@better-auth/expo'
import { solanaAuth } from '@cangu-finance/better-auth-solana'
import { db } from '@cangu-finance/db'
import * as schema from '@cangu-finance/db/schema/auth'
import { env } from '@cangu-finance/env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',

    schema: schema,
  }),
  trustedOrigins: [
    ...env.CORS_ORIGINS,
    ...(env.NODE_ENV === 'development'
      ? [
          'exp://',
          'exp://**',
          'cangu-finance://**',
          'exp://192.168.*.*:*/**',
          'http://localhost:8081',
        ]
      : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    expo(),
    solanaAuth({
      domain: new URL(env.BETTER_AUTH_URL).hostname,
      anonymous: true,
      cluster: env.SOLANA_CLUSTER,
      emailDomainName: env.SOLANA_EMAIL_DOMAIN,
    }),
  ],
})
