
import { useNavigate, useParams } from 'react-router-dom'
import PhotoForm from '../components/photos/PhotoForm'
import { createPhoto } from '../services/api'

export default function PhotoCreatePage() {
  const { albumId } = useParams<{ albumId: string }>()
  const navigate = useNavigate()

  const handleSubmit = async (data: {
    title: string
    url: string
    thumbnailUrl: string
    albumId: string
  }) => {
    await createPhoto({
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      albumId: data.albumId
    })
    
    navigate(`/albums/${data.albumId}`)
  }

  return (
    <PhotoForm
      title="New Photo"
      onSubmit={handleSubmit}
    />
  )
}
