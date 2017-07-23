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

  app.get('/users/me', async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      res.json({ user });
    } catch (error) {
      next(error)
    }
  })

  app.use('/users', service(options))

  app.service('users').hooks(hooks)
}
