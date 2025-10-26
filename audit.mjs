#!/usr/bin/env node
/**
 * Project Audit Script
 * --------------------
 * What it checks:
 * 1) Unused/incorrect dependencies (via depcheck)
 * 2) Unused exports/files (via ts-prune)
 * 3) Circular dependencies & orphans (via madge)
 * 4) Unused vars/imports (via ESLint)
 *
 * Requirements:
 *   node >= 18, npm >= 9
 *   npx will auto-install the needed CLIs on first run:
 *     depcheck, ts-prune, madge, eslint
 *
 * Usage:
 *   node audit.mjs
 *   (optionally) node audit.mjs --src src --tsconfig tsconfig.json
 *
 * Output:
 *   - AUDIT_REPORT.md (detailed)
 *   - console summary
 */

import { execSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ---------- CLI args ----------
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  const next = args[idx + 1];
  if (!next || next.startsWith("--")) return fallback;
  return next;
};

const SRC_DIR = resolve(arg("--src", "src"));
const TSCONFIG = resolve(arg("--tsconfig", "tsconfig.json"));

const header = (t) => `\n## ${t}\n`;
const bullet = (t) => `- ${t}\n`;

let report = `# Project Audit Report\n\nGenerated: ${new Date().toISOString()}\n\n` +
`**Config**\n\n- SRC: \`${SRC_DIR}\`\n- tsconfig: \`${TSCONFIG}\`\n\n`;

// Ensure tools are available via npx (auto-install if missing)
function run(cmd, options = {}) {
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf-8", ...options });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: e.stdout?.toString() || "", err: e.stderr?.toString() || e.message };
  }
}

// 1) depcheck
console.log("▶ Running depcheck...");
const depcheckCmd = `npx --yes depcheck --skip-missing=true --json`;
const depRes = run(depcheckCmd);
let depSummary = [];
if (depRes.ok) {
  try {
    const depJson = JSON.parse(depRes.out);
    const unusedDeps = depJson.dependencies || [];
    const unusedDev = depJson.devDependencies || [];
    const missing = depJson.missing || {};
    const invalidFiles = depJson.invalidFiles || {};
    const invalidDirs = depJson.invalidDirs || {};

    report += header("Dependencies (depcheck)");
    report += bullet(`Unused dependencies: ${unusedDeps.length ? unusedDeps.join(", ") : "None"}`);
    report += bullet(`Unused devDependencies: ${unusedDev.length ? unusedDev.join(", ") : "None"}`);
    const missingList = Object.keys(missing);
    report += bullet(`Missing (declared used in code but not in package.json): ${missingList.length ? missingList.join(", ") : "None"}`);
    const invFiles = Object.keys(invalidFiles);
    const invDirs = Object.keys(invalidDirs);
    if (invFiles.length || invDirs.length) {
      report += `\n<details><summary>Invalid files/dirs</summary>\n\n`;
      if (invFiles.length) {
        report += `**Files**\n\n` + invFiles.map(f => `- ${f}`).join("\n") + "\n";
      }
      if (invDirs.length) {
        report += `\n**Dirs**\n\n` + invDirs.map(d => `- ${d}`).join("\n") + "\n";
      }
      report += `</details>\n`;
    }

    if (unusedDeps.length) depSummary.push(`${unusedDeps.length} unused deps`);
    if (unusedDev.length) depSummary.push(`${unusedDev.length} unused devDeps`);
    if (missingList.length) depSummary.push(`${missingList.length} missing deps`);
  } catch (e) {
    report += header("Dependencies (depcheck)") + bullet("Failed to parse depcheck output.");
  }
} else {
  report += header("Dependencies (depcheck)") + bullet("depcheck failed to run.") + "\n```\n" + (depRes.err || depRes.out) + "\n```\n";
}

// 2) ts-prune
console.log("▶ Running ts-prune...");
const tsPruneCmd = `npx --yes ts-prune --ignore "${SRC_DIR}/**/*.test.*|${SRC_DIR}/__tests__/**|**/*.spec.*"`;
const pruneRes = run(tsPruneCmd);
let pruneCount = 0;
if (pruneRes.ok) {
  const lines = pruneRes.out
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);
  pruneCount = lines.length;
  report += header("Unused exports/files (ts-prune)");
  if (lines.length === 0) {
    report += bullet("No unused exports found.");
  } else {
    report += `Found **${lines.length}** potentially unused exports:\n\n`;
    report += "<details>\n<summary>Show list</summary>\n\n";
    report += lines.map(l => `- ${l}`).join("\n") + "\n\n</details>\n";
  }
} else {
  report += header("Unused exports/files (ts-prune)") + bullet("ts-prune failed to run.") + "\n```\n" + (pruneRes.err || pruneRes.out) + "\n```\n";
}

