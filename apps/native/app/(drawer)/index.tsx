import { useQuery } from '@tanstack/react-query'
import { Card } from 'heroui-native'
import { Pressable, Text, View } from 'react-native'

import { Container } from '@/components/container'
import { SignIn } from '@/components/sign-in'
import { SignUp } from '@/components/sign-up'
import { SolanaConnect } from '@/components/solana-connect'
import { SolanaSignInButton } from '@/components/solana-sign-in-button'
import { authClient } from '@/lib/auth-client'
import { orpc, queryClient } from '@/utils/orpc'

export default function Home() {
  const _healthCheck = useQuery(orpc.healthCheck.queryOptions())
  const walletSummary = useQuery(orpc.vaults.getWalletSummary.queryOptions())
  const { data: session } = authClient.useSession()

  return (
    <Container className="space-y-6 p-6">
      <View className="mb-6 py-4">
        <Text className="mb-2 font-bold text-4xl text-foreground">
          Cangu finance
        </Text>
      </View>
      {session?.user && (
        <Card variant="secondary" className="mb-6 p-6">
          <Text className="mb-1 text-muted text-xs uppercase tracking-widest">
            Disponible para gastar
          </Text>
          <Text className="mb-4 font-bold text-4xl text-foreground">
            ${walletSummary.data?.availableBalance.toFixed(2) ?? '0.00'}
          </Text>

          <View className="flex-row justify-between border-muted/20 border-t pt-4">
            <View>
              <Text className="text-[10px] text-muted uppercase">
                Saldo Total
              </Text>
              <Text className="font-semibold text-foreground">
                ${walletSummary.data?.realBalance.toFixed(2) ?? '0.00'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-muted uppercase">
                En Vaults
              </Text>
              <Text className="font-semibold text-primary">
                -${walletSummary.data?.totalSaved.toFixed(2) ?? '0.00'}
              </Text>
            </View>
          </View>
        </Card>
      )}

      <View className="mb-6">
        <SolanaConnect />
      </View>

      {session?.user ? (
        <Card variant="secondary" className="mb-6 p-4">
          <Text className="mb-2 text-base text-foreground">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Text className="mb-4 text-muted text-sm">{session.user.email}</Text>
          <Pressable
            className="self-start rounded-lg bg-danger px-4 py-3 active:opacity-70"
            onPress={() => {
              authClient.signOut()
              queryClient.invalidateQueries()
            }}
          >
            <Text className="font-medium text-foreground">Sign Out</Text>
          </Pressable>
        </Card>
      ) : null}

      {!session?.user && (
        <View className="flex gap-6">
          <SolanaSignInButton />
          <View className="flex-row items-center gap-4">
            <View className="h-[1] flex-1 bg-muted/20" />
            <Text className="text-muted text-xs uppercase">
              Or continue with email
            </Text>
            <View className="h-[1] flex-1 bg-muted/20" />
          </View>
          <SignIn />
          <SignUp />
        </View>
      )}
    </Container>
  )
}
