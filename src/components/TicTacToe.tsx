import { useState, useCallback, useEffect } from "react";
import { RotateCcw, Sparkles, Trophy, Users, Bot } from "lucide-react";
import confetti from "canvas-confetti";
import { useAIOpponent, type Difficulty } from "@/hooks/useAIOpponent";
import AIMessage, { type MessageType } from "./AIMessage";

type Player = "X" | "O" | null;
type Board = Player[];
type GameMode = "pvp" | "ai";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const triggerConfetti = (winner: "X" | "O") => {
  const colors = winner === "X" 
    ? ["#ec4899", "#f472b6", "#fce7f3"]
    : ["#38bdf8", "#7dd3fc", "#e0f2fe"];

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.7, x: 0.5 },
      colors,
    });
  }, 300);
};

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [showWinBanner, setShowWinBanner] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [aiMessage, setAiMessage] = useState<MessageType>("game_start");
  const [isAIThinking, setIsAIThinking] = useState(false);

  const { getAIMove } = useAIOpponent();

  const checkWinner = useCallback((squares: Board): { winner: Player; cells: number[] } => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], cells: [a, b, c] };
      }
    }
    return { winner: null, cells: [] };
  }, []);

  const { winner } = checkWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  // AI Move Effect
  useEffect(() => {
    if (gameMode === "ai" && currentPlayer === "O" && !winner && !isDraw) {
      setIsAIThinking(true);
      setAiMessage("thinking");

      const thinkingTime = difficulty === "easy" ? 500 : difficulty === "medium" ? 800 : 1200;

      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, difficulty, "O");
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = "O";
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result.winner) {
            setWinningCells(result.cells);
            setScores((prev) => ({
              ...prev,
              [result.winner!]: prev[result.winner!] + 1,
            }));
            setShowWinBanner(true);
            setAiMessage("lose"); // AI won = player lost
            triggerConfetti(result.winner);
          } else if (newBoard.every((cell) => cell !== null)) {
            setAiMessage("draw");
          } else {
            setCurrentPlayer("X");
            setAiMessage("your_turn");
          }
        }
        setIsAIThinking(false);
      }, thinkingTime);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameMode, difficulty, winner, isDraw, getAIMove, checkWinner]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isAIThinking) return;
    if (gameMode === "ai" && currentPlayer === "O") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinningCells(result.cells);
      setScores((prev) => ({
        ...prev,
        [result.winner!]: prev[result.winner!] + 1,
      }));
      setShowWinBanner(true);
      if (gameMode === "ai") {
        setAiMessage("win"); // Player won
      }
      triggerConfetti(result.winner);
    } else if (newBoard.every((cell) => cell !== null)) {
      if (gameMode === "ai") {
        setAiMessage("draw");
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinningCells([]);
    setShowWinBanner(false);
    setAiMessage("game_start");
    setIsAIThinking(false);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0 });
  };

  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetAll();
  };

  useEffect(() => {
    if (showWinBanner) {
      const timer = setTimeout(() => setShowWinBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWinBanner]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-game-pink-light via-background to-game-sky-light relative overflow-hidden">
      {/* Win Banner Overlay */}
      {showWinBanner && winner && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`
            animate-scale-in px-8 py-6 rounded-3xl shadow-2xl
            ${winner === "X" ? "bg-game-pink" : "bg-game-sky"}
          `}>
            <div className="flex items-center gap-3 text-white">
              <Trophy className="w-10 h-10 animate-bounce" />
              <span className="text-3xl md:text-4xl font-bold">
                {gameMode === "ai" ? (winner === "X" ? "You Win!" : "AI Wins!") : `${winner} Wins!`}
              </span>
              <Trophy className="w-10 h-10 animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-game-pink animate-bounce-subtle" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-game-pink to-game-sky bg-clip-text text-transparent">
            Prajwal's Tic Tac Toe
          </h1>
          <Sparkles className="w-8 h-8 text-game-sky animate-bounce-subtle" style={{ animationDelay: "0.5s" }} />
        </div>
        <p className="text-muted-foreground text-lg">Play to have fun! 🎮</p>
      </div>

      {/* Game Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchGameMode("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            gameMode === "ai"
              ? "bg-gradient-to-r from-game-pink to-game-sky text-white"
              : "bg-card text-foreground hover:bg-muted"
          }`}
        >
          <Bot className="w-4 h-4" />
          vs AI
        </button>
        <button
          onClick={() => switchGameMode("pvp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            gameMode === "pvp"
              ? "bg-gradient-to-r from-game-pink to-game-sky text-white"
              : "bg-card text-foreground hover:bg-muted"
          }`}
        >
          <Users className="w-4 h-4" />
          2 Players
        </button>
      </div>

      {/* Difficulty Selector (AI Mode only) */}
      {gameMode === "ai" && (
        <div className="flex gap-2 mb-6">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                resetGame();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                difficulty === d
                  ? d === "easy"
                    ? "bg-green-500 text-white"
                    : d === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* AI Message */}
      {gameMode === "ai" && (
        <div className="w-full max-w-sm mb-6">
          <AIMessage
            type={aiMessage}
            difficulty={difficulty}
            aiWins={scores.O}
            playerWins={scores.X}
          />
        </div>
      )}

      {/* Score Board */}
      <div className="flex gap-8 mb-6">
        <div className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
          currentPlayer === "X" && !winner ? "bg-game-pink-light scale-105" : "bg-card"
        } ${winner === "X" ? "animate-pulse ring-4 ring-game-pink" : ""}`}>
          <span className="text-3xl font-bold text-game-pink">
            {gameMode === "ai" ? "You" : "X"}
          </span>
          <span className="text-2xl font-semibold text-foreground">{scores.X}</span>
        </div>
        <div className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
          currentPlayer === "O" && !winner ? "bg-game-sky-light scale-105" : "bg-card"
        } ${winner === "O" ? "animate-pulse ring-4 ring-game-sky" : ""}`}>
          <span className="text-3xl font-bold text-game-sky">
            {gameMode === "ai" ? "AI" : "O"}
          </span>
          <span className="text-2xl font-semibold text-foreground">{scores.O}</span>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 h-12 flex items-center">
        {winner ? (
          <div className="text-2xl font-bold animate-bounce">
            <span className={winner === "X" ? "text-game-pink" : "text-game-sky"}>
              {gameMode === "ai" ? (winner === "X" ? "You" : "AI") : winner}
            </span>
            <span className="text-foreground"> wins! 🎉</span>
          </div>
        ) : isDraw ? (
          <div className="text-2xl font-bold text-muted-foreground animate-wiggle">
            It's a draw! 🤝
          </div>
        ) : (
          <div className="text-xl text-muted-foreground">
            {isAIThinking ? (
              <span className="text-game-sky animate-pulse">AI is thinking...</span>
            ) : (
              <>
                <span className={currentPlayer === "X" ? "text-game-pink" : "text-game-sky"}>
                  {gameMode === "ai" ? (currentPlayer === "X" ? "Your" : "AI's") : `${currentPlayer}'s`}
                </span>
                {" turn"}
              </>
            )}
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className={`bg-card p-4 rounded-3xl game-shadow transition-all duration-300 ${
        winner ? "ring-4 " + (winner === "X" ? "ring-game-pink" : "ring-game-sky") : ""
      }`}>
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isAIThinking}
              className={`
                w-20 h-20 md:w-24 md:h-24 rounded-2xl text-4xl md:text-5xl font-bold
                transition-all duration-200 cell-shadow
                ${!cell && !winner && !isAIThinking ? "hover:scale-105 hover:bg-muted cursor-pointer" : "cursor-default"}
                ${winningCells.includes(index) ? "animate-pulse scale-110" : ""}
                ${cell === "X" ? "bg-game-pink-light text-game-pink" : ""}
                ${cell === "O" ? "bg-game-sky-light text-game-sky" : ""}
                ${!cell ? "bg-muted" : ""}
                ${winningCells.includes(index) && cell === "X" ? "ring-4 ring-game-pink bg-game-pink text-white" : ""}
                ${winningCells.includes(index) && cell === "O" ? "ring-4 ring-game-sky bg-game-sky text-white" : ""}
              `}
            >
              {cell && <span className="animate-pop inline-block">{cell}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-game-pink text-white rounded-full font-semibold
                     hover:opacity-90 transition-all duration-200 hover:scale-105 game-shadow"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-6 py-3 bg-game-sky text-white rounded-full font-semibold
                     hover:opacity-90 transition-all duration-200 hover:scale-105"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
