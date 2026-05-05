# src/api/errors.py
"""
API error hierarchy — 3 classes, zero ambiguity.

UserError   (400) — caller problem: invalid input, missing field
NotFound    (404) — entity not found in graph: student, school, municipality, state
ServiceError(503) — internal failure: Neo4j offline, model not loaded, LLM timeout

Any unhandled exception is caught by make_unhandled_response → 503.
Stack traces NEVER reach the client — only the internal logger.

Why 503 and not 500 for internal errors:
  503 signals to the caller that a retry is possible later.
  500 indicates an unrecoverable programming error. Using 503 avoids
  false-positive alerts in monitoring systems that treat 500 as critical.
"""
import logging
import uuid
from fastapi import Request
from fastapi.responses import JSONResponse
from .schemas.common import ErrorResponse

logger = logging.getLogger(__name__)


class AppError(Exception):
    status_code: int = 500
    error_code:  str = "internal_error"

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class UserError(AppError):
    """Entrada inválida — problema do caller. HTTP 400."""
    status_code = 400
    error_code  = "bad_request"


class NotFound(AppError):
    """Entidade não encontrada no grafo. HTTP 404."""
    status_code = 404
    error_code  = "not_found"


class ServiceError(AppError):
    """Falha interna: Neo4j, modelo MLflow, LLM. HTTP 503."""
    status_code = 503
    error_code  = "service_unavailable"


def _get_request_id(req: Request) -> str:
    return getattr(req.state, "request_id", str(uuid.uuid4())[:8])


def make_error_response(req: Request, exc: AppError) -> JSONResponse:
    request_id = _get_request_id(req)
    logger.error(
        "AppError code=%s message=%s request_id=%s path=%s",
        exc.error_code, exc.message, request_id, req.url.path,
    )
    body = ErrorResponse(
        request_id=request_id,
        error_code=exc.error_code,
        message=exc.message,
    )
    return JSONResponse(status_code=exc.status_code, content=body.model_dump())


def make_unhandled_response(req: Request, exc: Exception) -> JSONResponse:
    """
    Handler de último recurso. Captura qualquer exceção não prevista.
    Loga o stack trace internamente mas nunca expõe detalhes ao cliente.
    """
    request_id = _get_request_id(req)
    logger.exception(
        "Unhandled exception request_id=%s path=%s type=%s",
        request_id, req.url.path, type(exc).__name__,
    )
    body = ErrorResponse(
        request_id=request_id,
        error_code="service_unavailable",
        message="Erro interno. Tente novamente em instantes.",
    )
    return JSONResponse(status_code=503, content=body.model_dump())
