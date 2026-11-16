# Repository checks

Run `mise run check` from the repository root before considering a change done.
CI runs the same command. Use `mise run setup` to install dependencies and hooks.

Do not disable lint rules to pass checks. Exceptions require a human decision,
a specific path and rule, and a reason. Security exceptions also require an
expiry date enforced by a check.

Do not manually edit `call-calendar/package-lock.json`, build output, or
`schemas/renovate.schema.json`. Regenerate the lockfile with npm; fetch the schema
from its documented upstream URL. Do not edit the generated Hexlet workflow.
