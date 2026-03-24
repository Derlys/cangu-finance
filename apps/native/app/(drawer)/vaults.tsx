import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { GoalCard } from '@/components/goal-card'
import { orpc } from '@/utils/orpc'

export default function VaultsScreen() {
  const { data: goals, isLoading } = useQuery(
    orpc.vaults.getGoals.queryOptions({
      input: { walletAddress: 'placeholder-wallet' },
    }),
  )
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Estas son mis metas</Text>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GoalCard
            name={item.name}
            current={item.current}
            target={item.target}
            symbol={item.symbol}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>Aún no tienes metas creadas.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
})
