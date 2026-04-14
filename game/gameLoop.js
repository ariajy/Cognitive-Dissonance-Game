// Game Orchestrator / State Machine
// End-to-end flow:
// Belief Persona → Decision → Dissonance → Reduction → Update.
//
// Classic script global export for file:// compatibility.

// Scenarios are provided via ./content/scenarios.js as a classic script.
// We adapt content schema → engine schema here (mechanics unchanged).

function derivePrimaryChoicesFromDecisionAction(s) {
  if (!s || !s.decisionAction || !s.beliefId) return [];
  var base = s.decisionAction;
  var beliefId = s.beliefId;
  var baseActionTags = Array.isArray(base.actionTags) ? base.actionTags : [];
  var baseStrainDelta = typeof base.strainDelta === "number" ? base.strainDelta : 0;
  var baseImpact =
    base.beliefImpact &&
    typeof base.beliefImpact[beliefId] === "number"
      ? base.beliefImpact[beliefId]
      : -0.5;

  // Ensure conflict choice is negative impact (goes against belief).
  var conflictVal = baseImpact;
  if (conflictVal >= 0) conflictVal = -Math.abs(conflictVal || 0.5);

  // beliefImpact steps of 0.25 → strength change in multiples of 5 (×20 in applyBeliefDelta).
  var alignedVal = Math.round((Math.abs(conflictVal) * 0.35) / 0.25) * 0.25;
  if (alignedVal < 0.25) alignedVal = 0.25;
  if (alignedVal > 0.5) alignedVal = 0.5;

  var rawAlignStrain = Math.abs(baseStrainDelta) * 0.6;
  var alignedStrain = -Math.max(5, Math.round(rawAlignStrain / 5) * 5);

  function mkBeliefImpact(val) {
    var obj = {};
    obj[beliefId] = val;
    return obj;
  }

  // Minimal authored copy (fallback only). If s.primaryChoices exists, we use it instead.
  return [
    {
      id: "primary-conflict",
      label: "Do it anyway",
      actionTags: baseActionTags,
      beliefImpact: mkBeliefImpact(conflictVal),
      strainDelta: baseStrainDelta,
      tone: "conflict"
    },
    {
      id: "primary-aligned",
      label: "Fix it now",
      actionTags: baseActionTags,
      beliefImpact: mkBeliefImpact(alignedVal),
      strainDelta: alignedStrain,
      tone: "aligned"
    }
  ];
}

function toDecisionMoment(s, idx) {
  const title = s && s.title ? s.title : "Scene";
  const situationText = s && (s.situation || s.scenario) ? (s.situation || s.scenario) : "";
  const decisionText = s && s.decision ? s.decision : "";

  const reductions = (s && s.reductions) || {};
  const ordered = ["behavior_change", "belief_change", "justification"];
  const rationalizations = ordered
    .filter((k) => reductions[k])
    .map((k) => {
      const r = reductions[k] || {};
      return {
        id: k,
        label: r.label,
        explanation: r.explanation,
        actionTags: r.actionTags || [],
        baseWeight: typeof r.baseWeight === "number" ? r.baseWeight : 1,
        beliefImpact: r.beliefImpact || {},
        strainDelta: typeof r.strainDelta === "number" ? r.strainDelta : 0,
        tone: r.tone || "mixed",
        reductionType: k,
        copingCaveat:
          typeof r.copingCaveat === "string" && r.copingCaveat.trim()
            ? r.copingCaveat.trim()
            : ""
      };
    });

  return {
    id: s.id || `scenario-${idx + 1}`,
    title,
    belief: s.belief,
    beliefId: s.beliefId || null,
    beliefFocusLabel: s.beliefFocusLabel || null,
    innerVoices: s.innerVoices || [],
    situation: situationText,
    decision: decisionText,
    decisionAction: s.decisionAction || null,
    // Primary choices for the decision screen.
    // If the content generator provides `primaryChoices`, use it; otherwise derive from decisionAction.
    primaryChoices: Array.isArray(s.primaryChoices)
      ? s.primaryChoices
      : derivePrimaryChoicesFromDecisionAction(s),
    episodeLabel: s.episodeLabel || `Scenario ${idx + 1}`,
    contextTags: s.contextTags || [],
    systemFeedback: s.systemFeedback || null,
    reflectionPrompts: Array.isArray(s.reflectionPrompts) ? s.reflectionPrompts : [],
    rationalizations
  };
}

