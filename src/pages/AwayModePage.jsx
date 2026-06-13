import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, AlertTriangle, X, PauseCircle, Timer, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

const AWAY_SECONDS = 20 * 60

export default function AwayModePage() {
  const navigate = useNavigate()
  const { currentBooking, seats, endAway, releaseSeat } = useApp()
  const [timeLeft, setTimeLeft] = useState(AWAY_SECONDS)
  const [released, setReleased] = useState(false)

  const seat = seats.find(s => s.id === currentBooking?.seatId)

  useEffect(() => {
    if (released) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setReleased(true)
          releaseSeat()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [released])

  const handleReturn = () => {
    endAway()
    navigate('/map')
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const progress = timeLeft / AWAY_SECONDS

  // SVG circle math
  const radius = 90
  const circ = 2 * Math.PI * radius
  const strokeDash = circ * progress

  const now = new Date()
  const startTime = currentBooking?.checkIn || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  if (released) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seat Released</h2>
          <p className="text-gray-500 mb-6">Your away time expired. Desk {currentBooking?.seatId} has been released for other students.</p>
          <button onClick={() => navigate('/map')} className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
            Browse Available Seats
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Away Mode</h1>
          <p className="text-sm text-gray-400">Your session is paused while you step away</p>
        </div>
        <button onClick={handleReturn} className="text-gray-400 hover:text-gray-700 p-1">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 max-w-5xl mx-auto w-full">

        {/* LEFT - Timer card */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8 flex flex-col">

          {/* Current desk row */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <rect x="3" y="3" width="18" height="11" rx="2" fill="#4ade80" />
                  <rect x="2" y="14" width="20" height="5" rx="2" fill="#86efac" />
                  <rect x="5" y="19" width="4" height="3" rx="1" fill="#9ca3af" />
                  <rect x="15" y="19" width="4" height="3" rx="1" fill="#9ca3af" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Current Desk</p>
                <p className="font-bold text-gray-900 text-base">Desk {currentBooking?.seatId || 'A11'}</p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Away
            </span>
          </div>

          {/* Big circular countdown */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative flex items-center justify-center">
              <svg width="230" height="230" viewBox="0 0 230 230">
                {/* Background ring */}
                <circle cx="115" cy="115" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />
                {/* Progress ring — orange, goes counterclockwise as time ticks */}
                <circle
                  cx="115" cy="115" r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ - strokeDash}
                  transform="rotate(-90 115 115)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              {/* Timer text inside circle */}
              <div className="absolute text-center">
                <p className="text-5xl font-extrabold text-gray-900 tabular-nums tracking-tight">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </p>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Remaining</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <p className="text-sm text-gray-500 text-center mb-3">
              Maximum away time: <span className="font-bold text-gray-800">20 minutes</span>
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(1 - progress) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0 min</span>
              <span>20 min</span>
            </div>
          </div>

          {/* Return button */}
          <button
            onClick={handleReturn}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-4 rounded-xl font-bold text-base transition-colors mt-6"
          >
            End Away & Return
          </button>

          {/* Warning box */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Seat will be automatically released</p>
              <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                If you do not return before the timer expires, your booking for Desk {currentBooking?.seatId || 'A11'} will be cancelled and made available to other students.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT - Session details + How it works */}
        <div className="md:w-80 space-y-5">

          {/* Session Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-5">Session Details</p>
            <div className="space-y-4">
              <SessionRow icon={MapPin} label="Location" value={`Floor 1 · ${seat?.zone || 'Quiet Zone'}`} />
              <SessionRow icon={Clock} label="Started" value={startTime} />
              <SessionRow icon={Timer} label="Duration" value="2 Hours" />
              <SessionRow icon={Clock} label="Ends At" value={endTime} />
            </div>
          </div>

          {/* How Away Mode Works */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-xs text-primary font-bold leading-none">i</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">How Away Mode Works</p>
            </div>
            <div className="space-y-5">
              <HowItem
                icon={<PauseCircle size={18} className="text-gray-700 shrink-0 mt-0.5" />}
                title="Session paused"
                desc="Away mode temporarily pauses your booking timer so you don't lose time while away."
              />
              <HowItem
                icon={<Timer size={18} className="text-gray-700 shrink-0 mt-0.5" />}
                title="20-minute maximum"
                desc="You have up to 20 minutes to return. The countdown starts as soon as you activate Away Mode."
              />
              <HowItem
                icon={<Lock size={18} className="text-gray-700 shrink-0 mt-0.5" />}
                title="Automatic release"
                desc="If you don't return in time, your seat is automatically released for other students to book."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating away badge (bottom right) */}
      <div className="fixed bottom-6 right-6 bg-yellow-400 text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-xl z-50">
        <span className="text-base">🔔</span>
        <span className="font-bold text-sm tracking-wide">AWAY</span>
        <span className="font-mono font-bold text-sm tabular-nums">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

function SessionRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-gray-400 shrink-0" />
      <span className="text-sm text-gray-500 flex-1">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function HowItem({ icon, title, desc }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
