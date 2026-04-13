// Netlify Function: POST /api/registrations
// Validates input and inserts one document into MongoDB (e.g. MongoDB Atlas).
//
// Netlify environment variables:
//   MONGODB_URI          — required, Atlas connection string (use env var, never commit)
//   MONGODB_DB           — optional, default "learnFromDissonance"
//   MONGODB_COLLECTION   — optional, default "registrations"
//
// Atlas: Network Access → allow 0.0.0.0/0 (or Netlify’s egress) so serverless can connect.

const { MongoClient } = require("mongodb");

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
  var email = readTrimmed(data.email, 120).toLowerCase();
  var consent = !!data.consent;

  if (!fullName) return json(400, { error: "fullName is required." });
  if (!isEmail(email)) return json(400, { error: "Valid email is required." });
  if (!consent) return json(400, { error: "Consent is required." });

  var uri = process.env.MONGODB_URI;
  if (!uri || typeof uri !== "string" || !uri.trim()) {
    return json(503, {
      error:
        "Database not configured. Set MONGODB_URI in Netlify environment variables."
    });
  }
  uri = uri.trim();
  if (/<password>/i.test(uri) || /%3Cpassword%3E/i.test(uri)) {
    return json(503, {
      error:
        "MONGODB_URI still contains the placeholder <password>. Replace it with your Atlas database user password.",
      hint:
        "If the password contains @ : / # ? use URL-encoding (e.g. @ → %40). Copy the string from Atlas → Connect → Drivers."
    });
  }

  var dbName = readEnvDefault(process.env.MONGODB_DB, "learnFromDissonance");
  var collName = readEnvDefault(process.env.MONGODB_COLLECTION, "registrations");

  var doc = {
    fullName: fullName,
    email: email,
    consent: true,
    source: "learn-from-dissonance",
    submittedAt: new Date().toISOString(),
    createdAt: new Date()
  };

  var client;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 12000 });
    await client.connect();
    var coll = client.db(dbName).collection(collName);
    var result = await coll.insertOne(doc);
    var registrationId =
      result && result.insertedId ? String(result.insertedId) : buildRegistrationId(email);

    return json(201, {
      ok: true,
      registrationId: registrationId,
      message: "Registration submitted."
    });
  } catch (e) {
    var code = e && e.code ? String(e.code) : "";
    var em = e && e.message ? String(e.message) : "";
    console.error("[registrations] MongoDB error", { code: code, message: em });

    var errMsg = "Could not save registration.";
    var extraHint = "";

    if (/authentication failed|bad auth|invalid.*password|SCRAM/i.test(em)) {
      errMsg = "MongoDB rejected the username or password.";
      extraHint =
        "In Netlify, edit MONGODB_URI: use the Database User from Atlas (Database Access), URL-encode special characters in the password, and do not leave <password> in the string.";
    } else if (/ENOTFOUND|getaddrinfo|ECONNREFUSED|querySrv|SSL|TLS|timed out|Server selection timed out/i.test(em)) {
      errMsg = "Cannot reach MongoDB (network or URI hostname wrong).";
      extraHint =
        "Atlas → Network Access must include 0.0.0.0/0. Confirm the cluster hostname in MONGODB_URI matches Atlas → Connect → Drivers.";
    }

    return json(502, { error: errMsg, hint: extraHint || undefined });
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (_) {}
    }
  }
};

function readEnvDefault(v, fallback) {
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function readTrimmed(v, maxLen) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function buildRegistrationId(email) {
  var local = typeof email === "string" && email.indexOf("@") > 0 ? email.split("@")[0] : "";
  var safe = (local || "user").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 18) || "user";
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
