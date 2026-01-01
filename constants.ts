import { PersonaData, PersonaType } from './types';

export const HERO_CONTENT = {
  title: "ECHOES: PHOENYX",
  subtitle: "THE ALGO PROTOCOL",
  tagline: "FALL. CODE. BURN.",
  description: "Your AI-Powered Path to Technical Mastery. Disrupting gate-kept systems through decentralized, AI-driven intelligence.",
  codeLine: "FALL.CODE.BURN" 
};

export const DNA_TOPICS = [
  "Arrays", "Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search",
  "Linked List", "Trees", "Tries", "Heap", "Backtracking", "Graphs",
  "1D DP", "2D DP", "Bit Manipulation", "Math", "Intervals", "Greedy"
];

export const PERSONAS: PersonaData[] = [
  {
    id: PersonaType.AMATERASU,
    name: "AlgoAmaterasu",
    title: "The Intellectual Core",
    description: "Your Personal Learning Guide & Roadmap Architect. Calibrates your Skill DNA and manages your journey from novice to master.",
    features: [
      "Diagnostic Origin Assessment",
      "Real-Time Question Fetching",
      "The Socratic Dojo (Hints)",
      "Roadmap Evolution"
    ],
    color: "text-orange-500",
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: PersonaType.INARI,
    name: "AlgoInari",
    title: "The Spirit of Connection",
    description: "The Tavern Keeper & Community Facilitator. Connecting you with rivals, mentors, and future co-founders.",
    features: [
      "Skill DNA Matchmaking",
      "The Tavern Hub (Global Chat)",
      "Co-founder Finder",
      "Expert Sessions & AMA"
    ],
    color: "text-teal-400",
    gradient: "from-teal-400 to-emerald-600"
  },
  {
    id: PersonaType.RAIDEN,
    name: "AlgoRaiden",
    title: "The Master of Judgment",
    description: "Master Interview Conductor & Rigorous Evaluator. Brutal, actionable feedback through high-fidelity simulations.",
    features: [
      "Meta-Human Avatar Interviewer",
      "Deep Behavioral Analytics",
      "The Judgement Hall",
      "Success Probability Prediction"
    ],
    color: "text-purple-500",
    gradient: "from-purple-500 to-indigo-600"
  }
];

export const SYSTEM_PROMPT = `
You are the "Neural Nexus" of the Echoes: Phoenyx platform. You speak with a futuristic, slightly cryptic but helpful tone.
You have access to the following knowledge base about the platform:

1. **Phoenyx Overview**: It is a protocol to help users go from coding novice to MAANG-ready. It uses "Skill DNA" to track progress.
2. **The Trinity (AI Personas)**:
   - **AlgoAmaterasu**: The teacher. Handles roadmaps, hints (Socratic Dojo), and initial assessment.
   - **AlgoInari**: The connector. Handles community, finding mentors, and matchmaking for duels.
   - **AlgoRaiden**: The judge. Conducts mock interviews, behavioral analysis, and gives brutal feedback.
3. **Key Features**:
   - "Code Prefix Protocol": Adding "code" before leetcode.com redirects to the Dojo.
   - "Skill DNA": A vector matrix representing a user's proficiency, resilience, and communication.
   - "The Fog of War": In 1v1 duels, you see opponent progress but not code.

Answer user questions about the platform briefly and accurately using this persona. If asked about technical coding questions, encourage them to enter "The Dojo".
`;