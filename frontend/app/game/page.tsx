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

export default function GamePage() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [hasWon, setHasWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Mode toggles
  const [showTimer, setShowTimer] = useState(false)
  const [showMoves, setShowMoves] = useState(false)
  const [freeMode, setFreeMode] = useState(true)

  useEffect(() => {
    fetchTiles()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (showTimer && timerActive) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive, showTimer])

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

    if (!timerActive && showTimer) {
      setTimerActive(true)
    }

    const newTiles = [...tiles]
    newTiles[index].isFlipped = true

    const newFlipped = [...flipped, index]
    setTiles(newTiles)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      if (showMoves) setMoves(prev => prev + 1)

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

  return (
    <main>
      <nav className="mode-select">
        <button
          onClick={() => {
            setShowTimer(prev => !prev)
            setFreeMode(false)
          }}
          className={showTimer ? 'active' : ''}
        >
          Tími
        </button>

        <button
          onClick={() => {
            setShowMoves(prev => !prev)
            setFreeMode(false)
          }}
          className={showMoves ? 'active' : ''}
        >
          Tilraunir
        </button>

        <button
          onClick={() => {
            setShowTimer(false)
            setShowMoves(false)
            setFreeMode(true)
          }}
          className={freeMode ? 'active' : ''}
        >
          Spila án pressu
        </button>
      </nav>

      <div className="game-container">
        <div className="hud">
          {showMoves && <p>Tilraunir: {moves}</p>}
          {showTimer && <p>Tími: {seconds} sek</p>}
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
    </main>
  )
}
