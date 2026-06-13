import React, { createContext, useContext, useState } from 'react'

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
  const [user, setUser] = useState(null)
  const [seats, setSeats] = useState(initialSeats)
  const [currentBooking, setCurrentBooking] = useState(null)
  const [awayMode, setAwayMode] = useState(false)

  const login = (userData) => setUser(userData)
  const logout = () => {
    setUser(null)
    setCurrentBooking(null)
    setAwayMode(false)
  }

  const bookSeat = (seatId) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setSeats(prev => prev.map(s =>
      s.id === seatId
        ? { ...s, status: 'occupied', occupant: user?.name, checkIn: timeStr }
        : s
    ))
    const seat = seats.find(s => s.id === seatId)
    setCurrentBooking({ seatId, seat, checkIn: timeStr, sessionStart: now })
  }

  const releaseSeat = () => {
    if (!currentBooking) return
    setSeats(prev => prev.map(s =>
      s.id === currentBooking.seatId
        ? { ...s, status: 'available', occupant: null, checkIn: null }
        : s
    ))
    setCurrentBooking(null)
    setAwayMode(false)
  }

  const activateAway = () => setAwayMode(true)
  const endAway = () => setAwayMode(false)

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
