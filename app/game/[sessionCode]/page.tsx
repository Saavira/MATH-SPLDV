"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Clock,
  Coins,
  Users,
  Sparkles,
  Wand2,
  ArrowUp,
  ArrowDown,
  Swords,
  Gift,
  RotateCcw,
  Trophy,
  Crown,
  Skull,
  LucideIcon,
} from "lucide-react" 
import { useParams, useRouter } from "next/navigation"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBMOGpYzm_krm66Xtkh9CXriP2jJlMVfTs",
  authDomain: "math-education-c09a8.firebaseapp.com",
  projectId: "math-education-c09a8",
  storageBucket: "math-education-c09a8.firebasestorage.app",
  messagingSenderId: "522545520014",
  appId: "1:522545520014:web:a1c8da693e67c6acfb58df",
  measurementId: "G-LSPV4M26WE",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Question bank with multiple choice
const questionBank = [
  {
    id: 1,
    question: "Diketahui sistem persamaan: x + y = 5 dan x - y = 1. Nilai x adalah...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correct: "B",
    type: "spldv",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Sistem persamaan 2x + y = 7 dan x + y = 4. Nilai y adalah...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correct: "A",
    type: "spldv",
    difficulty: "easy",
  },
  {
    id: 3,
    question: "Jika 3x + 2y = 12 dan x - y = 1, maka x + y = ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correct: "C",
    type: "spldv",
    difficulty: "medium",
  },
  {
    id: 4,
    question: "Hitung: 15 + 23 × 4 - 8 = ...",
    options: ["A. 99", "B. 107", "C. 115", "D. 123"],
    correct: "B",
    type: "math",
    difficulty: "easy",
  },
  {
    id: 5,
    question: "Hasil dari 144 ÷ 12 + 7 × 3 = ...",
    options: ["A. 33", "B. 35", "C. 37", "D. 39"],
    correct: "A",
    type: "math",
    difficulty: "easy",
  },
]

// Game board configuration - colorful squares with special events
const createGameBoard = () => {
  const board = []
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-orange-400",
  ]

  const specialSquares: { [key: number]: { type: string; icon: LucideIcon; color: string; name: string } } = {
    5: { type: "rollAgain", icon: RotateCcw, color: "bg-yellow-500", name: "Roll Lagi" },
    12: { type: "moveForward", icon: ArrowUp, color: "bg-green-500", name: "Maju Bonus" },
    18: { type: "duel", icon: Swords, color: "bg-red-500", name: "Duel Arena" },
    25: { type: "bonusTime", icon: Gift, color: "bg-purple-500", name: "Bonus Waktu" },
    32: { type: "moveBackward", icon: ArrowDown, color: "bg-orange-500", name: "Mundur" },
    38: { type: "rollAgain", icon: RotateCcw, color: "bg-yellow-500", name: "Roll Lagi" },
    45: { type: "duel", icon: Swords, color: "bg-red-500", name: "Duel Arena" },
    52: { type: "bonusTime", icon: Gift, color: "bg-purple-500", name: "Bonus Waktu" },
    58: { type: "moveForward", icon: ArrowUp, color: "bg-green-500", name: "Maju Bonus" },
    65: { type: "moveBackward", icon: ArrowDown, color: "bg-orange-500", name: "Mundur" },
    72: { type: "rollAgain", icon: RotateCcw, color: "bg-yellow-500", name: "Roll Lagi" },
    78: { type: "duel", icon: Swords, color: "bg-red-500", name: "Duel Arena" },
    85: { type: "bonusTime", icon: Gift, color: "bg-purple-500", name: "Bonus Waktu" },
    92: { type: "moveForward", icon: ArrowUp, color: "bg-green-500", name: "Maju Bonus" },
  }

  for (let i = 0; i < 100; i++) {
    board.push({
      id: i,
      isSpecial: specialSquares[i] ? true : false,
      specialType: specialSquares[i]?.type || null,
      icon: specialSquares[i]?.icon || null,
      color: specialSquares[i]?.color || colors[i % colors.length],
      name: specialSquares[i]?.name || `Kotak ${i}`,
    })
  }
  return board
}

interface Player {
  id: string
  name: string
  class: string
  position: number
  money: number
  bonusTime: number
  isEliminated: boolean
  isCurrentTurn: boolean
}

interface GameState {
  currentPlayerIndex: number
  gameTimer: number
  gameStatus: "active" | "finished"
  players: Player[]
  currentTurnPlayer: string
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const sessionCode = params.sessionCode as string

