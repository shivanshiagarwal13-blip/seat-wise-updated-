import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Map, QrCode, Clock, Shield, HelpCircle } from 'lucide-react'

export default function InfoPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SeatWise Library Map</h1>
            <p className="text-sm text-gray-500">Learn how the seat booking and QR check-in experience works.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">A smarter library map powered by real-time booking.</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              SeatWise combines live floor plan status, QR-based check-in, and backend-managed session timers so students can reserve desks fairly and libraries can keep seating available.
            </p>
            <div className="space-y-4">
              <FeatureRow icon={Map} title="Live floor status" description="See which desks are free, occupied, or temporarily away in a single view." />
              <FeatureRow icon={QrCode} title="QR check-in" description="Confirm your desk by scanning the QR code at the seat and start your session instantly." />
              <FeatureRow icon={Clock} title="Trusted session timers" description="All timers run on the server and persist across refreshes, logins, and browser closing." />
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-cyan-500 p-8 text-white shadow-xl">
            <div className="mb-6 space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] opacity-80">Information</p>
              <h3 className="text-3xl font-bold">Seat Booking System</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Every booking is recorded by the backend. When a student scans a desk QR, the server starts a 2-hour session timer and updates the map instantly.
              </p>
            </div>
            <div className="grid gap-4">
              <InfoStat label="2-hour sessions" value="Managed on the server" />
              <InfoStat label="Away mode" value="20-minute graceful pause" />
              <InfoStat label="Automatic release" value="Expired desks re-open automatically" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Library Map</p>
              <h3 className="text-2xl font-bold text-gray-900">Map + booking details</h3>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              View Library Map
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Seat categories" text="Solo cubicles, group tables, and indoor study zones are clearly labeled for easy selection." />
            <Card title="Status legend" text="Green means available, red means occupied, and yellow means away with a limited return window." />
            <Card title="Smart check-in" text="Verified QR scan starts your booking and prevents accidental seat holds by others." />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Dedicated flow</p>
            <h4 className="text-xl font-bold text-gray-900 mb-2">One active booking</h4>
            <p className="text-gray-600 text-sm leading-relaxed">Students can only hold one active seat at a time to ensure fair access across the library.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Backend-first timers</p>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Persistent session state</h4>
            <p className="text-gray-600 text-sm leading-relaxed">Timers are stored in the server/database, so closing the browser doesn’t reset the booking.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Automatic cleanup</p>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Expired seats recycle</h4>
            <p className="text-gray-600 text-sm leading-relaxed">A background job checks every minute and releases desks when a session or away timer ends.</p>
          </div>
        </section>

        <section className="bg-gray-50 rounded-3xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need help or want a demo?</h3>
          <p className="text-gray-600 leading-relaxed">Reach out to the library team for a guided tour of the SeatWise map and booking workflow, or login to see it in action.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">Login and try it</button>
            <button onClick={() => navigate('/')} className="border border-gray-200 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">Back to home</button>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureRow({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-semibold text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function InfoStat({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <p className="text-xs uppercase tracking-widest text-white/80 mb-2">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function Card({ title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
      <p className="text-lg font-semibold text-gray-900 mb-2">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  )
}
