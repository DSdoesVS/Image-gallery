import { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
   
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
