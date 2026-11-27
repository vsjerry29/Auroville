---
trigger: always_on
description: "Strict scope control, loop prevention, focused verification limits, and 15-20 minute execution budgets for every task in this project."
---

# Efficient Execution Rules

Priority: focused execution, no repeated builds, no agent loops, and no unnecessary work.

## Precedence Over Global Workflows

- This workspace rule takes precedence over broader global rules (`~/.gemini/GEMINI.md` and `~/.gemini/config/rules/creative-frontend.md`) whenever they would expand scope or verification for a localized change.
- Retain design craft, typography, accessibility, and anti-slop quality standards on touched UI, while skipping heavy exploratory steps (full 21st.dev discovery, multi-direction ideation, or full-site multi-viewport screenshot sweeps) unless the task is a full page/milestone redesign that genuinely requires them.

## 1. Strict Scope Control

- Work only on the files and components required by the current request.
- Do not redesign unrelated chapters.
- Do not reread the entire V4/V5 masterplans for a small localized change.
- Do not repeatedly research references already approved.
- Do not invoke 21st.dev MCP, image-generation agents, or additional subagents unless the task genuinely requires them.
- Never expand the task scope without a concrete technical reason.

## 2. Prevent Endless Execution

- Never repeat the same command without a meaningful code or configuration change.
- Never start duplicate builds or test processes.
- Do not create endless polling, timer, or verification loops.
- Wait for a terminal command's actual completion and inspect its exit code.
- A successfully completed process must be marked finished, not restarted.
- If a process is genuinely stuck, inspect its status once, terminate it if appropriate, and report the problem.
- If the same failure occurs twice without new diagnostic evidence, stop repeating the process and report the blocker.

## 3. Efficient Development Workflow

For a small change:

1. Identify the specific affected files.
2. Inspect only relevant code.
3. Implement the change.
4. Run focused checks.
5. Capture 3–6 important browser states if the change is visual.
6. Correct verified issues.
7. Run one final production build when appropriate.
8. Finish and report.

- Do not repeatedly rebuild and recapture the entire website.
- For substantial milestones, broader verification is allowed only when genuinely necessary.

## 4. Verification Limits

- Prefer targeted Playwright tests for affected chapters.
- Do not run the complete responsive screenshot suite after every adjustment.
- Reuse existing screenshots when the relevant implementation has not changed.
- Perform one initial verification and one focused correction pass.
- Additional passes require a specific unresolved failure.
- Do not continuously modify animation timing without identifying an observable problem.

## 5. Execution Budget

- For small, localized changes, target completion within 15–20 minutes.
- If work is approaching 30 minutes, stop expanding the task. Finish the current safe operation, preserve completed changes, and report the remaining work.
- Do not compromise correctness or claim success without verification.
- Do not make a fixed time limit override safe termination or cleanup of active processes.

## 6. Final Completion Conditions

Stop execution when:
- The requested implementation is complete.
- Focused verification passes.
- The final build, if required, succeeds.

- Do not continue searching for additional improvements after the requested task is verified.
- If verification fails repeatedly, provide the error and relevant evidence instead of entering an endless retry loop.

## 7. Reporting

Give a concise final report containing:
- Files changed.
- What was implemented.
- Tests performed and results.
- Remaining issues, if any.

- Do not repeatedly announce that builds or verification suites have started.
- Do not automatically commit to Git unless explicitly requested.
