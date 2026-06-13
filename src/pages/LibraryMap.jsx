import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, ChevronDown, LayoutDashboard, Map, Calendar, Clock, User,
  HelpCircle, LogOut, X, BookOpen, CheckCircle, Moon, Sun,
  Mail, Phone, MessageSquare, TrendingUp, Users, AlertCircle, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS_COLORS = {
  available: { bg: 'bg-green-50 border-green-300', dot: 'bg-green-500', ring: 'ring-green-400' },
  occupied:  { bg: 'bg-red-50 border-red-300',   dot: 'bg-red-500',   ring: 'ring-red-400'  },
  away:      { bg: 'bg-yellow-50 border-yellow-300', dot: 'bg-yellow-500', ring: 'ring-yellow-400' },
}

const NOTIFICATIONS = [
  {
    id: 1,
    icon: AlertCircle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    title: 'Away timer warning',
    body: 'Your seat (A03) will be released in 5 minutes if you don\'t return.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary-light',
    title: 'Seat available nearby',
    body: 'A Solo Cubicle (A10) just opened up in the Quiet Zone.',
    time: '10 min ago',
    unread: true,
  },
]

export default function LibraryMap() {
  const navigate = useNavigate()
  const { user, seats, bookSeat, releaseSeat, currentBooking, activateAway, logout } = useApp()
  const [selected, setSelected]   = useState(null)
  const [activeNav, setActiveNav] = useState('Library Map')
  const [showToast, setShowToast] = useState(false)
  const [darkMode, setDarkMode]   = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifRead, setNotifRead] = useState([])
  const notifRef = useRef(null)

  const soloSeats   = seats.filter(s => s.type === 'solo')
  const groupSeats  = seats.filter(s => s.type === 'group')
  const indoorSeats = seats.filter(s => s.type === 'indoor')
  const selectedSeat = seats.find(s => s.id === selected)
  const unreadCount  = NOTIFICATIONS.filter(n => !notifRead.includes(n.id)).length

  // Close notif dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const dm = darkMode
    ? {
        page: 'bg-gray-900',
        sidebar: 'bg-gray-800 border-gray-700',
        topbar: 'bg-gray-800 border-gray-700',
        card: 'bg-gray-800 border-gray-700',
        text: 'text-gray-100',
        subtext: 'text-gray-400',
        navActive: 'bg-gray-700 text-green-400',
        navHover: 'hover:bg-gray-700 hover:text-gray-100',
        input: 'bg-gray-700 border-gray-600 text-gray-100',
      }
    : {
        page: 'bg-gray-50',
        sidebar: 'bg-white border-gray-100',
        topbar: 'bg-white border-gray-100',
        card: 'bg-white border-gray-100',
        text: 'text-gray-900',
        subtext: 'text-gray-400',
        navActive: 'bg-primary-light text-primary',
        navHover: 'hover:bg-gray-50 hover:text-gray-800',
        input: 'bg-white border-gray-200 text-gray-800',
      }

  const handleBook = () => {
    if (!selected) return
    bookSeat(selected)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleAway = () => { activateAway(); navigate('/away') }

  const navItems = [
    { label: 'Dashboard',     icon: LayoutDashboard },
    { label: 'Library Map',   icon: Map             },
    { label: 'My Bookings',   icon: Calendar        },
    { label: 'History',       icon: Clock           },
    { label: 'Profile',       icon: User            },
    { label: 'Help & Support', icon: HelpCircle     },
  ]

  const handleNav = (item) => {
    setActiveNav(item.label)
    if (item.label === 'Library Map') return
    if (item.label === 'Dashboard') { navigate('/map'); return }
  }

  const renderAction = () => {
    if (!selectedSeat) return null
    if (currentBooking?.seatId === selectedSeat.id) {
      return (
        <div className="space-y-3">
          <div className={`${dm.card} border rounded-xl p-3 text-sm text-green-700 font-medium text-center flex items-center justify-center gap-2`}>
            <CheckCircle size={16} /> This is your current seat
          </div>
          <button onClick={handleAway} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
            <Clock size={16} /> Go Away (20 min)
          </button>
          <button onClick={() => { releaseSeat(); setSelected(null) }} className="w-full border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
            Release Seat
          </button>
        </div>
      )
    }
    if (selectedSeat.status === 'available' && !currentBooking) {
      return (
        <button onClick={handleBook} className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold text-sm transition-colors">
          Check In to This Seat
        </button>
      )
    }
    if (selectedSeat.status === 'available' && currentBooking) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700 text-center">
          You already have an active booking at Desk <strong>{currentBooking.seatId}</strong>
        </div>
      )
    }
    if (selectedSeat.status === 'occupied') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
          This seat is currently occupied by another student.
        </div>
      )
    }
    if (selectedSeat.status === 'away') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700 text-center">
          This student is temporarily away. The seat may open up soon.
        </div>
      )
    }
    return null
  }

  // ── Non-map views ────────────────────────────────────────────────────────────
  if (activeNav !== 'Library Map') {
    const renderPageContent = () => {
      // ── Dashboard ───────────────────────────────────────────────────────────
      if (activeNav === 'Dashboard') {
        const stats = [
          { label: 'Available Seats', value: seats.filter(s => s.status === 'available').length, icon: Map, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Occupied', value: seats.filter(s => s.status === 'occupied').length, icon: Users, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Away Mode', value: seats.filter(s => s.status === 'away').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Total Seats', value: seats.length, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary-light' },
        ]
        return (
          <div className="p-8 max-w-5xl mx-auto w-full">
            <h2 className={`text-2xl font-bold mb-1 ${dm.text}`}>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
            <p className={`text-sm mb-8 ${dm.subtext}`}>Here's what's happening at the library today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`${dm.card} border rounded-2xl p-5`}>
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className={`text-2xl font-bold ${dm.text}`}>{value}</p>
                  <p className={`text-xs ${dm.subtext} mt-0.5`}>{label}</p>
                </div>
              ))}
            </div>
            {currentBooking ? (
              <div className={`${dm.card} border rounded-2xl p-6 mb-6`}>
                <p className={`text-xs font-bold tracking-widest uppercase mb-3 text-primary`}>Active Booking</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`font-bold text-lg ${dm.text}`}>Desk {currentBooking.seatId}</p>
                    <p className={`text-sm ${dm.subtext}`}>Floor 1 · Quiet Zone · Check-in: {currentBooking.checkIn}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">Active</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAway} className="flex-1 bg-yellow-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-500">Go Away</button>
                  <button onClick={() => { releaseSeat(); setActiveNav('Library Map') }} className="flex-1 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50">Release Seat</button>
                </div>
              </div>
            ) : (
              <div className={`${dm.card} border rounded-2xl p-6 mb-6 text-center`}>
                <p className={`${dm.subtext} text-sm mb-3`}>No active seat booking</p>
                <button onClick={() => setActiveNav('Library Map')} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark">
                  Find a Seat
                </button>
              </div>
            )}
            <div className={`${dm.card} border rounded-2xl p-6`}>
              <p className={`text-xs font-bold tracking-widest uppercase mb-4 text-primary`}>Recent Activity</p>
              {[
                { action: 'Checked in to Desk A07', time: 'Today, 9:12 AM' },
                { action: 'Released Desk A07', time: 'Today, 11:43 AM' },
                { action: 'Checked in to Desk G1', time: 'Yesterday, 2:30 PM' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-2.5 ${i < 2 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className={`text-sm ${dm.text}`}>{item.action}</span>
                  </div>
                  <span className={`text-xs ${dm.subtext}`}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // ── My Bookings ─────────────────────────────────────────────────────────
      if (activeNav === 'My Bookings') {
        return (
          <div className="p-8 max-w-2xl mx-auto w-full">
            <h2 className={`text-2xl font-bold mb-6 ${dm.text}`}>My Bookings</h2>
            {currentBooking ? (
              <div className={`${dm.card} border rounded-2xl p-5 mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold ${dm.text}`}>Desk {currentBooking.seatId}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
                </div>
                <p className={`text-sm ${dm.subtext}`}>Check-in: {currentBooking.checkIn}</p>
                <p className={`text-sm ${dm.subtext}`}>Floor 1 · Quiet Zone</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAway} className="flex-1 bg-yellow-400 text-white py-2 rounded-xl text-sm font-semibold hover:bg-yellow-500">Go Away</button>
                  <button onClick={() => { releaseSeat(); setActiveNav('Library Map') }} className="flex-1 border border-red-200 text-red-500 py-2 rounded-xl text-sm font-semibold hover:bg-red-50">Release</button>
                </div>
              </div>
            ) : (
              <div className={`${dm.card} border rounded-2xl p-8 text-center`}>
                <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
                <p className={`${dm.subtext} text-sm mb-4`}>No active bookings</p>
                <button onClick={() => setActiveNav('Library Map')} className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark">Go to Library Map</button>
              </div>
            )}
          </div>
        )
      }

      // ── History ─────────────────────────────────────────────────────────────
      if (activeNav === 'History') {
        const history = [
          { seat: 'A07', type: 'Solo Cubicle', date: 'Jun 14, 2025', duration: '2h 31m' },
          { seat: 'G1',  type: 'Group Table',  date: 'Jun 13, 2025', duration: '1h 15m' },
          { seat: 'A12', type: 'Solo Cubicle', date: 'Jun 12, 2025', duration: '3h 02m' },
          { seat: 'IS1', type: 'Indoor Study', date: 'Jun 11, 2025', duration: '45m'    },
        ]
        return (
          <div className="p-8 max-w-2xl mx-auto w-full">
            <h2 className={`text-2xl font-bold mb-6 ${dm.text}`}>Session History</h2>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className={`${dm.card} border rounded-2xl p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${dm.text}`}>Desk {h.seat} · {h.type}</p>
                      <p className={`text-xs ${dm.subtext}`}>{h.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${dm.text}`}>{h.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // ── Profile ─────────────────────────────────────────────────────────────
      if (activeNav === 'Profile') {
        return (
          <div className="p-8 max-w-lg mx-auto w-full">
            <h2 className={`text-2xl font-bold mb-6 ${dm.text}`}>My Profile</h2>
            <div className={`${dm.card} border rounded-2xl p-6`}>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'AS'}
                </div>
                <div>
                  <p className={`font-bold text-lg ${dm.text}`}>{user?.name}</p>
                  <p className={`text-sm ${dm.subtext}`}>Student · {user?.id}</p>
                </div>
              </div>
              {[
                { label: 'Student ID', value: user?.id || 'MUJ2024001' },
                { label: 'Email', value: 'student@muj.manipal.edu' },
                { label: 'Department', value: 'Computer Science' },
                { label: 'Library Card', value: 'LIB-2024-' + (user?.id || '001') },
              ].map(({ label, value }) => (
                <div key={label} className="mb-4">
                  <p className={`text-xs ${dm.subtext} mb-0.5`}>{label}</p>
                  <p className={`text-sm font-semibold ${dm.text}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // ── Help & Support ───────────────────────────────────────────────────────
      if (activeNav === 'Help & Support') {
        return (
          <div className="p-8 max-w-2xl mx-auto w-full">
            <h2 className={`text-2xl font-bold mb-2 ${dm.text}`}>Help & Support</h2>
            <p className={`text-sm mb-8 ${dm.subtext}`}>Got a question or issue? We're here to help.</p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className={`${dm.card} border rounded-2xl p-5`}>
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center mb-3">
                  <Mail size={18} className="text-primary" />
                </div>
                <p className={`font-semibold mb-1 ${dm.text}`}>Email Support</p>
                <p className={`text-sm ${dm.subtext} mb-2`}>Reach our team anytime. We respond within 24 hours.</p>
                <a href="mailto:support@seatwise.muj.edu" className="text-primary text-sm font-semibold hover:underline">
                  support@seatwise.muj.edu
                </a>
              </div>
              <div className={`${dm.card} border rounded-2xl p-5`}>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Phone size={18} className="text-blue-500" />
                </div>
                <p className={`font-semibold mb-1 ${dm.text}`}>Phone Support</p>
                <p className={`text-sm ${dm.subtext} mb-2`}>Mon–Sat, 9 AM – 6 PM (IST)</p>
                <a href="tel:+911412699100" className="text-blue-500 text-sm font-semibold hover:underline">
                  +91 141 269 9100
                </a>
              </div>
            </div>

            <div className={`${dm.card} border rounded-2xl p-6 mb-6`}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-primary" />
                <p className={`font-semibold ${dm.text}`}>Frequently Asked Questions</p>
              </div>
              {[
                { q: 'How do I check in to a seat?', a: 'Select any available seat on the Library Map and click "Check In". You can also scan the QR code at the desk.' },
                { q: 'What happens if I go away?', a: 'Use the "Go Away" button to activate a 20-minute grace period. If you don\'t return, your seat will be released automatically.' },
                { q: 'Can I book multiple seats?', a: 'No — each student can hold one active booking at a time to ensure fair access for everyone.' },
                { q: 'Who do I contact for technical issues?', a: 'Email us at support@seatwise.muj.edu or call the library desk directly.' },
              ].map(({ q, a }, i) => (
                <div key={i} className={`py-3 ${i < 3 ? 'border-b border-gray-100' : ''}`}>
                  <p className={`text-sm font-semibold mb-1 ${dm.text}`}>{q}</p>
                  <p className={`text-sm ${dm.subtext}`}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }

      return null
    }

    return (
      <div className={`flex h-screen ${dm.page}`}>
        <Sidebar navItems={navItems} activeNav={activeNav} onNav={handleNav} user={user} onLogout={() => { logout(); navigate('/') }} dm={dm} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} dm={dm} showNotif={showNotif} setShowNotif={setShowNotif} notifRef={notifRef} notifRead={notifRead} setNotifRead={setNotifRead} unreadCount={unreadCount} />
          <div className="flex-1 overflow-auto">
            {renderPageContent()}
          </div>
        </div>
      </div>
    )
  }

  // ── Library Map view ─────────────────────────────────────────────────────────
  return (
    <div className={`flex h-screen ${dm.page} font-sans`}>
      <Sidebar navItems={navItems} activeNav={activeNav} onNav={handleNav} user={user} onLogout={() => { logout(); navigate('/') }} dm={dm} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} dm={dm} showNotif={showNotif} setShowNotif={setShowNotif} notifRef={notifRef} notifRead={notifRead} setNotifRead={setNotifRead} unreadCount={unreadCount} />

        <div className="flex flex-1 overflow-hidden">
          {/* Map area */}
          <div className="flex-1 p-5 overflow-auto">
            <div className={`${dm.card} border rounded-2xl p-6 min-h-full relative`}>

              {/* Solo Cubicles */}
              <section className="mb-8">
                <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${dm.subtext}`}>Solo Cubicles (SC)</p>
                <div className="grid grid-cols-6 gap-3 max-w-2xl">
                  {soloSeats.slice(0, 6).map(seat  => <SeatCard key={seat.id} seat={seat} selected={selected} onSelect={setSelected} />)}
                  <div className="col-span-6 border-t border-dashed border-gray-100 my-0.5" />
                  {soloSeats.slice(6, 12).map(seat => <SeatCard key={seat.id} seat={seat} selected={selected} onSelect={setSelected} />)}
                  <div className="col-span-6 border-t border-dashed border-gray-100 my-0.5" />
                  {soloSeats.slice(12, 18).map(seat => <SeatCard key={seat.id} seat={seat} selected={selected} onSelect={setSelected} />)}
                  <div className="col-span-6 border-t border-dashed border-gray-100 my-0.5" />
                  {soloSeats.slice(18).map(seat  => <SeatCard key={seat.id} seat={seat} selected={selected} onSelect={setSelected} />)}
                </div>
              </section>

              {/* Group Tables */}
              <section className="mb-8">
                <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${dm.subtext}`}>Group Tables (G)</p>
                <div className="flex gap-8">
                  {groupSeats.map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => setSelected(seat.id)}
                      className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all
                        ${seat.status === 'available' ? 'bg-green-50 border-green-300' : seat.status === 'away' ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}
                        ${selected === seat.id ? 'ring-2 ring-offset-2 ring-primary scale-105' : 'hover:scale-105'}`}
                    >
                      <span className="font-bold text-gray-800 text-lg">{seat.id}</span>
                      <span className="text-xs text-gray-500">{seat.seats} seats</span>
                      <span className={`absolute top-2 right-2 w-3 h-3 rounded-full ${seat.status === 'available' ? 'bg-green-500' : seat.status === 'away' ? 'bg-yellow-400' : 'bg-red-500'}`}></span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Indoor Study Areas */}
              <section>
                <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${dm.subtext}`}>Indoor Study Areas (IS)</p>
                <div className="flex gap-4">
                  {indoorSeats.map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => setSelected(seat.id)}
                      className={`relative rounded-xl border-2 px-6 py-3 min-w-44 text-left transition-all
                        ${seat.status === 'available' ? 'bg-purple-50 border-purple-300' : 'bg-red-50 border-red-300'}
                        ${selected === seat.id ? 'ring-2 ring-offset-2 ring-primary' : 'hover:shadow-md'}`}
                    >
                      <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${seat.status === 'available' ? 'bg-purple-500' : 'bg-red-500'}`}></span>
                      <p className="font-semibold text-sm text-gray-800">{seat.id} · Indoor Study</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {seat.seats} seats · <span className={seat.status === 'available' ? 'text-purple-600 font-medium' : 'text-red-500 font-medium'}>{seat.status}</span>
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="text-xs tracking-widest text-gray-300 border border-gray-200 px-4 py-1 rounded-full uppercase">Entrance</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <aside className={`w-72 border-l ${dm.sidebar} p-5 overflow-auto flex flex-col`}>
            {!selectedSeat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className={`w-14 h-14 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                  <Map size={24} className={dm.subtext} />
                </div>
                <h3 className={`font-semibold mb-1 ${dm.text}`}>Click a seat</h3>
                <p className={`text-sm ${dm.subtext}`}>Select any seat on the map to view details and check in.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`font-bold text-lg ${dm.text}`}>Desk {selectedSeat.id}</h2>
                  <button onClick={() => setSelected(null)} className={`${dm.subtext} hover:text-gray-700 p-1`}><X size={18} /></button>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5
                  ${selectedSeat.status === 'available' ? 'bg-green-100 text-green-700' : selectedSeat.status === 'away' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[selectedSeat.status]?.dot}`}></span>
                  {selectedSeat.status.charAt(0).toUpperCase() + selectedSeat.status.slice(1)}
                </span>
                <div className="space-y-4 mb-6">
                  <Detail label="Location" value={`Floor 1 · ${selectedSeat.zone}`} dm={dm} />
                  <Detail label="Type" value={selectedSeat.type === 'solo' ? 'Solo Cubicle' : selectedSeat.type === 'group' ? 'Group Table' : 'Indoor Study'} dm={dm} />
                  {selectedSeat.occupant && <Detail label="Occupied by" value={selectedSeat.occupant} dm={dm} />}
                  {selectedSeat.checkIn && <Detail label="Check-in Time" value={selectedSeat.checkIn} dm={dm} />}
                </div>
                {renderAction()}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50">
          <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
          <div>
            <p className="font-semibold text-sm">Checked in to Desk {currentBooking?.seatId}</p>
            <p className="text-xs text-gray-400">Your 2-hour session has started.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ navItems, activeNav, onNav, user, onLogout, dm, darkMode, onToggleDark }) {
  return (
    <aside className={`w-52 ${dm.sidebar} border-r flex flex-col py-5 shrink-0`}>
      <div className="flex items-center gap-2 px-5 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <BookOpen size={15} color="white" />
        </div>
        <span className={`font-bold ${dm.text}`}>SeatWise</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onNav({ label, icon: Icon })}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeNav === label ? dm.navActive + ' font-semibold' : `text-gray-500 ${dm.navHover}`}`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>
      <div className="px-3 space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 ${dm.navHover} transition-all`}
        >
          {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={onLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 ${dm.navHover}`}>
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className={`px-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} mt-3 flex items-center gap-2`}>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user?.name?.split(' ').map(n => n[0]).join('') || 'AS'}
        </div>
        <div className="min-w-0">
          <p className={`text-xs font-semibold truncate ${dm.text}`}>{user?.name}</p>
          <p className={`text-xs truncate ${dm.subtext}`}>{user?.id}</p>
        </div>
      </div>
    </aside>
  )
}

// ── TopBar ─────────────────────────────────────────────────────────────────────
function TopBar({ user, dm, showNotif, setShowNotif, notifRef, notifRead, setNotifRead, unreadCount }) {
  return (
    <header className={`${dm.topbar} border-b px-6 py-3.5 flex items-center justify-between shrink-0 relative`}>
      <button className={`flex items-center gap-2 font-semibold text-base ${dm.text}`}>
        Library – Floor 1 <ChevronDown size={16} className={dm.subtext} />
      </button>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Occupied</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>Away</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'AS'}
          </div>
          <div className="hidden md:block">
            <p className={`text-sm font-semibold ${dm.text}`}>{user?.name}</p>
            <p className={`text-xs ${dm.subtext}`}>{user?.id}</p>
          </div>
          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotif(v => !v)
                setNotifRead(NOTIFICATIONS.map(n => n.id))
              }}
              className={`relative ${dm.subtext} hover:text-gray-700 p-1`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900">Notifications</p>
                  <span className="text-xs text-gray-400">All caught up</span>
                </div>
                {NOTIFICATIONS.map((n, i) => {
                  const Icon = n.icon
                  return (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50`}>
                      <div className={`w-9 h-9 ${n.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon size={16} className={n.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  )
                })}
                <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                  <button className="text-xs text-primary font-semibold hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function SeatCard({ seat, selected, onSelect }) {
  const colors = STATUS_COLORS[seat.status]
  return (
    <button
      onClick={() => onSelect(seat.id)}
      className={`relative border-2 rounded-xl p-2 flex flex-col items-center gap-1.5 transition-all w-full
        ${colors.bg}
        ${selected === seat.id ? `ring-2 ring-offset-1 ${colors.ring} scale-105` : 'hover:scale-105 hover:shadow-sm'}`}
    >
      <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${colors.dot}`}></span>
      <svg viewBox="0 0 40 44" width="36" height="40" fill="none">
        <rect x="6" y="2" width="28" height="18" rx="4" fill={seat.status === 'available' ? '#4ade80' : seat.status === 'away' ? '#fbbf24' : '#f87171'} />
        <rect x="4" y="20" width="32" height="12" rx="3" fill={seat.status === 'available' ? '#86efac' : seat.status === 'away' ? '#fcd34d' : '#fca5a5'} />
        <rect x="8" y="32" width="5" height="10" rx="2" fill="#9ca3af" />
        <rect x="27" y="32" width="5" height="10" rx="2" fill="#9ca3af" />
        <rect x="17" y="32" width="6" height="8" rx="1" fill="#d1d5db" />
      </svg>
      <span className="text-xs font-bold text-gray-700">{seat.id}</span>
    </button>
  )
}

function Detail({ label, value, dm }) {
  return (
    <div>
      <p className={`text-xs mb-0.5 ${dm.subtext}`}>{label}</p>
      <p className={`text-sm font-semibold ${dm.text}`}>{value}</p>
    </div>
  )
}

// Export NOTIFICATIONS so TopBar can access it at module level
const NOTIFICATIONS_EXPORT = NOTIFICATIONS
