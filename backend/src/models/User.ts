import { Schema, model, Document } from 'mongoose'

interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

const UserSchema = new Schema({
  name: String,
  username: { type: String, unique: true },
  email:    { type: String, unique: true },
  passwordHash: String
})

export default model<UserDocument>('User', UserSchema)