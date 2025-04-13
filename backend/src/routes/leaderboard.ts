import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/score', async (req, res) => {
  const { name, time, moves } = req.body
  const score = await prisma.score.create({
    data: { name, time, moves },
  })
  res.json(score)
})

router.get('/leaderboard', async (req, res) => {
  const scores = await prisma.score.findMany({
    where: {
      time: { not: null },
      moves: { not: null },
    },
    orderBy: [{ time: 'asc' }, { moves: 'asc' }],
    take: 10,
  })
  res.json(scores)
})

export default router
