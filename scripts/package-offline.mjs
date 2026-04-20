#!/usr/bin/env node
// package-offline.mjs
// ---------------------------------------------------------------------------
// Packages this repository as a standalone offline notebook bundle.
//
// Usage:
//   node scripts/package-offline.mjs
//
// Output:
//   <repo-root>/math-viz-notebook.zip
//
// Contents:
//   - All repo files EXCEPT: .git/, node_modules/, .github/, and the output
//     zip itself.
//   - A small `serve.sh` helper that wraps `python3 -m http.server 8000`
//     with a Windows fallback note.
//
// Requirements:
//   - Node.js (uses only Node's standard library — no npm deps).
//   - The `zip` command-line utility must be available on PATH. This is
//     standard on macOS and most Linux distributions (including GitHub
//     Actions ubuntu-latest and macos-latest runners). On Windows, install
//     Info-ZIP or run under WSL / Git Bash with zip installed.
//
// Exit codes:
//   0  success
//   1  failure (missing `zip`, I/O error, etc.)
// ---------------------------------------------------------------------------

import { execSync, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, statSync, chmodSync, existsSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const ZIP_NAME = 'math-viz-notebook.zip';
const ZIP_PATH = join(REPO_ROOT, ZIP_NAME);

const EXCLUDES = [
  '.git',
  '.git/*',
  'node_modules',
  'node_modules/*',
  '.github',
  '.github/*',
  ZIP_NAME,
];

const SERVE_SH_CONTENTS = `#!/usr/bin/env bash
# serve.sh — tiny local static server for the math-viz notebook bundle.
#
# Usage (macOS / Linux):
#   ./serve.sh
# then open http://localhost:8000/ in your browser.
#
# Windows:
#   PowerShell / cmd users can run the same command directly:
#     python -m http.server 8000
#   (use "python" instead of "python3" on most Windows installs)
#   or use WSL / Git Bash to run this script as-is.

set -euo pipefail
PORT="\${1:-8000}"
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT"
else
  echo "error: python3 (or python) not found on PATH" >&2
  echo "install Python 3 from https://www.python.org/downloads/ and retry" >&2
  exit 1
fi
`;

function fail(msg, err) {
  console.error(`[package-offline] ERROR: ${msg}`);
  if (err) console.error(err.stack || err.message || String(err));
  process.exit(1);
}

function ensureZipAvailable() {
  try {
    execFileSync('zip', ['-v'], { stdio: 'ignore' });
  } catch (err) {
    fail(
      "`zip` command not found on PATH. Install Info-ZIP (macOS: preinstalled; " +
      "Debian/Ubuntu: `sudo apt-get install zip`; Windows: use WSL or Git Bash).",
      err,
    );
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KiB', 'MiB', 'GiB'];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(2)} ${units[i]}`;
}

function main() {
  ensureZipAvailable();

  // Remove any stale zip so it isn't accidentally re-included.
  if (existsSync(ZIP_PATH)) {
    try {
      unlinkSync(ZIP_PATH);
    } catch (err) {
      fail(`failed to remove stale ${ZIP_NAME}`, err);
    }
  }

  // Stage serve.sh in a temp dir, then include it into the zip alongside repo.
  const stageDir = mkdtempSync(join(tmpdir(), 'math-viz-pkg-'));
  const serveShPath = join(stageDir, 'serve.sh');

  try {
    writeFileSync(serveShPath, SERVE_SH_CONTENTS, { encoding: 'utf8' });
    try {
      chmodSync(serveShPath, 0o755);
    } catch {
      // non-fatal on filesystems that don't support chmod
    }

    // Build exclude args for `zip -r`.
    const excludeArgs = [];
    for (const pat of EXCLUDES) {
      excludeArgs.push('-x', pat);
    }

    // 1) Zip the repo contents (excluding the unwanted dirs / zip itself).
    //    Run from REPO_ROOT so paths inside the zip are relative.
    try {
      execFileSync(
        'zip',
        ['-r', ZIP_PATH, '.', ...excludeArgs],
        { cwd: REPO_ROOT, stdio: ['ignore', 'ignore', 'inherit'] },
      );
    } catch (err) {
      fail('`zip -r` failed while archiving repo contents', err);
    }

    // 2) Append serve.sh into the zip at the top level.
    try {
      execFileSync(
        'zip',
        ['-j', ZIP_PATH, serveShPath],
        { stdio: ['ignore', 'ignore', 'inherit'] },
      );
    } catch (err) {
      fail('`zip -j` failed while adding serve.sh', err);
    }
  } finally {
    try {
      rmSync(stageDir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }

  let size;
  try {
    size = statSync(ZIP_PATH).size;
  } catch (err) {
    fail(`zip was not created at ${ZIP_PATH}`, err);
  }

  console.log(`[package-offline] wrote ${ZIP_PATH} (${formatBytes(size)})`);
  process.exit(0);
}

try {
  main();
} catch (err) {
  fail('unexpected failure', err);
}