  const [gameBoard] = useState(createGameBoard())
  const [gameState, setGameState] = useState<GameState>({
    currentPlayerIndex: 0,
    gameTimer: 1800, // 30 minutes in seconds
    gameStatus: "active",
    players: [],
    currentTurnPlayer: "",
  })

  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [questionTimer, setQuestionTimer] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showDuel, setShowDuel] = useState(false)
  const [duelOpponent, setDuelOpponent] = useState<any>(null)
  const [canRollAgain, setCanRollAgain] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize current student
  useEffect(() => {
    const studentData = localStorage.getItem("studentData")
    if (!studentData) {
      router.push("/login/student")
      return
    }
    setCurrentStudent(JSON.parse(studentData))
  }, [])

  // Fetch game state periodically
  useEffect(() => {
    if (!sessionCode) return

    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/game/${sessionCode}/state`)
        if (!response.ok) {
          // Don't throw an error, just log it, so the game doesn't crash on a temporary network issue
          console.error("Gagal mengambil status permainan")
          return
        }
        const data = await response.json()

        const players = data.players.filter((p: any) => p.role === 'student');
        const currentTurnPlayer = players.find((p: Player) => p.isCurrentTurn);

        setGameState((prev) => ({
          ...prev,
          players: players,
          currentTurnPlayer: currentTurnPlayer ? currentTurnPlayer.name : (players.length > 0 ? players[0].name : ""),
        }))
      } catch (error) {
        console.error("Error fetching game state:", error)
      }
    }

    fetchGameState() // Initial fetch
    const intervalId = setInterval(fetchGameState, 3000) // Poll every 3 seconds

    return () => clearInterval(intervalId)
  }, [sessionCode])

  // Game timer
  useEffect(() => {
    if (gameState.gameStatus === "active") {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.gameTimer <= 1) {
            endGame()
            return { ...prev, gameTimer: 0, gameStatus: "finished" }
          }
          return { ...prev, gameTimer: prev.gameTimer - 1 }
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState.gameStatus])

  // Question timer
  useEffect(() => {
    if (showQuestion && questionTimer > 0) {
      questionTimerRef.current = setTimeout(() => {
        setQuestionTimer((prev) => prev - 1)
      }, 1000)
    } else if (showQuestion && questionTimer === 0) {
      handleAnswerSubmit("") // Auto wrong answer
    }

    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current)
    }
  }, [showQuestion, questionTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    return icons[value - 1]
  }

  const canRollDice = () => {
    if (!currentStudent || !gameState.currentTurnPlayer) return false

    // Check if it's this student's turn
    const isMyTurn = currentStudent.name === gameState.currentTurnPlayer

    // Check if student is not eliminated
    const currentPlayer = gameState.players.find((p) => p.name === currentStudent.name)
    const isNotEliminated = currentPlayer && !currentPlayer.isEliminated

    return isMyTurn && isNotEliminated && !isRolling && !showQuestion
  }

  const handleRollDice = async () => {
    if (!canRollDice() || !currentStudent) return;

    setIsRolling(true);

    // Animate dice roll
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(async () => {
      clearInterval(rollAnimation);
      try {
        const response = await fetch(`/api/game/${sessionCode}/roll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: currentStudent.id }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal melempar dadu');
        }

        setDiceValue(result.diceValue);
        // The polling mechanism will handle updating the game state.
        // We just need to show the dice result.

      } catch (error: any) {
        console.error("Error rolling dice:", error);
        // Optionally, show an error message to the user
      } finally {
        setIsRolling(false);
      }
    }, 1000);
  };
  const movePlayerBackward = (steps: number) => {
    const currentPlayer = gameState.players.find((p) => p.name === currentStudent.name)
    if (!currentPlayer) return

    const newPosition = Math.max(currentPlayer.position - steps, 0)

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.name === currentStudent.name ? { ...p, position: newPosition } : p)),
    }))
  }

  const startDuel = () => {
    const availableOpponents = gameState.players.filter((p) => p.name !== currentStudent.name && !p.isEliminated)

    if (availableOpponents.length > 0) {
      const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)]
      setDuelOpponent(randomOpponent)
      setShowDuel(true)
      showQuestionModal()
    } else {
      showQuestionModal()
    }
  }

  const giveBonusTime = () => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.name === currentStudent.name ? { ...p, bonusTime: p.bonusTime + 1 } : p)),
    }))
  }

  const showQuestionModal = () => {
    const randomQuestion = questionBank[Math.floor(Math.random() * questionBank.length)]
    setCurrentQuestion(randomQuestion)
    setQuestionTimer(30 + (gameState.players.find((p) => p.name === currentStudent.name)?.bonusTime || 0) * 30)
    setSelectedAnswer("")
    setShowQuestion(true)
  }

  const handleAnswerSubmit = (answer: string) => {
    if (!currentQuestion) return

    const isCorrect = answer === currentQuestion.correct
    const currentPlayer = gameState.players.find((p) => p.name === currentStudent.name)
    if (!currentPlayer) return

    let moneyChange = 0
    if (currentQuestion.type === "spldv") {
      moneyChange = isCorrect ? 10000 : -5000
    } else {
      moneyChange = isCorrect ? 20000 : -10000
    }

    const newMoney = Math.max(currentPlayer.money + moneyChange, 0)
    const isEliminated = newMoney === 0

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.name === currentStudent.name
          ? {
              ...p,
              money: newMoney,
              isEliminated: isEliminated,
              bonusTime: p.bonusTime > 0 ? p.bonusTime - 1 : 0,
            }
          : p,
      ),
    }))

    // Check for roll again bonus
    if (isCorrect && diceValue === 6) {
      setCanRollAgain(true)
    } else {
      nextTurn()
    }

    setShowQuestion(false)
    setShowDuel(false)
    setCurrentQuestion(null)
    setDuelOpponent(null)

    if (isEliminated) {
      // Save eliminated player data
      savePlayerResult(currentPlayer, "eliminated")
    }
  }

  const nextTurn = () => {
    if (canRollAgain) {
      setCanRollAgain(false)
      return
    }

    setGameState((prev) => {
      const activePlayers = prev.players.filter((p) => !p.isEliminated)
      if (activePlayers.length === 0) return prev

      const currentIndex = activePlayers.findIndex((p) => p.name === prev.currentTurnPlayer)
      const nextIndex = (currentIndex + 1) % activePlayers.length
      const nextPlayer = activePlayers[nextIndex]

      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        currentTurnPlayer: nextPlayer.name,
        players: prev.players.map((p) => ({
          ...p,
          isCurrentTurn: p.name === nextPlayer.name && !p.isEliminated,
        })),
      }
    })
  }

  const endGame = async () => {
    setGameState((prev) => ({ ...prev, gameStatus: "finished" }))

    // Save all player results
    const sortedPlayers = [...gameState.players]
      .filter((p) => !p.isEliminated)
      .sort((a, b) => {
        if (a.position === 99 && b.position !== 99) return -1
        if (b.position === 99 && a.position !== 99) return 1
        if (a.position === b.position) return b.money - a.money
        return b.position - a.position
      })

    for (let i = 0; i < sortedPlayers.length; i++) {
      await savePlayerResult(sortedPlayers[i], `rank_${i + 1}`)
    }

    // Redirect to feedback
    setTimeout(() => {
      router.push(`/feedback/${sessionCode}`)
    }, 3000)
  }

  const savePlayerResult = async (player: Player, status: string) => {
    try {
      await addDoc(collection(db, "gameResults"), {
        sessionCode,
        playerName: player.name,
        playerClass: player.class,
        finalPosition: player.position,
        finalMoney: player.money,
        status,
        completedAt: new Date(),
      })
    } catch (error) {
      console.error("Error saving result:", error)
    }
  }

  const currentPlayer = gameState.players.find((p) => p.name === currentStudent?.name)
  const DiceIcon = getDiceIcon(diceValue)

  if (!currentStudent) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-2">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 mb-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-mono text-lg">{formatTime(gameState.gameTimer)}</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">SPLDV Math Monopoly</h1>
            <p className="text-purple-200 text-sm">Sesi: {sessionCode}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-300" />
            <span className="text-white">{gameState.players.filter((p) => !p.isEliminated).length}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <Card className="border-purple-400/30 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-10 gap-1 bg-gray-800/50 p-2 rounded-lg">
                  {gameBoard.map((square, index) => {
                    const playersOnSquare = gameState.players.filter((p) => p.position === index && !p.isEliminated)
                    const SquareIcon = square.icon

                    return (
                      <div
                        key={index}
                        className={`
                          w-8 h-8 relative flex items-center justify-center text-xs font-bold rounded
                          ${square.color}
                          ${index === 0 ? "ring-2 ring-green-400" : ""}
                          ${index === 99 ? "ring-2 ring-yellow-400" : ""}
                          border border-white/20 hover:scale-105 transition-transform
                        `}
                        title={square.name}
                      >
                        {index === 0 && <span className="text-white">START</span>}
                        {index === 99 && <span className="text-white">FINISH</span>}
                        {square.isSpecial && SquareIcon && <SquareIcon className="w-4 h-4 text-white" />}
                        {!square.isSpecial && index !== 0 && index !== 99 && (
                          <span className="text-white text-xs">{index}</span>
                        )}

                        {/* Player indicators */}
                        {playersOnSquare.length > 0 && (
                          <div className="absolute -top-1 -right-1 flex flex-wrap">
                            {playersOnSquare.slice(0, 4).map((player, pIndex) => (
                              <div
                                key={player.id}
                                className={`w-2 h-2 rounded-full border border-white ${
                                  player.name === currentStudent.name ? "bg-yellow-400" : "bg-blue-400"
                                }`}
                                title={player.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls & Player Info */}
        <div className="space-y-4">
          {/* Dice Roll Card */}
          <Card className="border-purple-400/30 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl text-purple-200">
                {canRollDice()
                  ? "Giliran Anda!"
                  : currentPlayer?.isEliminated
                  ? "Anda Tereliminasi"
                  : `Giliran: ${gameState.currentTurnPlayer}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="flex justify-center">
                <div className={`p-4 rounded-lg ${isRolling ? "animate-bounce" : ""}`}>
                  {(() => {
                    const DiceIcon = getDiceIcon(diceValue)
                    return <DiceIcon className="w-12 h-12 text-white" />
                  })()}
                </div>
              </div>

              <Button
                onClick={handleRollDice}
                disabled={!canRollDice()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
              >
                {isRolling ? "Mengocok..." : "Lempar Dadu"}
              </Button>

              {canRollAgain && (
                <Badge className="bg-yellow-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Bonus Roll!
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Player Stats */}
          <Card className="border-purple-400/30 bg-black/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-200">Pemain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {gameState.players.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-2 rounded border text-xs ${
                    player.isEliminated
                      ? "bg-red-900/30 border-red-400/30"
                      : player.name === gameState.currentTurnPlayer
                      ? "bg-yellow-900/30 border-yellow-400/30"
                      : "bg-purple-900/30 border-purple-400/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-medium ${
                        player.isEliminated
                          ? "text-red-200"
                          : player.name === gameState.currentTurnPlayer
                          ? "text-yellow-200"
                          : "text-white"
                      }`}
                    >
                      {player.name}
                      {player.name === gameState.currentTurnPlayer && <Crown className="w-3 h-3 inline ml-1" />}
                      {player.isEliminated && <Skull className="w-3 h-3 inline ml-1" />}
                    </span>
                    <Badge className={`text-xs ${player.position === 99 ? "bg-yellow-600" : "bg-blue-600"}`}>
                      Pos: {player.position}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-400" />
                      <span className={`text-xs ${player.isEliminated ? "text-red-300" : "text-yellow-200"}`}>
                        Rp{player.money.toLocaleString()}
                      </span>
                    </div>
                    {player.bonusTime > 0 && (
                      <Badge className="bg-purple-600 text-xs">
                        <Gift className="w-2 h-2 mr-1" />+{player.bonusTime}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestion && currentQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl border-purple-400/30 bg-black/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-purple-200">
                  {showDuel ? `🗡️ Duel vs ${duelOpponent?.name}` : "📚 Soal SPLDV"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-200 font-mono text-lg">{formatTime(questionTimer)}</span>
                </div>
              </div>
              <Progress
                value={(questionTimer / (30 + (currentPlayer?.bonusTime || 0) * 30)) * 100}
                className="w-full"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                <p className="text-white text-lg leading-relaxed">{currentQuestion.question}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option.charAt(0) ? "default" : "outline"}
                    className={`p-4 text-left justify-start h-auto ${
                      selectedAnswer === option.charAt(0)
                        ? "bg-purple-600 border-purple-400"
                        : "bg-purple-900/30 border-purple-400/50 hover:bg-purple-800/50"
                    }`}
                    onClick={() => setSelectedAnswer(option.charAt(0))}
                  >
                    <span className="text-white">{option}</span>
                  </Button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleAnswerSubmit(selectedAnswer)}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Jawab
                </Button>
                <Button
                  onClick={() => handleAnswerSubmit("")}
                  variant="outline"
                  className="border-red-400 text-red-200 hover:bg-red-900/30"
                >
                  Lewati
                </Button>
              </div>

              {showDuel && (
                <div className="bg-red-900/30 p-3 rounded-lg border border-red-400/30">
                  <p className="text-red-200 text-sm text-center">
                    <Swords className="w-4 h-4 inline mr-1" />
                    Mode Duel! Jawaban benar: +Rp15.000, Salah: -Rp7.500
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState.gameStatus === "finished" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg border-purple-400/30 bg-black/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-purple-200">Permainan Selesai!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-purple-100 mb-4">Terima kasih telah bermain SPLDV Math Monopoly!</p>
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Hasil Anda:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Posisi Akhir:</span>
                      <span className="text-white">{currentPlayer?.position}/99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Uang Akhir:</span>
                      <span className="text-yellow-200">Rp{currentPlayer?.money.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Status:</span>
                      <span className={currentPlayer?.isEliminated ? "text-red-200" : "text-green-200"}>
                        {currentPlayer?.isEliminated ? "Tereliminasi" : "Selesai"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-purple-300 text-sm">Mengarahkan ke halaman feedback dalam 3 detik...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
