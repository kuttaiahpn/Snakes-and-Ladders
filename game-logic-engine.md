# Game Mechanics & State Management
**Grid:** 100 tiles (1 to 100).
**Players:** Array of objects `{ id, name, position, shieldActive, isBot }`. Max 5.
**Turn Logic:** Sequential. Roll 1-6. 
**Special Events (The "Modern Twist"):**
1.  **Quantum Inversion (Global):** Triggers randomly every 5-10 turns. For 2 rounds, all Snakes act as Ladders, and Ladders act as Snakes.
2.  **The Void (Global):** Triggers rarely. Grid tiles 40-50 disappear. Landing on them drops you back to 39.
3.  **Power-Ups (Individual):** Landing on specific "Energy Nodes" grants:
    - *Deflector Shield:* Ignores the next Snake.
    - *Overclock:* Next dice roll is multiplied by 2.
    - *Glitch:* The player who lands on a snake is stuck for 1 skipped turn.
**Event Tracking (Crucial):** Every dice roll must log an event. If a player lands on a snake, increment their `snakesHit` stat and recalculate their `unluckyPercentage`.
**Firebase Real-time Sync:** The `gameState` (board positions, player stats, and chat history array) must be synced via Firebase Firestore or Realtime DB so all 5 players see the stats update instantly.
**Gemini API Chat Generation:** - Expose a serverless function (or utility) `generatePlayerMessage(sender, target, type: 'stinker' | 'props', targetStats)`.
- The UI will display a loading spinner in the chat box while Gemini fetches the response, then push the generated string + emojis to the Firebase chat array.