import { Router } from 'express'
import type { NextFunction, $Response, $Request } from 'express'
import User from './user'

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
  users.forEach(u => {
    console.log(require('util').inspect({ [u.name]: u }, true, 10, true))
  })
})

router.delete('/all', async (req, res) => {
  res.status(203).end()
  const users = await User.find()
  users.forEach(async u => {
    await u.remove()
  })
})

export default router;
