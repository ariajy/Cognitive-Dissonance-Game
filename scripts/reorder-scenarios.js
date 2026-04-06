const fs = require("fs");
const path = require("path");

const scenariosPath = path.join(__dirname, "..", "content", "scenarios.js");
const s = fs.readFileSync(scenariosPath, "utf8");

const open = s.indexOf("const scenarios = [");
const close = s.indexOf("\n  ];", open);
if (open < 0 || close < 0) throw new Error("scenarios array markers not found");

const before = s.slice(0, open);
// Skip the closing `];` we embed in `rebuilt` so we don’t duplicate it.
const after = s.slice(close + "\n  ];".length);

const innerBody = s.slice(open + "const scenarios = [".length, close);

function extractObject(src, afterId) {
  const key = 'id: "' + afterId + '"';
  let i = src.indexOf(key);
  if (i < 0) throw new Error("id not found: " + afterId);
  i = src.lastIndexOf("{", i);
  let depth = 0;
  let j = i;
  for (; j < src.length; j++) {
    const c = src[j];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        j++;
        while (src[j] === " " || src[j] === "\n" || src[j] === "\r") j++;
        if (src[j] === ",") j++;
        return { obj: src.slice(i, j) };
      }
    }
  }
  throw new Error("unclosed brace for " + afterId);
}

const ids = [
  "missed-deadline",
  "helping-hand",
  "white-lie",
  "diet-promise",
  "identity-clash",
  "intimate-relationship",
  "intimate-relationship-phone",
  "intimate-relationship-money",
  "intimate-relationship-isolation",
  "intimate-relationship-apology"
];

const extracted = ids.map((id) => extractObject(innerBody, id));

let rebuilt = "const scenarios = [";
for (let n = 0; n < ids.length; n++) {
  let block = extracted[n].obj.replace(
    /episodeLabel:\s*"Scenario \d+"/,
    'episodeLabel: "Scenario ' + (n + 1) + '"'
  );
  rebuilt += "\n    " + block.trim();
  if (n < ids.length - 1) rebuilt += ",";
}
rebuilt += "\n  ];";

fs.writeFileSync(scenariosPath, before + rebuilt + after);
console.log("OK: intimate scenarios → 6–10, others → 1–5.");
