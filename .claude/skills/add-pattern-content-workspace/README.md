# add-pattern-content — optimization workspace

`trigger-eval.json` is a 20-query trigger eval set (10 should-trigger, 10 tricky
near-miss should-not-trigger) for tuning the skill's `description`.

## Status

The automated description-optimization loop (`skill-creator/scripts/run_loop.py`)
could **not** be run in the environment where this skill was created, because:

1. The standalone `claude` CLI was not logged in (the loop shells out to `claude -p`,
   which needs its own auth), and
2. `run_eval.py` uses `select.select()` on subprocess pipes, which on Windows only
   works with sockets — it is Unix-only.

The description was instead tuned **manually** from the skill-creator's documented
triggering principles: strong, specific positive triggers plus explicit negative
guardrails for the near-miss cases in the eval set (abstract pattern questions, app
bugs, generic component/UI work, tests, docs, deploy).

## Running the automated loop later (from a logged-in claude terminal, on Unix/WSL)

```bash
cd <skill-creator-dir>
python -m scripts.run_loop \
  --eval-set <repo>/.claude/skills/add-pattern-content-workspace/trigger-eval.json \
  --skill-path <repo>/.claude/skills/add-pattern-content \
  --model claude-sonnet-5 \
  --max-iterations 5 --verbose
```

Then paste the resulting `best_description` into `add-pattern-content/SKILL.md`.
