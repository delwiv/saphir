import mongoose, { Schema } from 'mongoose'
import { pick } from 'ramda'
import uuid from 'uuid/v4'
import faker from 'faker'

const Mixed = Schema.Types.Mixed

const User = new Schema({
  uid: { type: String, default: uuid, index: true },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, text: true, unique: true },
  email: String,
  auth: {},
  avatar: String,
  bio: String,
  teams: [],
  games: [{
    // https://github.com/igdb/igdb-api-node
    name: String,
    genre: String,
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
  hardware: [{
    main: String,
    other: [String]
  }],
  genres: [String]
}, {
  strict: false,
  collection: 'users'
})

User.index({
  name: 'text',
  bio: 'text',
  'games.name': 'text',
  'games.genre': 'text',
  genres: 'text'
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
  'createdAt',
  'avatar',
  'birthDate',
  'address',
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

export const randomUser = () => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.internet.avatar(),
  bio: faker.hacker.phrase(),
  teams: ['Gambit', 'SKT', 'Fnatic'],
  // teams: [`${faker.hacker.adjective()} ${faker.hacker.noun()}`],
  games: [{
    // https://github.com/igdb/igdb-api-node
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    genre: faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    img: faker.image.imageUrl(),
    role: faker.random.arrayElement([
      'Main',
      'Mid',
      'Sniper',
      'TEEMO LAPIN',
      'Jean Kalashnikov',
      'Team Leader',
      'SOLO U SUXX ALLz'
    ]),
    // profileLink: '',
    // stats: Mixed
  }, {
    // https://github.com/igdb/igdb-api-node
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    genre: faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    img: faker.image.imageUrl(),
    role: faker.random.arrayElement([
      'Main',
      'Mid',
      'Sniper',
      'TEEMO LAPIN',
      'Jean Kalashnikov',
      'Team Leader',
      'SOLO U SUXX ALLz'
    ]),
    // profileLink: '',
    // stats: Mixed
  }, {
    // https://github.com/igdb/igdb-api-node
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    genre: faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    img: faker.image.imageUrl(),
    role: faker.random.arrayElement([
      'Main',
      'Mid',
      'Sniper',
      'TEEMO LAPIN',
      'Jean Kalashnikov',
      'Team Leader',
      'SOLO U SUXX ALLz'
    ]),
    // profileLink: '',
    // stats: Mixed
  }, {
    // https://github.com/igdb/igdb-api-node
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    genre: faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    img: faker.image.imageUrl(),
    role: faker.random.arrayElement([
      'Main',
      'Mid',
      'Sniper',
      'TEEMO LAPIN',
      'Jean Kalashnikov',
      'Team Leader',
      'SOLO U SUXX ALLz'
    ]),
    // profileLink: '',
    // stats: Mixed
  }, {
    // https://github.com/igdb/igdb-api-node
    name: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    genre: faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    img: faker.image.imageUrl(),
    role: faker.random.arrayElement([
      'Main',
      'Mid',
      'Sniper',
      'TEEMO LAPIN',
      'Jean Kalashnikov',
      'Team Leader',
      'SOLO U SUXX ALLz'
    ]),
    // profileLink: '',
    // stats: Mixed
  }],
  birthDate: faker.date.past(),
  address: {
    city: faker.address.city(),
    street: faker.address.streetAddress(),
    country: faker.address.country()
  },
  hardware: {
    main: faker.random.arrayElement([
      'PC Master Race',
      'PC',
      'XBOX 360',
      'XBOX One',
      'PS3',
      'PS4',
      'Wii',
      'Switch',
      'Archlinux Rulzz noobs'
    ]),
    other: [
      faker.random.arrayElement([
        'PC Master Race',
        'PC',
        'XBOX 360',
        'XBOX One',
        'PS3',
        'PS4',
        'Wii',
        'Switch',
        'Archlinux Rulzz noobs'
      ]),
      faker.random.arrayElement([
        'PC Master Race',
        'PC',
        'XBOX 360',
        'XBOX One',
        'PS3',
        'PS4',
        'Wii',
        'Switch',
        'Archlinux Rulzz noobs'
      ])
    ]
  },
  genres: [
    faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ]),
    faker.random.arrayElement([
      'FPS',
      'RTS',
      'TPS',
      'Action',
      'RPG',
      'Adventure',
      'MOBA'
    ])]
})
