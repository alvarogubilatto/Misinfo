import { store } from '../store/store'
import type { Property } from '../types'

export const financeService = {
  addFunds: (amount: number, accountId: number): void => {
    store.setState(s => {
      const accounts = s.accounts.map(a => 
        a.id === accountId ? { ...a, balance: a.balance + amount } : a
      )
      const balance = s.balance + amount
      const newActivity = {
        id: s.nextId,
        icon: 'ingreso',
        bg: '#00c97d',
        name: 'Depósito manual',
        meta: `Ingreso · Hoy`,
        amount: amount,
        cat: 'ingreso' as const
      }
      return {
        ...s,
        balance,
        accounts,
        activities: [newActivity, ...s.activities],
        nextId: s.nextId + 1
      }
    })
  },

  processPayment: (name: string, amount: number | string, accountId: number, category: 'ingreso' | 'gasto' | 'servicios' | 'compras' = 'gasto'): void => {
    store.setState(s => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount
      if (s.balance < numAmount) return s

      const accounts = s.accounts.map(a => 
        a.id === accountId ? { ...a, balance: a.balance - numAmount } : a
      )
      const balance = s.balance - numAmount
      const newActivity = {
        id: s.nextId,
        icon: 'card',
        bg: '#080908',
        name: name,
        meta: `Pago · Hoy`,
        amount: -numAmount,
        cat: category
      }
      return {
        ...s,
        balance,
        accounts,
        activities: [newActivity, ...s.activities],
        nextId: s.nextId + 1
      }
    })
  },

  addProperty: (propData: Omit<Property, 'id' | 'hasWarning'>): void => {
    store.setState(s => ({
      ...s,
      properties: [...s.properties, { ...propData, id: s.nextId, hasWarning: false }],
      nextId: s.nextId + 1
    }))
  }
}
