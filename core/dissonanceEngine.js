// Dissonance Trigger / Conflict Detector
// Deterministic given persona + chosenAction + config.
//
// Classic script global export for file:// compatibility.

class DissonanceEngine {
  constructor(config = {}) {
    this.config = {
      conflictThreshold:
        typeof config.conflictThreshold === "number" ? config.conflictThreshold : 60,
      baseStrainMultiplier:
        typeof config.baseStrainMultiplier === "number"
          ? config.baseStrainMultiplier
          : 0.8,
      maxStrainDelta:
        typeof config.maxStrainDelta === "number" ? config.maxStrainDelta : 25
    };
  }

  /**
   * @param {Persona} persona
   * @param {ChosenAction} chosenAction
   * @returns {{ triggered: boolean, conflicts: Conflict[], strainDelta: number }}
   */
  evaluateDissonance(persona, chosenAction) {
    const conflicts = [];
    const beliefs = persona && persona.beliefs ? persona.beliefs : [];

    beliefs.forEach((belief) => {
      const tagOverlap = intersectSize(
        new Set(belief.tags || []),
        new Set(chosenAction.actionTags || [])
      );
      if (!tagOverlap) return;

      const rawImpact =
        chosenAction &&
        chosenAction.beliefImpact &&
        typeof chosenAction.beliefImpact[belief.id] === "number"
          ? chosenAction.beliefImpact[belief.id]
          : 0;
      if (rawImpact >= 0) return; // only consider actions that go against the belief

      const strength =
        typeof belief.strength === "number" ? belief.strength : 0;
      if (strength < this.config.conflictThreshold) return;

      const magnitude = Math.abs(rawImpact); // 0-1
      const strainFactor = persona.strain / 100;

      let contribution =
        strength * magnitude * this.config.baseStrainMultiplier * (0.7 + strainFactor * 0.8);
      contribution = Math.min(this.config.maxStrainDelta, contribution);

      conflicts.push({
        beliefId: belief.id,
        beliefStrength: strength,
        magnitude,
        strainContribution: contribution
      });
    });

    if (!conflicts.length) {
      return { triggered: false, conflicts: [], strainDelta: 0 };
    }

    const totalDelta = conflicts.reduce((sum, c) => sum + c.strainContribution, 0);
    return {
      triggered: true,
      conflicts,
      strainDelta: roundStrainTo5(totalDelta)
    };
  }
}

function roundStrainTo5(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.round(n / 5) * 5;
}

function intersectSize(a, b) {
  let count = 0;
  a.forEach((v) => {
    if (b.has(v)) count++;
  });
  return count;
}

window.DissonanceEngine = DissonanceEngine;

