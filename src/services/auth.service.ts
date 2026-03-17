export const authService = {
  login: (): void => {
    localStorage.setItem('auth_token', 'true')
    window.location.reload()
  },
  logout: (): void => {
    localStorage.removeItem('auth_token')
    window.location.reload()
  },
  isAuthenticated: (): boolean => {
    return localStorage.getItem('auth_token') === 'true'
  }
}
