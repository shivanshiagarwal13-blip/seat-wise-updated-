import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, BookOpen, Shield, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [role, setRole] = useState('student')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!id || !password) { setError('Please fill in all fields.'); return }

    if (role === 'student') {
      login({ name: 'Aarav Sharma', id: id || '221001234', role: 'student' })
      navigate('/map')
    } else {
      login({ name: 'Library Admin', id: id || 'LIB-001', role: 'librarian' })
      navigate('/librarian')
    }
  }

  const isStudent = role === 'student'

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className={`hidden md:flex flex-col justify-between w-1/2 p-12 ${isStudent ? 'bg-primary' : 'bg-gray-900'} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-12 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen size={22} color="white" />
            </div>
            <span className="text-2xl font-bold text-white">SeatWise</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            {isStudent ? 'Fair seating, for everyone.' : 'Librarian Control Center.'}
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            {isStudent
              ? 'Real-time seat tracking, QR-based check-in, and automatic anti-hoarding — so you always find a place to study.'
              : 'Monitor live desk occupancy, manage abandoned sessions, and keep the library running smoothly.'}
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {isStudent ? (
            <>
              <Stat label="Seats available now" value="120" />
              <Stat label="Max session time" value="2 hrs" />
              <Stat label="Away mode limit" value="20 min" />
            </>
          ) : (
            <>
              <Stat label="Total desks monitored" value="120" />
              <Stat label="Abandoned desks today" value="5" />
              <Stat label="System uptime" value="98%" />
            </>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        {/* Role toggle */}
        <div className="w-full max-w-md">
          <div className="flex rounded-xl border border-gray-200 p-1 mb-8 bg-gray-50">
            <button
              onClick={() => { setRole('student'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${role === 'student' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BookOpen size={15} /> Student
            </button>
            <button
              onClick={() => { setRole('librarian'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${role === 'librarian' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Shield size={15} /> Librarian
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isStudent ? 'bg-primary' : 'bg-gray-800'}`}>
              {isStudent ? <BookOpen size={28} color="white" /> : <Shield size={28} color="white" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isStudent ? 'Login to continue to SeatWise' : 'Login to the Librarian Portal'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isStudent ? 'Student ID' : 'Librarian ID'}
              </label>
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder={isStudent ? 'Enter your student ID' : 'e.g. LIB-001'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-colors ${isStudent ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-900 hover:bg-gray-700'}`}
            >
              {isStudent ? 'Login as Student' : 'Login as Librarian'}
            </button>
          </form>

          <div className="text-center mt-5">
            <a href="#" className={`text-sm font-medium ${isStudent ? 'text-primary' : 'text-gray-700'} hover:underline`}>
              Forgot Password?
            </a>
          </div>

          <div className="border-t border-gray-100 mt-6 pt-6 text-center text-sm text-gray-400">
            {isStudent
              ? <span>New here? <a href="#" className="text-primary font-semibold">Contact your librarian</a></span>
              : <span>Student account? <button onClick={() => setRole('student')} className="text-gray-900 font-semibold hover:underline">Switch to Student login</button></span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 bg-white rounded-full opacity-70 shrink-0"></span>
      <span className="text-white text-sm"><span className="font-bold">{value}</span> {label}</span>
    </div>
  )
}
