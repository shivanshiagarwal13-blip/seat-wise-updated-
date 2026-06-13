import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Monitor, Users, Calendar, BarChart2, Bell, Settings, LogOut, Download, RotateCcw, XCircle, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

const initialSessions = [
  { deskId: 'DSK-001', status: 'occupied', student: 'Emma Wilson', checkIn: '08:30 AM', lastActivity: '2 mins ago', stale: false },
  { deskId: 'DSK-002', status: 'away', student: 'James Chen', checkIn: '09:15 AM', lastActivity: '18 mins ago', stale: true },
  { deskId: 'DSK-003', status: 'available', student: null, checkIn: null, lastActivity: null, stale: false },
  { deskId: 'DSK-004', status: 'occupied', student: 'Sarah Johnson', checkIn: '07:45 AM', lastActivity: '5 mins ago', stale: false },
  { deskId: 'DSK-005', status: 'abandoned', student: 'Michael Brown', checkIn: '06:30 AM', lastActivity: '2 hours ago', stale: true },
  { deskId: 'DSK-006', status: 'occupied', student: 'Priya Sharma', checkIn: '09:00 AM', lastActivity: '1 min ago', stale: false },
  { deskId: 'DSK-007', status: 'occupied', student: 'Rahul Mehta', checkIn: '10:10 AM', lastActivity: '3 mins ago', stale: false },
  { deskId: 'DSK-008', status: 'abandoned', student: 'Anika Roy', checkIn: '07:00 AM', lastActivity: '2 hours ago', stale: true },
]

const STATUS_STYLE = {
  occupied: 'bg-red-100 text-red-600',
  away: 'bg-yellow-100 text-yellow-700',
  available: 'bg-green-100 text-green-700',
  abandoned: 'bg-gray-100 text-gray-600',
}

const STATUS_DOT = {
  occupied: 'bg-red-500',
  away: 'bg-yellow-400',
  available: 'bg-green-500',
  abandoned: 'bg-gray-400',
}

export default function LibrarianDashboard() {
  const navigate = useNavigate()
  const { logout } = useApp()
  const [sessions, setSessions] = useState(initialSessions)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [filter, setFilter] = useState('All Statuses')

  const stats = {
    total: 10,
    occupied: sessions.filter(s => s.status === 'occupied').length,
    available: sessions.filter(s => s.status === 'available').length,
    away: sessions.filter(s => s.status === 'away').length,
  }
  const abandoned = sessions.filter(s => s.status === 'abandoned').length

  const handleReset = (deskId) => {
    setSessions(prev => prev.map(s => s.deskId === deskId ? { ...s, status: 'available', student: null, checkIn: null, lastActivity: null, stale: false } : s))
  }
  const handleEnd = (deskId) => {
    setSessions(prev => prev.map(s => s.deskId === deskId ? { ...s, status: 'available', student: null, checkIn: null, lastActivity: null, stale: false } : s))
  }

  const filtered = filter === 'All Statuses' ? sessions : sessions.filter(s => s.status === filter.toLowerCase())

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Live Monitoring', icon: Monitor },
    { label: 'Students', icon: Users },
    { label: 'Reservations', icon: Calendar },
    { label: 'Analytics', icon: BarChart2 },
    { label: 'Notifications', icon: Bell },
    { label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col py-6">
        <div className="flex items-center gap-2 px-5 mb-10">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <BookOpen size={15} color="white" />
          </div>
          <div>
            <p className="font-bold text-sm">SeatWise</p>
            <p className="text-xs text-gray-400">Library Management</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeNav === label ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="px-3 border-t border-white/10 pt-4">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Librarian Dashboard</h1>
            <p className="text-sm text-gray-400">Real-time desk occupancy and student activity tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-green-600">Live Updates Active</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Seats" value={stats.total} icon="🖥️" />
            <StatCard label="Occupied Seats" value={stats.occupied} icon="👤" />
            <StatCard label="Available Seats" value={stats.available} icon="✅" />
            <StatCard label="Away Seats" value={stats.away} icon="⏰" />
          </div>

          {/* Alert */}
          {abandoned > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-red-700">
                <span className="font-bold">{abandoned} desks abandoned</span> — sessions have been inactive for over 2 hours. Review and reset below.
              </p>
            </div>
          )}

          {/* Sessions table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Active Sessions</h2>
              <div className="flex items-center gap-3">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
                >
                  {['All Statuses', 'Occupied', 'Away', 'Available', 'Abandoned'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  <Download size={14} /> Export Data
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Desk ID</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Student Name</th>
                  <th className="px-6 py-3 text-left">Check-In Time</th>
                  <th className="px-6 py-3 text-left">Last Activity</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(session => (
                  <tr key={session.deskId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">{session.deskId}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[session.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[session.status]}`}></span>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{session.student || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{session.checkIn || '—'}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${session.stale ? 'text-red-500' : 'text-gray-500'}`}>
                      {session.lastActivity || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {session.status !== 'available' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReset(session.deskId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <RotateCcw size={12} /> Reset
                          </button>
                          <button
                            onClick={() => handleEnd(session.deskId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <XCircle size={12} /> End
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <span className="text-4xl opacity-70">{icon}</span>
    </div>
  )
}