const decisionMoments = Array.isArray(window.SCENARIOS)
  ? window.SCENARIOS.filter(function (s) {
      return s && typeof s === "object" && s.id;
    }).map(toDecisionMoment)
  : [];

if (!decisionMoments.length && typeof console !== "undefined" && console.warn) {
  console.warn(
    "GameLoop: No scenarios loaded. Ensure content/scenarios.js is included before game/gameLoop.js."
  );
}

class GameLoop {
  constructor({ persona, beliefSystem, strainSystem, dissonanceEngine, initialScenarioIndex }) {
    this.persona = persona;
    this.beliefSystem =
      beliefSystem instanceof window.BeliefSystem
        ? beliefSystem
        : new window.BeliefSystem(persona);
    this.strainSystem =
      strainSystem instanceof window.StrainSystem
        ? strainSystem
        : new window.StrainSystem(persona);
    this.dissonanceEngine =
      dissonanceEngine instanceof window.DissonanceEngine
        ? dissonanceEngine
        : new window.DissonanceEngine();

    this.currentIndex = 0;
    if (
      typeof initialScenarioIndex === "number" &&
      initialScenarioIndex >= 0 &&
      initialScenarioIndex < decisionMoments.length
    ) {
      this.currentIndex = initialScenarioIndex;
    }
    this.currentDecision =
      decisionMoments.length > 0 ? decisionMoments[this.currentIndex] : null;
    this.selectedPrimaryChoiceId = null;
    this.lastPrimaryChoice = null;
    this._decisionStrainDelta = 0;
    this._decisionDissonanceStrainDelta = 0;
    this.selectedRationalization = null;
    this.lastDissonance = null;
    this.lastReduction = null;
    this._episodeSnapshot = null;
    this.subscribers = [];
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  emit(event) {
    this.subscribers.forEach((fn) => fn(event));
  }

  getDecisionMoments() {
    return decisionMoments;
  }

  getCurrentPersona() {
    return this.persona;
  }

  getCurrentDecisionMoment() {
    return this.currentDecision;
  }

  getAvailablePrimaryChoices() {
    const decision = this.currentDecision;
    if (!decision) return [];
    if (Array.isArray(decision.primaryChoices) && decision.primaryChoices.length) {
      return decision.primaryChoices;
    }
    // Backward compatibility: derive from decisionAction if primaryChoices weren't authored.
    if (decision.decisionAction && decision.beliefId) {
      return derivePrimaryChoicesFromDecisionAction({
        decisionAction: decision.decisionAction,
        beliefId: decision.beliefId
      });
    }
    return [];
  }

  getSelectedPrimaryChoiceId() {
    return this.selectedPrimaryChoiceId;
  }

  selectPrimaryChoice(choiceId) {
    this.selectedPrimaryChoiceId = choiceId;
  }

  captureEpisodeSnapshot() {
    const strain = this.strainSystem.getStrain();
    const beliefs = {};
    this.beliefSystem.listBeliefs().forEach(function (b) {
      beliefs[b.id] = typeof b.strength === "number" ? b.strength : 0;
    });
    return { strain: strain, beliefs: beliefs };
  }

  computeEpisodeDeltas() {
    const snap = this._episodeSnapshot;
    if (!snap) {
      return { episodeStrainDelta: 0, episodeBeliefChanges: [] };
    }
    const strainAfter = this.strainSystem.getStrain();
    const episodeStrainDelta = strainAfter - snap.strain;
    const episodeBeliefChanges = [];
    this.beliefSystem.listBeliefs().forEach(function (b) {
      const before = snap.beliefs[b.id];
      if (typeof before !== "number") return;
      const after = typeof b.strength === "number" ? b.strength : 0;
      if (Math.round(before) !== Math.round(after)) {
        episodeBeliefChanges.push({
          beliefId: b.id,
          beforeStrength: before,
          afterStrength: after
        });
      }
    });
    return { episodeStrainDelta: episodeStrainDelta, episodeBeliefChanges: episodeBeliefChanges };
  }

  persistState() {
    if (!window.GamePersistence || !window.GamePersistence.save) return;
    var snap = window.GamePersistence.snapshotFromPersona(this.persona);
    window.GamePersistence.save(snap);
  }

  commitDecision() {
    const decision = this.currentDecision;
    if (!decision) return null;

    this._episodeSnapshot = this.captureEpisodeSnapshot();

    const choices = this.getAvailablePrimaryChoices();
    var chosenPrimary = null;
    if (this.selectedPrimaryChoiceId) {
      chosenPrimary = choices.find(function (c) {
        return c && c.id === this.selectedPrimaryChoiceId;
      }, this);
    }
    chosenPrimary = chosenPrimary || (choices.length ? choices[0] : null);
    if (!chosenPrimary) return null;

    const chosenAction = {
      decisionId: decision.id,
      optionId: chosenPrimary.id,
      label: chosenPrimary.label || "Decision",
      actionTags: chosenPrimary.actionTags || [],
      beliefImpact: chosenPrimary.beliefImpact || {},
      tone: chosenPrimary.tone || "mixed",
      choiceCategory: "primary",
      strategyType: "primary"
    };

    // Conflict detection should use the *actual chosen action*.
    // Evaluate dissonance BEFORE applying belief deltas from the action.
    const dissonance = this.dissonanceEngine.evaluateDissonance(
      this.persona,
      chosenAction
    );

    // Apply belief and base strain effects from the chosen action.
    Object.entries(chosenPrimary.beliefImpact || {}).forEach(([beliefId, delta]) => {
      this.beliefSystem.applyBeliefDelta(beliefId, delta * 100 * 0.2, delta * 0.05);
    });

    this.strainSystem.applyDelta(
      typeof chosenPrimary.strainDelta === "number" ? chosenPrimary.strainDelta : 0
    );

    if (dissonance.triggered) {
      this.strainSystem.applyDelta(dissonance.strainDelta);
      this.lastDissonance = dissonance;
    } else {
      this.lastDissonance = { triggered: false, conflicts: [], strainDelta: 0 };
    }
    this.lastPrimaryChoice = chosenPrimary;
    this._decisionDissonanceStrainDelta = dissonance.triggered ? dissonance.strainDelta : 0;
    this._decisionStrainDelta = this.strainSystem.getStrain() - this._episodeSnapshot.strain;
    this.selectedRationalization = null;

    var episode = this.computeEpisodeDeltas();

    const effect = {
      type: "DecisionCommitted",
      decision,
      chosenAction,
      primaryChoice: chosenPrimary,
      dissonance: this.lastDissonance,
      decisionStrainDelta: this._decisionStrainDelta,
      episodeStrainDelta: episode.episodeStrainDelta,
      episodeBeliefChanges: episode.episodeBeliefChanges,
      persona: this.persona
    };
    this.emit(effect);
    return effect;
  }

  getAvailableRationalizations() {
    const decision = this.currentDecision;
    if (!decision) return [];
    const list = Array.isArray(decision.rationalizations) ? decision.rationalizations : [];
    return list.filter((r) => r && r.explanation);
  }

  /** Strain added by this episode’s belief–action dissonance (same units as strain). */
  getDecisionDissonanceStrainDelta() {
    return typeof this._decisionDissonanceStrainDelta === "number"
      ? this._decisionDissonanceStrainDelta
      : 0;
  }

  applyRationalization(rationalizationId) {
    const decision = this.currentDecision;
    if (!decision) return null;
    const rationalization = (decision.rationalizations || []).find((r) => r.id === rationalizationId);
    if (!rationalization) return null;

    const strainBefore = this.strainSystem.getStrain();
    const beliefChanges = [];
    var strainApply = 0;
    if (rationalization.reductionType === "justification") {
      var diss = this.getDecisionDissonanceStrainDelta();
      if (diss > 0) {
        strainApply = -diss;
      } else {
        strainApply =
          typeof rationalization.strainDelta === "number" ? rationalization.strainDelta : -5;
      }
    } else {
      strainApply = typeof rationalization.strainDelta === "number" ? rationalization.strainDelta : 0;
    }
    this.strainSystem.applyDelta(strainApply);

    Object.entries(rationalization.beliefImpact || {}).forEach(([beliefId, delta]) => {
      const before = this.beliefSystem.getBelief(beliefId);
      const beforeStrength = before ? before.strength : null;
      const updated = this.beliefSystem.applyBeliefDelta(beliefId, delta * 100 * 0.2, delta * 0.05);
      const afterStrength = updated ? updated.strength : null;
      beliefChanges.push({ beliefId, beforeStrength, afterStrength });
    });

    const strainAfter = this.strainSystem.getStrain();
    this.lastReduction = {
      rationalization,
      strainBefore,
      strainAfter
    };
    this.selectedRationalization = rationalization;

    if (rationalization.reductionType === "justification") {
      this.persona.justificationUses =
        (typeof this.persona.justificationUses === "number"
          ? this.persona.justificationUses
          : 0) + 1;
    }

    var ih = this.persona.innerVoiceHistory;
    if (!ih || typeof ih !== "object") {
      this.persona.innerVoiceHistory = ih = {
        consecutiveJustifications: 0,
        beliefChanges: 0,
        behaviorChanges: 0,
        lastSceneVoiceWeights: { honesty: 1, security: 1, social: 1, attachment: 1 }
      };
    }
    var rt = rationalization.reductionType;
    if (rt === "justification") {
      ih.consecutiveJustifications =
        (typeof ih.consecutiveJustifications === "number" ? ih.consecutiveJustifications : 0) + 1;
    } else {
      ih.consecutiveJustifications = 0;
    }
    if (rt === "belief_change") {
      ih.beliefChanges = (typeof ih.beliefChanges === "number" ? ih.beliefChanges : 0) + 1;
    }
    if (rt === "behavior_change") {
      ih.behaviorChanges = (typeof ih.behaviorChanges === "number" ? ih.behaviorChanges : 0) + 1;
    }

    var episode = this.computeEpisodeDeltas();

    const effect = {
      type: "RationalizationApplied",
      rationalization,
      strainBefore,
      strainAfter,
      beliefChanges,
      episodeStrainDelta: episode.episodeStrainDelta,
      episodeBeliefChanges: episode.episodeBeliefChanges,
      justificationUsesTotal: this.persona.justificationUses || 0,
      primaryChoice: this.lastPrimaryChoice,
      decisionStrainDelta: this._decisionStrainDelta,
      decisionDissonanceStrainDelta: this._decisionDissonanceStrainDelta,
      persona: this.persona,
      decision
    };
    this.persistState();
    this.emit(effect);
    return effect;
  }

  getLastChoiceCategory() {
    if (!this.selectedRationalization) return null;
    return this.selectedRationalization.reductionType || null;
  }

  /** Persist last inner-voice weight snapshot after LLM/static generation (see inner-voice-agent-system.md §5). */
  recordInnerVoiceWeights(weights) {
    var ih = this.persona.innerVoiceHistory;
    if (!ih || typeof ih !== "object") return;
    if (!ih.lastSceneVoiceWeights) {
      ih.lastSceneVoiceWeights = { honesty: 1, security: 1, social: 1, attachment: 1 };
    }
    var w = weights || {};
    if (typeof w.honesty === "number") ih.lastSceneVoiceWeights.honesty = w.honesty;
    if (typeof w.security === "number") ih.lastSceneVoiceWeights.security = w.security;
    if (typeof w.social === "number") ih.lastSceneVoiceWeights.social = w.social;
    if (typeof w.attachment === "number") ih.lastSceneVoiceWeights.attachment = w.attachment;
    this.persistState();
  }

  goToNextDecision() {
    if (!this.persona.voiceContextCarryover || typeof this.persona.voiceContextCarryover !== "object") {
      this.persona.voiceContextCarryover = { primaryLabel: "", reductionType: null };
    }
    this.persona.voiceContextCarryover.primaryLabel =
      this.lastPrimaryChoice && this.lastPrimaryChoice.label
        ? String(this.lastPrimaryChoice.label).slice(0, 120)
        : "";
    this.persona.voiceContextCarryover.reductionType =
      this.selectedRationalization && this.selectedRationalization.reductionType
        ? this.selectedRationalization.reductionType
        : null;

    if (this.currentIndex < decisionMoments.length - 1) {
      this.currentIndex += 1;
      this.currentDecision = decisionMoments[this.currentIndex];
      this.selectedRationalization = null;
      this.lastDissonance = null;
      this.lastReduction = null;
      this.selectedPrimaryChoiceId = null;
      this.lastPrimaryChoice = null;
      this._episodeSnapshot = null;
      this._decisionStrainDelta = 0;
      this._decisionDissonanceStrainDelta = 0;
    } else {
      this.strainSystem.applyDecay();
    }

    const effect = {
      type: "StateUpdated",
      persona: this.persona,
      currentDecision: this.currentDecision,
      index: this.currentIndex
    };
    this.persistState();
    this.emit(effect);
    return effect;
  }
}

window.GameLoop = GameLoop;

