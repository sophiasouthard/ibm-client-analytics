# m365-mcp

A minimal MCP server that connects IBM Bob to Microsoft 365 via the Microsoft Graph API.
Provides tools for reading and writing calendar events and Outlook mail.

Designed for IBM PTSs (or anyone in a corporate Microsoft 365 tenant) who cannot use
OAuth device-code flow due to IT restrictions. Authentication is handled by a plain-text
Bearer token read from `token.txt` at call time — no app registration, no OAuth dance,
no admin consent required beyond what Graph Explorer already has.

---

## What it provides

| Tool | Description |
|---|---|
| `list_calendar_events` | List upcoming calendar events with attendees |
| `get_calendar_event` | Full detail on a specific event by ID |
| `create_calendar_event` | Create an event (optionally with Teams meeting link) |
| `list_emails` | List emails from inbox or any mail folder |
| `read_email` | Full content of a specific email |
| `send_email` | Send an email from your account |
| `search_emails` | Search across your mailbox by keyword |
| `reply_to_email` | Reply or reply-all to an email |

---

## Setup

### Prerequisites

- Node.js 18+
- A Microsoft 365 account (work or school)
- Access to [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)

### 1. Install and build

```bash
cd m365-mcp
npm install
npm run build
```

### 2. Get a token

1. Go to **https://developer.microsoft.com/graph/graph-explorer**
2. Sign in with your work Microsoft account
3. Click **Run query** on the default `GET /me` endpoint
4. Click the **Access token** tab in the response panel
5. Copy the full `eyJ...` token string

### 3. Store the token

Create a file called `token.txt` in this directory and paste the token into it:

```
m365-mcp/token.txt   ← paste token here, no quotes, no newline
```

> `token.txt` is excluded from git via `.gitignore`. Never commit it.

### 4. Register with Bob

Add this entry to your `.bob/mcp.json` (already included if you cloned this repo):

```json
"m365-mcp": {
  "command": "node",
  "args": ["./m365-mcp/build/index.js"],
  "disabled": false
}
```

Bob hot-reloads MCP config on save — no restart needed.

---

## Token refresh

Graph Explorer tokens expire after approximately **1 hour**. When you see a `401 Unauthorized`
error from any tool, your token has expired.

To refresh:
1. Return to Graph Explorer and click **Run query**
2. Copy the new token from the **Access token** tab
3. Overwrite `token.txt` with the new token
4. The next tool call will use it automatically — no restart needed

---

## Corporate tenant note

If your organization blocks third-party OAuth apps (common on IBM, bank, and government tenants),
Graph Explorer is typically the one pre-approved app that works without IT intervention.

Approaches that **will not work** on locked-down tenants:
- npm packages that use device-code OAuth flow
- Azure Portal app registration (requires permissions you likely don't have)
- Personal Microsoft accounts (no access to corporate tenant data)

See [`M365_MCP_SETUP.md`](../M365_MCP_SETUP.md) at the repo root for the full setup guide
including what was tried and why the other approaches fail.

---

## Fallback: direct curl

Even if the MCP tools are not surfaced in Bob's tool panel, Bob can call the Graph API
directly using the token in `token.txt`:

```bash
TOKEN=$(cat m365-mcp/token.txt)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://graph.microsoft.com/v1.0/me/calendarView \
  ?startDateTime=2026-07-07T00:00:00Z \
  &endDateTime=2026-07-13T23:59:59Z \
  &\$select=subject,start,end,organizer,attendees \
  &\$orderby=start/dateTime&\$top=50"
```

This works identically to the MCP tools and requires no server restart.
