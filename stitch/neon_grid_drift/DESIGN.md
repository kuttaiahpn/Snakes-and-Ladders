# Design System Strategy: Neon Kineticism

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Digital Pulse."** 

We are moving away from the static, clunky aesthetics of traditional board games and into a high-fidelity, synthwave-infused digital simulation. This design system treats the UI not as a flat interface, but as a glowing, multi-layered HUD (Heads-Up Display) projected in a deep-space vacuum. 

To break the "standard template" feel, we employ **Intentional Asymmetry**. Game status indicators, "Luck Meters," and navigation elements should feel like floating modules. We avoid rigid, centered layouts in favor of an editorial, offset composition that mimics the high-energy "glitch" aesthetic of cyberpunk media. Components do not just sit on the background; they hum, glow, and vibrate with life.

---

## 2. Colors: The Neon Spectrum
Our palette is rooted in the high-contrast tension between absolute darkness and electric luminescence.

*   **Primary Accent (`primary` #96f8ff):** Used for critical path actions and the "Ladders" to represent ascension and clarity.
*   **Secondary Accents (`secondary` #ff51fa):** Reserved for "Snakes" and high-risk elements, creating a visual "danger" contrast.
*   **Tertiary Accents (`tertiary` #f3ffca):** Used for "Neutral" game mechanics and status modifiers to keep the UI from feeling monochromatic.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. We define space through **Surface Hierarchy**. Use `surface-container-low` for large section backgrounds sitting on the `surface` (#0d0d16). Boundaries are felt through the shift in darkness, not a drawn line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical glass sheets.
*   **Base:** `surface` (#0d0d16).
*   **Secondary Modules:** `surface-container` (#191923).
*   **Active Overlays:** `surface-container-highest` (#252531) with a 60% opacity and 20px Backdrop Blur.

### The "Glass & Gradient" Rule
To achieve "vibe" status, all primary interactive elements must use a subtle linear gradient. 
*   **CTA Gradient:** `primary` (#96f8ff) to `primary-container` (#00f1fd) at a 135-degree angle. This prevents the "flat vector" look and adds a premium, liquid-neon depth.

---

## 3. Typography: Futuristic Precision
We utilize a pairing of **Space Grotesk** for high-impact data and **Manrope** for functional readability.

*   **Display (`display-lg` 3.5rem):** Space Grotesk. Use for game states (e.g., "YOU WIN"). Set with -2% letter spacing to feel dense and technical.
*   **Headlines (`headline-md` 1.75rem):** Space Grotesk. Used for section headers like "Luck Meter" or "Leaderboard." 
*   **Body (`body-md` 0.875rem):** Manrope. This is your workhorse. It provides a human, readable balance to the aggressive display type.
*   **Labels (`label-sm` 0.6875rem):** Space Grotesk in all-caps. Used for technical data, coordinates, and micro-copy.

The hierarchy is designed to feel like an architectural blueprint—functional, yet unmistakably stylized.

---

## 4. Elevation & Depth: Tonal Layering
In a cyberpunk world, depth is created by light, not shadows.

*   **The Layering Principle:** Instead of shadows, use **Inner Glows**. A card (`surface-container-high`) should have a subtle 1px inner stroke using `primary` at 10% opacity to simulate light catching the edge of a glass pane.
*   **Ambient Shadows:** If a "floating" modal is required, use a shadow with a 40px blur at 8% opacity, tinted with the `secondary` color (#ff51fa) rather than black. This creates a "neon underglow" effect.
*   **The Ghost Border Fallback:** For the 10x10 game grid, use the **Ghost Border**. Apply `outline-variant` (#484751) at 15% opacity. This defines the grid without cluttering the visual field.
*   **Glassmorphism:** All overlays must use `surface-container-highest` at 40% opacity with a `backdrop-filter: blur(12px)`.

---

## 5. Components: The Vibe Toolkit

### Circular Neon Avatar Frames
Avatars are not just circles; they are "Power Cores."
*   **Base:** `surface-container-highest`.
*   **Stroke:** 2px `primary` (#96f8ff) with a `box-shadow` glow (0 0 10px `primary`).
*   **State:** When it's a player's turn, the stroke should pulse using a CSS keyframe.

### Luck Meter (Progress Bars)
*   **Track:** `surface-container-lowest` (pure black #000000).
*   **Indicator:** A gradient from `secondary` (#ff51fa) to `primary` (#96f8ff).
*   **Detail:** Add a 1px "needle" at the current value using `on-surface` (#f2effb).

### The 10x10 Game Grid
*   **Cell Styling:** No solid borders. Use `surface-container-low` and `surface-container-high` in a checkerboard pattern for subtle distinction.
*   **Active Cell:** Highlighted with a 1px `primary` ghost border and a soft inner glow.

### Interactive Buttons
*   **Primary:** Background gradient (`primary` to `primary-container`), black text (`on-primary`), `xl` (0.75rem) corner radius.
*   **Secondary (Ghost):** No background. 1px ghost border of `secondary`. On hover, fill with 10% `secondary` opacity.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a separator. Use `spacing-8` (2rem) between major modules.
*   **DO** lean into the "glow." If an element is important, give it a soft, colored outer-glow (bloom).
*   **DO** use asymmetric layouts. Align "Luck Meters" to the right and player stats to the left to create a dynamic "cockpit" feel.

### Don't:
*   **DON'T** use 100% white (#ffffff). Always use `on-background` (#f2effb) to prevent eye strain against the dark theme.
*   **DON'T** use 1px solid white borders. It breaks the "Digital Pulse" immersion.
*   **DON'T** use standard drop shadows. Use colored ambient glows or tonal shifts.
*   **DON'T** use dividers. If a list needs separation, use a 4px gap or a slight background shift between `surface-container` tiers.