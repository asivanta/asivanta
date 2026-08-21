import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const forbiddenPaths = [
  /^attached_assets\//,
  /(^|\/)submissions\/.*\.json$/i,
  /^artifacts\/api-server\//,
  /^artifacts\/asivanta\/src\/pages\/(admin|login|portal)\.tsx$/i,
  /^api\/ai\/llm-status\.js$/i,
];

const forbiddenTerms = [
  ["Sun", "ny"].join(""),
  ["Pup", "Care"].join(""),
  ["Open", "Claw"].join(""),
  ["Her", "mes"].join(""),
  ["Ashley", "Baek"].join(""),
  ["Finish", "High"].join(""),
  ["Hero", "A"].join(""),
  ["Pickup", "Alert"].join(""),
];

const findings = [];
for (const file of trackedFiles) {
  if (!existsSync(file)) continue;
  if (forbiddenPaths.some((pattern) => pattern.test(file))) {
    findings.push(`${file}: forbidden public path`);
    continue;
  }

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const term of forbiddenTerms) {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      findings.push(`${file}: unrelated project name found`);
    }
  }
  if (/@gmail\.com\b/i.test(content)) {
    findings.push(`${file}: personal email provider found`);
  }
}

if (findings.length > 0) {
  console.error("Public-boundary check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(
  `Public-boundary check passed for ${trackedFiles.length} tracked files.`,
);
