import { store } from '../store/store'

let toastTimer: ReturnType<typeof setTimeout> | null = null

export const uiService = {
  showToast: (msg: string, type: string = ''): void => {
    store.setState(s => ({ ...s, toast: { msg, show: true, type } }))
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      store.setState(s => {
        if (!s.toast) return s
        return { ...s, toast: { ...s.toast, show: false } }
      })
    }, 2800)
  },

  showSuccess: (text: string, sub: string = ''): void => {
    store.setState(s => ({ ...s, feedback: { show: true, text, sub, type: 'success' } }))
    setTimeout(() => {
      store.setState(s => {
        if (!s.feedback) return s
        return { ...s, feedback: { ...s.feedback, show: false } }
      })
    }, 2200)
  },
  
  showError: (text: string, sub: string = ''): void => {
    store.setState(s => ({ ...s, feedback: { show: true, text, sub, type: 'error' } }))
    setTimeout(() => {
      store.setState(s => {
        if (!s.feedback) return s
        return { ...s, feedback: { ...s.feedback, show: false } }
      })
    }, 2500)
  },

  toggleDarkMode: (): void => {
    store.setState(s => ({ ...s, darkMode: !s.darkMode }))
  }
}
