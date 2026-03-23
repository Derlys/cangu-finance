import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Progress from 'react-native-progress'

interface GoalCardProps {
  name: string
  current: number
  target: number
  symbol: string
}

export const GoalCard = ({ name, current, target, symbol }: GoalCardProps) => {
  const progress = target > 0 ? current / target : 0
  const isCompleted = current >= target

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <Text style={[styles.status, isCompleted && styles.completedText]}>
          {isCompleted ? '✅ Completada' : '🎯 En progreso'}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currentAmount}>
          {current} <Text style={styles.symbol}>{symbol}</Text>
        </Text>
        <Text style={styles.targetAmount}>
          de {target} {symbol}
        </Text>
      </View>

      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        color={isCompleted ? '#4ADE80' : '#3B82F6'}
        unfilledColor="#E2E8F0"
        borderWidth={0}
        borderRadius={5}
      />

      <Text style={styles.percentage}>
        {Math.round(progress * 100)}% alcanzado
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  completedText: {
    color: '#16A34A',
  },
  amountContainer: {
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  symbol: {
    fontSize: 14,
    color: '#64748B',
  },
  targetAmount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  percentage: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
})