// 3) madge (circulars + orphans)
console.log("▶ Running madge...");
const madgeCmd = `npx --yes madge "${SRC_DIR}" --ts-config "${TSCONFIG}" --extensions ts,tsx,js,jsx --json`;
const madgeRes = run(madgeCmd);
let circCount = 0;
let orphanCount = 0;
if (madgeRes.ok) {
  try {
    const m = JSON.parse(madgeRes.out);
    // madge CLI --json output is a map of file->deps; we need 2nd calls for --circular and --orphans
    const circRes = run(`npx --yes madge "${SRC_DIR}" --ts-config "${TSCONFIG}" --extensions ts,tsx,js,jsx --circular --json`);
    const orphRes = run(`npx --yes madge "${SRC_DIR}" --ts-config "${TSCONFIG}" --extensions ts,tsx,js,jsx --orphans --json`);

    const circular = circRes.ok ? JSON.parse(circRes.out) : [];
    const orphans = orphRes.ok ? JSON.parse(orphRes.out) : [];

    circCount = Array.isArray(circular) ? circular.length : 0;
    orphanCount = Array.isArray(orphans) ? orphans.length : 0;

    report += header("Dependencies graph (madge)");
    report += bullet(`Circular dependency groups: ${circCount}`);
    report += bullet(`Orphan files (not imported by others): ${orphanCount}`);

    if (circCount) {
      report += "\n<details>\n<summary>Show circular groups</summary>\n\n";
      report += circular.map((g, i) => `**Group ${i + 1}**\n\n` + g.map(x => `- ${x}`).join("\n")).join("\n\n") + "\n\n</details>\n";
    }
    if (orphanCount) {
      report += "\n<details>\n<summary>Show orphan files</summary>\n\n";
      report += orphans.map(x => `- ${x}`).join("\n") + "\n\n</details>\n";
    }
  } catch (e) {
    report += header("Dependencies graph (madge)") + bullet("Failed to parse madge output.");
  }
} else {
  report += header("Dependencies graph (madge)") + bullet("madge failed to run.") + "\n```\n" + (madgeRes.err || madgeRes.out) + "\n```\n";
}

// 4) ESLint (unused vars/imports) – runs ESLint if config exists
console.log("▶ Running ESLint...");
const hasEslintConfig = ["eslint.config.js",".eslintrc.js",".eslintrc.cjs",".eslintrc.json",".eslintrc"].some(f => existsSync(resolve(process.cwd(), f)));
let eslintIssues = 0;
if (hasEslintConfig) {
  const eslintCmd = `npx --yes eslint "${SRC_DIR}/**/*.{ts,tsx,js,jsx}" -f json`;
  const eslintRes = run(eslintCmd);
  if (eslintRes.ok) {
    try {
      const arr = JSON.parse(eslintRes.out);
      // Count only "no-unused-vars" & "no-unused-imports"
      arr.forEach(file => {
        file.messages.forEach(msg => {
          if (msg.ruleId && (String(msg.ruleId).includes("no-unused-vars") || String(msg.ruleId).includes("unused-imports"))) {
            eslintIssues += 1;
          }
        });
      });
      report += header("ESLint (unused vars/imports)");
      report += bullet(`Potential unused vars/imports: ${eslintIssues}`);
    } catch (e) {
      report += header("ESLint (unused vars/imports)") + bullet("Failed to parse ESLint output.");
    }
  } else {
    report += header("ESLint (unused vars/imports)") + bullet("ESLint failed to run.") + "\n```\n" + (eslintRes.err || eslintRes.out) + "\n```\n";
  }
} else {
  report += header("ESLint (unused vars/imports)") + bullet("No ESLint config found. Skipping.");
}

// ---------- Summary ----------
let summary = [];
if (depSummary.length) summary.push(depSummary.join(", "));
if (pruneCount) summary.push(`${pruneCount} unused exports/files`);
if (circCount) summary.push(`${circCount} circular groups`);
if (orphanCount) summary.push(`${orphanCount} orphans`);
if (eslintIssues) summary.push(`${eslintIssues} ESLint unused issues`);

const finalSummary = summary.length ? summary.join(" • ") : "No major issues found 🎉";

report = `> **Summary:** ${finalSummary}\n\n` + report;

writeFileSync("AUDIT_REPORT.md", report, "utf-8");

console.log("\n===== AUDIT SUMMARY =====");
console.log(finalSummary);
console.log("Detailed report written to AUDIT_REPORT.md\n");
