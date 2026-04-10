#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.LAZYMAC_API_BASE || "https://api.lazy-mac.com";

const TOOLS = [
  { name: "qr_generate", path: "/qr-code/generate", method: "GET", desc: "Generate a QR code (PNG/SVG) from text or URL", params: { text: "string", format: "png|svg" } },
  { name: "url_shorten", path: "/url-shortener/shorten", method: "POST", desc: "Shorten a URL with analytics", params: { url: "string" } },
  { name: "ip_geo", path: "/ip-geo/lookup", method: "GET", desc: "IP → country, city, ASN, timezone", params: { ip: "string" } },
  { name: "tech_stack_detect", path: "/tech-stack-detector/scan", method: "GET", desc: "Detect a website's tech stack (BuiltWith alternative)", params: { url: "string" } },
  { name: "ai_cost_calc", path: "/ai-cost-calculator/estimate", method: "GET", desc: "Estimate token cost across GPT-4 / Claude / Gemini / Haiku", params: { tokens: "number", model: "string" } },
  { name: "llm_router", path: "/llm-router/route", method: "POST", desc: "Auto-pick cheapest LLM that meets quality bar for a request", params: { prompt: "string" } },
  { name: "k_privacy_scan", path: "/k-privacy-scanner/scan", method: "GET", desc: "Korean PIPA compliance scan for any URL (60s)", params: { url: "string" } },
  { name: "k_govdata", path: "/govdata-korea/lookup", method: "GET", desc: "Korean public data (holidays, weather, FX, postal) as English JSON", params: { dataset: "string" } },
  { name: "k_exchange_rate", path: "/k-exchange-rate/rates", method: "GET", desc: "Real-time KRW exchange rates + BOK base rate + CPI", params: { base: "string" } },
  { name: "korean_nlp", path: "/korean-nlp-tools/analyze", method: "POST", desc: "Korean morpheme/sentiment/keyword analysis", params: { text: "string" } },
  { name: "ai_provider_status", path: "/ai-provider-status/status", method: "GET", desc: "Real-time status for OpenAI/Anthropic/Google AI providers", params: { provider: "string" } },
  { name: "fake_data", path: "/fake-data/generate", method: "GET", desc: "Generate fake names, emails, addresses, JSON for testing", params: { schema: "string", count: "number" } },
  { name: "regex_test", path: "/regex-toolkit/test", method: "POST", desc: "Test, explain, and generate regex patterns", params: { pattern: "string", input: "string" } },
  { name: "seo_analyze", path: "/seo-analyzer/analyze", method: "GET", desc: "Page-level SEO audit — meta, headings, density", params: { url: "string" } },
  { name: "email_validate", path: "/email-validator/validate", method: "GET", desc: "Email syntax + MX + disposable detection", params: { email: "string" } },
];

const server = new Server(
  { name: "lazymac-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => ({
    name: t.name,
    description: t.desc,
    inputSchema: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(t.params).map(([k, v]) => [
          k,
          { type: v.includes("number") ? "number" : "string", description: v },
        ])
      ),
    },
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOLS.find((t) => t.name === request.params.name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
  }
  const args = request.params.arguments || {};
  let url = `${API_BASE}${tool.path}`;
  let init = { method: tool.method, headers: { "User-Agent": "lazymac-mcp/0.1.0" } };
  if (tool.method === "GET") {
    const qs = new URLSearchParams(
      Object.entries(args).map(([k, v]) => [k, String(v)])
    ).toString();
    if (qs) url += `?${qs}`;
  } else {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(args);
  }
  try {
    const res = await fetch(url, init);
    const text = await res.text();
    return { content: [{ type: "text", text: `HTTP ${res.status}\n${text}` }] };
  } catch (e) {
    return { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
