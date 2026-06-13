import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, 'seatwise.db')

const app = express()
app.use(cors())
app.use(express.json())

let db

async function initDb() {
  db = await open({ filename: DB_PATH, driver: sqlite3.Database })
  await db.exec(`
    CREATE TABLE IF NOT EXISTS seats (
      id TEXT PRIMARY KEY,
      type TEXT,
      status TEXT,
      zone TEXT,
      floor INTEGER,
      seats INTEGER,
      occupant TEXT,
      bookedBy TEXT,
      checkIn TEXT,
      expiresAt TEXT,
      awayExpiresAt TEXT
    )
  `)

  const row = await db.get('SELECT COUNT(*) as count FROM seats')
  if (!row || row.count === 0) {
    const seats = [
      { id: 'A01', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A02', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A03', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A04', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A05', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Raj M.', bookedBy: 'raj001', awayExpiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString() },
      { id: 'A06', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A08', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Priya S.', bookedBy: 'priya007', checkIn: '09:00 AM', expiresAt: new Date(Date.now() + 65 * 60 * 1000).toISOString() },
      { id: 'A09', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A10', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A11', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Arjun S.', bookedBy: 'arjun114', checkIn: '10:15 AM', expiresAt: new Date(Date.now() + 40 * 60 * 1000).toISOString() },
      { id: 'A12', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Meena R.', bookedBy: 'meena203', checkIn: '10:30 AM', expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
      { id: 'A13', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A15', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Dev K.', bookedBy: 'devk012', awayExpiresAt: new Date(Date.now() + 8 * 60 * 1000).toISOString() },
      { id: 'A16', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A17', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A18', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Sneha P.', bookedBy: 'sneha321', checkIn: '11:00 AM', expiresAt: new Date(Date.now() + 62 * 60 * 1000).toISOString() },
      { id: 'A19', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A20', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Vikram L.', bookedBy: 'vikram215', checkIn: '11:20 AM', expiresAt: new Date(Date.now() + 50 * 60 * 1000).toISOString() },
      { id: 'A22', type: 'solo', status: 'occupied', zone: 'Quiet Zone', floor: 1, occupant: 'Nisha T.', bookedBy: 'nisha102', checkIn: '08:45 AM', expiresAt: new Date(Date.now() + 25 * 60 * 1000).toISOString() },
      { id: 'A23', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A24', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A25', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'A26', type: 'solo', status: 'away', zone: 'Quiet Zone', floor: 1, occupant: 'Karan B.', bookedBy: 'karan303', awayExpiresAt: new Date(Date.now() + 4 * 60 * 1000).toISOString() },
      { id: 'A27', type: 'solo', status: 'available', zone: 'Quiet Zone', floor: 1 },
      { id: 'G1', type: 'group', status: 'available', zone: 'Group Zone', floor: 1, seats: 6 },
      { id: 'G2', type: 'group', status: 'occupied', zone: 'Group Zone', floor: 1, seats: 6, occupant: 'Team Alpha', bookedBy: 'teamalpha', checkIn: '10:00 AM', expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString() },
      { id: 'IS1', type: 'indoor', status: 'available', zone: 'Indoor Study', floor: 1, seats: 8 },
      { id: 'IS2', type: 'indoor', status: 'occupied', zone: 'Indoor Study', floor: 1, seats: 6, occupant: 'Study Group', bookedBy: 'studygrp', checkIn: '09:30 AM', expiresAt: new Date(Date.now() + 70 * 60 * 1000).toISOString() },
    ]

    const insert = await db.prepare(`INSERT INTO seats (id, type, status, zone, floor, seats, occupant, bookedBy, checkIn, expiresAt, awayExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    for (const seat of seats) {
      await insert.run(
        seat.id,
        seat.type,
        seat.status,
        seat.zone,
        seat.floor,
        seat.seats || 1,
        seat.occupant || null,
        seat.bookedBy || null,
        seat.checkIn || null,
        seat.expiresAt || null,
        seat.awayExpiresAt || null
      )
    }
    await insert.finalize()
  }
}

async function getSeats(userId) {
  const seats = await db.all('SELECT * FROM seats')
  const currentBooking = await db.get('SELECT * FROM seats WHERE bookedBy = ? AND status IN ("occupied","away")', userId)
  return { seats, currentBooking }
}

async function expireSessions() {
  const now = new Date().toISOString()
  const expired = await db.all(`SELECT * FROM seats WHERE (status = 'occupied' AND expiresAt <= ?) OR (status = 'away' AND awayExpiresAt <= ?)`, now, now)
  for (const seat of expired) {
    await db.run(`UPDATE seats SET status = 'available', occupant = NULL, bookedBy = NULL, checkIn = NULL, expiresAt = NULL, awayExpiresAt = NULL WHERE id = ?`, seat.id)
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/login', async (req, res) => {
  const { id, name, role } = req.body
  if (!id || !name || !role) return res.status(400).json({ error: 'Missing user fields' })
  const { seats, currentBooking } = await getSeats(id)
  return res.json({ user: { id, name, role }, seats, currentBooking })
})

app.get('/api/seats', async (req, res) => {
  const { userId } = req.query
  const { seats, currentBooking } = await getSeats(userId)
  return res.json({ seats, currentBooking })
})

app.post('/api/scan', async (req, res) => {
  const { userId, userName, seatId, qrData } = req.body
  if (!userId || !userName || !seatId) {
    return res.status(400).json({ error: 'Missing booking fields' })
  }

  const seat = await db.get('SELECT * FROM seats WHERE id = ?', seatId)
  if (!seat) return res.status(404).json({ error: 'Seat not found' })
  if (seat.status !== 'available') return res.status(409).json({ error: 'Seat is not available' })
  if (qrData && qrData !== seatId) {
    return res.status(400).json({ error: 'Invalid QR code for selected seat' })
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
  const checkIn = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  await db.run(`
    UPDATE seats SET status = 'occupied', occupant = ?, bookedBy = ?, checkIn = ?, expiresAt = ?, awayExpiresAt = NULL WHERE id = ?
  `, userName, userId, checkIn, expiresAt, seatId)

  const { seats, currentBooking } = await getSeats(userId)
  res.json({ seats, currentBooking })
})

app.post('/api/release', async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })
  await db.run(`UPDATE seats SET status = 'available', occupant = NULL, bookedBy = NULL, checkIn = NULL, expiresAt = NULL, awayExpiresAt = NULL WHERE bookedBy = ?`, userId)
  const { seats } = await getSeats(userId)
  res.json({ seats, currentBooking: null })
})

app.post('/api/away', async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })
  const seat = await db.get('SELECT * FROM seats WHERE bookedBy = ? AND status = "occupied"', userId)
  if (!seat) return res.status(404).json({ error: 'No active seat to pause' })
  const awayExpiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString()
  await db.run('UPDATE seats SET status = "away", awayExpiresAt = ? WHERE id = ?', awayExpiresAt, seat.id)
  const { seats, currentBooking } = await getSeats(userId)
  res.json({ seats, currentBooking })
})

app.post('/api/return', async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })
  const seat = await db.get('SELECT * FROM seats WHERE bookedBy = ? AND status = "away"', userId)
  if (!seat) return res.status(404).json({ error: 'No away session found' })
  await db.run('UPDATE seats SET status = "occupied", awayExpiresAt = NULL WHERE id = ?', seat.id)
  const { seats, currentBooking } = await getSeats(userId)
  res.json({ seats, currentBooking })
})

const PORT = process.env.PORT || 3001
initDb()
  .then(() => {
    setInterval(expireSessions, 60 * 1000)
    app.listen(PORT, () => {
      console.log(`SeatWise backend running on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Failed to initialize database', err)
    process.exit(1)
  })
