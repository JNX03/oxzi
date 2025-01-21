"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/face-scan')
    } catch (error) {
      console.error('Error signing up:', error)
    }
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
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
          <CardFooter>
            <Button className="w-full" type="submit" onClick={handleSignup}>Sign Up</Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}

