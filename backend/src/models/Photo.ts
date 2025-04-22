import { Schema, model, Types } from 'mongoose'

interface Photo {
  title: string
  albumId: Types.ObjectId
  url: string
  thumbnailUrl: string
}

const photoSchema = new Schema<Photo>({
  title:      { type: String, required: true },
  albumId:    { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  url:        { type: String, required: true },
  thumbnailUrl:{ type: String, required: true }
}, { timestamps: true })

export default model<Photo>('Photo', photoSchema)
