// Netlify Function: POST /api/registrations
// Stores nothing locally; forwards validated payload to a configured webhook.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "Invalid JSON body." });
  }

  var fullName = readTrimmed(data.fullName, 80);
  var studentId = readTrimmed(data.studentId, 40);
  var email = readTrimmed(data.email, 120).toLowerCase();
  var consent = !!data.consent;

  if (!fullName) return json(400, { error: "fullName is required." });
  if (!studentId) return json(400, { error: "studentId is required." });
  if (!isEmail(email)) return json(400, { error: "Valid email is required." });
  if (!consent) return json(400, { error: "Consent is required." });

  var payload = {
    fullName: fullName,
    studentId: studentId,
    email: email,
    consent: true,
    source: "dissonant-choices",
    submittedAt: new Date().toISOString()
  };

  var webhook = process.env.REGISTRATION_WEBHOOK_URL;
  if (!webhook) {
    return json(503, {
      error:
        "Registration backend is not configured. Set REGISTRATION_WEBHOOK_URL in Netlify environment variables."
    });
  }

  try {
    var upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!upstream.ok) {
      return json(502, {
        error: "Registration upstream rejected the request."
      });
    }
  } catch (e) {
    return json(502, {
      error: "Could not reach registration upstream."
    });
  }

  return json(201, {
    ok: true,
    registrationId: buildRegistrationId(studentId),
    message: "Registration submitted."
  });
};

function readTrimmed(v, maxLen) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function buildRegistrationId(studentId) {
  var safe = (studentId || "student").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 18) || "student";
  return "reg_" + safe + "_" + Date.now().toString(36);
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

