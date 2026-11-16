#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const AGENT_FILE = "dependency-security.agent.md";
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: npx github:viveksinghinsight/mcp-security-scanner [options]

Installs the Dependency Security Copilot agent.

Options:
  --user    Install into the VS Code user prompts folder instead of ./.github/agents
  --force   Overwrite an existing agent file
  -h, --help`);
  process.exit(0);
}

function userPromptsDir() {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Code", "User", "prompts");
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Code", "User", "prompts");
  }
  return path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "Code", "User", "prompts");
}

const source = path.join(__dirname, "..", AGENT_FILE);
const targetDir = args.includes("--user") ? userPromptsDir() : path.join(process.cwd(), ".github", "agents");
const target = path.join(targetDir, AGENT_FILE);

if (!fs.existsSync(source)) {
  console.error(`Agent file not found in package: ${source}`);
  process.exit(1);
}

if (fs.existsSync(target) && !args.includes("--force")) {
  console.error(`Already exists: ${target}\nRe-run with --force to overwrite.`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log(`Installed Dependency Security agent to ${target}`);
console.log('Reload VS Code, then select "Dependency Security" in Copilot Chat.');
