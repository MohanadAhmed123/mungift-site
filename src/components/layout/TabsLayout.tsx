import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import VocabularyPage from '@/pages/Vocabulary/VocabularyPage'
import Recipes from '@/pages/Recipes'
import Texts from '@/pages/Texts'
import Media from '@/pages/Media'
import { useAuth } from '@/context/AuthContext'
import NewWordPage from '@/pages/Vocabulary/newWordPage'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/theme/mode-toggle'

export default function TabsLayout() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="font-bold text-lg">
          Muna Gift App
        </h1>

        <div className="flex items-center gap-4">
          <span>{profile?.display_name}</span>
          <ModeToggle />
          <Button
            onClick={signOut}
            className="text-sm underline"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-6 px-6 py-3 border-b">
        <TabLink to="/vocabulary">Vocabulary</TabLink>
        <TabLink to="/recipes">Recipes</TabLink>
        <TabLink to="/texts">Texts</TabLink>
        <TabLink to="/media">Media</TabLink>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<VocabularyPage />} /> {/*need to update this later to home page route*/}
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/vocabulary/new" element={<NewWordPage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/texts" element={<Texts />} />
          <Route path="/media" element={<Media />} />
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </main>
    </div>
  )
}

function TabLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `pb-1 border-b-2 ${
          isActive
            ? 'border-black font-medium'
            : 'border-transparent text-gray-500'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
