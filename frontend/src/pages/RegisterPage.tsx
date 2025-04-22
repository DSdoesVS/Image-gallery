// src/pages/RegisterPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(name, username, email, password)
      nav('/users')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5">Sign Up</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth value={name}
          onChange={e => setName(e.target.value)} margin="normal" required />
        <TextField label="Username" fullWidth value={username}
          onChange={e => setUsername(e.target.value)} margin="normal" required />
        <TextField label="Email" type="email" fullWidth value={email}
          onChange={e => setEmail(e.target.value)} margin="normal" required />
        <TextField label="Password" type="password" fullWidth value={password}
          onChange={e => setPassword(e.target.value)} margin="normal" required />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Sign Up</Button>
      </Box>
      <Typography mt={2}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Box>
  )
}
