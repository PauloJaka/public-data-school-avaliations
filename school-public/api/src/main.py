"""
T.I.A Public API — src/main.py
Showcase version: state-level only, no individual student or school data.
"""
import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pythonjsonlogger import jsonlogger
from neo4j import GraphDatabase
from slowapi.errors import RateLimitExceeded
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from .limiter import limiter
from .errors import AppError, make_error_response, make_unhandled_response
from .config import settings

# ── Structured logging ────────────────────────────────────────────────────────
handler = logging.StreamHandler()
handler.setFormatter(jsonlogger.JsonFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
logger = logging.getLogger("tia_public")

# ── Lifespan (connects to Neo4j on startup) ───────────────────────────────────
@asynccontextmanager
async def lifespan(application: FastAPI):
    uri  = settings.neo4j_uri
    user = settings.neo4j_user
    pwd  = settings.neo4j_password
    db   = settings.neo4j_database

    driver = GraphDatabase.driver(uri, auth=(user, pwd))
    with driver.session(database=db) as s:
        s.run("RETURN 1").single()
    application.state.neo4j_driver = driver
    application.state.neo4j_db = db
    logger.info("neo4j_connected", extra={"uri": uri})

    yield

    driver.close()
    logger.info("neo4j_disconnected")


# ── App ────────────────────────────────────────────────────────────────────────
ENV = settings.environment

app = FastAPI(
    title="T.I.A — Tecnologia para Inteligência em Aprendizagem",
    description=(
        "RAG público de análise educacional estadual. "
        "Dados QEdu/PNAD + estatísticas calculadas da rede."
    ),
    version="1.0.0",
    docs_url=None if ENV == "production" else "/docs",
    redoc_url=None if ENV == "production" else "/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda req, exc: JSONResponse(
    status_code=429,
    content={"error": "rate_limit", "message": "Limite de requisições atingido. Tente em 1 minuto."},
))

# Forward original client IP from reverse proxies to keep SlowAPI rate limiting accurate
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# CORS locked to env-defined origins to prevent CSRF and phantom usage costs
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Request ID middleware ──────────────────────────────────────────────────────
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request.state.request_id = uuid.uuid4().hex[:8]
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    return response

# ── Error handlers ────────────────────────────────────────────────────────────
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return make_error_response(request, exc)


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    return make_unhandled_response(request, exc)

# ── Routes ────────────────────────────────────────────────────────────────────
from .routes.state import router as state_router  # noqa: E402
app.include_router(state_router, prefix="/ask")

# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "tia-public"}
