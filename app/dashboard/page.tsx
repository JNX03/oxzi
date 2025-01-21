"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Measurement {
  id: string
  timestamp: Date
  spo2: number
  stressLevel: number
  heartRate: number
}

export default function Dashboard() {
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  useEffect(() => {
    const fetchMeasurements = async () => {
      const q = query(collection(db, "measurements"), orderBy("timestamp", "desc"), limit(10))
      const querySnapshot = await getDocs(q)
      const fetchedMeasurements: Measurement[] = []
      querySnapshot.forEach((doc) => {
        fetchedMeasurements.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        } as Measurement)
      })
      setMeasurements(fetchedMeasurements.reverse())
    }

    fetchMeasurements()
  }, [])

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Average SpO2</CardTitle>
              <CardDescription>Last 10 measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {measurements.length > 0
                  ? `${(measurements.reduce((sum, m) => sum + m.spo2, 0) / measurements.length).toFixed(1)}%`
                  : 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Stress Level</CardTitle>
              <CardDescription>Last 10 measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {measurements.length > 0
                  ? `${(measurements.reduce((sum, m) => sum + m.stressLevel, 0) / measurements.length).toFixed(1)}%`
                  : 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Heart Rate</CardTitle>
              <CardDescription>Last 10 measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {measurements.length > 0
                  ? `${(measurements.reduce((sum, m) => sum + m.heartRate, 0) / measurements.length).toFixed(1)} BPM`
                  : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Measurement Trends</CardTitle>
            <CardDescription>Last 10 measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurements}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleDateString()} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="spo2" stroke="#8884d8" name="SpO2 (%)" />
                  <Line yAxisId="left" type="monotone" dataKey="stressLevel" stroke="#82ca9d" name="Stress Level (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#ffc658" name="Heart Rate (BPM)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

