import chokidar from "chokidar";
import { execSync } from "node:child_process";

const COMMIT_COOLDOWN_MS = 30_000;
const MAX_FILES_PER_COMMIT = 50;
const COMMIT_PREFIX = "Auto-commit";

let commitTimer = null;
let committing = false;

const watcher = chokidar.watch(".", {
  ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
  ignoreInitial: true,
});

const scheduleCommit = () => {
  if (committing) return;
  if (commitTimer) clearTimeout(commitTimer);
  commitTimer = setTimeout(runCommit, COMMIT_COOLDOWN_MS);
};

const runCommit = () => {
  commitTimer = null;
  if (committing) return;
  committing = true;

  try {
    const status = execSync("git status --porcelain", { encoding: "utf8" }).trim();
    if (!status) return;

    const files = status
      .split("\n")
      .map((line) => line.slice(3))
      .filter(Boolean)
      .slice(0, MAX_FILES_PER_COMMIT);

    if (!files.length) return;

    execSync(`git add ${files.map((file) => `"${file}"`).join(" ")}`);
    const message = `${COMMIT_PREFIX}: ${new Date().toISOString()}`;
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
  } catch (error) {
    console.error("Auto-commit failed:", error?.message ?? error);
  } finally {
    committing = false;
  }
};

watcher.on("all", scheduleCommit);

process.on("SIGINT", () => {
  watcher.close().finally(() => process.exit(0));
});
