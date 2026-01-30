import { useCallback } from "react";

type Player = "X" | "O" | null;
type Board = Player[];
type Difficulty = "easy" | "medium" | "hard";

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

// Minimax algorithm for unbeatable AI
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: "X" | "O"
): number => {
  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  // Check terminal states
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === aiPlayer ? 10 - depth : depth - 10;
    }
  }

  if (board.every((cell) => cell !== null)) return 0; // Draw

  const availableMoves = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      const score = minimax(newBoard, depth + 1, false, aiPlayer);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = humanPlayer;
      const score = minimax(newBoard, depth + 1, true, aiPlayer);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
};

const getRandomMove = (board: Board): number => {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getBestMove = (board: Board, aiPlayer: "X" | "O"): number => {
  let bestScore = -Infinity;
  let bestMove = -1;

  const availableMoves = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const score = minimax(newBoard, 0, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

const getBlockingMove = (board: Board, aiPlayer: "X" | "O"): number | null => {
  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  // Check if human can win and block
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [board[a], board[b], board[c]];
    const humanCount = line.filter((cell) => cell === humanPlayer).length;
    const emptyCount = line.filter((cell) => cell === null).length;

    if (humanCount === 2 && emptyCount === 1) {
      const emptyIndex = [a, b, c].find((i) => board[i] === null);
      if (emptyIndex !== undefined) return emptyIndex;
    }
  }

  return null;
};

const getWinningMove = (board: Board, aiPlayer: "X" | "O"): number | null => {
  // Check if AI can win
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [board[a], board[b], board[c]];
    const aiCount = line.filter((cell) => cell === aiPlayer).length;
    const emptyCount = line.filter((cell) => cell === null).length;

    if (aiCount === 2 && emptyCount === 1) {
      const emptyIndex = [a, b, c].find((i) => board[i] === null);
      if (emptyIndex !== undefined) return emptyIndex;
    }
  }

  return null;
};

export const useAIOpponent = () => {
  const getAIMove = useCallback(
    (board: Board, difficulty: Difficulty, aiPlayer: "X" | "O"): number => {
      const availableMoves = board
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (availableMoves.length === 0) return -1;

      switch (difficulty) {
        case "easy":
          // 70% random, 30% smart (just blocking)
          if (Math.random() < 0.7) {
            return getRandomMove(board);
          }
          return getBlockingMove(board, aiPlayer) ?? getRandomMove(board);

        case "medium":
          // Always try to win or block, otherwise 50% optimal
          const winMove = getWinningMove(board, aiPlayer);
          if (winMove !== null) return winMove;

          const blockMove = getBlockingMove(board, aiPlayer);
          if (blockMove !== null) return blockMove;

          if (Math.random() < 0.5) {
            return getBestMove(board, aiPlayer);
          }
          return getRandomMove(board);

        case "hard":
          // Always play optimally (unbeatable)
          return getBestMove(board, aiPlayer);

        default:
          return getRandomMove(board);
      }
    },
    []
  );

  return { getAIMove };
};

export type { Difficulty };
