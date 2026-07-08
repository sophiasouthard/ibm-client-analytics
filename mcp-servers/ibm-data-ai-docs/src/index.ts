#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// IBM Data & AI Product Catalog
// Keys map to IBM docs product identifiers used in the search API
// ---------------------------------------------------------------------------
const IBM_DATA_AI_PRODUCTS = [
  // ── watsonx platform (SaaS) ───────────────────────────────────────────────
  {
    name: "IBM watsonx (SaaS — all services)",
    key: "SSYOK8",
    docUrl: "https://www.ibm.com/docs/en/watsonx/saas",
    category: "watsonx Platform",
    description:
      "The unified watsonx SaaS platform covering watsonx.ai, watsonx.data, watsonx.governance, and watsonx Orchestrate on IBM Cloud.",
  },
  {
    name: "IBM watsonx.ai",
    key: "SSYOK8",
    docUrl: "https://www.ibm.com/docs/en/watsonx/saas?topic=overview-watsonxai",
    category: "watsonx Platform",
    description:
      "Enterprise AI studio for building, training, validating, tuning, and deploying foundation models and machine learning models. Includes Prompt Lab, AutoAI, Tuning Studio, and Watson Pipelines.",
  },
  {
    name: "IBM watsonx.data",
    key: "SSFHY8",
    docUrl: "https://www.ibm.com/docs/en/watsonxdata/saas",
    category: "watsonx Platform",
    description:
      "Open, hybrid data lakehouse that unifies data access across clouds and on-premises. Built on Apache Iceberg, Presto, Spark, and Milvus. Supports SQL queries, data governance, and vector search for RAG.",
  },
  {
    name: "IBM watsonx.data (on-premises / Software Hub)",
    key: "SSDZ38",
    docUrl: "https://www.ibm.com/docs/en/watsonxdata/sw",
    category: "watsonx Platform",
    description:
      "On-premises/private cloud version of watsonx.data deployed on IBM Software Hub (Cloud Pak for Data). Same lakehouse capabilities as SaaS, air-gapped deployment supported.",
  },
  {
    name: "IBM watsonx.governance",
    key: "SSYOK8",
    docUrl: "https://www.ibm.com/docs/en/watsonx/saas?topic=overview-watsonxgovernance",
    category: "watsonx Platform",
    description:
      "AI governance platform for monitoring, evaluating, and auditing AI models across their full lifecycle. Covers model risk management, bias/fairness detection, explainability, regulatory compliance, and AI FactSheets.",
  },
  {
    name: "IBM watsonx Orchestrate",
    key: "SSAVQO",
    docUrl: "https://www.ibm.com/docs/en/watsonx/orchestrate",
    category: "watsonx Platform",
    description:
      "Agentic AI platform to build, deploy, and manage AI agents and multi-agent systems. Integrates skills, tools, MCP servers, and pre-built automations for HR, sales, procurement, and custom workflows.",
  },
  {
    name: "IBM watsonx.data intelligence",
    key: "SSFHY8_int",
    docUrl: "https://www.ibm.com/docs/en/watsonxdata/intelligence",
    category: "watsonx Platform",
    description:
      "Unifies unstructured enterprise data (documents, emails, web) into an AI-ready data fabric. Provides semantic search, RAG pipeline management, and document intelligence on top of watsonx.data.",
  },
  {
    name: "IBM watsonx.data integration",
    key: "SSFHY8_intg",
    docUrl: "https://www.ibm.com/docs/en/watsonxdata/integration",
    category: "watsonx Platform",
    description:
      "Data integration layer of watsonx.data providing batch and streaming ingestion, DataStage pipelines, CDC, and connectivity across hybrid cloud data sources.",
  },
  // ── Cloud Pak for Data ────────────────────────────────────────────────────
  {
    name: "IBM Cloud Pak for Data",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data",
    category: "Cloud Pak for Data",
    description:
      "On-premises AI and data platform (private cloud). The deployment target for all IBM Data & AI services on Red Hat OpenShift. Includes the full services catalog: Watson Studio, Watson Machine Learning, Data Refinery, DataStage, Knowledge Catalog, and more.",
  },
  {
    name: "IBM Watson Studio",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-watson-studio",
    category: "Cloud Pak for Data",
    description:
      "Collaborative data science and AI development environment. Supports Jupyter notebooks, AutoAI, SPSS Modeler flows, R Studio, and experiment tracking for model development.",
  },
  {
    name: "IBM Watson Machine Learning",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-watson-machine-learning",
    category: "Cloud Pak for Data",
    description:
      "Model deployment and scoring platform. Deploy ML models, foundation models, Python functions, and decision optimization models as REST APIs. Supports online, batch, and streaming deployment.",
  },
  {
    name: "IBM Knowledge Catalog",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-knowledge-catalog",
    category: "Cloud Pak for Data",
    description:
      "Enterprise data catalog and governance platform. Manages metadata, data lineage, business glossaries, data quality rules, access policies, and data classifications (including PII detection).",
  },
  {
    name: "IBM DataStage",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-datastage",
    category: "Cloud Pak for Data",
    description:
      "Enterprise ETL/ELT and data integration platform. Designs and runs batch and streaming data pipelines. Supports 100+ native connectors and Spark-based parallel execution.",
  },
  {
    name: "IBM Data Virtualization",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-data-virtualization",
    category: "Cloud Pak for Data",
    description:
      "Query data in-place across heterogeneous sources (Db2, Oracle, Teradata, S3, etc.) without moving it. Provides a virtual data lake abstraction with governed access control.",
  },
  {
    name: "IBM Data Refinery",
    key: "SSQNUZ",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-data?topic=services-data-refinery",
    category: "Cloud Pak for Data",
    description:
      "Self-service data preparation tool. Cleans, shapes, and transforms structured and unstructured data using a visual flow editor with 300+ built-in operations. Tracks data lineage automatically.",
  },
  {
    name: "IBM OpenPages (GRC)",
    key: "SSFUEU",
    docUrl: "https://www.ibm.com/docs/en/openpages",
    category: "Cloud Pak for Data",
    description:
      "Governance, Risk and Compliance (GRC) platform. Manages enterprise risk frameworks, regulatory compliance (GDPR, BCBS 239, IFRS 9), audit management, policy management, and issue tracking. Part of watsonx.governance.",
  },
  {
    name: "IBM Planning Analytics (TM1)",
    key: "SSD29G",
    docUrl: "https://www.ibm.com/docs/en/planning-analytics",
    category: "Cloud Pak for Data",
    description:
      "Enterprise performance management and financial planning platform. Supports budgeting, forecasting, multi-dimensional OLAP analysis, and what-if scenario modeling.",
  },
  {
    name: "IBM Cognos Analytics",
    key: "SSEP7J",
    docUrl: "https://www.ibm.com/docs/en/cognos-analytics",
    category: "Analytics & BI",
    description:
      "Business intelligence and analytics platform. Self-service dashboards, reports, stories, and AI-powered data exploration. Embeds NLP-based Q&A for natural language querying of data.",
  },
  {
    name: "IBM SPSS Statistics",
    key: "SSLVMB",
    docUrl: "https://www.ibm.com/docs/en/spss-statistics",
    category: "Analytics & BI",
    description:
      "Statistical analysis software for data preparation, descriptive statistics, regression, classification, and predictive modeling. Used in academia, market research, healthcare, and social sciences.",
  },
  {
    name: "IBM SPSS Modeler",
    key: "SS3RA7",
    docUrl: "https://www.ibm.com/docs/en/spss-modeler",
    category: "Analytics & BI",
    description:
      "Visual data science and machine learning workbench. Drag-and-drop pipeline builder for classification, regression, clustering, association rule mining, and time series with 50+ ML algorithms.",
  },
  // ── Databases ─────────────────────────────────────────────────────────────
  {
    name: "IBM Db2 (Linux/Unix/Windows)",
    key: "SSEPGG",
    docUrl: "https://www.ibm.com/docs/en/db2",
    category: "Database",
    description:
      "Enterprise relational database for OLTP and mixed workloads. Supports SQL, JSON, XML, geospatial data, and AI extensions (in-database ML scoring). Latest version: 12.1.",
  },
  {
    name: "IBM Db2 Warehouse",
    key: "SS6NHC",
    docUrl: "https://www.ibm.com/docs/en/db2-warehouse",
    category: "Database",
    description:
      "MPP analytical data warehouse optimized for large-scale analytics and BI. Columnar storage, in-memory BLU acceleration. Available on-prem, cloud, and within Cloud Pak for Data.",
  },
  {
    name: "IBM Db2 for z/OS",
    key: "SSEPEK",
    docUrl: "https://www.ibm.com/docs/en/db2-for-zos",
    category: "Database",
    description:
      "Db2 variant for IBM Z mainframes. Mission-critical OLTP at extreme scale with ACID compliance, AI-accelerated queries, and built-in encryption. Tight integration with z/OS workloads.",
  },
  {
    name: "IBM Db2 for i (AS/400 / IBM i)",
    key: "SSAE4W",
    docUrl: "https://www.ibm.com/docs/en/db2-for-i",
    category: "Database",
    description:
      "Db2 database integrated into the IBM i operating system. Supports SQL, embedded SQL in RPG/COBOL, and is the standard database for all IBM i ERP and business applications.",
  },
  {
    name: "IBM Netezza (on Cloud / SaaS)",
    key: "SSULQD",
    docUrl: "https://www.ibm.com/docs/en/netezza",
    category: "Database",
    description:
      "High-performance cloud data warehouse designed for analytics. Massively parallel Netezza engine deployed as-a-service on AWS, Azure, or IBM Cloud. Near-zero administration.",
  },
  {
    name: "IBM Informix",
    key: "SSGU8G",
    docUrl: "https://www.ibm.com/docs/en/informix-servers",
    category: "Database",
    description:
      "Embeddable, autonomous OLTP database optimized for edge, IoT, and time-series workloads. Supports SQL, JSON, time-series, and spatial data types with minimal DBA overhead.",
  },
  // ── Data Integration & Quality ────────────────────────────────────────────
  {
    name: "IBM DataStage (standalone)",
    key: "SSZJPZ",
    docUrl: "https://www.ibm.com/docs/en/datastage",
    category: "Data Integration",
    description:
      "Standalone DataStage for on-premises ETL/ELT pipelines outside Cloud Pak for Data. Supports parallel processing, 100+ connectors, CDC, and native Spark execution.",
  },
  {
    name: "IBM InfoSphere Information Server",
    key: "SSZJPZ",
    docUrl: "https://www.ibm.com/docs/en/iis",
    category: "Data Integration",
    description:
      "Legacy on-premises data integration platform. Combines DataStage (ETL), QualityStage (data quality), Information Analyzer (profiling), and Metadata Asset Manager.",
  },
  {
    name: "IBM Master Data Management (MDM / Match 360)",
    key: "SSML2U",
    docUrl: "https://www.ibm.com/docs/en/mdm",
    category: "Data Integration",
    description:
      "Enterprise master data management platform. Consolidates and deduplicates customer, product, and reference data using probabilistic matching. Now branded as IBM Match 360 within Cloud Pak for Data.",
  },
  {
    name: "IBM DataStax Astra DB",
    key: "datastax-astra",
    docUrl: "https://www.ibm.com/docs/en/datastax-astra",
    category: "Data Integration",
    description:
      "Serverless NoSQL and vector database built on Apache Cassandra, acquired by IBM in 2025. Provides scalable document, key-value, and vector storage integrated into watsonx.data.",
  },
  // ── AI / Model Services ───────────────────────────────────────────────────
  {
    name: "IBM Watson Discovery",
    key: "SSQR63",
    docUrl: "https://www.ibm.com/docs/en/watson-discovery",
    category: "AI Services",
    description:
      "Intelligent document search and NLP platform. Ingests PDFs, HTML, and Office documents; extracts entities, relations, and sentiment; provides passage retrieval and smart document understanding for RAG pipelines.",
  },
  {
    name: "IBM Watson Natural Language Understanding (NLU)",
    key: "SSPQUF",
    docUrl: "https://www.ibm.com/docs/en/watson-nlu",
    category: "AI Services",
    description:
      "API for extracting entities, keywords, categories, sentiment, emotion, and semantic roles from unstructured text using pre-trained NLP models.",
  },
  {
    name: "IBM watsonx Code Assistant",
    key: "SSVJY2",
    docUrl: "https://www.ibm.com/docs/en/watsonx-code-assistant",
    category: "AI Services",
    description:
      "AI code generation and modernization assistant powered by IBM Granite models. Variants for general development, COBOL/COBOL-to-Java transformation (for Z), and Ansible Lightspeed (for Red Hat).",
  },
  {
    name: "IBM Granite Foundation Models",
    key: "SSYOK8",
    docUrl: "https://www.ibm.com/docs/en/watsonx/saas?topic=models-granite",
    category: "AI Services",
    description:
      "IBM's family of open-source enterprise foundation models (Granite 3.x, Granite-Code, Granite-Embedding, Granite-Vision). Available on watsonx.ai and via HuggingFace. Optimized for enterprise tasks, RAG, and code generation.",
  },
  // ── Streaming / Event Platform ────────────────────────────────────────────
  {
    name: "IBM Event Streams (Kafka)",
    key: "SSVHEW",
    docUrl: "https://www.ibm.com/docs/en/cloud-paks/cp-integration/event-streams",
    category: "Streaming & Events",
    description:
      "Enterprise Apache Kafka service on IBM Cloud and Cloud Pak for Integration. High-throughput event streaming for real-time data pipelines, CDC, and event-driven architectures.",
  },
  {
    name: "Confluent (IBM acquisition — closed April 2, 2026)",
    key: "confluent",
    docUrl: "https://www.ibm.com/products/confluent",
    category: "Streaming & Events",
    description:
      "Confluent Platform and Confluent Cloud — the enterprise data streaming platform built on Apache Kafka and Apache Flink. Acquired by IBM in a ~$11B deal that closed April 2, 2026. Provides real-time event streaming, stream processing, and data-in-motion governance across hybrid cloud. Positions IBM to deliver trusted, continuously flowing data for AI agents and automated workflows.",
  },
] as const;

