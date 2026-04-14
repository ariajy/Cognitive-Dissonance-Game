// Netlify Function: POST /api/inner-voices
// Proxies OpenAI with server-side key; client sends only whitelisted context fields.

var ALLOWED_IDS = ["honesty", "security", "social", "attachment"];

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  var key = process.env.OPENAI_API_KEY;
  if (!key || typeof key !== "string" || !key.trim()) {
    return json(501, {
      error: "OPENAI_API_KEY is not configured.",
      voices: null
    });
  }

  var body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "Invalid JSON body." });
  }

  var ctx = body && body.context && typeof body.context === "object" ? body.context : {};
  var safe = sanitizeContext(ctx);

  var model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  var system =
    "You output ONLY valid JSON (no markdown). Shape: {\"voices\":[{\"id\":\"honesty|security|social|attachment\",\"text\":\"...\",\"tone\":\"brief adjective\",\"weight\":0.5}]}. " +
    "Exactly four objects, one per id, all four ids required. Each text: one sentence, first person inner voice, max 25 English words. " +
    "Do not use the word wrong. Do not moralize. Match the given volume hint in tone.";

  var user =
    "Generate inner monologue lines for these four voices (Honesty, Security, Social pressure, Attachment).\n\n" +
    JSON.stringify(safe);

  try {
    var res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key.trim(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      console.error("[inner-voices] OpenAI HTTP", res.status, errText.slice(0, 200));
      return json(502, { error: "Upstream LLM error.", voices: null });
    }

    var completion = await res.json();
    var content =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content
        : "";

    var parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("[inner-voices] JSON parse failed", e && e.message);
      return json(502, { error: "Invalid LLM JSON.", voices: null });
    }

    var voices = normalizeVoices(parsed);
    if (!voices) {
      return json(502, { error: "Missing or invalid voices array.", voices: null });
    }

    return json(200, { voices: voices });
  } catch (e) {
    console.error("[inner-voices]", e && e.message);
    return json(502, { error: "Request failed.", voices: null });
  }
};

function sanitizeContext(ctx) {
  function sstr(v, max) {
    if (typeof v !== "string") return "";
    return v.trim().slice(0, max);
  }
  function snum(v, min, max) {
    var n = typeof v === "number" ? v : parseFloat(v);
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  var hints = ctx.volumeHints && typeof ctx.volumeHints === "object" ? ctx.volumeHints : {};
  var out = {
    scenarioTitle: sstr(ctx.scenarioTitle, 120),
    scenarioSituation: sstr(ctx.scenarioSituation, 900),
    focalBeliefName: sstr(ctx.focalBeliefName, 200),
    beliefStrength: snum(ctx.beliefStrength, 0, 100),
    strain: snum(ctx.strain, 0, 100),
    strainLabel: sstr(ctx.strainLabel, 20),
    justificationUses: snum(ctx.justificationUses, 0, 999),
    consecutiveJustifications: snum(ctx.consecutiveJustifications, 0, 999),
    beliefChanges: snum(ctx.beliefChanges, 0, 999),
    behaviorChanges: snum(ctx.behaviorChanges, 0, 999),
    lastChoiceSummary: sstr(ctx.lastChoiceSummary, 200),
    lastReductionType: ctx.lastReductionType ? sstr(String(ctx.lastReductionType), 40) : null,
    volumeHints: {
      honesty: sstr(hints.honesty, 80),
      security: sstr(hints.security, 80),
      social: sstr(hints.social, 80),
      attachment: sstr(hints.attachment, 80)
    },
    innerVoicesSeed: Array.isArray(ctx.innerVoicesSeed)
      ? ctx.innerVoicesSeed.slice(0, 6).map(function (x) {
          return sstr(String(x), 200);
        })
      : []
  };
  return out;
}

function normalizeVoices(parsed) {
  var raw = parsed && parsed.voices;
  if (!Array.isArray(raw)) return null;
  var out = [];
  var seen = {};
  raw.forEach(function (v) {
    if (!v || typeof v !== "object") return;
    var id = typeof v.id === "string" ? v.id.toLowerCase().trim() : "";
    if (ALLOWED_IDS.indexOf(id) < 0 || seen[id]) return;
    seen[id] = true;
    var text = typeof v.text === "string" ? v.text.trim().slice(0, 400) : "";
    var tone = typeof v.tone === "string" ? v.tone.trim().slice(0, 80) : "";
    var weight = typeof v.weight === "number" && !Number.isNaN(v.weight) ? v.weight : 0.5;
    out.push({ id: id, text: text, tone: tone, weight: weight });
  });
  if (out.length !== 4) return null;
  return out;
}

function json(code, obj) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(obj || {})
  };
}
