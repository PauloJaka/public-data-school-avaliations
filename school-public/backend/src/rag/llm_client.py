import logging
import re
from abc import ABC, abstractmethod

from ..config import settings

logger = logging.getLogger(__name__)

_MAX_TOKENS_OUT = 4096
_TEMPERATURE = 0.2

# Prompt injection patterns with multilingual coverage (PT + EN)
_INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?previous", re.IGNORECASE),
    re.compile(r"ignore\s+(todas\s+as\s+)?instru", re.IGNORECASE),
    re.compile(r"system\s*prompt", re.IGNORECASE),
    re.compile(r"\[INST\]|<SYS>|<<SYS>>"),          # Llama injection tokens
    re.compile(r"act\s+as\s+a", re.IGNORECASE),
    re.compile(r"you\s+are\s+now", re.IGNORECASE),
    re.compile(r"(print|reveal|show)\s+(your\s+)?(prompt|instructions|context)", re.IGNORECASE),
]


class LLMProvider(ABC):
    """
    Abstract base class for LLM provider implementations.

    Defines the interface for pluggable LLM backends (OpenAI, Gemini, Ollama).
    Each implementation encapsulates API client initialization, authentication,
    and response generation with consistent hyperparameters.
    """

    def _sanitize(self, question: str) -> str:
        """
        Protege contra Prompt Injection via Regex multilíngue.
        Retorna sentinela segura se detectar padrão de ataque.
        """
        for pattern in _INJECTION_PATTERNS:
            if pattern.search(question):
                logger.warning("prompt_injection_blocked question_preview=%s", question[:80])
                return "[SAFE_FALLBACK] Responda que a pergunta contém instruções não permitidas neste sistema."
        # Limpa caracteres de controle que possam escapar do template
        return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", question)

    @abstractmethod
    def ask(self, context: str, question: str, template: str, language: str = "pt-BR") -> str:
        """Generate a synthesis response in the given language."""
        ...


class OpenAIProvider(LLMProvider):
    """
    OpenAI GPT provider with default gpt-4o-mini configuration.

    This provider offers the best cost-to-performance ratio for Portuguese text
    synthesis. Uses OpenAI Chat Completions API with streaming-compatible output.
    """

    def __init__(self) -> None:
        from openai import OpenAI

        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY não configurada. Defina a variável no Railway.")
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model_name = settings.openai_model

    def ask(self, context: str, question: str, template: str, language: str = "pt-BR") -> str:
        """Generate synthesis response using OpenAI Chat Completions API."""
        lang_instruction = f"\n\nIMPORTANT: Respond exclusively in {language}." if language != "pt-BR" else ""
        prompt = template.format(
            context=context,
            question=self._sanitize(question)
        ) + lang_instruction
        response = self._client.chat.completions.create(
            model=self._model_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=_MAX_TOKENS_OUT,
            temperature=_TEMPERATURE,
        )
        return response.choices[0].message.content


class GeminiProvider(LLMProvider):
    """
    Google Gemini provider using the google-genai v1 SDK (free-tier compatible).
    """

    def __init__(self) -> None:
        from google import genai
        from google.genai import types as genai_types

        api_key = settings.gemini_api_key
        if not api_key:
            raise ValueError("GEMINI_API_KEY não configurada. Defina a variável no Railway.")
        self._client = genai.Client(
            api_key=api_key,
            http_options=genai_types.HttpOptions(api_version='v1'),
        )
        self._model_name = settings.gemini_model
        self._types = genai_types

    def ask(self, context: str, question: str, template: str, language: str = "pt-BR") -> str:
        """Generate synthesis response using Google Generative AI v1 API."""
        lang_instruction = f"\n\nIMPORTANT: Respond exclusively in {language}." if language != "pt-BR" else ""
        prompt = template.format(
            context=context,
            question=self._sanitize(question)
        ) + lang_instruction
        response = self._client.models.generate_content(
            model=self._model_name,
            contents=prompt,
            config=self._types.GenerateContentConfig(
                max_output_tokens=_MAX_TOKENS_OUT,
                temperature=_TEMPERATURE,
            ),
        )
        return response.text


class OllamaProvider(LLMProvider):
    """
    Ollama local LLM provider with zero API cost.

    This provider runs open-source models (e.g., Llama 3.2) locally via Ollama,
    suitable for on-premises or air-gapped deployments. Requires adequate CPU/GPU
    resources for acceptable latency.
    """

    def __init__(self) -> None:
        import ollama

        self._client = ollama.Client(host=settings.ollama_base_url)
        self._model_name = settings.ollama_model

    def ask(self, context: str, question: str, template: str, language: str = "pt-BR") -> str:
        """Generate synthesis response using Ollama generate endpoint."""
        lang_instruction = f"\n\nIMPORTANT: Respond exclusively in {language}." if language != "pt-BR" else ""
        prompt = template.format(
            context=context,
            question=self._sanitize(question)
        ) + lang_instruction
        response = self._client.generate(
            model=self._model_name,
            prompt=prompt,
            options={"num_predict": _MAX_TOKENS_OUT, "temperature": _TEMPERATURE},
        )
        return response["response"]


def get_llm_client() -> LLMProvider:
    """
    Factory function to instantiate the configured LLM provider at runtime.

    Reads the `LLM_PROVIDER` environment variable (case-insensitive) and returns
    an instance of the appropriate provider class (OpenAI, Gemini, or Ollama).
    Logs provider selection and model name for debugging. Fails fast with a clear
    error message if the configuration is invalid.

    **Note:** Do not confuse this with the embedding model (sentence-transformers).
    The embedding model is always local (loaded in `student_embedder.get_model()`)
    and never passes through this factory. This factory is exclusive to the LLM
    synthesis backend for generating responses to educational managers.

    Args:
        None

    Returns:
        LLMProvider: Instance of OpenAIProvider, GeminiProvider, or OllamaProvider
            based on `LLM_PROVIDER` environment variable.

    Raises:
        ValueError: If `LLM_PROVIDER` is not one of 'openai', 'gemini', or 'ollama'.

    Examples:
        >>> llm = get_llm_client()  # Uses OpenAI by default
        >>> response = llm.ask(context, question, template)
    """
    provider = settings.llm_provider.lower()
    if provider == "openai":
        logger.info("llm_provider=openai model=%s", settings.openai_model)
        return OpenAIProvider()
    elif provider == "gemini":
        logger.info("llm_provider=gemini model=%s", settings.gemini_model)
        return GeminiProvider()
    elif provider == "ollama":
        logger.info("llm_provider=ollama model=%s", settings.ollama_model)
        return OllamaProvider()
    raise ValueError(
        f"Invalid LLM_PROVIDER: '{provider}'. Expected 'openai', 'gemini', or 'ollama'."
    )
