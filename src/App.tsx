import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import TabsLayout from '@/components/layout/TabsLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
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
  )
}

export default App