type Product = (typeof IBM_DATA_AI_PRODUCTS)[number];

// ---------------------------------------------------------------------------
// IBM Data & AI Case Studies Knowledge Base
// ---------------------------------------------------------------------------
const IBM_CASE_STUDIES = [
  {
    customer: "US Open / USTA",
    industry: "Sports & Media",
    products: ["watsonx.data", "watsonx.ai", "watsonx.governance", "IBM Consulting"],
    challenge: "Process millions of real-time tennis data points to generate AI-driven fan insights and commentary during the tournament.",
    solution: "IBM watsonx.data centralizes and curates structured and unstructured US Open data as a hybrid open data lakehouse. watsonx.ai generates real-time player commentary, AI Draws, and fan-facing predictions.",
    results: "Real-time AI insights delivered to millions of fans globally; AI commentary generated within seconds of match events.",
    url: "https://www.ibm.com/case-studies/us-open",
  },
  {
    customer: "Unipol",
    industry: "Insurance",
    products: ["watsonx.ai", "watsonx Orchestrate", "Cloud Pak for Data", "IBM Granite"],
    challenge: "Modernize IT operations across a large insurance group and enable enterprise-wide AI adoption at scale.",
    solution: "Built NAMI — an AI-powered automation platform using watsonx.ai for generative AI use cases and watsonx Orchestrate for agentic workflows.",
    results: "Enterprise-wide AI adoption accelerated; IT operations modernized on hybrid cloud.",
    url: "https://www.ibm.com/case-studies/unipol",
  },
  {
    customer: "Nationwide Building Society",
    industry: "Financial Services / Banking",
    products: ["watsonx.ai", "IBM Consulting"],
    challenge: "Adopt generative AI responsibly while maintaining regulatory compliance and ethical AI standards.",
    solution: "IBM Consulting co-created a comprehensive AI strategy and governance model, identifying high-impact use cases across customer interactions, risk, and fraud detection.",
    results: "Faster processing of customer queries; comprehensive AI governance framework established.",
    url: "https://www.ibm.com/case-studies/nationwide-building-society",
  },
  {
    customer: "BanFast (Sweden)",
    industry: "Construction",
    products: ["watsonx.data"],
    challenge: "Reduce manual data input and use operational data to improve worker health and safety.",
    solution: "Deployed watsonx.data as the central data platform to unify operational data across the business.",
    results: "75% reduction in manual data input; data used to enhance worker health and safety monitoring.",
    url: "https://www.ibm.com/think/insights/ibm-think-2025-watsonx-data",
  },
  {
    customer: "CrushBank",
    industry: "IT Services / Help Desk",
    products: ["watsonx.data"],
    challenge: "IT help desk AI system needed accurate, customer-specific data to resolve tickets faster.",
    solution: "watsonx.data used as a central, governed store for structured and unstructured data.",
    results: "40% increase in tickets resolved per day; reduced average resolution time.",
    url: "https://www.ibm.com/products/watsonx-data",
  },
  {
    customer: "Scuderia Ferrari",
    industry: "Sports / Motorsport",
    products: ["watsonx.data", "watsonx.ai"],
    challenge: "Deliver richer AI-generated race insights to millions of fans using racing telemetry and historical data.",
    solution: "watsonx.data manages and curates racing telemetry; watsonx.ai generates fan-facing insights.",
    results: "Doubled daily active users on global fan app; 35% increase in data engagement.",
    url: "https://www.ibm.com/products/watsonx-data",
  },
  {
    customer: "Lockheed Martin",
    industry: "Aerospace & Defense",
    products: ["watsonx.data", "watsonx.ai"],
    challenge: "Internal AI systems needed cleaner data from large volumes of engineering and operational information.",
    solution: "watsonx.data used to unify and curate engineering and operational data for internal AI systems.",
    results: "Up to 20% improvement in AI response accuracy.",
    url: "https://www.ibm.com/products/watsonx-data",
  },
  {
    customer: "City of Helsinki",
    industry: "Government / Public Sector",
    products: ["watsonx Assistant"],
    challenge: "38,000 city employees needed automation for citizen services and internal workflows.",
    solution: "IBM Consulting built 10 virtual assistants using watsonx Assistant; a multi-chatbot connects capabilities across city departments.",
    results: "Up to 300 citizen contacts handled per day by AI assistants; data silos removed between departments.",
    url: "https://www.ibm.com/products/watsonx/client-quotes",
  },
  {
    customer: "VIA Metropolitan Transit (San Antonio)",
    industry: "Transportation / Public Sector",
    products: ["watsonx Assistant"],
    challenge: "Public transit call center overwhelmed with repetitive FAQs, needed 24/7 multilingual support.",
    solution: "IBM Expert Labs built Ava, a digital assistant using call center data to answer FAQs 24/7 in English and Spanish.",
    results: "3,000 conversations per month; 28,000+ unique users; 150+ questions answered automatically in two languages.",
    url: "https://www.ibm.com/products/watsonx/client-quotes",
  },
] as const;

