import { supabase } from '../lib/supabase'

export const authService = {
  login: async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? error.message : null
  },

  loginWithGoogle: async (): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return error ? error.message : null
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut()
  },
}
