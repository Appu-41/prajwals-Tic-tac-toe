import { useState, useCallback } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

type Player = "X" | "O" | null;
type Board = Player[];

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

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winningCells, setWinningCells] = useState<number[]>([]);

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

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

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
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinningCells([]);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-game-pink-light via-background to-game-sky-light">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-game-pink animate-bounce-subtle" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-game-pink to-game-sky bg-clip-text text-transparent">
            Prajwal's Tic Tac Toe
          </h1>
          <Sparkles className="w-8 h-8 text-game-sky animate-bounce-subtle" style={{ animationDelay: "0.5s" }} />
        </div>
        <p className="text-muted-foreground text-lg">Play to have fun! 🎮</p>
      </div>

      {/* Score Board */}
      <div className="flex gap-8 mb-6">
        <div className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
          currentPlayer === "X" && !winner ? "bg-game-pink-light scale-105" : "bg-card"
        }`}>
          <span className="text-3xl font-bold text-game-pink">X</span>
          <span className="text-2xl font-semibold text-foreground">{scores.X}</span>
        </div>
        <div className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
          currentPlayer === "O" && !winner ? "bg-game-sky-light scale-105" : "bg-card"
        }`}>
          <span className="text-3xl font-bold text-game-sky">O</span>
          <span className="text-2xl font-semibold text-foreground">{scores.O}</span>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 h-12 flex items-center">
        {winner ? (
          <div className="text-2xl font-bold animate-wiggle">
            <span className={winner === "X" ? "text-game-pink" : "text-game-sky"}>
              {winner}
            </span>
            <span className="text-foreground"> wins! 🎉</span>
          </div>
        ) : isDraw ? (
          <div className="text-2xl font-bold text-muted-foreground animate-wiggle">
            It's a draw! 🤝
          </div>
        ) : (
          <div className="text-xl text-muted-foreground">
            <span className={currentPlayer === "X" ? "text-game-pink" : "text-game-sky"}>
              {currentPlayer}
            </span>
            's turn
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-card p-4 rounded-3xl game-shadow">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner}
              className={`
                w-20 h-20 md:w-24 md:h-24 rounded-2xl text-4xl md:text-5xl font-bold
                transition-all duration-200 cell-shadow
                ${!cell && !winner ? "hover:scale-105 hover:bg-muted cursor-pointer" : "cursor-default"}
                ${winningCells.includes(index) ? "animate-wiggle" : ""}
                ${cell === "X" ? "bg-game-pink-light text-game-pink" : ""}
                ${cell === "O" ? "bg-game-sky-light text-game-sky" : ""}
                ${!cell ? "bg-muted" : ""}
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
          className="flex items-center gap-2 px-6 py-3 bg-game-pink text-primary-foreground rounded-full font-semibold
                     hover:opacity-90 transition-all duration-200 hover:scale-105 game-shadow"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-6 py-3 bg-game-sky text-secondary-foreground rounded-full font-semibold
                     hover:opacity-90 transition-all duration-200 hover:scale-105"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
