// src/pages/UserListPage.tsx
import { useState, useEffect } from 'react'
import { fetchUsers, fetchUserAlbums } from '../services/api'
import { deleteUser } from '../services/api'
import { User } from '../types/User'
import {
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Badge
} from '@mui/material'
import { Link } from 'react-router-dom'

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        // 1) fetch users
        const usersData = await fetchUsers()
        setUsers(usersData)

        // 2) fetch albums for each user to get counts
        const countEntries = await Promise.all(
          usersData.map(async (u) => {
            const albums = await fetchUserAlbums(u.id)
            return [u.id, albums.length] as [string, number]
          })
        )
        setAlbumCounts(Object.fromEntries(countEntries))
      } catch {
        setError('Failed to load users or album counts')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <CircularProgress />
  if (error)   return <Alert severity="error">{error}</Alert>

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {users.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {user.name}{' '}
                <Badge badgeContent={albumCounts[user.id] ?? 0} color="primary">
                  albums
                </Badge>
              </Typography>
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
