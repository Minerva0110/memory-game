'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import '../game.scss'

type Tile = {
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
}

type Mode = 'keppni' | 'aefing' | 'fraels'

type Score = {
  id: string
  name: string
  time: number
  moves: number
}

export default function GamePage() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [hasWon, setHasWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [mode, setMode] = useState<Mode>('fraels')
  const [playerName, setPlayerName] = useState('')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState<Score[]>([])

  const isCompetitive = mode === 'keppni'

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) setPlayerName(name)
    fetchTiles()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if ((mode === 'keppni' || mode === 'aefing') && timerActive) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, mode])
  
  function fetchTiles() {
    fetch('http://localhost:8000/api/game-config?tiles=24')
      .then(res => res.json())
      .then(data => {
        const loadedTiles: Tile[] = data.tiles.map((img: string, index: number) => ({
          id: index,
          image: img,
          isFlipped: false,
          isMatched: false,
        }))
        setTiles(loadedTiles)
        setHasWon(false)
        setMoves(0)
        setSeconds(0)
        setTimerActive(false)
        setFlipped([])
      })
  }

  function handleClick(index: number) {
    if (tiles[index].isFlipped || tiles[index].isMatched || flipped.length === 2) return

    if (!timerActive && (mode === 'keppni' || mode === 'aefing')) {
        setTimerActive(true)
      }
      
    const newTiles = [...tiles]
    newTiles[index].isFlipped = true

    const newFlipped = [...flipped, index]
    setTiles(newTiles)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      if (isCompetitive) setMoves(prev => prev + 1)

      const [first, second] = newFlipped
      if (newTiles[first].image === newTiles[second].image) {
        newTiles[first].isMatched = true
        newTiles[second].isMatched = true

        const allMatched = newTiles.every(tile => tile.isMatched)
        setTiles(newTiles)
        setFlipped([])

        if (allMatched) {
          setHasWon(true)
          setTimerActive(false)

          if (isCompetitive && playerName) {
            fetch('http://localhost:8000/api/score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: playerName, time: seconds, moves }),
            }).catch(err => console.error('Failed to submit score:', err))
          }
        }
      } else {
        setTimeout(() => {
          newTiles[first].isFlipped = false
          newTiles[second].isFlipped = false
          setTiles([...newTiles])
          setFlipped([])
        }, 1000)
      }
    }
  }

  function openLeaderboard() {
    fetch('http://localhost:8000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboardData(data)
        setShowLeaderboard(true)
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err)
      })
  }
  

  return (
    <main>
      <nav className="mode-select">
        <button onClick={() => setMode('keppni')} className={mode === 'keppni' ? 'active' : ''}>
          🏆 Keppni
        </button>
        <button onClick={() => setMode('aefing')} className={mode === 'aefing' ? 'active' : ''}>
          🧪 Æfing
        </button>
        <button onClick={() => setMode('fraels')} className={mode === 'fraels' ? 'active' : ''}>
          🌙 Spila án pressu
        </button>
        <button className="leaderboard-button" onClick={openLeaderboard}>
          📈 Stigatafla
        </button>
      </nav>

      {mode === 'keppni' && (
        <p className="mode-info">Þessi mód verður skráð í stigatöflu – tími til að einbeita sér!</p>
      )}

      <div className="game-container">
      <div className="hud">
         {(mode === 'keppni' || mode === 'aefing') && (
             <p>Tími: {seconds} sek</p>
              )}
        {mode === 'keppni' && (
            <p>Tilraunir: {moves}</p>
             )}
             </div>


        <div className="board">
          {tiles.map((tile, i) => (
            <div
              key={tile.id}
              className={`tile ${tile.isFlipped || tile.isMatched ? 'flipped' : ''} ${tile.isMatched ? 'matched' : ''}`}
              onClick={() => handleClick(i)}
            >
              <div className="inner">
                <div className="front">
                  <Image
                    src={tile.image}
                    alt={`Tile ${i}`}
                    width={80}
                    height={80}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <div className="back" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasWon && (
        <div className="win-message">
          <h2>Vel gert!</h2>
          <p>Viltu reyna aftur?</p>
          <button onClick={fetchTiles}>Spila aftur</button>
        </div>
      )}

{showLeaderboard && (
  <div className="leaderboard-popup">
    <div className="leaderboard-content">
      <h2>Stigatafla</h2>
      {leaderboardData.length > 0 ? (
  <ul>
    {leaderboardData.map((score, index) => (
      <li key={score.id}>
        #{index + 1} – <strong>{score.name}</strong>: {score.moves} tilraunir – {score.time} sek
      </li>
    ))}
  </ul>
) : (
  <p>Engin stig skráð enn — vertu(ðu) fyrst(ur) á listanum! 🎯</p>
)}

      <button onClick={() => setShowLeaderboard(false)}>Loka</button>
    </div>
  </div>
)}

    </main>
  )
}
