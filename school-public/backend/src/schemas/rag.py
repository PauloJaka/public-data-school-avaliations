from typing import Literal, Optional
from pydantic import BaseModel, Field


class AskStateRequest(BaseModel):
    uf: str = Field(..., min_length=2, max_length=2, description="Brazilian state code (e.g. SE, BA, SP)")
    question: str = Field(..., min_length=5, max_length=500)
    language: Literal["pt-BR", "en"] = Field(
        default="pt-BR",
        description="Response language: 'pt-BR' (default) or 'en' for English."
    )


class AskResponse(BaseModel):
    request_id:    str
    latency_ms:    int
    model_version: str
    answer:        str
    granularity:   str = "estado"
    context_len:   int = 0
    data_quality:  str = "desconhecido"
