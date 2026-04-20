# scripts

`validate-concepts.mjs` walks `concepts/index.json`, every registered `concepts/<topic>.json`, and `concepts/capstones.json` to check for duplicate ids, missing fields (`anchor`/`title`/`blurb`), unresolved or ambiguous prereqs, prereq cycles, unresolved capstone goals, and on-disk topic files that are not registered.

Run from the repo root (or any subdirectory — paths resolve relative to the script):

```
node scripts/validate-concepts.mjs
```

Exit `0` means the concept graph is clean. Exit `1` means at least one error was found; warnings (ambiguous bare prereqs, unregistered-but-present topic files) are printed but do not flip the exit code.
