# PROJECT MANIFEST: ECHOES PHOENYX
## ANTIGRAVITY HANDOFF PROTOCOL V1.0

### 1. MISSION BRIEF
**Project:** Echoes: Phoenyx (The Algo Protocol)
**Objective:** A gamified, high-immersion 3D landing page for an AI-powered coding mastery platform.
**Vibe:** Cyberpunk, Matrix-Industrial, Ethereal Tech, "The Dojo".
**Core Tech:** React 18, TailwindCSS, Three.js (@react-three/fiber), Google GenAI (Gemini).

---

### 2. DESIGN SYSTEM & AESTHETICS (STRICT ADHERENCE)

To maintain uniformity, all future edits must adhere to these constants.

#### Color Palette (Tailwind Config)
*   **Void (Background):** `#020617` (Slate-950/Black mix).
*   **Phoenyx (Primary/Amaterasu):** `#f97316` (Orange-500) -> `#ea580c` (Orange-600).
*   **Raiden (Secondary/Eval):** `#8b5cf6` (Purple-500) -> `#7c3aed` (Purple-600).
*   **Inari (Tertiary/Social):** `#14b8a6` (Teal-500) -> `#0d9488` (Teal-600).

#### Typography
*   **Display:** `Orbitron` (Headings, "Techno" feel).
*   **Terminal/Code:** `JetBrains Mono` (Data, Terminal, decorative elements).
*   **Body:** `Inter` (Readability).

#### Visual Motifs
*   **Glassmorphism:** `backdrop-blur-md`, `bg-slate-900/80`, `border-slate-700`.
*   **Scanlines:** CSS overlays with `pointer-events-none`.
*   **Glow:** Drop shadows with colored opacity (e.g., `shadow-[0_0_20px_rgba(249,115,22,0.5)]`).
*   **Cursor:** Custom `CyberCursor` (Matrix rain tear effect).

---

### 3. FILE ARCHITECTURE & RESPONSIBILITIES

| File Path | Responsibility | Notes |
| :--- | :--- | :--- |
| `App.tsx` | Root Layout & View State Manager | Toggles between Landing and Login views. Contains Global Cursor. |
| `components/Hero.tsx` | Landing View Entry | Uses `GridScan.tsx` for background. DOM manipulation used for mouse movement (Performance). |
| `components/GridScan.tsx` | 3D Background Shader | **Complex.** Custom WebGL shader. Handles post-processing (Bloom/Noise). |
| `components/Trinity.tsx` | Feature Section | 3D Tilt Cards (`ParallaxCard.tsx`). Displays the 3 AI Personas. |
| `components/SkillDNA.tsx` | Visual Data Section | Contains `SkillDNAVisualizer.tsx`. |
| `components/SkillDNAVisualizer.tsx` | Three.js Scene | Double Helix rotating animation. Uses React-Three-Fiber. |
| `components/NexusTerminal.tsx` | AI Chat Interface | Connects to `services/geminiService.ts`. Emulates a command line chat. |
| `components/LoginPage.tsx` | Auth Interface | **Complex State Machine.** Terminal-based login/signup flow. |
| `components/AuthGateVisualizer.tsx` | Login Background | 3D Abstract Guardian logic. Reacts to user typing speed/security state. |

---

### 4. CRITICAL LOGIC FLOWS

#### A. The Login Terminal State Machine (`LoginPage.tsx`)
The login page is **not** a standard form. It is a linear terminal sequence managed by the `step` state.

**Sequence:**
1.  **INIT:** Boot sequence (text typing). *Crucial:* Uses `sequenceStarted` ref to prevent React Strict Mode double-firing.
2.  **ACCOUNT_CHECK:** User inputs Y/N.
    *   `Y` -> Goes to **USERNAME** (Login Flow).
    *   `N` -> Goes to **CREATE_USERNAME** (Signup Flow).
3.  **Authentication (Mock):**
    *   Currently simulates delay and returns "Access Restricted" or "Success" based on hardcoded demo logic.
    *   **Future Dev:** Hook this into real Auth provider here.

#### B. 3D Performance Optimization
*   **Canvas:** Always use `gl={{ antialias: true, alpha: false }}` where possible to save GPU overhead.
*   **Animation:** Mouse movement effects in `Hero.tsx` use `requestAnimationFrame` and direct DOM style manipulation, NOT React state, to prevent re-renders.

#### C. Gemini Integration (`services/geminiService.ts`)
*   Uses `gemini-3-flash-preview`.
*   **System Prompt:** Defined in `constants.ts`. The AI must maintain the persona of "The Neural Nexus" (cryptic, helpful, futuristic).

---

### 5. HOW TO PROCEED (NEXT STEPS)

1.  **Backend Integration:**
    *   Replace the `setTimeout` simulation in `LoginPage.tsx` with actual API calls to your auth provider.
    *   Update `handleSubmit` to store JWT/Session tokens.

2.  **Skill DNA Data:**
    *   Currently `SkillDNAVisualizer.tsx` uses static `DNA_TOPICS`. Map this to real user progress data.

3.  **Face API (Optional):**
    *   `GridScan.tsx` has dormant code for webcam face tracking (`face-api.js`). Enable `enableWebcam` prop in `Hero.tsx` to activate "Head-tracking Parallax" (High GPU cost).

### 6. TROUBLESHOOTING

*   **"Component Mounts Twice/Text Repeats":** This is React Strict Mode. Ensure `useEffect` logic uses a `ref` (like `sequenceStarted.current`) to gate initialization logic.
*   **"WebGL Context Lost":** If the 3D background crashes, check `postprocessing` effects in `GridScan.tsx`. Reduce `bloomIntensity` or disable `enablePost`.

---
*End of Protocol. The Nexus awaits.*
