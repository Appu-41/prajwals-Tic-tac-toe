import { useEffect, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import type { Difficulty } from "@/hooks/useAIOpponent";

type MessageType = "win" | "lose" | "draw" | "thinking" | "your_turn" | "game_start" | "idle";

interface AIMessageProps {
  type: MessageType;
  difficulty: Difficulty;
  aiWins: number;
  playerWins: number;
}

const messages = {
  win: {
    easy: [
      "Yay! You got me! 🎉 Wanna go again?",
      "Nice one! You're pretty good! Another round?",
      "Okay okay, you win this time! Let's play again!",
    ],
    medium: [
      "Well played! You beat me fair and square! 👏",
      "Impressive! You got skills! Rematch?",
      "Okay, I underestimated you! Let's go again!",
    ],
    hard: [
      "WHAT?! How did you... Okay, I respect that! 🤯",
      "Impossible! You're a Tic Tac Toe genius! Again?",
      "I bow to you, master! That was incredible! 👑",
    ],
  },
  lose: {
    easy: [
      "Hehe, got you! 😏 Don't worry, try again!",
      "Oops! I won! Better luck next time! 🍀",
      "Yay me! But you were close! Another go?",
    ],
    medium: [
      "Ha! Too slow! 😎 Wanna try again?",
      "I saw that coming from a mile away! 🔮",
      "Nice try, but I'm getting warmer! Rematch?",
    ],
    hard: [
      "🤖 CALCULATED. Did you really think you could beat me?",
      "Bow before your AI overlord! 👑 Just kidding... or am I?",
      "Too easy! I'm basically unbeatable on hard mode! 💪",
      "Muhahaha! The machine always wins! 🎮",
      "GG EZ! Want me to go easy on you? 😏",
    ],
  },
  draw: {
    easy: [
      "A tie! We're both pretty good! 🤝",
      "Ooh, so close! Neither of us won! Again?",
    ],
    medium: [
      "Stalemate! You're a worthy opponent! 🤝",
      "Draw! We're evenly matched! Another round?",
    ],
    hard: [
      "A draw against hard mode? Impressive defense! 🛡️",
      "You survived! Most can't even tie with me! 💪",
    ],
  },
  thinking: {
    easy: ["Hmm, let me think... 🤔", "Where should I go... 💭"],
    medium: ["Calculating... 🧮", "Analyzing the board... 🔍"],
    hard: ["Processing optimal strategy... 🤖", "Running minimax algorithm... 💻"],
  },
  your_turn: {
    easy: ["Your move! I believe in you! ✨", "Go ahead, make your move! 🎯"],
    medium: ["Your turn! Choose wisely! 🎯", "Make your move! I'm watching... 👀"],
    hard: ["Your turn. Make it count. 🎯", "Choose carefully... I see everything. 👁️"],
  },
  game_start: {
    easy: ["Let's have fun! You go first! 🎮", "Ready to play? You start! 🌟"],
    medium: ["Game on! Show me what you got! 💪", "Let's do this! Your move! 🔥"],
    hard: ["Prepare yourself. I won't go easy. 🤖", "Challenge accepted. Begin. ⚔️"],
  },
  idle: {
    easy: ["This is fun! 😊", "I love playing with you! 💕"],
    medium: ["Good game so far! 🎮", "You're keeping me on my toes! 👀"],
    hard: ["*analyzing patterns* 🤖", "*calculating probabilities* 📊"],
  },
};

const getStreakMessage = (aiWins: number, playerWins: number, difficulty: Difficulty): string | null => {
  if (aiWins >= 3) {
    return difficulty === "hard" 
      ? `${aiWins} wins in a row! I am inevitable! 🏆`
      : `${aiWins} wins! I'm on fire! 🔥`;
  }
  if (playerWins >= 3) {
    return difficulty === "hard"
      ? `${playerWins} wins?! Are you cheating?! 😱`
      : `${playerWins} wins! You're amazing! 🌟`;
  }
  return null;
};

const AIMessage = ({ type, difficulty, aiWins, playerWins }: AIMessageProps) => {
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const streakMessage = getStreakMessage(aiWins, playerWins, difficulty);
    if (streakMessage && (type === "win" || type === "lose")) {
      setMessage(streakMessage);
    } else {
      const messageList = messages[type][difficulty];
      const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
      setMessage(randomMessage);
    }
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [type, difficulty, aiWins, playerWins]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl bg-card shadow-lg transition-all duration-300 ${
      isAnimating ? "scale-105" : "scale-100"
    }`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-game-pink to-game-sky flex items-center justify-center">
        {type === "thinking" ? (
          <Sparkles className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          AI Opponent ({difficulty})
        </p>
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default AIMessage;
export type { MessageType };
