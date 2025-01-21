import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Oxzi</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Oxzi is an advanced medical AI system that measures and evaluates blood oxygen saturation and basic health data through non-contact facial analysis using Machine Learning.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/face-scan">
              <Button size="lg" variant="outline">Try Demo</Button>
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p>Get instant health data from facial scans</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Non-invasive</h3>
              <p>No physical contact required for measurements</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">AI-powered</h3>
              <p>Utilizes advanced machine learning algorithms</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              "นายชวภณ เนติสิงหะ",
              "นายธนกรัณฑ์ คุณเขต",
              "นายภูตะวัน มั่งมูล",
              "นายปองคุณ ฟูชื่น",
              "นางสาวณัฐนัย สุขศรี"
            ].map((name, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{name[0]}</span>
                </div>
                <p className="text-sm">{name}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-2">อาจารย์ที่ปรึกษาโครงการ</h3>
            <p>อาจารย์ วุฒิสิทธิ์ สมตุ้ย</p>
            <p className="mt-2">โรงเรียนปรินส์รอยแยลส์วิทยาลัย</p>
          </div>
        </section>
      </div>
    </Layout>
  )
}

