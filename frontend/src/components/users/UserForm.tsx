// src/components/users/UserForm.tsx
import { FC, useState, useEffect } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { User } from '../../types/User'

interface Props {
  title: string
  initialData?: Partial<User>
  onSubmit: (data: { name: string; username: string; email: string }) => Promise<void>
}

const UserForm: FC<Props> = ({ title, initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '')
  const [username, setUsername] = useState(initialData?.username || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setUsername(initialData.username || '')
      setEmail(initialData.email || '')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit({ name, username, email })
    setSubmitting(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
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
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: 2 }}
      >
        {title}
      </Button>
    </Box>
  )
}

export default UserForm
