import { Router } from 'express'
import type { NextFunction, $Response, $Request } from 'express'
import { User } from '../users'

const router = Router()

router.get('/', async (req: $Request, res: $Response, next: NextFunction) => {
  try {
    const skip = req.query.skip || 0
    const regex = new RegExp(req.query.q, 'gi')
    const result = await User.find({
      $or: [
        { name: regex },
        { bio: regex },
        { 'games.name': regex },
        { 'games.genre': regex },
        { genres: regex }
      ]
    })
    .skip(skip)
    .limit(10)

    console.log({ result })
    res.json({ result });
  } catch (error) {
    console.log({ error })
    next(error)
  }
})

export default router;
