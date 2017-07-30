import mongoose, { Schema } from 'mongoose'
import { pick } from 'ramda'
import uuid from 'uuid/v4'

const Mixed = Schema.Types.Mixed

const User = new Schema({
  uid: { type: String, default: uuid, index: true },
  createdAt: { type: Date, default: Date.now },
  name: String,
  email: String,
  auth: {},
  bio: String,
  games: [{
    // https://github.com/igdb/igdb-api-node
    name: String,
    img: String,
    role: String,
    profileLink: String,
    stats: Mixed
  }],
  birthDate: Date,
  address: {
    city: String,
    street: String,
    country: String
  },
  hardware: [Mixed],
  genres: [String]
}, {
  strict: false,
  collection: 'users'
})

const publicFields = [
  'name',
  'email',
  'bio',
  'games',
  'genres',
  'hardware',
  'logo',
  'uid',
  'createdAt'
]

User.statics = {
  findByUid(uid) {
    return this.findOne({ uid })
  }
}

User.methods = {
  publicObject() {
    return pick(publicFields, this)
  }
}

export default mongoose.model('User', User)
