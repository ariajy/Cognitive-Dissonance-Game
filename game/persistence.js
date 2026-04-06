// Minimal cross-session state (file:// friendly when localStorage exists).
// Persists: belief strengths, justification habit count, identity/registration flags.
// Strain is NOT persisted — each visit starts at Scenario 1 with default baseline tension (see beliefSystem createDefaultPersona).
// Scenario progress is NOT saved — each visit starts at Scenario 1 (see index.html + GameLoop).
(function () {
  var STORAGE_KEY = "dissonantChoices_v1";

  function snapshotFromPersona(persona) {
    var beliefs = {};
    if (persona && persona.beliefs) {
      persona.beliefs.forEach(function (b) {
        beliefs[b.id] = {
          strength: typeof b.strength === "number" ? b.strength : 0,
          stability: typeof b.stability === "number" ? b.stability : 0.8
        };
      });
    }
    // `playerName` in JSON is always the persisted form of `persona.name` (same trim/slice rules).
    return {
      v: 3,
      justificationUses:
        persona && typeof persona.justificationUses === "number"
          ? persona.justificationUses
          : 0,
      beliefs: beliefs,
      playerName:
        persona && typeof persona.name === "string" ? persona.name.trim().slice(0, 40) : "",
      playerPriorityBeliefIds: Array.isArray(persona.playerPriorityBeliefIds)
        ? persona.playerPriorityBeliefIds.slice(0, 3)
        : [],
      onboardingDone: !!(persona && persona.onboardingDone),
      registrationDone: !!(persona && persona.registrationDone),
      registrationRef:
        persona && typeof persona.registrationRef === "string"
          ? persona.registrationRef.slice(0, 120)
          : ""
    };
  }

  function applyToPersona(persona, data) {
    if (!persona || !data) return;
    // Saves before v3 had no onboarding screen — keep returning players on Start.
    if (typeof data.v === "number" && data.v < 3) {
      persona.onboardingDone = true;
      if (!persona.name || !String(persona.name).trim()) {
        // Legacy saves had no stored name; do not inject a fixed protagonist name.
        persona.name = "";
      }
    }
    if (typeof data.justificationUses === "number") {
      persona.justificationUses = data.justificationUses;
    }
    if (data.beliefs && persona.beliefs) {
      persona.beliefs.forEach(function (b) {
        var snap = data.beliefs[b.id];
        if (!snap) return;
        if (typeof snap.strength === "number") {
          b.strength = Math.min(100, Math.max(0, snap.strength));
        }
        if (typeof snap.stability === "number") {
          b.stability = Math.min(1, Math.max(0, snap.stability));
        }
        b.lastUpdated = Date.now();
      });
    }
    // Restore identity: keep `persona.name` and save payload `playerName` in lockstep.
    if (typeof data.playerName === "string" && data.playerName.trim()) {
      persona.name = data.playerName.trim().slice(0, 40);
    }
    if (Array.isArray(data.playerPriorityBeliefIds) && data.playerPriorityBeliefIds.length === 3) {
      persona.playerPriorityBeliefIds = data.playerPriorityBeliefIds.slice(0, 3);
    }
    if (data.onboardingDone === true) {
      persona.onboardingDone = true;
    }
    if (data.registrationDone === true) {
      persona.registrationDone = true;
    } else if (
      typeof data.registrationDone !== "boolean" &&
      data.onboardingDone === true
    ) {
      // Backward compatibility: older saves had no explicit registration flag.
      persona.registrationDone = true;
    }
    if (typeof data.registrationRef === "string" && data.registrationRef.trim()) {
      persona.registrationRef = data.registrationRef.trim().slice(0, 120);
    }
  }

  function load() {
    try {
      if (typeof localStorage === "undefined") return null;
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function save(data) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Quota or private mode — ignore
    }
  }

  window.GamePersistence = {
    STORAGE_KEY: STORAGE_KEY,
    load: load,
    save: save,
    snapshotFromPersona: snapshotFromPersona,
    applyToPersona: applyToPersona
  };
})();
