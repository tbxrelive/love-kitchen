import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { RoomProvider, useRoom } from '@/contexts/RoomContext'
import AppShell from '@/components/layout/AppShell'
import ConfettiOverlay from '@/components/shared/ConfettiOverlay'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import LandingPage from '@/pages/LandingPage'
import KitchenPage from '@/pages/KitchenPage'
import DiaryPage from '@/pages/DiaryPage'

function RoomGuard({ children }: { children: React.ReactNode }) {
  const { userId, loading } = useAuth()
  const { roomCode } = useRoom()

  if (loading) {
    return <LoadingSpinner text="正在验证..." />
  }

  if (!userId || !roomCode) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        element={
          <RoomGuard>
            <AppShell />
          </RoomGuard>
        }
      >
        <Route path="/kitchen/:roomCode" element={<KitchenPage />} />
        <Route path="/diary/:roomCode" element={<DiaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <BrowserRouter>
          <AppRoutes />
          <ConfettiOverlay />
        </BrowserRouter>
      </RoomProvider>
    </AuthProvider>
  )
}
