import Layout from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-16 py-8">
        <h1 className="text-4xl font-bold mb-6">About Oxzi</h1>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
          <p className="text-lg mb-4">
            Oxzi is an innovative AI-powered application designed to measure and evaluate key health metrics such as
            blood oxygen saturation (SpO2), heart rate, and stress levels through non-contact facial analysis. Developed
            by a team of students from Prince Royal's College, this project aims to revolutionize health monitoring,
            especially in emergency situations and remote areas.
          </p>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Non-Contact Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Utilizes facial analysis to measure health metrics without physical contact, reducing infection risks.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Provides instant health data through advanced image processing and AI algorithms.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User-Friendly Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Designed for ease of use, making it accessible for both medical professionals and the general public.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ideal for quick health assessments in emergency situations or remote areas with limited medical
                  resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Technology</h2>
          <p className="text-lg mb-4">Oxzi leverages cutting-edge technologies including:</p>
          <ul className="list-disc list-inside text-lg mb-4 space-y-2">
            <li>Photoplethysmography (PPG) for analyzing light reflection changes on the skin</li>
            <li>Fourier Analysis for separating pulse signals from noise</li>
            <li>Convolutional Neural Networks (CNN) for enhancing accuracy and reducing data errors</li>
            <li>Time Series Analysis for examining pulse rate changes over time</li>
            <li>Linear Regression for evaluating relationships between measured signals and standard values</li>
          </ul>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Project Impact</h2>
          <p className="text-lg mb-4">Oxzi has the potential to significantly impact healthcare by:</p>
          <ul className="list-disc list-inside text-lg mb-4 space-y-2">
            <li>Providing quick and accurate health assessments in emergency situations</li>
            <li>Reducing the risk of infection transmission in medical settings</li>
            <li>Enabling remote health monitoring in areas with limited medical resources</li>
            <li>Promoting preventive healthcare through easy-to-use technology</li>
          </ul>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Future Development</h2>
          <p className="text-lg mb-4">
            The Oxzi team is committed to continuous improvement and expansion of the project, including:
          </p>
          <ul className="list-disc list-inside text-lg mb-4 space-y-2">
            <li>Enhancing AI models for even greater accuracy</li>
            <li>Expanding the range of health metrics that can be measured</li>
            <li>Integrating with IoT devices for comprehensive health monitoring</li>
            <li>Collaborating with healthcare providers for real-world implementation and validation</li>
          </ul>
        </section>
      </div>
    </Layout>
  )
}

