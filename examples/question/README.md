# Question

Single-choice question element with four fixed answers. The author writes
the answers and (when gradable) marks one as correct; the end user picks
one and gets correct/incorrect feedback after submission. The host can
flip the element between gradable (right/wrong) and ungradable (poll-style)
modes via the element settings.

**Type:** `ACME_TCE_QUESTION`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `isGradable` | `boolean` | Set by the host on element creation |
| `answers` | `string[]` | The four answer options (fixed length) |
| `correct` | `number?` | Index of the correct answer (gradable only) |
| `question` | `string[]` | Embed IDs in display order |
| `embeds` | `Record<string, any>` | Embedded prompt content keyed by ID |
| `hint` | `string` | Author-provided hint |
| `feedback` | `Record<number, string>` | Per-answer feedback |

`embeds`, `question`, `hint`, and `feedback` are required by the runtime
question wrapper for any element with `isQuestion: true` — even if the
element-specific Edit doesn't render UI for them, the wrapper does.

## Edit

The runtime question wrapper renders the prompt, hint, and feedback
panels around the element-specific Edit. The element only renders the
answer rows:

- Four fixed answer text fields
- In gradable mode: a radio in each row to mark the correct answer
- In ungradable mode: a numbered avatar in each row, no correct-answer concept

## Display

- Renders the four answers with letter avatars (A–D)
- After submission on a gradable element, the picked answer is marked correct or incorrect

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
```
