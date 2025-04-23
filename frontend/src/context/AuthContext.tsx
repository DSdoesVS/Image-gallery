import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loginUser, registerUser } from '../services/api'
import { User } from '../types/User'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (name: string, username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

 
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        // Handle potential JSON parse error
        console.error('Error parsing stored user data', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser({ username, password })
      
    
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await registerUser({ name, username, email, password })
      
     
      if (response.token) {
        setToken(response.token)
        setUser(response.user)
        setIsAuthenticated(true)
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
  
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
