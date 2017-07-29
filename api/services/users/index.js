import { Router } from 'express'
import User from './user'
import type { NextFunction, $Response, $Request } from 'express'

const router = Router()

router.get('/me', async (req: $Request, res: $Response, next: NextFunction) => {
  try {
    const { uid } = res.locals;
    console.log({ uid });
    const user = await User.findOne({ uid })
    if (!user)
      return res.boom.notFound('User not found')

    console.log({ user: user.publicObject() });
    res.json({ user: user.publicObject() });
  } catch (error) {
    console.log({ error })
    next(error)
  }
})


export default router;
