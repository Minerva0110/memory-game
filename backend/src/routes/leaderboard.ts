import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/leaderboard', async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      where: {
        time: { not: null },
        moves: { not: null },
      },
      orderBy: [{ time: 'asc' }, { moves: 'asc' }],
      take: 10,
    })
    res.json(scores)
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
    res.status(500).json({ error: 'Failed to load leaderboard' })
  }
})

export default router
