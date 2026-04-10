#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Auto-generated from lazymac product-registry.json (2026-04-10)
// 36 tools backed by https://api.lazy-mac.com — REST + MCP, sub-200ms p95
const TOOLS = [
  // ── AI & FinOps ──────────────────────────────────────────
  { name: "ai_cost_calculator", route: "/ai-cost", method: "GET", desc: "Estimate token cost across GPT-4 / Claude / Gemini / Haiku — compare 30+ models" },
  { name: "ai_spend_tracker", route: "/ai-spend", method: "POST", desc: "Track AI spending across OpenAI / Anthropic / Google with budgets and alerts" },
  { name: "ai_budget_planner", route: "/ai-budget-planner", method: "POST", desc: "Allocate AI budget per team, threshold alerts, weekly digest reports" },
  { name: "ai_token_counter", route: "/ai-token-counter", method: "GET", desc: "Pre-flight token counting for GPT-4 / Claude / Gemini before requests" },
  { name: "ai_provider_status", route: "/ai-provider-status", method: "GET", desc: "Real-time status / latency / incident feed for OpenAI / Anthropic / Google" },
  { name: "ai_rate_limit_tracker", route: "/ai-rate-limit-tracker", method: "POST", desc: "Track and forecast AI provider rate limits across all API keys" },
  { name: "llm_router", route: "/llm-router", method: "POST", desc: "Auto-pick cheapest LLM (GPT-4 / Claude / Haiku) that meets your quality bar" },
  { name: "llm_pricing", route: "/llm-pricing", method: "GET", desc: "50+ LLM models with real-time pricing per token" },
  { name: "prompt_optimizer", route: "/prompt-opt", method: "POST", desc: "Optimize prompts for cost, quality, and consistency" },
  { name: "prompt_shield", route: "/prompt-shield", method: "POST", desc: "Prompt injection / jailbreak / PII detection for LLM inputs" },

  // ── Developer Tools ───────────────────────────────────────
  { name: "qr_code", route: "/qr", method: "GET", desc: "Generate QR codes (PNG/SVG) for URLs, vCards, WiFi, email, SMS" },
  { name: "url_shortener", route: "/url", method: "POST", desc: "Shorten URLs with click tracking, geo stats, sub-10ms redirects" },
  { name: "ip_geolocation", route: "/ip", method: "GET", desc: "IP → country, city, coordinates, timezone, ISP, ASN" },
  { name: "fake_data_generator", route: "/fake", method: "GET", desc: "Generate fake names, emails, addresses, JSON for testing" },
  { name: "regex_toolkit", route: "/regex", method: "POST", desc: "Test, match, explain, and generate regex patterns in plain English" },
  { name: "json_schema_validator", route: "/json-schema", method: "POST", desc: "Auto-infer schemas, validate, generate TypeScript, mock data, diffs" },
  { name: "data_transform", route: "/transform", method: "POST", desc: "JSON / CSV / XML conversion, flatten, filter, sort, aggregate" },
  { name: "diff_patch_tools", route: "/diff", method: "POST", desc: "LCS-based text diffing, unified patch generate / apply" },
  { name: "markdown_tools", route: "/markdown", method: "POST", desc: "Markdown ↔ HTML, TOC extraction, link extraction, linting" },
  { name: "cron_parser", route: "/cron", method: "GET", desc: "Cron expression parser — explain, validate, generate, next runs" },
  { name: "timezone", route: "/timezone", method: "GET", desc: "400+ city timezone converter, DST-aware, meeting planner" },
  { name: "webhook_inspector", route: "/webhook", method: "POST", desc: "Capture, store, and replay webhook payloads — debug integrations" },
  { name: "text_analysis", route: "/text", method: "POST", desc: "Sentiment, readability, keyword extraction, language detection" },
  { name: "email_validator", route: "/email", method: "GET", desc: "8-layer email validation — syntax / MX / disposable / typo correction" },
  { name: "password_strength", route: "/password", method: "POST", desc: "Entropy, crack-time, common-password check (zxcvbn alt)" },

  // ── Design / Content ──────────────────────────────────────
  { name: "color_palette", route: "/color", method: "GET", desc: "HEX/RGB/HSL/CMYK conversion, harmonies, WCAG contrast, gradients" },
  { name: "placeholder_image", route: "/placeholder", method: "GET", desc: "SVG / PNG placeholders, avatar initials, geometric patterns" },
  { name: "font_metadata", route: "/font", method: "GET", desc: "102 Google Fonts metadata, 35 curated pairings, CSS generation" },
  { name: "seo_analyzer", route: "/seo", method: "GET", desc: "Page-level SEO audit — meta tags, headings, links, alt text" },
  { name: "tech_stack_detector", route: "/tech-stack", method: "GET", desc: "Detect 150+ technologies on any URL — BuiltWith alternative" },

  // ── Crypto / Trading ──────────────────────────────────────
  { name: "crypto_signal", route: "/crypto-signal", method: "GET", desc: "Real-time signals: SMA, RSI, MACD, Bollinger for 100+ pairs" },
  { name: "crypto_tax_calculator", route: "/crypto-tax", method: "POST", desc: "FIFO/LIFO/Average cost basis, multi-exchange, DeFi, staking" },

  // ── Security / Business ───────────────────────────────────
  { name: "smart_contract_scanner", route: "/smart-contract", method: "POST", desc: "Solidity vuln scan — reentrancy, overflow, access control" },
  { name: "startup_valuation", route: "/valuation", method: "POST", desc: "7 valuation methods (DCF, Berkus, Scorecard, VC, comparables)" },

  // ── Korean (K-MCP) ────────────────────────────────────────
  { name: "k_market_intel", route: "/kr-market", method: "GET", desc: "Korean financial data — KOSPI / KOSDAQ, stocks, FX, Kimchi Premium" },
  { name: "k_public_data", route: "/kr-data", method: "GET", desc: "Korean government data in English — weather, FX, holidays, transport" },
  { name: "k_address_tools", route: "/kr-address", method: "GET", desc: "Korean address normalize, parse, validate, geocode, postal code" },
  { name: "k_business_validator", route: "/kr-biz", method: "GET", desc: "Validate Korean BRN (사업자등록번호), corp registration, phones" },
  { name: "k_exchange_rate", route: "/k-exchange-rate", method: "GET", desc: "KRW exchange rate + BOK base rate + CPI (real-time + history)" },
  { name: "k_company_lookup", route: "/k-company-lookup", method: "GET", desc: "Korean company lookup by business registration number" },
  { name: "k_address_geocoder", route: "/k-address-geocoder", method: "GET", desc: "Korean address geocoder + reverse geocoder (road / lot)" },
];

