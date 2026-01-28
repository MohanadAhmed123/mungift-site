import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import TabsLayout from '@/components/layout/TabsLayout'
import { ThemeProvider } from '@/components/theme/theme-provider'

function App() {

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

export default App
