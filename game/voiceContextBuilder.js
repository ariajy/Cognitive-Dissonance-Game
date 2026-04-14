// Builds inner-voice agent weights and LLM-safe context (see docs/inner-voice-agent-system.md).
// Classic global script for file:// compatibility.

(function () {
  var VOICE_IDS = ["honesty", "security", "social", "attachment"];

  function focalStrength(persona, beliefId) {
    if (!persona || !persona.beliefs || !beliefId) return 75;
    var b = persona.beliefs.find(function (x) {
      return x && x.id === beliefId;
    });
    if (!b) return 75;
    return typeof b.strength === "number" ? b.strength : 75;
  }

  function isIntimateScene(moment) {
    var tags = (moment && moment.contextTags) || [];
    if (tags.indexOf("intimate-relationship") >= 0) return true;
    if (moment && moment.beliefId === "safetyInLove") return true;
    var id = moment && moment.id ? String(moment.id) : "";
    return id.indexOf("intimate") >= 0;
  }

  function strainLabel(strain) {
    var s = typeof strain === "number" ? strain : 0;
    if (s < 34) return "Low";
    if (s < 67) return "Medium";
    return "High";
  }

  function weightToVolumeLabel(w) {
    if (w >= 0.85) return "clear and assertive";
    if (w >= 0.55) return "present but uncertain";
    if (w >= 0.35) return "barely audible";
    return "aggressive and insistent";
  }

  /**
   * @param {object} moment - current decision moment
   * @param {object} persona
   * @param {number} strain - 0-100
   * @returns {{ weights: object, volumeLabels: object, apiContext: object }}
   */
  function build(moment, persona, strain) {
    var beliefId = moment && moment.beliefId ? moment.beliefId : null;
    var focal = focalStrength(persona, beliefId);
    var focalNorm = focal / 100;
    var invFocal = (100 - focal) / 100;

    var ju =
      persona && typeof persona.justificationUses === "number" ? persona.justificationUses : 0;
    var ih = persona && persona.innerVoiceHistory ? persona.innerVoiceHistory : {};
    var consec =
      typeof ih.consecutiveJustifications === "number" ? ih.consecutiveJustifications : 0;
    var beliefChanges = typeof ih.beliefChanges === "number" ? ih.beliefChanges : 0;

    var attachFactor = isIntimateScene(moment) ? 1 : 0.65;

    var honHist = Math.max(0.3, 1.0 - ju * 0.15);
    var modH = focalNorm * honHist * (strain > 70 ? 0.7 : 1.0);

    var secHist = Math.min(1.8, 1.0 + consec * 0.2);
    var modS = invFocal * secHist * (strain > 50 ? 1.3 : 1.0);

    var modSo = Math.min(1.5, 1.0 + ju * 0.1);

    var attHist = Math.min(1.6, 1.0 + beliefChanges * 0.15);
    var modA = attachFactor * attHist * (strain > 70 ? 1.2 : 1.0);

    var weights = {
      honesty: modH,
      security: modS,
      social: modSo,
      attachment: modA
    };

    var volumeLabels = {};
    VOICE_IDS.forEach(function (id) {
      volumeLabels[id] = weightToVolumeLabel(weights[id]);
    });

    var carry = persona && persona.voiceContextCarryover ? persona.voiceContextCarryover : {};
    var lastChoice =
      carry.primaryLabel && String(carry.primaryLabel).trim()
        ? String(carry.primaryLabel).trim()
        : "(first scene — no prior action in this run)";

    var apiContext = {
      scenarioTitle: (moment && moment.title) || "Scene",
      scenarioSituation: (moment && moment.situation) || "",
      beliefId: beliefId || "",
      focalBeliefName: (moment && moment.belief) || "",
      beliefStrength: Math.round(focal),
      strain: Math.round(typeof strain === "number" ? strain : 0),
      strainLabel: strainLabel(strain),
      justificationUses: ju,
      consecutiveJustifications: consec,
      beliefChanges: beliefChanges,
      behaviorChanges:
        typeof ih.behaviorChanges === "number" ? ih.behaviorChanges : 0,
      lastChoiceSummary: lastChoice,
      lastReductionType: carry.reductionType || null,
      innerVoicesSeed: Array.isArray(moment && moment.innerVoices) ? moment.innerVoices : [],
      volumeHints: volumeLabels,
      weights: weights
    };

    return {
      weights: weights,
      volumeLabels: volumeLabels,
      apiContext: apiContext
    };
  }

  window.VoiceContextBuilder = {
    VOICE_IDS: VOICE_IDS,
    build: build,
    strainLabel: strainLabel
  };
})();
