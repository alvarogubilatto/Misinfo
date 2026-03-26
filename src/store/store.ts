import { signal, effect } from '@preact/signals-react'
import { loadState, saveStateToStorage } from '../data'
import type { AppState } from '../types'

// El Signal principal que contiene todo el estado
export const stateSignal = signal<AppState>(loadState())

// Efecto automático para persistencia en cada cambio
effect(() => {
  saveStateToStorage(stateSignal.value)
})

export const store = {
  getState: (): AppState => stateSignal.value,
  setState: (updater: ((s: AppState) => AppState) | AppState) => {
    const currentState = stateSignal.value
    const newState = typeof updater === 'function' ? updater(currentState) : updater
    if (newState !== currentState) {
      stateSignal.value = newState
    }
  },
  // Mantenemos subscribe para compatibilidad con useSyncExternalStore temporalmente
  subscribe: (listener: (s: AppState) => void) => {
    return effect(() => {
      listener(stateSignal.value)
    })
  }
}

