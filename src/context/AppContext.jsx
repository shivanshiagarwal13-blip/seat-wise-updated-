import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

// Initial seat data
const initialSeats = [
  // Solo Cubicles
  { id: 'A01', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A02', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A03', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A04', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A05', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Raj M.' },
  { id: 'A06', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A08', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Priya S.', checkIn: '09:00 AM' },
  { id: 'A09', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A10', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A11', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Arjun S.', checkIn: '10:15 AM' },
  { id: 'A12', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Meena R.', checkIn: '10:30 AM' },
  { id: 'A13', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A15', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Dev K.' },
  { id: 'A16', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A17', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A18', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Sneha P.', checkIn: '11:00 AM' },
  { id: 'A19', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A20', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Vikram L.', checkIn: '11:20 AM' },
  { id: 'A22', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Nisha T.', checkIn: '08:45 AM' },
  { id: 'A23', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A24', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A25', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  { id: 'A26', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Karan B.' },
  { id: 'A27', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
  // Group Tables
  { id: 'G1', type: 'group', status: 'available', zone: 'Group Zone', floor: 1, seats: 6 },
  { id: 'G2', type: 'group', status: 'occupied', zone: 'Group Zone', floor: 1, seats: 6, occupant: 'Team Alpha', checkIn: '10:00 AM' },
  // Indoor Study Areas
  { id: 'IS1', type: 'indoor', status: 'available', zone: 'Indoor Study', floor: 1, seats: 8 },
  { id: 'IS2', type: 'indoor', status: 'occupied', zone: 'Indoor Study', floor: 1, seats: 6, occupant: 'Study Group', checkIn: '09:30 AM' },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('seatwise-user')
    return stored ? JSON.parse(stored) : null
  })
  const [seats, setSeats] = useState(initialSeats)
  const [currentBooking, setCurrentBooking] = useState(null)
  const [awayMode, setAwayMode] = useState(false)

  const fetchSeats = async (userId) => {
    if (!userId) return
    try {
      const res = await fetch(`/api/seats?userId=${encodeURIComponent(userId)}`)
      if (!res.ok) throw new Error('Unable to fetch seats')
      const json = await res.json()
      setSeats(json.seats ?? initialSeats)
      setCurrentBooking(json.currentBooking ?? null)
      setAwayMode(json.currentBooking?.status === 'away')
    } catch (error) {
      console.warn('Seat fetch failed:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSeats(user.id)
    }
  }, [user])

  const login = async (userData) => {
    setUser(userData)
    window.localStorage.setItem('seatwise-user', JSON.stringify(userData))
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      if (!res.ok) throw new Error('Login failed')
      const json = await res.json()
      setSeats(json.seats ?? initialSeats)
      setCurrentBooking(json.currentBooking ?? null)
      setAwayMode(json.currentBooking?.status === 'away')
      return true
    } catch (error) {
      console.warn('Login backend failed:', error)
      return false
    }
  }

  const logout = () => {
    window.localStorage.removeItem('seatwise-user')
    setUser(null)
    setCurrentBooking(null)
    setAwayMode(false)
  }

  const bookSeat = async (seatId, qrData) => {
    if (!user) return
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.name, seatId, qrData }),
      })
      if (!res.ok) throw new Error('Booking failed')
      const json = await res.json()
      setSeats(json.seats ?? seats)
      setCurrentBooking(json.currentBooking ?? null)
      setAwayMode(json.currentBooking?.status === 'away')
    } catch (error) {
      console.warn('Book seat failed:', error)
    }
  }

  const releaseSeat = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!res.ok) throw new Error('Release failed')
      const json = await res.json()
      setSeats(json.seats ?? seats)
      setCurrentBooking(null)
      setAwayMode(false)
    } catch (error) {
      console.warn('Release seat failed:', error)
    }
  }

  const activateAway = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/away', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!res.ok) throw new Error('Away activation failed')
      const json = await res.json()
      setSeats(json.seats ?? seats)
      setCurrentBooking(json.currentBooking ?? null)
      setAwayMode(true)
    } catch (error) {
      console.warn('Activate away failed:', error)
    }
  }

  const endAway = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!res.ok) throw new Error('Return failed')
      const json = await res.json()
      setSeats(json.seats ?? seats)
      setCurrentBooking(json.currentBooking ?? null)
      setAwayMode(false)
    } catch (error) {
      console.warn('Return from away failed:', error)
    }
  }

  return (
    <AppContext.Provider value={{
      user, login, logout,
      seats, bookSeat, releaseSeat,
      currentBooking,
      awayMode, activateAway, endAway,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
