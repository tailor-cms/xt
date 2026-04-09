# Simple Counter

Example content element demonstrating core CEK features.

**Type:** `ACME_TCE_COUNTER`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `count` | `number` | The counter value |
| `description` | `string` | Author-provided label |
| `backgroundUrl` | `string?` | Uploaded background image |

## Edit

- Text field for the description
- Increment/decrement buttons for the counter (decrement in top toolbar)
- Background image upload with preview
- Export data button (downloads element data as JSON via server RPC)

## Display

- Shows description and counter value
- Submit interaction button that sends the count to the server
- Displays the current user state as JSON

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
```
