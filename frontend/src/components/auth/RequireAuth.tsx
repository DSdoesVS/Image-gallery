import { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to login, preserving where they came from
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
