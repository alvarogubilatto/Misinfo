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
    store.setState(s => ({ ...s, success: { show: true, text, sub } }))
    setTimeout(() => {
      store.setState(s => {
        if (!s.success) return s
        return { ...s, success: { ...s.success, show: false } }
      })
    }, 2200)
  },

  toggleDarkMode: (): void => {
    store.setState(s => ({ ...s, darkMode: !s.darkMode }))
  }
}
