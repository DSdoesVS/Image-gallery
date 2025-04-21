// src/services/api.ts
import axios from 'axios'
import { User } from '../types/User'
import { Album } from '../types/Album'
import { Photo } from '../types/Photo'

const API = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

/** Users */
export function fetchUsers(): Promise<User[]> {
  return API.get<User[]>('/users?_limit=10').then(r => r.data)
}

export function createUser(user: Partial<User>): Promise<User> {
  return API.post<User>('/users', user).then(r => r.data)
}

export function updateUser(id: number, data: Partial<User>): Promise<User> {
  return API.put<User>(`/users/${id}`, data).then(r => r.data)
}

export function deleteUser(id: number): Promise<void> {
  return API.delete(`/users/${id}`).then(() => {})
}

/** Albums */
export function fetchUserAlbums(userId: number): Promise<Album[]> {
  return API.get<Album[]>(`/albums?userId=${userId}`).then(r => r.data)
}

export function fetchAlbum(id: number): Promise<Album> {
  return API.get<Album>(`/albums/${id}`).then(r => r.data)
}

export function createAlbum(data: Partial<Album>): Promise<Album> {
  return API.post<Album>('/albums', data).then(r => r.data)
}

export function updateAlbum(id: number, data: Partial<Album>): Promise<Album> {
  return API.put<Album>(`/albums/${id}`, data).then(r => r.data)
}

export function deleteAlbum(id: number): Promise<void> {
  return API.delete(`/albums/${id}`).then(() => {})
}

/** Photos */
export function fetchAlbumPhotos(albumId: number): Promise<Photo[]> {
  return API.get<Photo[]>(`/photos?albumId=${albumId}`).then(r =>
    r.data.map(p => ({
      ...p,
      url: `https://picsum.photos/seed/${p.id}/800/600`,
      thumbnailUrl: `https://picsum.photos/seed/${p.id}/150/150`
    }))
  )
}

export function fetchPhoto(photoId: number): Promise<Photo> {
  return API.get<Photo>(`/photos/${photoId}`).then(r => ({
    ...r.data,
    url: `https://picsum.photos/id/${r.data.id}/800/600`,
    thumbnailUrl: `https://picsum.photos/id/${r.data.id}/150/150`
  }))
}

export function createPhoto(data: Partial<Photo>): Promise<Photo> {
  return API.post<Photo>('/photos', data).then(r => r.data)
}

export function updatePhoto(id: number, data: Partial<Photo>): Promise<Photo> {
  return API.put<Photo>(`/photos/${id}`, data).then(r => r.data)
}

export function deletePhoto(id: number): Promise<void> {
  return API.delete(`/photos/${id}`).then(() => {})
}
