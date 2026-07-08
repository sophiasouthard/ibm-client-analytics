# ibm-data-ai-docs MCP Server

A local MCP server that gives Bob deep knowledge of the IBM Data & AI product portfolio.
**No API key required.** It calls the public IBM docs search API and ships a curated catalog
of 35+ products and 9+ real customer case studies directly in its source.

## What it provides

| Tool | What it does |
|---|---|
| `list_ibm_data_ai_products` | Full IBM Data & AI catalog — 35+ products with descriptions, doc URLs, category |
| `search_ibm_docs` | Live search of ibm.com/docs for any topic |
| `fetch_ibm_doc_page` | Fetch and read a specific IBM documentation page |
| `get_product_overview` | Get catalog entry + live docs landing page for any product |
| `recommend_ibm_products` | Map a customer's tech stack / problem to the best IBM products |
| `get_ibm_case_studies` | Filter real IBM customer case studies by product or industry |
| `fetch_ibm_case_study` | Fetch full narrative of a specific IBM case study |

## Setup (one-time, ~2 minutes)

### Prerequisites
- Node.js 18+ — check with `node --version`. Install from https://nodejs.org if needed.

### Build

```bash
cd mcp-servers/ibm-data-ai-docs
npm install
npm run build
```

This produces `build/index.js` — the compiled server binary.

### Register with Bob

Add this to your Bob MCP config. Choose your scope:

**Workspace only** (`.bob/mcp.json` in your project folder — recommended):
```json
{
  "mcpServers": {
    "ibm-data-ai-docs": {
      "command": "node",
      "args": ["./mcp-servers/ibm-data-ai-docs/build/index.js"],
      "disabled": false,
      "alwaysAllow": [
        "list_ibm_data_ai_products",
        "get_ibm_case_studies",
        "search_ibm_docs",
        "recommend_ibm_products",
        "get_product_overview",
        "fetch_ibm_doc_page",
        "fetch_ibm_case_study"
      ]
    }
  }
}
```

**Global** (`~/.bob/settings/mcp.json` — available in all workspaces):
```json
{
  "mcpServers": {
    "ibm-data-ai-docs": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/ibm-partner-tracker/mcp-servers/ibm-data-ai-docs/build/index.js"],
      "disabled": false,
      "alwaysAllow": [
        "list_ibm_data_ai_products",
        "get_ibm_case_studies",
        "search_ibm_docs",
        "recommend_ibm_products",
        "get_product_overview",
        "fetch_ibm_doc_page",
        "fetch_ibm_case_study"
      ]
    }
  }
}
```

> **Tip for global config:** Replace `/ABSOLUTE/PATH/TO/` with the real path to where you cloned
> this repo. On a Mac, run `pwd` inside the `ibm-partner-tracker` folder to get the full path.

The server connects immediately on save — no Bob restart needed.

### Verify it's working

In Bob, ask:
```
List all IBM Data & AI products in the watsonx Platform category.
```

You should see a formatted list of watsonx.ai, watsonx.data, watsonx.governance,
watsonx Orchestrate, and related products with their descriptions and doc URLs.

## No API key required

This server uses only:
- The public IBM docs search API (`ibm.com/docs/api/v1/search`) — no auth required
- Public IBM.com pages for doc fetching — no auth required
- A static catalog and case study database embedded in the source code
