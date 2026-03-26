# Snakes & Ladders - Vibe Edition 🐍⚡🪜

A high-fidelity, real-time multiplayer board game with a cyberpunk aesthetic, integrated AI commentary, and quantum mechanics.

![Hero Image](public/game-hero.png)

## 🌌 The Vibe
This isn't your childhood board game. **Vibe Edition** transforms the classic 10x10 grid into a neon-soaked digital arena where luck is quantified, and the "Quantum Inversion" can flip your victory into defeat in a single turn.

## 🚀 Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Firebase Firestore (Real-time synchronization)
- **AI Engine:** Google Gemini AI (Flash 1.5) via `@google/generative-ai`
- **DevOps:** Docker, Google Cloud Run, GitHub Actions

## ✨ Key Features
- **Multiplayer Engine:** Real-time synchronization across Solo, Duo, Trio, and Squad modes using Firestore transactions for atomic turn-locking.
- **SHAKUNI AI Commentator:** A snarky, cyber-overlord narrator that roasts your fails and toasts your legendary climbs using generative AI.
- **Quantum Inversion:** A global event that periodically inverts game logic—Snakes become Ladders, and Ladders become Snakes.
- **Dynamic Leaderboard:** Real-time performance tracking with "Lucky %" and "Unlucky %" indicators based on game history.
- **Boustrophedon Grid:** A custom-engineered grid system with programmatic slanted ladders and animated glow-paths.

## 🛠️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Snakes-and-Ladders
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 🐳 Docker & Cloud Run
The project is containerized for easy deployment to Google Cloud Run. Ensure you have the `Dockerfile` updated with your specific environment arguments or use GitHub Secrets for injection.

## 🔐 GitHub Requirements
To ensure the automated Cloud Build pipeline works correctly, add the following to your **GitHub Settings > Secrets and Variables**:
- `VITE_FIREBASE_API_KEY`
- `VITE_GEMINI_API_KEY`
- (And other Firebase variables listed above)

---
*Built with Agentic Vibe Coding.*
