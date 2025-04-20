import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUserAlbums, fetchAlbumPhotos } from '../services/api'
import { Album } from '../types/Album'
import { Photo } from '../types/Photo'
import {
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button
} from '@mui/material'

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId?: string }>()
  const [albums, setAlbums] = useState<Album[]>([])
  const [covers, setCovers] = useState<Record<number, Photo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    ;(async () => {
      try {
        const albumData = await fetchUserAlbums(+userId)
        setAlbums(albumData)

        const coverEntries = await Promise.all(
          albumData.map(async (album) => {
            const photos = await fetchAlbumPhotos(album.id)
            return [album.id, photos[0]] as [number, Photo]
          })
        )

        setCovers(Object.fromEntries(coverEntries))
      } catch {
        setError('Failed to load albums')
      } finally {
        setLoading(false)
      }
    })()
  }, [userId])

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Albums ({albums.length})
      </Typography>
      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Card>
              {covers[album.id] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={covers[album.id].thumbnailUrl}
                  alt={album.title}
                />
              )}
              <CardContent>
                <Typography variant="h6">{album.title}</Typography>
                <Button
                  component={Link}
                  to={`/albums/${album.id}`}
                  variant="contained"
                  size="small"
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
