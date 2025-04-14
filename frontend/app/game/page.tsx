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

  const [namePromptOpen, setNamePromptOpen] = useState(false)
  const [tempName, setTempName] = useState('')

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
    fetch('https://memory-backend-9t90.onrender.com/api/game-config?tiles=24')
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

  function sendScore(name: string) {
    fetch('https://memory-backend-9t90.onrender.com/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, time: seconds, moves }),
    })    
      .then(res => res.json())
      .then(data => console.log('Score saved:', data))
      .catch(err => console.error('Failed to save score:', err))
  }

  function handleClick(index: number) {
    if (tiles[index].isFlipped || tiles[index].isMatched || flipped.length === 2) return
    if (!timerActive && (mode === 'keppni' || mode === 'aefing')) setTimerActive(true)

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
          setTimerActive(false)
          if (isCompetitive && !playerName) {
            setNamePromptOpen(true)
          } else if (isCompetitive && playerName) {
            sendScore(playerName)
            setHasWon(true)
          } else {
            setHasWon(true)
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
    console.log('Trying to open leaderboard...')
    fetch('https://memory-backend-9t90.onrender.com/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard data:', data)
        setLeaderboardData(data)
        setShowLeaderboard(true)
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err)
      })
  }
  
  return (
    <>
    <div className="star-background">
      {[...Array(250)].map((_, i) => (
        <div className="star" key={i}></div>
      ))}
    </div>
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

      {mode === 'keppni' && !timerActive && (
        <p className="mode-info">Viltu keppa? Þetta verður skráð í stigatöflu svo núna er tími til að einbeita sér!</p>
      )}

      <div className="game-container">
        <div className="hud">
          {(mode === 'keppni' || mode === 'aefing') && <p>Tími: {seconds} sek</p>}
          {mode === 'keppni' && <p>Tilraunir: {moves}</p>}
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
                  <Image src={tile.image} alt={`Tile ${i}`} width={80} height={80} style={{ objectFit: 'contain' }} priority />
                </div>
                <div className="back" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {namePromptOpen && (
        <div className="win-message">
          <h2>Vel gert!</h2>
          <p>Viltu skrá nafnið þitt á stigatöfluna?</p>
          <input
            type="text"
            placeholder="Nafn..."
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', margin: '1rem 0', borderRadius: '6px' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                if (tempName.trim()) {
                  localStorage.setItem('playerName', tempName)
                  setPlayerName(tempName)
                  sendScore(tempName)
                  setNamePromptOpen(false)
                  setHasWon(true)
                }
              }}
            >
              Skrá mig
            </button>
            <button
              onClick={() => {
                setNamePromptOpen(false)
                setHasWon(true)
              }}
            >
              Hætta við
            </button>
          </div>
        </div>
      )}

      {hasWon && !namePromptOpen && (
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
          <p>Engin stig skráð — vertu fyrstur á listanum!</p>
        )}
        <button onClick={() => setShowLeaderboard(false)}>Loka</button>
      </div>
    </div>
  )}
</main>
<div className="watermark">Vefforritun 2</div>

    </>
  )
}
