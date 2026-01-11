import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [emailOrName, setEmailOrName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let email = emailOrName

    // If user entered a display name, resolve it to email
    if (!emailOrName.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('display_name', emailOrName)
        .single()

      if (error || !data) {
        setError('User not found')
        setLoading(false)
        return
      }

      email = data.email
    }

    const { error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) {
      setError(authError.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Login</h1>

      <input
        type="text"
        placeholder="Email or username"
        value={emailOrName}
        onChange={(e) => setEmailOrName(e.target.value)}
        className="w-full border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2"
      >
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}