// ---------------------------------------------------------------------------
// IBM Docs Search API helpers
// ---------------------------------------------------------------------------
const IBM_DOCS_SEARCH_BASE = "https://www.ibm.com/docs/api/v1/search";

interface IBMDocsHit {
  title: string;
  fullurl: string;
  snippet: string;
  date: string;
  product: { key: string; label: string };
  productBreadCrumb: string;
  readTime: number;
}

interface IBMDocsSearchResponse {
  hits: number;
  topics: IBMDocsHit[];
}

async function searchIBMDocs(query: string, productKey?: string, limit = 10): Promise<IBMDocsSearchResponse> {
  const params = new URLSearchParams({ query, lang: "en", limit: String(limit) });
  if (productKey) params.set("product", productKey);
  const resp = await fetch(`${IBM_DOCS_SEARCH_BASE}?${params.toString()}`, {
    headers: { "User-Agent": "ibm-data-ai-docs-mcp/0.1.0" },
  });
  if (!resp.ok) throw new Error(`IBM Docs search failed: ${resp.status} ${resp.statusText}`);
  return (await resp.json()) as IBMDocsSearchResponse;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function fetchDocPage(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: { "User-Agent": "ibm-data-ai-docs-mcp/0.1.0", Accept: "text/html,application/xhtml+xml" },
  });
  if (!resp.ok) throw new Error(`Failed to fetch page: ${resp.status} ${resp.statusText}`);
  const html = await resp.text();
  const articleMatch =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<main[^>]*role="main"[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/<div[^>]*class="[^"]*ibmdocs-topic[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const content = articleMatch ? articleMatch[1] : html;
  return content
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, level, text) => `\n${"#".repeat(parseInt(level))} ${stripHtml(text)}\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${stripHtml(text)}`)
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => `\n${stripHtml(text)}\n`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, text) => `\`${stripHtml(text)}\``)
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 15000);
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer({ name: "ibm-data-ai-docs", version: "0.1.0" });

