"""
RAG pipeline — public version (state-level only).
Adapted from src/rag/rag_pipeline.py in backend-tia.
"""
import logging
import time
from dataclasses import dataclass
from neo4j import Driver

from .retriever import Retriever
from .context_builder import build_state_context
from .prompt_templates import STATE_ANALYSIS, STATE_ANALYSIS_EN
from .llm_client import get_llm_client

logger = logging.getLogger(__name__)


@dataclass
class RAGResponse:
    answer:       str
    context_len:  int = 0
    latency_ms:   int = 0
    model_used:   str = ""
    data_quality: str = "desconhecido"
    granularity:  str = "estado"


class RAGPipeline:
    def __init__(self, driver: Driver, database: str = "neo4j"):
        self._retriever = Retriever(driver, database=database)
        self._llm = get_llm_client()

    def ask_about_state(self, uf: str, question: str, language: str = "pt-BR") -> RAGResponse:
        t0 = time.time()
        ctx_dict = self._retriever.get_state_context(uf)
        if not ctx_dict:
            return RAGResponse(answer=f"Estado {uf} não encontrado.", granularity="estado")

        context_str = build_state_context(ctx_dict)
        template = STATE_ANALYSIS_EN if language == "en" else STATE_ANALYSIS
        answer = self._llm.ask(context_str, question, template, language=language)
        return RAGResponse(
            answer=answer,
            context_len=len(context_str),
            latency_ms=int((time.time() - t0) * 1000),
            model_used=type(self._llm).__name__,
            granularity="estado",
        )
