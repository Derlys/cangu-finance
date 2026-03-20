import { env } from '@cangu-finance/env/web'
import { assertIsAddress } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import type { UiWallet, UiWalletAccount } from '@wallet-ui/react'
import { useSignIn } from '@wallet-ui/react'
import { authClient } from '@/lib/auth-client'
import { handleSiwsAuth } from './handle-siws-auth'

interface UseSiwsAuthOptions {
  account: UiWalletAccount
  onError?: (error: unknown) => void
  onSuccess?: () => void
  statement?: string
  wallet: UiWallet
}

const baseUrl = env.VITE_SERVER_URL

export function useHandleSiwsAuthMutation({
  account,
  onError,
  onSuccess,
  statement = 'Sign in to Cangu Finance',
  wallet,
}: UseSiwsAuthOptions) {
  if (!account) {
    throw new Error('No account selected')
  }
  const address = account.address
  assertIsAddress(address)
  const session = authClient.useSession()
  const signIn = useSignIn(wallet)

  return useMutation({
    mutationFn: () =>
      handleSiwsAuth({
        address,
        baseUrl,
        statement,
        signIn,
        refresh: session.refetch,
      }),
    onSuccess,
    onError,
  })
}
