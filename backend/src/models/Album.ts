import { Schema, model, Types } from 'mongoose'

interface Album {
  title: string
  userId: Types.ObjectId
}

const albumSchema = new Schema<Album>({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default model<Album>('Album', albumSchema)
