import mongoose, { Schema } from 'mongoose'

const Mixed = Schema.Types.Mixed

const User = new Schema({
  name: String,
  email: String,
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

export default mongoose.model('User', User)
