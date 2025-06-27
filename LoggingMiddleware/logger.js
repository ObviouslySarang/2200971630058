// logger.js
const axios = require("axios");

const stacks = ["backend", "frontend"];
const levels = ["debug", "info", "warn", "fatal"];
const backendPkgs = [
  "cache",
  "controller",
  "cronb",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];
const frontendPkgs = ["api", "component", "hook", "page", "state", "style"];
const bothPkgs = ["auth", "config", "middleware", "utils"];

function Log(stack, level, pkg, message) {
  stack = (stack + "").toLowerCase();
  level = (level + "").toLowerCase();
  pkg = (pkg + "").toLowerCase();
  if (!stacks.includes(stack)) {
    return;
  }
  if (!levels.includes(level)) {
    return;
  }
  if (
    !(
      backendPkgs.includes(pkg) ||
      frontendPkgs.includes(pkg) ||
      bothPkgs.includes(pkg)
    )
  ) {
    return;
  }
  axios
    .post("http://20.244.56.144/eva1uation-service/logs", {
      stack: stack,
      level: level,
      package: pkg,
      message: message,
    })
    .then((response) => {
      // Log sent successfully
    })
    .catch((error) => {
      // Error sending log
    });
}

module.exports = { Log };
