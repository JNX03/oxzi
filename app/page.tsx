import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-6">ยินดีต้อนรับสู่ Oxzi</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Oxzi เป็นระบบ AI ทางการแพทย์ที่ล้ำสมัยที่สามารถวัดและประเมินระดับความอิ่มตัวของออกซิเจนในเลือด อัตราการเต้นของหัวใจ และระดับความเครียดผ่านการวิเคราะห์ใบหน้าแบบไม่สัมผัสโดยใช้ Machine Learning
          </p>
          <div className="flex space-x-4 justify-center">
            <Link href="/login">
              <Button size="lg">เริ่มต้นใช้งาน</Button>
            </Link>
            <Link href="/face-scan">
              <Button size="lg" variant="outline">
                ลองใช้งานเดโม
              </Button>
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">คุณสมบัติเด่น</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">วิเคราะห์แบบเรียลไทม์</h3>
              <p>รับข้อมูลสุขภาพทันทีจากการสแกนใบหน้า</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">ไม่รุกราน</h3>
              <p>ไม่จำเป็นต้องสัมผัสทางกายภาพสำหรับการวัดผล</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">ขับเคลื่อนด้วย AI</h3>
              <p>ใช้เทคโนโลยี Machine Learning ขั้นสูง</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">ภาพรวมโครงการ</h2>
          <p className="text-lg mb-4">
            Oxzi ถูกออกแบบมาเพื่อช่วยในสถานการณ์ฉุกเฉินและลดความเสี่ยงในการติดเชื้อโดยไม่ต้องสัมผัสผู้ป่วยโดยตรง ให้ความสะดวกสำหรับบุคคลทั่วไปและบุคลากรทางการแพทย์ในการตรวจสุขภาพเบื้องต้น โดยเฉพาะในพื้นที่ห่างไกลหรือสถานการณ์ที่อุปกรณ์ขนาดใหญ่ไม่เหมาะสม
          </p>
          <p className="text-lg mb-4">
            ระบบนี้ใช้เทคนิค Photoplethysmography (PPG), Fourier Analysis และ Convolutional Neural Networks (CNN) ในการวิเคราะห์ภาพใบหน้าและดึงข้อมูลสุขภาพ ออกแบบให้ใช้งานง่ายและเข้าถึงได้ โดยเน้นการให้ผลลัพธ์ที่รวดเร็วและแม่นยำ
          </p>
          <div className="mt-4 text-center">
            <Link href="/about">
              <Button>เรียนรู้เพิ่มเติมเกี่ยวกับ Oxzi</Button>
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">ทีมของเรา</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {["นายชวภณ เนติสิงหะ", "นายธนกรัณฑ์ คุณเขต", "นายภูตะวัน มั่งมูล", "นายปองคุณ ฟูชื่น", "นางสาวณัฐนัย สุขศรี"].map(
              (name, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{name[0]}</span>
                  </div>
                  <p className="text-sm">{name}</p>
                </div>
              )
            )}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-2">อาจารย์ที่ปรึกษาโครงการ</h3>
            <p>อาจารย์ วุฒิสิทธิ์ สมตุ้ย</p>
            <p className="mt-2">โรงเรียนปรินส์รอยแยลส์วิทยาลัย</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
