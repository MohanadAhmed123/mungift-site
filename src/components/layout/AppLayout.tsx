import { Routes, Route, Navigate } from 'react-router-dom'
import VocabularyPage from '@/pages/Vocabulary/VocabularyPage'
import Recipes from '@/pages/Recipes'
import Texts from '@/pages/Texts'
import Media from '@/pages/Media'
import NewWordPage from '@/pages/Vocabulary/newWordPage'
import { TopBar } from '@/components/layout/TopBar'

export default function AppLayout() {

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      {/* Page content */}
      <main className="flex-1 px-4 py-4 sm:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/vocabulary" replace />} /> {/*need to update this later to home page route*/}
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
