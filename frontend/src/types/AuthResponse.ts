// src/types/AuthResponse.ts
import { User } from './User'

export interface AuthResponse {
  token: string
  user: User
}
