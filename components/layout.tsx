import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { Activity } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Oxzi
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <Activity className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="ghost">Signup</Button>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        © 2025 Oxzi. All rights reserved.
      </footer>
    </div>
  )
}

