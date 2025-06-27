// logger.js
// This is a simple logger middleware thingy for backend/frontend


const axios = require("axios");

// Allowed values 
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
  // lowercase everything just in case
  stack = (stack + "").toLowerCase();
  level = (level + "").toLowerCase();
  pkg = (pkg + "").toLowerCase();
  // check if values are allowed 
  if (!stacks.includes(stack)) {
    console.log("Stack not allowed:", stack);
    return;
  }
  if (!levels.includes(level)) {
    console.log("Level not allowed:", level);
    return;
  }
  if (
    !(
      backendPkgs.includes(pkg) ||
      frontendPkgs.includes(pkg) ||
      bothPkgs.includes(pkg)
    )
  ) {
    console.log("Package not allowed:", pkg);
    return;
  }
  // axios post
  axios
    .post("http://20.244.56.144/eva1uation-service/logs", {
      stack: stack,
      level: level,
      package: pkg,
      message: message,
    })
    .then((response) => {
      console.log("Log response:", response.data);
    })
    .catch((error) => {
      if (error.response) {
        console.log("Error sending log:", error.response.data);
      } else {
        console.log("Error sending log:", error.message);
      }
    });
}


module.exports = { Log };
