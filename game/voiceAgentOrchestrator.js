// Fetches dynamic inner voices from Netlify /api/inner-voices or falls back to static lines.
(function () {
  var TIMEOUT_MS = 3000;
  var ENDPOINT = "/api/inner-voices";
  var ORDER = ["honesty", "security", "social", "attachment"];

  function sortByWeightDescending(items, weights) {
    return items.slice().sort(function (a, b) {
      var wa = weights[a.id] != null ? weights[a.id] : 0;
      var wb = weights[b.id] != null ? weights[b.id] : 0;
      return wb - wa;
    });
  }

  function staticFallbackLines(moment) {
    var lines = Array.isArray(moment && moment.innerVoices) ? moment.innerVoices : [];
    return ORDER.map(function (id, idx) {
      return {
        id: id,
        text: typeof lines[idx] === "string" ? lines[idx] : "",
        tone: "",
        weight: 0
      };
    });
  }

  /**
   * @param {object} opts
   * @param {object} opts.moment
   * @param {object} opts.persona
   * @param {number} opts.strain
   * @param {object} opts.gameLoop - for recordInnerVoiceWeights
   * @returns {Promise<{ lines: Array<{id,text,tone,weight}>, source: string }>}
   */
  function generate(opts) {
    var moment = opts.moment;
    var persona = opts.persona;
    var strain = typeof opts.strain === "number" ? opts.strain : 0;
    var loop = opts.gameLoop;

    if (!window.VoiceContextBuilder || typeof window.VoiceContextBuilder.build !== "function") {
      return Promise.resolve({
        lines: staticFallbackLines(moment),
        source: "static-no-builder"
      });
    }

    var built = window.VoiceContextBuilder.build(moment, persona, strain);
    var weights = built.weights;
    var apiContext = built.apiContext;

    if (loop && typeof loop.recordInnerVoiceWeights === "function") {
      loop.recordInnerVoiceWeights(weights);
    }

    var protocol =
      typeof window !== "undefined" && window.location && window.location.protocol === "file:";
    if (protocol) {
      return Promise.resolve({
        lines: staticFallbackLines(moment),
        source: "static-file-protocol"
      });
    }

    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = null;
    if (controller) {
      timer = window.setTimeout(function () {
        try {
          controller.abort();
        } catch (e) {}
      }, TIMEOUT_MS);
    }

    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: apiContext }),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (timer) window.clearTimeout(timer);
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.voices)) {
          return {
            lines: staticFallbackLines(moment),
            source: "static-bad-response"
          };
        }
        var byId = {};
        data.voices.forEach(function (v) {
          if (v && v.id) byId[String(v.id).toLowerCase()] = v;
        });
        var merged = ORDER.map(function (id) {
          var v = byId[id];
          var text = v && typeof v.text === "string" ? v.text.trim() : "";
          var lines = moment.innerVoices || [];
          var idx = ORDER.indexOf(id);
          if (!text && typeof lines[idx] === "string") text = lines[idx];
          return {
            id: id,
            text: text,
            tone: v && v.tone ? String(v.tone) : "",
            weight: typeof (v && v.weight) === "number" ? v.weight : weights[id] || 0
          };
        });
        return {
          lines: sortByWeightDescending(merged, weights),
          source: "llm"
        };
      })
      .catch(function () {
        if (timer) window.clearTimeout(timer);
        return {
          lines: staticFallbackLines(moment),
          source: "static-error"
        };
      });
  }

  window.VoiceAgentOrchestrator = {
    generate: generate,
    ORDER: ORDER
  };
})();
