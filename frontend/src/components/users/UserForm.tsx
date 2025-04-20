import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

interface Props {
  title: string
  onSubmit: (data: { name: string; username: string; email: string }) => void
}

export default function UserForm({ title, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, username, email })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {title}
      </Button>
    </Box>
  )
}
