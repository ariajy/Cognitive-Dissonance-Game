// Strain System
// Responsibility: track & update global strain, provide labels and basic decay rules.
//
// Classic script global export for file:// compatibility.

class StrainSystem {
  constructor(personaState, config = {}) {
    this.persona = personaState;
    this.config = {
      baseDecayPerStep:
        typeof config.baseDecayPerStep === "number" ? config.baseDecayPerStep : 2,
      maxStrain: typeof config.maxStrain === "number" ? config.maxStrain : 100,
      minStrain: typeof config.minStrain === "number" ? config.minStrain : 0
    };
    // Ensure model matches UI defaults (createDefaultPersona strain: 0).
    this._normalizePersonaStrain();
  }

  _normalizePersonaStrain() {
    var p = this.persona;
    if (!p) return;
    var s = p.strain;
    if (typeof s !== "number" || Number.isNaN(s)) {
      p.strain = 0;
    } else {
      p.strain = roundStrainToStep5(clamp(s, this.config.minStrain, this.config.maxStrain));
    }
  }

  getStrain() {
    this._normalizePersonaStrain();
    return this.persona.strain;
  }

  setStrain(value) {
    this._normalizePersonaStrain();
    if (typeof value !== "number" || Number.isNaN(value)) {
      return this.persona.strain;
    }
    this.persona.strain = roundStrainToStep5(
      clamp(value, this.config.minStrain, this.config.maxStrain)
    );
    return this.persona.strain;
  }

  applyDelta(delta) {
    return this.setStrain(this.persona.strain + delta);
  }

  applyDecay() {
    const stabilityFactor =
      typeof this.persona.stabilityIndex === "number"
        ? this.persona.stabilityIndex
        : 0.8;
    const decay = this.config.baseDecayPerStep * stabilityFactor;
    return this.applyDelta(-decay);
  }

  getLabel() {
    this._normalizePersonaStrain();
    const s = this.persona.strain;
    if (s < 25) return "Calm";
    if (s < 55) return "Uneasy";
    if (s < 80) return "Tense";
    return "Overloaded";
  }

  getLevel() {
    this._normalizePersonaStrain();
    const s = this.persona.strain;
    if (s < 25) return "low";
    if (s < 55) return "mild";
    if (s < 80) return "medium";
    return "high";
  }

  /**
   * Primary UI read for global strain: Low / Medium / High (breakpoints 40 and 70).
   */
  getBandLabel() {
    this._normalizePersonaStrain();
    return StrainSystem.bandLabelForValue(this.persona.strain);
  }

  static bandLabelForValue(s) {
    var v =
      typeof s === "number" && !Number.isNaN(s)
        ? Math.min(100, Math.max(0, s))
        : 0;
    if (v < 40) return "Low";
    if (v < 70) return "Medium";
    return "High";
  }
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/** Strain is stored in multiples of 5 (0–100) for consistent UI and decay. */
function roundStrainToStep5(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.round(v / 5) * 5;
}

window.StrainSystem = StrainSystem;

