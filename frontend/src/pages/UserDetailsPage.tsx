// src/pages/UserDetailsPage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  fetchUserAlbums,
  fetchAlbumPhotos,
  deleteAlbum
} from '../services/api'
import { useAuth } from '../context/AuthContext'
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
  Button,
  Box
} from '@mui/material'
import { generateFakeAlbums, generateFakePhoto } from '../utils/fakeData'

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [albums, setAlbums] = useState<Album[]>([])
  const [covers, setCovers] = useState<Record<string, Photo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useFakeData, setUseFakeData] = useState(false)

  // Deletes an album by ID, then removes it from local state
  const handleDeleteAlbum = async (albumId: string) => {
    try {
      if (!useFakeData) {
        await deleteAlbum(albumId)
      }
      setAlbums(prev => prev.filter(a => a._id !== albumId))
      // also drop its cover
      setCovers(prev => {
        const { [albumId]: _, ...rest } = prev
        return rest
      })
    } catch {
      // you might show a toast/error here
      console.error('Failed to delete album')
    }
  }

  useEffect(() => {
    // If not authenticated, don't try to fetch data
    if (!isAuthenticated) {
      setLoading(false)
      setUseFakeData(true)
      // Use current user's ID if none provided in URL
      const effectiveUserId = userId || (user ? user.id : '1')
      const fakeAlbums = generateFakeAlbums(parseInt(effectiveUserId, 10), 6)
      setAlbums(fakeAlbums)
      
      // Generate fake covers for each album
      const fakeCoverEntries = fakeAlbums.map(album => {
        const photo = generateFakePhoto(album.id)
        return [album._id, photo] as [string, Photo]
      })
      setCovers(Object.fromEntries(fakeCoverEntries))
      return
    }
    
    // If user is viewing their own profile but URL doesn't match authenticated user ID
    if (!userId && user) {
      // Redirect to the correct user profile
      navigate(`/users/${user.id}`);
      return;
    }

    // Use current user's ID if none provided in URL
    const effectiveUserId = userId || (user ? user.id : '')
    
    if (!effectiveUserId) {
      setLoading(false)
      setError('No user ID available')
      setUseFakeData(true)
      return
    }

    ;(async () => {
      try {
        // 1) Load this user's albums
        const albumData = await fetchUserAlbums(effectiveUserId)
        setAlbums(albumData)

        // 2) For each album, load its photos and pick the first as cover
        const coverEntries = await Promise.all(
          albumData.map(async album => {
            const photos = await fetchAlbumPhotos(album._id)
            return [album._id, photos[0]] as [string, Photo]
          })
        )
        setCovers(Object.fromEntries(coverEntries))
        setUseFakeData(false)
      } catch (error) {
        console.error('Error loading albums:', error)
        setError('Failed to load albums or covers')
        
        // Generate fake albums when real data fails to load
        const fakeAlbums = generateFakeAlbums(parseInt(effectiveUserId, 10), 6)
        setAlbums(fakeAlbums)
        
        // Generate fake covers for each album
        const fakeCoverEntries = fakeAlbums.map(album => {
          const photo = generateFakePhoto(album.id)
          return [album._id, photo] as [string, Photo]
        })
        setCovers(Object.fromEntries(fakeCoverEntries))
        setUseFakeData(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [userId, user, isAuthenticated, navigate])

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />

  return (
    <Box sx={{ p: 2 }}>
      {/* Show info alert when using fake data */}
      {useFakeData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Unable to connect to the server. Showing placeholder albums.
        </Alert>
      )}
      
      {/* New‐Album button */}
      <Box sx={{ mb: 2, textAlign: 'right' }}>
        <Button
          component={Link}
          to={`/users/${userId}/albums/new`}
          variant="contained"
          size="small"
        >
          New Album
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Albums ({albums.length})
      </Typography>

      <Grid container spacing={2}>
        {albums.map(album => (
          <Grid item xs={12} sm={6} md={4} key={album._id}>
            <Card>
              {/* cover image if available */}
              {covers[album._id] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={covers[album._id].thumbnailUrl}
                  alt={album.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" noWrap>
                  {album.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    component={Link}
                    to={`/albums/${album._id}`}
                    size="small"
                    variant="contained"
                  >
                    View Photos
                  </Button>
                  <Button
                    component={Link}
                    to={`/albums/${album._id}/edit`}
                    size="small"
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteAlbum(album._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
