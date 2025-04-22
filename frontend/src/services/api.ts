// src/services/api.ts
import API from './axios'    // ← your JWT‑aware instance
import { User }  from '../types/User'
import { Album } from '../types/Album'
import { Photo } from '../types/Photo'
import { AuthResponse } from '../types/AuthResponse'

export interface AuthResponse {
  token: string
  user: User
}

/** AUTH */
export function registerUser(data: {
  name: string
  username: string
  email: string
  password: string
}): Promise<AuthResponse> {
  return API.post('/auth/register', data).then(r => r.data)
}

export function loginUser(data: {
  username: string
  password: string
}): Promise<AuthResponse> {
  return API.post('/auth/login', data).then(r => r.data)
}

/** USERS */
export function fetchUsers(): Promise<User[]> {
  return API.get('/users').then(r => r.data)
}
export function fetchUser(id: string): Promise<User> {
  return API.get(`/users/${id}`).then(r => r.data)
}
export function createUser(u: Partial<User>): Promise<User> {
  return API.post('/users', u).then(r => r.data)
}
export function updateUser(id: string, u: Partial<User>): Promise<User> {
  return API.put(`/users/${id}`, u).then(r => r.data)
}
export function deleteUser(id: string): Promise<void> {
  return API.delete(`/users/${id}`).then(() => {})
}

/** ALBUMS */
export function fetchUserAlbums(userId: string): Promise<Album[]> {
  return API.get(`/users/${userId}/albums`).then(r => r.data)
}
export function fetchAlbum(id: string): Promise<Album> {
  return API.get(`/albums/${id}`).then(r => r.data)
}
export function createAlbum(a: Partial<Album>): Promise<Album> {
  return API.post(`/users/${a.userId}/albums`, a).then(r => r.data)
}
export function updateAlbum(id: string, a: Partial<Album>): Promise<Album> {
  return API.put(`/albums/${id}`, a).then(r => r.data)
}
export function deleteAlbum(id: string): Promise<void> {
  return API.delete(`/albums/${id}`).then(() => {})
}

/** PHOTOS */
export function fetchAlbumPhotos(albumId: string): Promise<Photo[]> {
  return API.get(`/albums/${albumId}/photos`).then(r => r.data)
}
export function fetchPhoto(id: string): Promise<Photo> {
  return API.get(`/photos/${id}`).then(r => r.data)
}
export function createPhoto(p: Partial<Photo>): Promise<Photo> {
  return API.post(`/albums/${p.albumId}/photos`, p).then(r => r.data)
}
export function updatePhoto(id: string, p: Partial<Photo>): Promise<Photo> {
  return API.put(`/photos/${id}`, p).then(r => r.data)
}
export function deletePhoto(id: string): Promise<void> {
  return API.delete(`/photos/${id}`).then(() => {})
}
