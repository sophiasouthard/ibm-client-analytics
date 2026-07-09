#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
const TOKEN_FILE = path.join(__dirname, "..", "token.txt");

function getToken(): string {
  // Read from token.txt at call time so you can update it without restarting Bob
  try {
    const fromFile = fs.readFileSync(TOKEN_FILE, "utf8").trim();
    if (fromFile && fromFile !== "PASTE_FRESH_TOKEN_HERE") {
      return fromFile;
    }
  } catch {
    // fall through to env var
  }
  const token = process.env.AUTH_TOKEN;
  if (!token) {
    throw new Error(
      "No token found. Paste a fresh token from https://developer.microsoft.com/graph/graph-explorer into m365-mcp/token.txt"
    );
  }
  return token;
}

async function graphGet(path: string): Promise<unknown> {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API error ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

async function graphPost(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph API error ${res.status} ${res.statusText}: ${text}`);
  }
  // Some endpoints return 202/204 with no body
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ─── Tool definitions ────────────────────────────────────────────────────────

const TOOLS = [
  // Calendar
  {
    name: "list_calendar_events",
    description:
      "List upcoming calendar events from the user's primary Outlook/Teams calendar.",
    inputSchema: {
      type: "object",
      properties: {
        top: {
          type: "number",
          description: "Max number of events to return (default 10, max 50).",
        },
        start: {
          type: "string",
          description:
            "Filter events starting on or after this ISO 8601 datetime (e.g. 2025-01-01T00:00:00). Defaults to now.",
        },
        end: {
          type: "string",
          description:
            "Filter events ending on or before this ISO 8601 datetime.",
        },
      },
    },
  },
  {
    name: "get_calendar_event",
    description: "Get full details of a specific calendar event by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        event_id: {
          type: "string",
          description: "The event ID from list_calendar_events.",
        },
      },
      required: ["event_id"],
    },
  },
  {
    name: "create_calendar_event",
    description:
      "Create a new event on the user's Outlook/Teams calendar. Returns the created event.",
    inputSchema: {
      type: "object",
      properties: {
        subject: { type: "string", description: "Event title." },
        start: {
          type: "string",
          description: "Start datetime in ISO 8601 format (e.g. 2025-06-10T14:00:00).",
        },
        end: {
          type: "string",
          description: "End datetime in ISO 8601 format.",
        },
        timezone: {
          type: "string",
          description: "IANA timezone name (e.g. America/Chicago). Defaults to UTC.",
        },
        body: {
          type: "string",
          description: "Optional body/description for the event (plain text).",
        },
        attendees: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional list of attendee email addresses to invite.",
        },
        is_online_meeting: {
          type: "boolean",
          description: "Set to true to add a Teams meeting link. Defaults to false.",
        },
      },
      required: ["subject", "start", "end"],
    },
  },
  // Mail
  {
    name: "list_emails",
    description:
      "List emails from the user's Outlook inbox (or another folder).",
    inputSchema: {
      type: "object",
      properties: {
        folder: {
          type: "string",
          description:
            "Well-known folder name: inbox, sentitems, drafts, deleteditems. Defaults to inbox.",
        },
        top: {
          type: "number",
          description: "Max number of emails to return (default 10, max 50).",
        },
        unread_only: {
          type: "boolean",
          description: "If true, return only unread messages.",
        },
      },
    },
  },
  {
    name: "read_email",
    description: "Read the full content of a specific email by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        message_id: {
          type: "string",
          description: "The message ID from list_emails or search_emails.",
        },
      },
      required: ["message_id"],
    },
  },
  {
    name: "send_email",
    description: "Send an email from the user's Outlook account.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "array",
          items: { type: "string" },
          description: "List of recipient email addresses.",
        },
        subject: { type: "string", description: "Email subject." },
        body: {
          type: "string",
          description: "Email body (plain text).",
        },
        cc: {
          type: "array",
          items: { type: "string" },
          description: "Optional CC email addresses.",
        },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "search_emails",
    description:
      "Search for emails across the mailbox using a keyword query. Returns matching messages.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search keyword or phrase (e.g. 'project proposal', 'from:john@ibm.com').",
        },
        top: {
          type: "number",
          description: "Max number of results (default 10, max 25).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "reply_to_email",
    description: "Reply to an existing email.",
    inputSchema: {
      type: "object",
      properties: {
        message_id: {
          type: "string",
          description: "The message ID to reply to.",
        },
        body: {
          type: "string",
          description: "The reply body (plain text).",
        },
        reply_all: {
          type: "boolean",
          description: "If true, reply to all recipients. Defaults to false.",
        },
      },
      required: ["message_id", "body"],
    },
  },
];

// ─── Tool handlers ────────────────────────────────────────────────────────────

async function handleListCalendarEvents(args: Record<string, unknown>): Promise<string> {
  const top = Math.min(Number(args.top ?? 10), 50);
  const now = new Date().toISOString();
  const start = (args.start as string) ?? now;

  let url = `/me/calendarView?startDateTime=${encodeURIComponent(start)}&$top=${top}&$orderby=start/dateTime&$select=id,subject,start,end,location,bodyPreview,isOnlineMeeting,onlineMeetingUrl,organizer,attendees`;

  if (args.end) {
    url += `&endDateTime=${encodeURIComponent(args.end as string)}`;
  } else {
    // Default: next 30 days
    const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    url += `&endDateTime=${encodeURIComponent(defaultEnd)}`;
  }

  const data = (await graphGet(url)) as { value: unknown[] };
  if (!data.value?.length) return "No upcoming calendar events found.";

  const events = data.value.map((e: unknown) => {
    const ev = e as Record<string, unknown>;
    const start = (ev.start as Record<string, string>)?.dateTime ?? "";
    const end = (ev.end as Record<string, string>)?.dateTime ?? "";
    const location = (ev.location as Record<string, string>)?.displayName ?? "";
    const organizer = ((ev.organizer as Record<string, unknown>)?.emailAddress as Record<string, string>)?.name ?? "";
    return `**${ev.subject}**\nID: ${ev.id}\nStart: ${start}\nEnd: ${end}${location ? `\nLocation: ${location}` : ""}${organizer ? `\nOrganizer: ${organizer}` : ""}${ev.bodyPreview ? `\nPreview: ${ev.bodyPreview}` : ""}${ev.isOnlineMeeting ? "\n🔗 Teams meeting" : ""}`;
  });

  return events.join("\n\n---\n\n");
}

async function handleGetCalendarEvent(args: Record<string, unknown>): Promise<string> {
  const eventId = args.event_id as string;
  const ev = (await graphGet(`/me/events/${encodeURIComponent(eventId)}`)) as Record<string, unknown>;

  const start = (ev.start as Record<string, string>)?.dateTime ?? "";
  const end = (ev.end as Record<string, string>)?.dateTime ?? "";
  const location = (ev.location as Record<string, string>)?.displayName ?? "";
  const organizer = ((ev.organizer as Record<string, unknown>)?.emailAddress as Record<string, string>)?.name ?? "";
  const attendeeList = ((ev.attendees as unknown[]) ?? [])
    .map((a: unknown) => {
      const att = a as Record<string, unknown>;
      const email = (att.emailAddress as Record<string, string>);
      return `${email?.name} <${email?.address}>`;
    })
    .join(", ");
  const body = ((ev.body as Record<string, string>)?.content ?? "").replace(/<[^>]+>/g, "").trim();

  return [
    `**${ev.subject}**`,
    `ID: ${ev.id}`,
    `Start: ${start}`,
    `End: ${end}`,
    location ? `Location: ${location}` : null,
    `Organizer: ${organizer}`,
    attendeeList ? `Attendees: ${attendeeList}` : null,
    ev.isOnlineMeeting ? `Teams link: ${ev.onlineMeetingUrl ?? "(available in Teams)"}` : null,
    body ? `\nBody:\n${body.slice(0, 2000)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function handleCreateCalendarEvent(args: Record<string, unknown>): Promise<string> {
  const timezone = (args.timezone as string) ?? "UTC";
  const payload: Record<string, unknown> = {
    subject: args.subject,
    start: { dateTime: args.start, timeZone: timezone },
    end: { dateTime: args.end, timeZone: timezone },
    isOnlineMeeting: args.is_online_meeting ?? false,
  };

  if (args.body) {
    payload.body = { contentType: "text", content: args.body };
  }

  if (Array.isArray(args.attendees) && args.attendees.length > 0) {
    payload.attendees = (args.attendees as string[]).map((email) => ({
      emailAddress: { address: email },
      type: "required",
    }));
  }

  const ev = (await graphPost("/me/events", payload)) as Record<string, unknown>;
  const start = (ev.start as Record<string, string>)?.dateTime ?? "";
  return `✅ Event created: **${ev.subject}**\nID: ${ev.id}\nStart: ${start}\n${ev.isOnlineMeeting ? `Teams link: ${ev.onlineMeetingUrl}` : ""}`;
}

async function handleListEmails(args: Record<string, unknown>): Promise<string> {
  const folder = (args.folder as string) ?? "inbox";
  const top = Math.min(Number(args.top ?? 10), 50);
  const filter = args.unread_only ? "&$filter=isRead eq false" : "";

  const url = `/me/mailFolders/${folder}/messages?$top=${top}&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,isRead,bodyPreview${filter}`;
  const data = (await graphGet(url)) as { value: unknown[] };

  if (!data.value?.length) return "No emails found.";

  const emails = data.value.map((m: unknown) => {
    const msg = m as Record<string, unknown>;
    const from = ((msg.from as Record<string, unknown>)?.emailAddress as Record<string, string>);
    const read = msg.isRead ? "" : "🔵 ";
    return `${read}**${msg.subject}**\nID: ${msg.id}\nFrom: ${from?.name} <${from?.address}>\nReceived: ${msg.receivedDateTime}\nPreview: ${msg.bodyPreview}`;
  });

  return emails.join("\n\n---\n\n");
}

async function handleReadEmail(args: Record<string, unknown>): Promise<string> {
  const msgId = args.message_id as string;
  const msg = (await graphGet(`/me/messages/${encodeURIComponent(msgId)}?$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,body,hasAttachments`)) as Record<string, unknown>;

  const from = ((msg.from as Record<string, unknown>)?.emailAddress as Record<string, string>);
  const to = ((msg.toRecipients as unknown[]) ?? [])
    .map((r: unknown) => {
      const rec = (r as Record<string, unknown>).emailAddress as Record<string, string>;
      return `${rec?.name} <${rec?.address}>`;
    })
    .join(", ");
  const body = ((msg.body as Record<string, string>)?.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return [
    `**${msg.subject}**`,
    `From: ${from?.name} <${from?.address}>`,
    `To: ${to}`,
    `Received: ${msg.receivedDateTime}`,
    msg.hasAttachments ? "📎 Has attachments" : null,
    `\n${body.slice(0, 3000)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function handleSendEmail(args: Record<string, unknown>): Promise<string> {
  const toList = (args.to as string[]).map((addr) => ({
    emailAddress: { address: addr },
  }));
  const ccList = Array.isArray(args.cc)
    ? (args.cc as string[]).map((addr) => ({ emailAddress: { address: addr } }))
    : [];

  const payload = {
    message: {
      subject: args.subject,
      body: { contentType: "text", content: args.body },
      toRecipients: toList,
      ...(ccList.length ? { ccRecipients: ccList } : {}),
    },
  };

  await graphPost("/me/sendMail", payload);
  return `✅ Email sent to ${(args.to as string[]).join(", ")}: **${args.subject}**`;
}

async function handleSearchEmails(args: Record<string, unknown>): Promise<string> {
  const top = Math.min(Number(args.top ?? 10), 25);
  const query = encodeURIComponent(args.query as string);
  const url = `/me/messages?$search="${query}"&$top=${top}&$select=id,subject,from,receivedDateTime,bodyPreview`;
  const data = (await graphGet(url)) as { value: unknown[] };

  if (!data.value?.length) return `No emails found matching "${args.query}".`;

  const emails = data.value.map((m: unknown) => {
    const msg = m as Record<string, unknown>;
    const from = ((msg.from as Record<string, unknown>)?.emailAddress as Record<string, string>);
    return `**${msg.subject}**\nID: ${msg.id}\nFrom: ${from?.name} <${from?.address}>\nReceived: ${msg.receivedDateTime}\nPreview: ${msg.bodyPreview}`;
  });

  return emails.join("\n\n---\n\n");
}

async function handleReplyToEmail(args: Record<string, unknown>): Promise<string> {
  const msgId = args.message_id as string;
  const replyAll = args.reply_all ?? false;
  const endpoint = replyAll
    ? `/me/messages/${encodeURIComponent(msgId)}/replyAll`
    : `/me/messages/${encodeURIComponent(msgId)}/reply`;

  await graphPost(endpoint, {
    message: {},
    comment: args.body,
  });

  return `✅ Reply sent${replyAll ? " (reply all)" : ""}.`;
}

// ─── Server setup ─────────────────────────────────────────────────────────────

const server = new Server(
  { name: "m365-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const a = args as Record<string, unknown>;

  try {
    let result: string;
    switch (name) {
      case "list_calendar_events":   result = await handleListCalendarEvents(a); break;
      case "get_calendar_event":     result = await handleGetCalendarEvent(a); break;
      case "create_calendar_event":  result = await handleCreateCalendarEvent(a); break;
      case "list_emails":            result = await handleListEmails(a); break;
      case "read_email":             result = await handleReadEmail(a); break;
      case "send_email":             result = await handleSendEmail(a); break;
      case "search_emails":          result = await handleSearchEmails(a); break;
      case "reply_to_email":         result = await handleReplyToEmail(a); break;
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
    return { content: [{ type: "text", text: result }] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("m365-mcp server running (Calendar + Mail via Microsoft Graph)");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
