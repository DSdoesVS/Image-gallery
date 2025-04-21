import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  username: { type: String, unique: true },
  email:    { type: String, unique: true },
  passwordHash: String
})

export default model('User', UserSchema)