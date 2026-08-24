import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("pnpm", ["--filter", "@workspace/asivanta", "run", "build"], {
  env: { ...process.env, PORT: "3000", BASE_PATH: "/" },
});
run(process.execPath, ["--test", "scripts/public-site.test.mjs"]);
