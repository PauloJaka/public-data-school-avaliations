"""
Tests for the topic_gate module — pre-LLM education filter.

Run with: python -m pytest tests/test_topic_gate.py -v
"""

import pytest
from src.rag.topic_gate import is_education_related


# ─── Should PASS (education-related) ────────────────────────────────────────

class TestEducationRelatedPass:
    """Questions that MUST pass the gate and reach the LLM."""

    @pytest.mark.parametrize("question", [
        # PT-BR — direct education questions
        "Como está o IDEB de Sergipe?",
        "Qual a taxa de evasão no Nordeste?",
        "Quantos alunos tem no estado?",
        "Infraestrutura das escolas públicas",
        "O que é o SAEB?",
        "Nota do ENEM no Maranhão",
        "Desempenho dos professores",
        "Taxa de aprovação no ensino médio",
        "Matrícula na educação infantil",
        "Alfabetização no Brasil",
        "Equidade racial na educação",
        "Investimento em educação no estado",
        "Como funciona o FUNDEB?",
        "O que é a BNCC?",
        "Merenda escolar no estado",
        "Transporte escolar zona rural",
        "Biblioteca nas escolas",
        "Laboratório de informática",
        "Risco de evasão escolar",
        "Currículo do ensino fundamental",
        "Distorção idade-série",
        "Desigualdade de renda e educação",
        # EN — direct education questions
        "What is the IDEB score for São Paulo?",
        "School dropout rate in Brazil",
        "Compare IDEB with Japan",
        "How many students are enrolled?",
        "Teacher quality in Northeast",
        "Literacy rate in rural areas",
        "Education policy funding",
        "Public school infrastructure",
        "Student achievement scores",
        "Gender parity in education",
        "What is the equity index?",
        "PNAD education data",
        "School census results",
        # Edge cases that should pass
        "compare education in Sergipe and Bahia",
        "what is PISA?",
        "explain the ml risk model",
        "ranking of states by education",
    ])
    def test_passes(self, question: str) -> None:
        assert is_education_related(question) is True, f"Should PASS: {question!r}"


# ─── Should BLOCK (off-topic) ───────────────────────────────────────────────

class TestOffTopicBlock:
    """Questions that MUST be blocked before reaching the LLM."""

    @pytest.mark.parametrize("question", [
        # Greetings
        "olá",
        "hello",
        "oi, tudo bem?",
        "hi there",
        "bom dia",
        "good morning",
        # Random topics
        "Receita de bolo",
        "Como fazer lasanha?",
        "Me conta uma piada",
        "Tell me a joke",
        "Qual a capital da França?",
        "What is the weather today?",
        "Quem ganhou o jogo de futebol?",
        "Who won the Super Bowl?",
        "Me recomende um filme",
        "Recommend a good book",
        "Como investir na bolsa?",
        "What is Bitcoin?",
        "Qual a idade do universo?",
        "How old is the Earth?",
        "Me ajude a escrever um email",
        "Write me a poem",
        "O que é inteligência artificial?",
        # Empty / gibberish
        "",
        "   ",
        "asdfghjkl",
        "123456",
        "???",
    ])
    def test_blocks(self, question: str) -> None:
        assert is_education_related(question) is False, f"Should BLOCK: {question!r}"


# ─── Accent handling ────────────────────────────────────────────────────────

class TestAccentHandling:
    """Ensure accent stripping works correctly."""

    def test_accented_keyword_matches(self) -> None:
        assert is_education_related("educação no Brasil") is True

    def test_unaccented_keyword_matches(self) -> None:
        assert is_education_related("educacao no Brasil") is True

    def test_mixed_case(self) -> None:
        assert is_education_related("IDEB DE SERGIPE") is True

    def test_uppercase_off_topic(self) -> None:
        assert is_education_related("RECEITA DE BOLO") is False
