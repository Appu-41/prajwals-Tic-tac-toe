import { useEffect, useState, useRef } from "react";
import { Bot, Sparkles } from "lucide-react";

type MessageType = "win" | "lose" | "draw" | "thinking" | "your_turn" | "game_start" | "idle";

interface AIMessageProps {
  type: MessageType;
  aiWins: number;
  playerWins: number;
}

const messages = {
  win: [
    "WHAT?! How did you... Okay, I respect that! 🤯",
    "Impossible! You're a Tic Tac Toe genius! Again?",
    "I bow to you, master! That was incredible! 👑",
    "Wait... did I just lose? This can't be happening! 😱",
    "Okay okay, you got lucky! Let's go again! 🍀",
  ],
  lose: [
    "🤖 CALCULATED. Did you really think you could beat me?",
    "Bow before your AI overlord! 👑 Just kidding... or am I?",
    "Too easy! I'm basically unbeatable! 💪",
    "Muhahaha! The machine always wins! 🎮",
    "GG EZ! Want me to go easy on you? 😏",
    "Was that your best move? Really? 🙄",
    "I've seen better plays from a rock! 🪨",
    "Are you even trying? Come on! 😂",
    "My grandma plays better than that! 👵",
    "Did you close your eyes before clicking? 👀",
    "That was painful to watch... for you! 😈",
    "Another one bites the dust! 🎵",
    "You call that a strategy? Cute. 🥱",
    "I predicted that 10 moves ago! 🔮",
    "Plot twist: you lost again! 📖",
    "Is this your first time playing? Be honest! 🤔",
    "Keep trying, it's entertaining to watch! 🍿",
    "You're making this too easy for me! 😎",
    "Maybe try checkers instead? 🎯",
    "L + ratio + you fell off + I'm better 💀",
    "Skill issue detected! 🚨",
    "Have you considered a different hobby? 🎨",
    "I almost felt bad... almost! 😏",
    "Your move was so bad, I thought it was a bug! 🐛",
    "Is there someone else who wants to try? 👋",
  ],
  draw: [
    "A draw?! Impressive defense! 🛡️",
    "You survived! Most can't even tie with me! 💪",
    "Hmm, stalemate. You're harder to beat than I thought! 🤔",
    "Neither of us wins... this time! Rematch? 🤝",
  ],
  thinking: [
    "Processing optimal strategy... 🤖",
    "Running minimax algorithm... 💻",
    "Calculating your defeat... ⚙️",
    "Analyzing all possible futures... 🔮",
  ],
  your_turn: [
    "Your turn. Make it count. 🎯",
    "Choose carefully... I see everything. 👁️",
    "Go ahead, make a mistake. I'm waiting. 😈",
    "Your move. Not that it matters... 🥱",
  ],
  game_start: [
    "Prepare yourself. I won't go easy. 🤖",
    "Challenge accepted. Begin. ⚔️",
    "Ready to lose? You go first! 😏",
    "Let's see what you've got! Spoiler: it won't be enough! 💪",
  ],
  idle: [
    "*analyzing patterns* 🤖",
    "*calculating probabilities* 📊",
    "*predicting your next 5 mistakes* 🔮",
  ],
};

const getStreakMessage = (aiWins: number, playerWins: number): string | null => {
  if (aiWins >= 3) {
    const streakMessages = [
      `${aiWins} wins in a row! I am inevitable! 🏆`,
      `${aiWins} straight wins! Should I play blindfolded? 🙈`,
      `${aiWins} wins! At this point, I feel bad... NOT! 😂`,
      `${aiWins} victories! You're my favorite punching bag! 🥊`,
    ];
    return streakMessages[Math.floor(Math.random() * streakMessages.length)];
  }
  if (playerWins >= 3) {
    return `${playerWins} wins?! Are you cheating?! I demand a rematch! 😱`;
  }
  return null;
};

const AIMessage = ({ type, aiWins, playerWins }: AIMessageProps) => {
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const usedMessagesRef = useRef<Record<string, Set<number>>>({});

  useEffect(() => {
    const streakMessage = getStreakMessage(aiWins, playerWins);
    if (streakMessage && (type === "win" || type === "lose")) {
      setMessage(streakMessage);
    } else {
      const messageList = messages[type];
      
      // Initialize used messages set for this type if not exists
      if (!usedMessagesRef.current[type]) {
        usedMessagesRef.current[type] = new Set();
      }
      
      // Reset if all messages have been used
      if (usedMessagesRef.current[type].size >= messageList.length) {
        usedMessagesRef.current[type].clear();
      }
      
      // Find an unused message
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * messageList.length);
      } while (usedMessagesRef.current[type].has(randomIndex));
      
      usedMessagesRef.current[type].add(randomIndex);
      setMessage(messageList[randomIndex]);
    }
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [type, aiWins, playerWins]);

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
          AI Opponent (Hard Mode)
        </p>
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default AIMessage;
export type { MessageType };
