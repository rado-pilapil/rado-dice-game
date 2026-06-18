🎲 React + Phaser Dice Game

A hybrid React + Phaser.js dice rolling game with animated physics-based rolling, real-time UI controls, and responsive canvas scaling.

🚀 Features

- 🎮 Phaser-based dice roll animation (1–100)
- ⚛️ React control panel (target, roll, history, streak)
- 🔊 Sound toggle support
- 📊 Roll history + win streak tracking
- 📱 Fully responsive (desktop + mobile)
- 🧠 Typed React ↔ Phaser event bridge
- 🎲 Physics-based rolling animation with easing
- 📐 Auto-scaling canvas (FIT mode)

🧱 Tech Stack

- React (Vite / CRA compatible)
- TypeScript
- Phaser 3
- Event-based bridge system (React ↔ Phaser)

📦 Installation

1. Clone the repository
   git clone https://github.com/your-username/react-phaser-dice-game.git
   cd react-phaser-dice-game

2. Install dependencies
   Using npm:
   npm install

Or yarn:
yarn install

3. Start development server
   npm run dev
   or:
   npm start

🌐 Open in browser
http://localhost:5173

(or CRA default: http://localhost:3000)

🧩 Project Structure
src/
│
├── game/
│ ├── bridge/
│ │ └── events.ts # React ↔ Phaser event bus
│ ├── scenes/
│ │ └── DiceScene.ts # Phaser dice logic + animation
│ ├── config.ts # Phaser config (scale + render)
│ ├── createGame.ts # Game factory
│
├── hooks/
│ └── useDiceGame.ts # React game logic hook
│
├── components/
│ ├── PhaserGame.tsx # Phaser canvas wrapper
│ └── ControlPanel.tsx # UI controls
│
├── App.tsx
└── main.tsx

🎮 How the Game Works

1. React → Phaser
   React emits events:

gameEvents.emit("ROLL_REQUEST", value);
gameEvents.emit("SET_MUTE", true);

2. Phaser → React
   Phaser responds:

gameEvents.emit("READY");
gameEvents.emit("ROLL_COMPLETE", result);

3. Flow
   User clicks Roll
   ↓
   React emits ROLL_REQUEST
   ↓
   Phaser runs DiceScene animation
   ↓
   Dice rolls visually (physics + easing)
   ↓
   Phaser emits ROLL_COMPLETE
   ↓
   React updates UI (result, streak, history)

🎯 Game Rules

- User sets a target number (1–100)
- Dice rolls random number between 1–100
- If result ≥ target → win streak increases
- Otherwise streak resets

🎛 Controls

- Input: Set target number
- Roll Button: Start dice animation
- Sound Toggle: Enable/disable sound
- History: Last 10 results
- Streak: Current win streak

📱 Responsive Behavior

- Desktop: split layout (game + control panel)
- Mobile: stacked layout
- Canvas always:
  - maintains aspect ratio
  - auto-centers
  - scales using Phaser FIT mode

⚙️ Key Technical Details
Phaser scaling system:
mode: Phaser.Scale.FIT
autoCenter: Phaser.Scale.CENTER_BOTH

🧪 Development Notes
Prevent duplicate roll
if (rolling) return;

Cleanup Phaser instance
game.destroy(true);

Event cleanup in Phaser scene
gameEvents.off(...)

🧹 Build for production
npm run build

🚀 Possible Enhancements

- 🎲 3D dice (Three.js integration)
- 🔊 sound effects per roll speed
- 🧠 weighted probability mode
- 🎥 motion blur / trail effect
- 📱 haptic feedback (mobile)
- 🏆 leaderboard system
