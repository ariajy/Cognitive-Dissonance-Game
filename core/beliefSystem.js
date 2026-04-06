// Belief Persona System
// Core entities and basic CRUD over beliefs on a Persona.
//
// This file is loaded as a classic script (no ES module imports)
// so it can run from file:// on mobile/desktop.

function createDefaultPersona() {
  const now = Date.now();
  return {
    id: "player",
    // Filled after onboarding or restored from save (see persistence.js legacy v<3).
    name: "",
    rngSeed: now,
    strain: 0,
    stabilityIndex: 0.8,
    // True after the student registration API succeeds.
    registrationDone: false,
    // Server-generated registration reference id (if returned by API).
    registrationRef: "",
    // Set true after onboarding (name + 3 priority beliefs) or when restored from save.
    onboardingDone: false,
    // Up to 3 belief ids the player marks as core; all beliefs stay in the list for mechanics.
    playerPriorityBeliefIds: [],
    // Cross-session habit counter (justification path); see game/persistence.js
    justificationUses: 0,
    beliefs: [
      {
        id: "responsibility",
        coreClaim: "I am responsible and follow through.",
        strength: 80,
        stability: 0.82,
        tags: ["procrastination", "responsibility"],
        lastUpdated: now
      },
      {
        id: "kindness",
        coreClaim: "I am kind and helpful.",
        strength: 80,
        stability: 0.8,
        tags: ["helping", "kindness"],
        lastUpdated: now
      },
      {
        id: "honesty",
        coreClaim: "I should be honest, even when it is costly.",
        strength: 85,
        stability: 0.84,
        tags: ["ethical", "honesty"],
        lastUpdated: now
      },
      {
        id: "selfControl",
        coreClaim: "I have strong self-control.",
        strength: 80,
        stability: 0.78,
        tags: ["self-control", "diet"],
        lastUpdated: now
      },
      {
        id: "fairness",
        coreClaim: "I am open-minded and fair.",
        strength: 75,
        stability: 0.76,
        tags: ["identity", "fairness"],
        lastUpdated: now
      },
      {
        id: "safetyInLove",
        coreClaim: "Love should feel safe; I will not live in fear.",
        strength: 85,
        stability: 0.81,
        tags: ["intimate-relationship", "safety-in-love"],
        lastUpdated: now
      }
    ]
  };
}

class BeliefSystem {
  constructor(personaState) {
    this.persona = personaState;
  }

  getPersona() {
    return this.persona;
  }

  getBelief(id) {
    return this.persona.beliefs.find((b) => b.id === id) || null;
  }

  listBeliefs() {
    return [...this.persona.beliefs];
  }

  setBeliefStrength(id, newStrength) {
    const belief = this.getBelief(id);
    if (!belief) return null;
    belief.strength = clamp(newStrength, 0, 100);
    belief.lastUpdated = Date.now();
    return belief;
  }

  applyBeliefDelta(id, deltaStrength, deltaStability = 0) {
    const belief = this.getBelief(id);
    if (!belief) return null;
    belief.strength = clamp(belief.strength + deltaStrength, 0, 100);
    belief.stability = clamp(belief.stability + deltaStability, 0, 1);
    belief.lastUpdated = Date.now();
    this.rebuildStabilityIndex();
    return belief;
  }

  rebuildStabilityIndex() {
    if (!this.persona.beliefs.length) {
      this.persona.stabilityIndex = 0;
      return;
    }
    const avgStability =
      this.persona.beliefs.reduce((sum, b) => sum + b.stability, 0) /
      this.persona.beliefs.length;
    this.persona.stabilityIndex = Number(avgStability.toFixed(2));
  }
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// Curated list for onboarding (ids must match persona.beliefs entries).
window.ONBOARDING_BELIEF_OPTIONS = [
  { id: "responsibility", label: "Responsibility — I follow through." },
  { id: "kindness", label: "Kindness — I help when I can." },
  { id: "honesty", label: "Honesty — I tell the truth even when it costs." },
  { id: "selfControl", label: "Self-control — I can stick to my plans." },
  { id: "fairness", label: "Fairness — I try to be open-minded and fair." },
  { id: "safetyInLove", label: "Safety in love — love should not feel frightening." }
];

// Global exports
window.createDefaultPersona = createDefaultPersona;
window.BeliefSystem = BeliefSystem;

