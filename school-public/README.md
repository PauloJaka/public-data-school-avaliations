# T.I.A — Technology for Learning Intelligence (Public API)

A public RAG system for Brazilian state-level educational analysis. Technical portfolio showcasing a **Knowledge Graph + RAG + ML** pipeline applied to education policy.

---

## What is T.I.A?

**T.I.A** (Tecnologia para Inteligência em Aprendizagem) is an educational intelligence system that combines:

- **Knowledge Graph** (Neo4j) loaded with QEdu, PNAD and calculated school network statistics for all 27 Brazilian states
- **RAG pipeline** (Retrieval-Augmented Generation) to answer natural-language questions about educational indicators
- **ML models** (XGBoost + GBM) for dropout and grade-failure risk prediction — aggregated at the state level

> This public version exposes **state-level data only**. No individual student, school, or classroom data is stored or returned.

---

## API Usage

### Ask a question in Portuguese

```bash
curl -X POST https://your-url.railway.app/ask/state \
  -H "Content-Type: application/json" \
  -d '{
    "uf": "SE",
    "question": "Qual o panorama da educação em Sergipe?",
    "language": "pt-BR"
  }'
```

### Ask a question in English

```bash
curl -X POST https://your-url.railway.app/ask/state \
  -H "Content-Type: application/json" \
  -d '{
    "uf": "BA",
    "question": "What are the main dropout risk factors in this state?",
    "language": "en"
  }'
```

### Available endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/ask/state` | State-level educational analysis via RAG |
| `GET`  | `/health`    | Health check |

---

## Request & Response

### Request body

```json
{
  "uf": "SE",
  "question": "What is the dropout risk profile for this state?",
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uf` | `string` | ✅ | Brazilian state code — 2 uppercase letters (e.g. `SE`, `BA`, `SP`) |
| `question` | `string` | ✅ | Natural-language question — 5 to 500 characters |
| `language` | `string` | ❌ | Response language: `"pt-BR"` (default) or `"en"` |

### Response body

```json
{
  "request_id": "a1b2c3d4",
  "latency_ms": 3200,
  "model_version": "GeminiProvider",
  "answer": "1. STATE OVERVIEW: Sergipe presents an IDEB score of 4.2 in upper primary...",
  "granularity": "estado",
  "context_len": 1840,
  "data_quality": "desconhecido"
}
```

### What you can ask

The RAG pipeline retrieves real state-level data and uses it as context for the LLM. Useful question types:

- **IDEB and quality** — "How does this state compare to the national IDEB target?"
- **Dropout and failure** — "What is the dropout risk distribution in this state?"
- **Racial inequality** — "What do PNAD indicators reveal about racial gaps in education here?"
- **Gender gaps** — "Are there significant gender disparities in literacy and years of schooling?"
- **Vulnerable municipalities** — "Which municipalities in this state have the highest adult illiteracy rates?"
- **Policy priorities** — "What are the top 3 interventions this state should prioritize?"

---

## Architecture

```
POST /ask/state
      │
      ▼
 FastAPI (Python 3.11)
      │  Cypher query — :State + :Municipality nodes only
      ▼
 Neo4j 5.18
      │  QEdu + PNAD + pub_* (calculated stats + ML predictions)
      ▼
 Context Builder
      │  serializes graph data into structured text (~16K chars max)
      ▼
 LLM Provider (Gemini / OpenAI / Ollama)
      │  system prompt selects PT-BR or EN template
      ▼
 Natural-language response
```

### Data available per state

Each `:State` node contains:

| Category | Fields |
|----------|--------|
| **QEdu** | IDEB (grades 1–5, 6–9, 10–12), flow rates, dropout/failure rates, age-grade distortion, Portuguese & Math proficiency |
| **PNAD** | Racial and gender equity indicators (illiteracy, years of schooling, school attendance) |
| **Network stats** (`pub_*`) | Total schools/students analyzed, average absenteeism, % Bolsa Família recipients, students with disabilities |
| **ML predictions** (`pub_pct_risco_*`) | Dropout risk distribution (low/medium/high/critical) and predicted failure rate |

States with calculated network data are flagged with `pub_tem_dados_calculados: true`.

---

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tia-public
cd tia-public

# 2. Configure environment
cp .env.example .env
# Edit .env — set GEMINI_API_KEY and NEO4J_PASSWORD

# 3. Start containers
docker compose up -d

# 4. Wait for Neo4j seed (~60s on first run)
docker compose logs neo4j -f

# 5. Test the API
curl -X POST http://localhost:8000/ask/state \
  -H "Content-Type: application/json" \
  -d '{"uf": "SE", "question": "What is the education profile of this state?", "language": "en"}'
```

---

## Security & Privacy

- **No individual data** — no `:Student`, `:School`, or `:Classroom` nodes exist in the graph
- **Strict input validation** — Pydantic rejects any extra fields with `422`
- **Rate limiting** — 5 requests/minute per IP (or per `X-API-Key` header if provided)
- **OpenAPI docs disabled** in production (`ENVIRONMENT=production`)
- **ML predictions** are offline-generated aggregates — no individual risk scores are stored or returned
- **Prompt injection protection** — regex-based sanitization blocks instruction-injection attempts

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| API | FastAPI 0.111 + Uvicorn |
| Graph DB | Neo4j 5.18 Community |
| LLM | Google Gemini 1.5 Flash (default) · OpenAI GPT-4o Mini · Ollama (local) |
| ML models | XGBoost (dropout EF1) + GBM (grades EF2) |
| Deployment | Railway (Docker Compose) |
| Language | Python 3.11 |

---

## Data Sources

| Source | Description |
|--------|-------------|
| **QEdu** | Public educational indicators from MEC/INEP |
| **PNAD** | National Household Survey by IBGE |
| **School network** | Calculated statistics from partner school network data — anonymized and aggregated at state level |
