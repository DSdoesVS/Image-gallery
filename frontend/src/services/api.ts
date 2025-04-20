import axios from 'axios'
import { User } from '../types/User'
import { Album } from '../types/Album'
import { Photo } from '../types/Photo'

const API = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

export function fetchUsers(): Promise<User[]> {
  return API.get<User[]>('/users?_limit=10').then(res => res.data)
}

export function fetchUserAlbums(userId: number): Promise<Album[]> {
  return API.get<Album[]>(`/albums?userId=${userId}`).then(res => res.data)
}

export function fetchAlbumPhotos(albumId: number): Promise<Photo[]> {
  return API.get<Photo[]>(`/photos?albumId=${albumId}`).then(res =>
    res.data.map(p => ({
      ...p,
      url: `https://picsum.photos/id/${p.id}/800/600`,
      thumbnailUrl: `https://picsum.photos/id/${p.id}/150/150`
    }))
  )
}