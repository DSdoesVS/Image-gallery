
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUser, updateUser } from '../services/api'
import { CircularProgress, Alert, Box } from '@mui/material'
import UserForm from '../components/users/UserForm'
import { User } from '../types/User'

export default function UserEditPage() {
  const { userId } = useParams<{ userId?: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    fetchUser(+userId)
      .then(setUser)
      .catch(() => setError('Failed to load user'))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!user) return null

  const handleUpdate = async (data: { name: string; username: string; email: string }) => {
    await updateUser(user.id, data)
    navigate('/users')
  }

  return (
    <Box sx={{ p: 2 }}>
      <UserForm
        title="Edit User"
        initialData={user}
        onSubmit={handleUpdate}
      />
    </Box>
  )
}
