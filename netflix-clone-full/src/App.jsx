
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Browse from './pages/Browse.jsx'
import Account from './pages/Account.jsx'
import Search from './pages/Search.jsx'
import Profiles from './pages/Profiles.jsx'
import { AuthProvider, useAuth } from './services/auth.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-white p-6">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profiles" element={<PrivateRoute><Profiles /></PrivateRoute>} />
        <Route path="/browse" element={<PrivateRoute><Browse /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
