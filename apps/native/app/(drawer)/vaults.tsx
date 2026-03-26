import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Input, TextField } from 'heroui-native'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { GoalCard } from '@/components/goal-card'
import { orpc, queryClient } from '@/utils/orpc'

export default function VaultsScreen() {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')

  const {
    data: goals,
    isLoading,
    error,
    refetch,
  } = useQuery(orpc.vaults.getGoals.queryOptions())

  const createGoalMutation = useMutation(
    orpc.vaults.createGoal.mutationOptions({
      onSuccess: () => {
        refetch()
        setName('')
        setTarget('')
        setShowForm(false)
      },
    }),
  )

  const addProgressMutation = useMutation(
    orpc.vaults.addProgress.mutationOptions({
      onSuccess: () => {
        refetch()
        queryClient.invalidateQueries(
          orpc.vaults.getWalletSummary.queryOptions(),
        )
      },
    }),
  )

  const deleteGoalMutation = useMutation(
    orpc.vaults.deleteGoal.mutationOptions({
      onSuccess: () => {
        refetch()
        queryClient.invalidateQueries(
          orpc.vaults.getWalletSummary.queryOptions(),
        )
      },
    }),
  )

  const handleAddProgress = (goalId: number, amount: number) => {
    addProgressMutation.mutate({ goalId, amount })
  }

  const handleDeleteGoal = (goalId: number) => {
    deleteGoalMutation.mutate({ goalId })
  }

  const handleCreateGoal = () => {
    if (!name || !target) return
    createGoalMutation.mutate({
      name,
      target: Number.parseFloat(target),
      symbol: '$',
    })
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: 'red' }}>Error al cargar las metas</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.row}>
          <Text style={styles.header}>Mis metas</Text>
          <Button
            isIconOnly
            size="sm"
            variant="primary"
            onPress={() => setShowForm(!showForm)}
          >
            <Ionicons
              name={showForm ? 'close' : 'add'}
              size={20}
              color="white"
            />
          </Button>
        </View>
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Nueva meta de ahorro</Text>
            <TextField>
              <Input
                placeholder="¿Para qué quieres ahorrar?"
                value={name}
                onChangeText={setName}
              />
            </TextField>
            <View style={{ height: 10 }} />
            <TextField>
              <Input
                placeholder="Monto objetivo (ej. 1000)"
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
              />
            </TextField>
            <Button
              className="mt-4"
              onPress={handleCreateGoal}
              isDisabled={!name || !target || createGoalMutation.isPending}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {createGoalMutation.isPending ? 'Creando...' : 'Crear meta'}
              </Text>
            </Button>
          </View>
        )}
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GoalCard
            id={item.id}
            name={item.name}
            current={item.current}
            target={item.target}
            symbol={item.symbol}
            onAddProgress={handleAddProgress}
            onDelete={handleDeleteGoal}
            isAddingProgress={addProgressMutation.isPending}
            isDeleting={deleteGoalMutation.isPending}
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#475569',
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  empty: { fontSize: 16, color: '#94a3b8', textAlign: 'center' },
})
