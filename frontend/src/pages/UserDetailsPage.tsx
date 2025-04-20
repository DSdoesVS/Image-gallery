import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUserAlbums } from '../services/api'
import { Album } from '../types/Album'
import {
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material'

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId?: string }>()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    fetchUserAlbums(+userId)
      .then(data => {
        setAlbums(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load albums')
        setLoading(false)
      })
  }, [userId])

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Albums
      </Typography>
      <Grid container spacing={2}>
        {albums.map(album => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{album.title}</Typography>
                <Button
                  component={Link}
                  to={`/albums/${album.id}`}
                  size="small"
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  View Photos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