export default function createServer({ config } = {}) {
  const apiBase = (config && config.apiBase) || process.env.LAZYMAC_API_BASE || "https://api.lazy-mac.com";
  const apiKey = (config && config.apiKey) || process.env.LAZYMAC_API_KEY || "";
  const server = new Server(
    { name: "lazymac-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.desc,
      inputSchema: {
        type: "object",
        properties: { params: { type: "object", description: "Free-form params object — passed as query string for GET, JSON body for POST" } },
      },
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = TOOLS.find((t) => t.name === request.params.name);
    if (!tool) {
      return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
    }
    const args = (request.params.arguments && request.params.arguments.params) || {};
    let url = `${apiBase}${tool.route}`;
    const init = {
      method: tool.method,
      headers: { "User-Agent": "lazymac-mcp/1.0.0", ...(apiKey ? { "X-API-Key": apiKey } : {}) },
    };
    if (tool.method === "GET") {
      const qs = new URLSearchParams(
        Object.entries(args).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)])
      ).toString();
      if (qs) url += `?${qs}`;
    } else {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(args);
    }
    try {
      const res = await fetch(url, init);
      const text = await res.text();
      const upgradeHint = res.status === 402
        ? `\n\n💡 Free tier exceeded. Upgrade for unlimited: https://api.lazy-mac.com/pricing`
        : "";
      return { content: [{ type: "text", text: `HTTP ${res.status}\n${text}${upgradeHint}` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true };
    }
  });

  return server;
}

export function createSandboxServer() {
  return createServer({ config: { apiBase: "https://api.lazy-mac.com" } });
}

const isMain = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("index.js");
if (isMain) {
  (async () => {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
  })();
}
