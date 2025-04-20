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
      url: `https://picsum.photos/seed/${p.id}/800/600`,
      thumbnailUrl: `https://picsum.photos/seed/${p.id}/150/150`
    }))
  )
}
export function createUser(user: Partial<User>): Promise<User> {
    return API.post<User>('/users', user).then(res => res.data)
  }
  export function deleteUser(userId: number): Promise<void> {
    return API.delete(`/users/${userId}`).then(() => {})
  }
  export function updateUser(userId: number, data: Partial<User>): Promise<User> {
    return API.put<User>(`/users/${userId}`, data).then(res => res.data)
  }