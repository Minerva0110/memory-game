import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/score', async (req, res) => {
  const { name, time, moves } = req.body

  try {
    const score = await prisma.score.create({
      data: { name, time, moves },
    })
    res.json(score)
  } catch (error) {
    console.error('Failed to save score:', error)
    res.status(500).json({ error: 'Failed to save score' })
  }
})

export default router
