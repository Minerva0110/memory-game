import express from 'express'
import cors from 'cors'
import gameRouter from './routes/game'
import leaderboardRoutes from './routes/leaderboard'
import scoreRoutes from './routes/score'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', gameRouter)
app.use('/api', leaderboardRoutes)
app.use('/api', scoreRoutes)

app.get('/', (_req, res) => {
  res.send(`
    <h1 style="font-family: sans-serif; color: #ccc; text-align: center; margin-top: 20vh;">
      Backend virkar!
    </h1>
  `)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
