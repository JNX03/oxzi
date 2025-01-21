"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/face-scan')
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth)
      router.push('/face-scan')
    } catch (error) {
      console.error('Error logging in as guest:', error)
    }
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" type="submit" onClick={handleLogin}>Login</Button>
            <Button className="w-full" variant="outline" onClick={handleGuestLogin}>Continue as Guest</Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}

