import { store } from '../store/store'
import { uiService } from './ui.service'
import type { Subscription } from '../types'

export const subsService = {
  addSubscription: (subData: Omit<Subscription, 'id' | 'paused'>): void => {
    store.setState(s => ({
      ...s,
      subs: [...s.subs, { ...subData, id: s.nextId, paused: false }],
      nextId: s.nextId + 1
    }))
    uiService.showSuccess('¡Suscripción agregada!', subData.name)
  },

  togglePause: (id: number): void => {
    const s = store.getState()
    const sub = s.subs.find(sub => sub.id === id)
    if (!sub) return

    const newPausedState = !sub.paused
    store.setState(state => ({
      ...state,
      subs: state.subs.map(item => 
        item.id === id ? { ...item, paused: newPausedState } : item
      )
    }))

    const msg = newPausedState ? `${sub.name} pausada` : `${sub.name} reactivada`
    uiService.showToast(msg, newPausedState ? 'warning' : 'success')
  },

  deleteSubscription: (id: number): void => {
    const s = store.getState()
    const sub = s.subs.find(sub => sub.id === id)
    if (!sub) return

    store.setState(state => ({
      ...state,
      subs: state.subs.filter(item => item.id !== id)
    }))
    uiService.showToast(`${sub.name} eliminada`, 'success')
  }
}
