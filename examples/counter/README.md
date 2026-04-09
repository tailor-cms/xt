# Simple Counter

Click counter with an author-set description and an optional background
image. The author increments and decrements the count, optionally uploads
a background image, and can link to another element. The end user can
submit interactions back to the server. Counts above 9 reset to 0 on save.

**Type:** `ACME_TCE_COUNTER`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `count` | `number` | The counter value |
| `description` | `string` | Author-provided label |
| `key` | `string?` | Storage key for the uploaded background |
| `assets` | `{ backgroundUrl: string }?` | Internal storage URLs (dot-notation) |
| `backgroundUrl` | `string?` | Public URL of the uploaded background |

`data.assets.*` holds storage keys, `data.backgroundUrl` holds the resolved
public URL. See [docs/file-storage.md](../../docs/file-storage.md).

## Edit

- Description text field
- Increment button (decrement lives in the top toolbar)
- Background image upload with preview
- Link element button (renders the linked element's data when present)
- Export data button — downloads the element's data as JSON via a server procedure

## Display

- Shows the description and current count
- Submit interaction button — records a server-side timestamp
- Shows the current user state as JSON for debugging

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
```
