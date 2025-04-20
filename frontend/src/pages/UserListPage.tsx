import { useState, useEffect } from 'react'
import { fetchUsers } from '../services/api'
import { User } from '../types/User'
import { CircularProgress, Alert, Grid, Card, CardContent, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load users')
        setLoading(false)
      })
  }, [])

  if (loading) return <CircularProgress />

  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {users.map(user => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {user.email}
              </Typography>
              <Button
                component={Link}
                to={`/users/${user.id}`}
                variant="contained"
                size="small"
              >
                View Albums
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
