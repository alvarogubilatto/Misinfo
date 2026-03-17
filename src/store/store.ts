import { loadState, saveStateToStorage } from '../data'
import type { AppState } from '../types'

let state: AppState = loadState()
const listeners = new Set<(s: AppState) => void>()

export const store = {
  getState: (): AppState => state,
  setState: (updater: ((s: AppState) => AppState) | AppState) => {
    const newState = typeof updater === 'function' ? updater(state) : updater
    if (newState !== state) {
      state = newState
      saveStateToStorage(state)
      listeners.forEach(listener => listener(state))
    }
  },
  subscribe: (listener: (s: AppState) => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
}
