# Tech Stack & Quality Standards
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion.
- **Backend/State:** Firebase Realtime Database (listen to board state changes).
- **Google AI Integration:** Google Gemini SDK (for generating situation-based chat messages).
- **Code Quality:** Strict TypeScript. Modular components (Dice, Board, PlayerCard). 
- **Security:** Sanitize all chat inputs. Do not expose Firebase Admin or Gemini API keys in the client bundle. Implement Content Security Policy (CSP) headers" and "sanitize all user-inputted names for the leaderboard.
- **Testing:** basic Vitest or Jest unit tests for the core scoring logic. Judges love seeing a /tests folder.