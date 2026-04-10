# lazymac-mcp

> Unified MCP server exposing 36+ [lazymac](https://api.lazy-mac.com) developer APIs as tools for Claude Code, Cursor, Windsurf, and any MCP client.

[![smithery badge](https://smithery.ai/badge/@lazymac/mcp)](https://smithery.ai/server/@lazymac/mcp)

## Tools (15+ shipped, 36 in roadmap)

- **qr_generate** — QR codes (PNG/SVG)
- **url_shorten** — URL shortener with analytics
- **ip_geo** — IP geolocation (country, city, ASN, tz)
- **tech_stack_detect** — Detect any site's tech stack (BuiltWith alt)
- **ai_cost_calc** — Estimate token cost across GPT-4 / Claude / Gemini / Haiku
- **llm_router** — Auto-pick cheapest LLM that meets quality bar
- **k_privacy_scan** — Korean PIPA compliance scan (60s)
- **k_govdata** — Korean public data as English JSON
- **k_exchange_rate** — KRW rates + BOK base rate + CPI
- **korean_nlp** — Morpheme/sentiment/keyword for Korean text
- **ai_provider_status** — Live status of OpenAI/Anthropic/Google
- **fake_data** — Test data generator
- **regex_test** — Test/explain/generate regex
- **seo_analyze** — Page SEO audit
- **email_validate** — Email syntax + MX + disposable detection

## Install (Claude Desktop / Code)

```json
{
  "mcpServers": {
    "lazymac": {
      "command": "npx",
      "args": ["-y", "@lazymac/mcp"]
    }
  }
}
```

## Install via Smithery

```bash
npx -y @smithery/cli install @lazymac/mcp --client claude
```

## Backed by

- **REST**: https://api.lazy-mac.com (36+ APIs on Cloudflare Workers, p95 < 200ms)
- **Marketplaces**: Gumroad, RapidAPI, Apify, ProxyGate
- **Author**: [@lazymac2x](https://github.com/lazymac2x)

## License

MIT

<sub>💡 Host your own stack? <a href="https://m.do.co/c/c8c07a9d3273">Get $200 DigitalOcean credit</a> via lazymac referral link.</sub>
