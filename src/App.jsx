import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import LibraryMap from './pages/LibraryMap'
import AwayModePage from './pages/AwayModePage'
import LibrarianDashboard from './pages/LibrarianDashboard'
import InfoPage from './pages/InfoPage'

function ProtectedRoute({ children, role }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/map" element={
            <ProtectedRoute role="student">
              <LibraryMap />
            </ProtectedRoute>
          } />
          <Route path="/away" element={
            <ProtectedRoute role="student">
              <AwayModePage />
            </ProtectedRoute>
          } />
          <Route path="/librarian" element={
            <ProtectedRoute role="librarian">
              <LibrarianDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
