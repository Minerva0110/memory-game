import { Router, Request, Response } from 'express'
import { generateTileSet } from '../utils/tileGenerator'

const router = Router()

router.get('/game-config', (req: Request, res: Response) => {
  const tileCount = parseInt(req.query.tiles as string) || 24

  try {
    const tiles = generateTileSet(tileCount)

    res.json({
      boardSize: tileCount,
      tiles
    })
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
  }
})

export default router
