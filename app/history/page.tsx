"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Layout from '@/components/layout'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Measurement {
  id: string
  timestamp: Date
  spo2: number
  stressLevel: number
  heartRate: number
}

export default function History() {
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
      setMeasurements(fetchedMeasurements)
    }

    fetchMeasurements()
  }, [])

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Measurement History</h1>
        <Table>
          <TableCaption>Your recent measurements</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>SpO2</TableHead>
              <TableHead>Stress Level</TableHead>
              <TableHead>Heart Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((measurement) => (
              <TableRow key={measurement.id}>
                <TableCell>{measurement.timestamp.toLocaleString()}</TableCell>
                <TableCell>{measurement.spo2}%</TableCell>
                <TableCell>{measurement.stressLevel}%</TableCell>
                <TableCell>{measurement.heartRate} BPM</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

