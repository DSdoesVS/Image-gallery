
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

  
  const handleDeleteAlbum = async (albumId: string) => {
    try {
      if (!useFakeData) {
        await deleteAlbum(albumId)
      }
      setAlbums(prev => prev.filter(a => a._id !== albumId))
      
      setCovers(prev => {
        const { [albumId]: _, ...rest } = prev
        return rest
      })
    } catch {
     
      console.error('Failed to delete album')
    }
  }

  useEffect(() => {
   
    if (!isAuthenticated) {
      setLoading(false)
      setUseFakeData(true)
   
      const effectiveUserId = userId || (user ? user.id : '1')
      const fakeAlbums = generateFakeAlbums(parseInt(effectiveUserId, 10), 6)
      setAlbums(fakeAlbums)
      
  
      const fakeCoverEntries = fakeAlbums.map(album => {
        const photo = generateFakePhoto(album.id)
        return [album._id, photo] as [string, Photo]
      })
      setCovers(Object.fromEntries(fakeCoverEntries))
      return
    }
    
    
    if (!userId && user) {
      navigate(`/users/${user.id}`);
      return;
    }

    
    const effectiveUserId = userId || (user ? user.id : '')
    
    if (!effectiveUserId) {
      setLoading(false)
      setError('No user ID available')
      setUseFakeData(true)
      return
    }

    ;(async () => {
      try {
        
        const albumData = await fetchUserAlbums(effectiveUserId)
        setAlbums(albumData)

        
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
      {useFakeData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Unable to connect to the server. Showing placeholder albums.
        </Alert>
      )}
      
     
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
