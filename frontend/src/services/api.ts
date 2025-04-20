import axios from 'axios'
import { User } from '../types/User'
import { Album } from '../types/Album'

const API = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

export function fetchUsers(): Promise<User[]> {
  return API.get<User[]>('/users?_limit=10').then(res => res.data)
}
export function fetchUserAlbums(userId: number): Promise<Album[]> {
    return API.get<Album[]>(`/albums?userId=${userId}`).then(res => res.data)
  }