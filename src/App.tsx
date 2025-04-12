import { useState } from 'react'
import './App.css'
import SentenceConstruction from './components/SentenceConstruction'
import IntroScreen from './components/IntroScreen'
import FeedbackScreen from './components/FeedbackScreen'

// Game states
type GameState = 'intro' | 'playing' | 'feedback'

function App() {
  const [gameState, setGameState] = useState<GameState>('intro')
  const [results, setResults] = useState<any[]>([])

  const startGame = () => {
    setGameState('playing')
  }

  const endGame = (gameResults: any[]) => {
    setResults(gameResults)
    setGameState('feedback')
  }

  const backToIntro = () => {
    setGameState('intro')
    setResults([])
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 flex justify-center items-center px-4 py-8 sm:px-6 md:px-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 flex flex-col">
        {gameState === 'intro' && <IntroScreen onStart={startGame} />}
        {gameState === 'playing' && <SentenceConstruction onComplete={endGame} />}
        {gameState === 'feedback' && <FeedbackScreen results={results} onRestart={backToIntro} />}
      </div>
    </div>
  )
}

export default App