server.tool(
  "list_ibm_data_ai_products",
  "List every product in the IBM Data & AI portfolio with its category, description, and documentation URL.",
  {
    category: z.enum(["all","watsonx Platform","Cloud Pak for Data","Analytics & BI","Database","Data Integration","AI Services","Streaming & Events"]).optional(),
  },
  async ({ category }) => {
    const filter = category === "all" || !category ? null : category;
    const products: Product[] = filter
      ? (IBM_DATA_AI_PRODUCTS.filter((p) => p.category === filter) as unknown as Product[])
      : (IBM_DATA_AI_PRODUCTS as unknown as Product[]);
    const lines = products.map((p) => `**${p.name}**\n  Category: ${p.category}\n  Docs: ${p.docUrl}\n  Product Key: ${p.key}\n  Description: ${p.description}`);
    return { content: [{ type: "text", text: `# IBM Data & AI Product Portfolio (${products.length} products)\n\n` + lines.join("\n\n") }] };
  }
);

server.tool(
  "search_ibm_docs",
  "Search the IBM documentation site (ibm.com/docs) for any topic across the IBM Data & AI portfolio.",
  {
    query: z.string(),
    product_key: z.string().optional(),
    limit: z.number().min(1).max(20).optional(),
  },
  async ({ query, product_key, limit }) => {
    try {
      const results = await searchIBMDocs(query, product_key, limit ?? 8);
      if (!results.topics?.length) return { content: [{ type: "text", text: `No results found for: "${query}"` }] };
      const lines = results.topics.map((t, i) =>
        `### ${i + 1}. ${stripHtml(t.title)}\n**Product:** ${t.productBreadCrumb || t.product.label}\n**URL:** ${t.fullurl}\n**Updated:** ${t.date}\n> ${stripHtml(t.snippet)}`
      );
      return { content: [{ type: "text", text: `# IBM Docs Search: "${query}"\n*${results.hits.toLocaleString()} total matches*\n\n` + lines.join("\n\n") }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Search failed: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
    }
  }
);

server.tool(
  "fetch_ibm_doc_page",
  "Fetch and read the full content of a specific IBM documentation page (max 15,000 chars).",
  { url: z.string().url() },
  async ({ url }) => {
    if (!url.includes("ibm.com") && !url.includes("confluent.io")) {
      return { content: [{ type: "text", text: "Only ibm.com and confluent.io URLs are supported." }], isError: true };
    }
    try {
      const text = await fetchDocPage(url);
      return { content: [{ type: "text", text: `# IBM Docs Page\n**URL:** ${url}\n\n---\n\n${text}` }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Failed to fetch page: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
    }
  }
);

server.tool(
  "get_product_overview",
  "Get a comprehensive overview of a specific IBM Data & AI product — description, docs URL, and live documentation landing page content.",
  { product_name: z.string() },
  async ({ product_name }) => {
    const lower = product_name.toLowerCase();
    const product = IBM_DATA_AI_PRODUCTS.find(
      (p) => p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase().split(" ").pop()?.toLowerCase() ?? "")
    );
    if (!product) {
      return { content: [{ type: "text", text: `Product "${product_name}" not found. Available: ${IBM_DATA_AI_PRODUCTS.map((p) => p.name).join(", ")}` }] };
    }
    let output = `# ${product.name}\n\n**Category:** ${product.category}\n**Documentation:** ${product.docUrl}\n\n## Description\n${product.description}\n\n`;
    try {
      output += `## Documentation Landing Page\n\n${await fetchDocPage(product.docUrl)}`;
    } catch (_) {
      output += `*Could not fetch live documentation page.*`;
    }
    return { content: [{ type: "text", text: output }] };
  }
);

server.tool(
  "recommend_ibm_products",
  "Given a customer's technology stack and/or business problem, recommend the most relevant IBM Data & AI products with fit reasoning.",
  {
    tech_stack: z.string().optional(),
    business_problem: z.string().optional(),
    industry: z.string().optional(),
  },
  async ({ tech_stack, business_problem, industry }) => {
    if (!tech_stack && !business_problem) {
      return { content: [{ type: "text", text: "Provide at least one of: tech_stack or business_problem." }], isError: true };
    }
    const catalog = IBM_DATA_AI_PRODUCTS.map((p) => `- **${p.name}** (${p.category}): ${p.description}`).join("\n");
    const context =
      `## Customer Context\n` +
      (industry ? `**Industry:** ${industry}\n` : "") +
      (tech_stack ? `**Current Tech Stack:** ${tech_stack}\n` : "") +
      (business_problem ? `**Business Problem:** ${business_problem}\n` : "") +
      `\n## IBM Data & AI Product Catalog\n${catalog}\n\n` +
      `## Instructions\nIdentify the top 3–6 IBM products that best fit. For each, explain: (1) why it fits, (2) business value, (3) integration with existing tools, (4) competitive displacement angle. Also note products that are NOT a fit.`;
    return { content: [{ type: "text", text: context }] };
  }
);

server.tool(
  "get_ibm_case_studies",
  "Browse IBM Data & AI customer case studies. Filter by product or industry.",
  {
    product: z.string().optional(),
    industry: z.string().optional(),
  },
  async ({ product, industry }) => {
    let studies = IBM_CASE_STUDIES as unknown as (typeof IBM_CASE_STUDIES)[number][];
    if (product) { const p = product.toLowerCase(); studies = studies.filter((s) => s.products.some((pr) => pr.toLowerCase().includes(p))); }
    if (industry) { const ind = industry.toLowerCase(); studies = studies.filter((s) => s.industry.toLowerCase().includes(ind)); }
    if (!studies.length) return { content: [{ type: "text", text: `No case studies found for the given filters.` }] };
    const lines = studies.map((s) =>
      `### ${s.customer} — ${s.industry}\n**Products:** ${s.products.join(", ")}\n**Challenge:** ${s.challenge}\n**Solution:** ${s.solution}\n**Results:** ${s.results}\n**Source:** ${s.url}`
    );
    return { content: [{ type: "text", text: `# IBM Data & AI Case Studies (${studies.length} match${studies.length === 1 ? "" : "es"})\n\n` + lines.join("\n\n---\n\n") }] };
  }
);

server.tool(
  "fetch_ibm_case_study",
  "Fetch and read the full content of a specific IBM case study page from ibm.com/case-studies.",
  { url: z.string().url() },
  async ({ url }) => {
    if (!url.includes("ibm.com")) return { content: [{ type: "text", text: "Only ibm.com case study URLs are supported." }], isError: true };
    try {
      const text = await fetchDocPage(url);
      return { content: [{ type: "text", text: `# IBM Case Study\n**URL:** ${url}\n\n---\n\n${text}` }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Failed to fetch: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ibm-data-ai-docs MCP server running on stdio");
}

main().catch((err) => { console.error("Fatal error:", err); process.exit(1); });
