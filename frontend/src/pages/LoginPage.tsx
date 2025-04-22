// src/pages/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      nav('/users')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5">Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField label="Username" fullWidth value={username}
          onChange={e => setUsername(e.target.value)} margin="normal" required />
        <TextField label="Password" type="password" fullWidth value={password}
          onChange={e => setPassword(e.target.value)} margin="normal" required />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
      </Box>
      <Typography mt={2}>
        Don’t have an account? <Link to="/register">Sign up</Link>
      </Typography>
    </Box>
  )
}
