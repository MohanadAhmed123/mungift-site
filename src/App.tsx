import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import TabsLayout from '@/components/layout/TabsLayout'

function App() {

  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<div>Home (tabs go here)
          <button onClick={signOut}>Sign Out</button>
        </div>} /> */}
        
        <Route path="/login" element={<Login />} />

        <Route path="/*"
          element={
            <ProtectedRoute>
              <TabsLayout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    // <div className="min-h-screen flex items-center justify-center bg-black text-white">
    //   <h1 className="text-4xl font-bold">Muna Gift App</h1>
    // </div>
  )
}

export default App
