---
name: Artifact dependency installs
description: A monorepo-specific dependency installation constraint for frontend artifacts.
---

When adding a package to an artifact, scope the package-manager command to that artifact's workspace package; an unscoped install may target the workspace root and fail the root-package guard.

**Why:** The workspace intentionally prevents accidental root dependency additions, while artifact packages own their frontend dependencies.

**How to apply:** Use the artifact package filter for package additions and then run that artifact's typecheck before restarting its workflow.