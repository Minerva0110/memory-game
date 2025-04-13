import express from 'express'
import cors from 'cors'
import gameRouter from './routes/game'
import { PrismaClient } from '@prisma/client'
import leaderboardRoutes from './routes/leaderboard'


const app = express()
const PORT = 8000
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use('/api', gameRouter)
app.use('/api', leaderboardRoutes)

app.post('/api/score', async (req, res) => {
    const { name, time, moves } = req.body
    try {
      const score = await prisma.score.create({
        data: { name, time, moves },
      })
      res.json(score)
    } catch (error) {
      res.status(500).json({ error: 'Failed to save score' })
    }
  })
  
  app.get('/api/leaderboard', async (req, res) => {
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
        res.status(500).json({ error: 'Failed to load leaderboard' })
      }
    })

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
