import axios from 'axios'
import { User } from '../types/User'

const API = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

export function fetchUsers(): Promise<User[]> {
  return API.get<User[]>('/users?_limit=10').then(res => res.data)
}
