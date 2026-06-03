import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {/* Sweet footer */}
      <footer className="text-center py-4 border-t-2 border-peach/20">
        <p className="font-cute text-sm text-brown-light">
          💕 小厨神 · 恋爱厨房 — 只属于我们的甜蜜小厨房 💕
        </p>
      </footer>
    </div>
  )
}
