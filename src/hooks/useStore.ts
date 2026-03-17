import { useSyncExternalStore } from 'react'
import { store } from '../store/store'
import type { AppState } from '../types'

export function useStore<T = AppState>(selector: (s: AppState) => T = (s) => s as unknown as T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState())
  )
}
