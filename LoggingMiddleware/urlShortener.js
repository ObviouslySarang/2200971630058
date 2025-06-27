const express = require("express");
const { Log } = require("./logger");
const crypto = require("crypto");
const app = express();
app.use(express.json());

const urls = {};
const stats = {};

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,16}$/.test(code);
}

function makeShortcode() {
  return crypto.randomBytes(4).toString("hex");
}

app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url || !isValidUrl(url)) {
    Log("backend", "error", "handler", "Invalid URL input");
    return res.status(400).json({ error: "Invalid URL" });
  }
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      Log("backend", "error", "handler", "Invalid shortcode format");
      return res.status(400).json({ error: "Invalid shortcode format" });
    }
    if (urls[code]) {
      Log("backend", "error", "handler", "Shortcode collision");
      return res.status(409).json({ error: "Shortcode already exists" });
    }
  } else {
    do {
      code = makeShortcode();
    } while (urls[code]);
  }
  const now = new Date();
  const mins = parseInt(validity) || 30;
  const expiry = new Date(now.getTime() + mins * 60000);
  urls[code] = {
    url,
    created: now,
    expiry,
  };
  stats[code] = { clicks: 0, clicksData: [] };
  Log("backend", "info", "controller", `Short URL created: ${code}`);
  res.status(201).json({
    shortLink: `${req.protocol}://${req.get("host")}/${code}`,
    expiry: expiry.toISOString(),
  });
});

app.get("/:code", (req, res) => {
  const code = req.params.code;
  const entry = urls[code];
  if (!entry) {
    Log("backend", "warn", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date() > entry.expiry) {
    Log("backend", "warn", "handler", "Shortcode expired");
    return res.status(410).json({ error: "Shortcode expired" });
  }
  stats[code].clicks++;
  stats[code].clicksData.push({
    timestamp: new Date().toISOString(),
    referrer: req.get("referer") || null,
    geo: req.ip || null,
  });
  Log("backend", "info", "service", `Shortcode ${code} clicked`);
  res.redirect(entry.url);
});

app.get("/shorturls/:code", (req, res) => {
  const code = req.params.code;
  const entry = urls[code];
  if (!entry) {
    Log("backend", "warn", "handler", "Shortcode not found for stats");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  const s = stats[code];
  res.json({
    originalUrl: entry.url,
    created: entry.created,
    expiry: entry.expiry,
    totalClicks: s.clicks,
    clicks: s.clicksData,
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  Log("backend", "info", "route", `URL Shortener running on ${PORT}`);
});
