import { Router } from 'express'
import type { NextFunction, $Response, $Request } from 'express'
import User, { randomUser } from './user'

export { User }

const router = Router()

router.get('/me', async (req: $Request, res: $Response, next: NextFunction) => {
  try {
    const { uid } = res.locals;
    const user = await User.findByUid(uid)
    if (!user)
      return res.boom.notFound('User not found')

    res.json({ user: user.publicObject() });
  } catch (error) {
    console.log({ error })
    next(error)
  }
})

router.patch('/me', async (req: $Request, res: $Response, next: NextFunction) => {
  try {
    const { uid } = res.locals;
    const user = await User.findByUid(uid)

    if (!user)
      return res.boom.notFound('User not found')

    Object.assign(user, req.body)

    await user.save();

    console.log({ user: user.publicObject() });
    res.json({ user: user.publicObject() });
  } catch (error) {
    console.log({ error })
    next(error)
  }
})

router.get('/all', async (req, res) => {
  res.status(203).end()
  const users = await User.find()
  console.log(require('util').inspect({ users }, true, 10, true))
})

router.delete('/all', async (req, res) => {
  const users = await User.find()
  users.forEach(async u => {
    await u.remove()
  })
  res.status(203).end()
})

router.get('/create', async (req, res, next) => {
  try {
    const count = +req.query.count
    const a = Array(count).fill(0)
    a.forEach(async () => { await User(randomUser()).save() })
    res.end()
  } catch (error) {
    next(error)
  }
})

export default router;
