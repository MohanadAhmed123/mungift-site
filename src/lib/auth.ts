import { supabase } from './supabase'

export const onAuthStateChange = (callback: () => void) => {
  return supabase.auth.onAuthStateChange(() => {
    callback()
  })
}
