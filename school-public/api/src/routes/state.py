"""
Public route /ask/state
Accepts only { "uf": "XX", "question": "...", "language": "pt-BR" }
Rate limit: 5 req/min per IP — no API key required.
"""
import asyncio
import logging
from fastapi import APIRouter, Request, Depends
from neo4j import Driver

from ..limiter import limiter
from ..errors import NotFound, ServiceError
from ..rag.rag_pipeline import RAGPipeline
from ..schemas.rag import AskStateRequest, AskResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def get_pipeline(request: Request) -> RAGPipeline:
    """FastAPI Depends factory — simplifies mocking in unit tests."""
    driver: Driver = request.app.state.neo4j_driver
    db: str = request.app.state.neo4j_db
    return RAGPipeline(driver, database=db)


@router.post("/state", response_model=AskResponse)
@limiter.limit("5/minute")
async def ask_state(
    body: AskStateRequest,
    request: Request,
    pipeline: RAGPipeline = Depends(get_pipeline),
) -> AskResponse:
    """
    Análise estadual via RAG com suporte multilíngue.

    Parâmetros:
        uf       - sigla do estado (2 chars, ex: "SE")
        question - pergunta em linguagem natural (5–500 chars)
        language - idioma da resposta: "pt-BR" (padrão) ou "en"
    """
    req_id = request.state.request_id
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None, pipeline.ask_about_state, body.uf, body.question, body.language
        )
    except Exception as exc:
        logger.error("ask_state_error request_id=%s: %s", req_id, exc)
        raise ServiceError("Falha na geração da resposta. Tente novamente.")

    if "não encontrado" in result.answer.lower():
        raise NotFound(f"Estado '{body.uf}' não encontrado na base.")

    return AskResponse(
        request_id    = req_id,
        latency_ms    = result.latency_ms,
        model_version = result.model_used,
        answer        = result.answer,
        granularity   = result.granularity,
        context_len   = result.context_len,
        data_quality  = result.data_quality,
    )
