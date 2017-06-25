import service from 'feathers-mongoose'
import User from './user'
import hooks from './hooks'

export default function userService() {
  const app = this

  const options = {
    Model: User,
    paginate: {
      default: 10,
      max: 25
    }
  }

  app.use('/users', service(options))

  app.service('users').hooks(hooks)
}
