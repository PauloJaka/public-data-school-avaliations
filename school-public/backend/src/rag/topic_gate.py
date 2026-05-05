"""
Topic gate — pre-LLM filter for education-related questions.

Blocks off-topic queries (greetings, recipes, jokes, etc.) BEFORE the
retriever or LLM is called, saving API credits and preventing hallucination.

Strategy: keyword allowlist with accent-stripped matching.
If zero education keywords are found in the user's question → reject.
"""

import re
import unicodedata
import logging

logger = logging.getLogger(__name__)

# ─── Education keyword allowlist (PT-BR + EN) ────────────────────────────────
# Organized by category. Each entry is matched as a whole-word boundary (\b).
# Accents are stripped from both the question and the keywords before matching.

_KEYWORDS_PT = {
    # Instituições
    "escola", "escolas", "escolar", "escolares", "colegio", "colegios",
    "universidade", "universidades", "faculdade", "faculdades",
    "creche", "creches", "campus", "instituto", "institutos",
    "rede publica", "rede privada", "rede municipal", "rede estadual",
    "rede federal", "escola publica", "escola privada",
    # Níveis de ensino
    "educacao", "ensino", "ensino fundamental", "ensino medio",
    "educacao infantil", "educacao basica", "educacao superior",
    "graduacao", "pos-graduacao", "mestrado", "doutorado",
    "anos iniciais", "anos finais", "serie", "series",
    "eja", "educacao de jovens",
    # Métricas e avaliações
    "ideb", "saeb", "enem", "pisa", "prova brasil", "provinha",
    "nota", "notas", "pontuacao", "media", "desempenho",
    "indice", "indicador", "indicadores", "meta", "metas",
    "proficiencia", "avaliacao", "avaliacoes",
    "taxa de aprovacao", "taxa de reprovacao", "taxa de abandono",
    "fluxo escolar", "distorcao idade-serie", "distorcao",
    # Pessoas
    "aluno", "alunos", "aluna", "alunas", "estudante", "estudantes",
    "professor", "professores", "professora", "professoras",
    "docente", "docentes", "pedagogo", "pedagoga", "diretor", "diretora",
    "coordenador", "coordenadora", "gestor", "gestora",
    "funcionario", "funcionarios", "servidor", "servidores",
    # Fontes de dados
    "pnad", "ibge", "inep", "qedu", "censo escolar", "censo",
    "atlas brasil", "ipea", "pnud", "datasus",
    "microdados", "sinopse", "sinopse estatistica",
    # Fenômenos educacionais
    "evasao", "abandono", "dropout", "reprovacao", "aprovacao",
    "repetencia", "matricula", "matriculas", "frequencia",
    "infrequencia", "absenteismo", "retencao",
    "conclusao", "diplomacao", "formatura",
    "defasagem", "atraso escolar",
    # Currículo e pedagogia
    "curriculo", "curricular", "disciplina", "disciplinas",
    "matematica", "portugues", "lingua portuguesa", "ciencias",
    "historia", "geografia", "aprendizagem", "aprendizado",
    "alfabetizacao", "letramento", "leitura", "escrita",
    "competencia", "competencias", "habilidade", "habilidades",
    "pedagogia", "pedagogico", "pedagogica", "didatica", "didatico",
    "metodologia", "ativo", "ativa",
    # Equidade e diversidade
    "equidade", "desigualdade", "desigualdades", "igualdade",
    "racial", "raciais", "raca", "cor", "etnia",
    "genero", "feminino", "masculino", "paridade",
    "renda", "pobreza", "vulnerabilidade", "vulneravel",
    "inclusao", "inclusiva", "deficiencia", "especial",
    "quilombola", "indigena", "indigenas", "rural", "urbano",
    "periferia", "periferica", "favela",
    # Infraestrutura escolar
    "infraestrutura", "laboratorio", "laboratorios",
    "biblioteca", "bibliotecas", "quadra", "quadras",
    "informatica", "computador", "computadores", "internet",
    "acessibilidade", "saneamento", "agua", "esgoto",
    "merenda", "alimentacao escolar", "cantina",
    "transporte escolar", "transporte",
    # Políticas e programas
    "fundeb", "fundef", "pnae", "pnld", "pnate",
    "bncc", "pne", "plano nacional", "plano estadual", "plano municipal",
    "bolsa familia", "bolsa escola", "prouni", "fies", "sisu",
    "mais educacao", "programa", "programas", "politica publica",
    "politicas publicas", "legislacao", "lei", "ldb",
    "conselho", "conselhos", "secretaria de educacao", "seduc", "mec",
    # Financiamento
    "investimento", "orcamento", "gasto", "gastos",
    "custo aluno", "financiamento", "recurso", "recursos",
    "piso salarial", "salario", "remuneracao", "carreira",
    # ML / modelo
    "risco", "previsao", "modelo", "ml", "machine learning",
    "clustering", "agrupamento", "score",
    # Localidades e panorama
    "estado", "estados", "municipio", "municipios", "cidade", "cidades",
    "brasil", "brasileira", "brasileiro", "nacional", "regional", "regiao",
    "uf", "acre", "alagoas", "amapa", "amazonas", "bahia", "ceara",
    "distrito federal", "espirito santo", "goias", "maranhao", "mato grosso",
    "mato grosso do sul", "minas gerais", "para", "paraiba", "parana",
    "pernambuco", "piaui", "rio de janeiro", "rio grande do norte",
    "rio grande do sul", "rondonia", "roraima", "santa catarina", "sao paulo",
    "sergipe", "tocantins", "sp", "ba", "rj", "mg", "ce", "pe", "pr", "rs",
    "sc", "go", "df", "pb", "ma", "rn", "al", "se", "pi", "to", "pa", "ap",
    "rr", "ro", "am", "ac", "ms", "mt", "es",
    # Termos de resumo
    "resumo", "dados", "informacao", "informacoes", "panorama", "geral",
    "visao geral", "analise", "relatorio", "cenario",
}

_KEYWORDS_EN = {
    # Institutions
    "school", "schools", "university", "universities", "college", "colleges",
    "campus", "institute", "institutes", "kindergarten", "daycare",
    "public school", "private school", "charter school",
    # Education levels
    "education", "elementary", "middle school", "high school",
    "primary", "secondary", "higher education", "undergraduate",
    "graduate", "postgraduate", "k-12",
    "early years", "later years", "grade", "grades",
    # Metrics and assessments
    "ideb", "saeb", "enem", "pisa",
    "score", "scores", "achievement", "performance", "proficiency",
    "index", "indicator", "indicators", "target", "benchmark",
    "assessment", "evaluation", "exam", "exams", "test", "testing",
    "pass rate", "fail rate", "dropout rate", "completion rate",
    "age-grade distortion",
    # People
    "student", "students", "pupil", "pupils",
    "teacher", "teachers", "professor", "professors",
    "educator", "educators", "principal", "principals",
    "staff", "faculty",
    # Data sources
    "pnad", "ibge", "inep", "qedu", "census", "microdata",
    "atlas brasil", "dataset",
    # Educational phenomena
    "dropout", "dropouts", "retention", "enrollment",
    "attendance", "absenteeism", "truancy",
    "graduation", "completion", "repetition",
    "literacy", "illiteracy", "numeracy",
    "learning", "teaching", "instruction",
    # Curriculum and pedagogy
    "curriculum", "curricular", "subject", "subjects",
    "mathematics", "math", "reading", "writing", "science",
    "competency", "competencies", "skill", "skills",
    "pedagogy", "pedagogical", "methodology",
    # Equity and diversity
    "equity", "inequality", "equality", "disparity",
    "racial", "race", "ethnicity", "ethnic",
    "gender", "parity", "income", "poverty",
    "vulnerability", "inclusion", "inclusive",
    "disability", "special needs", "indigenous",
    "rural", "urban",
    # Infrastructure
    "infrastructure", "laboratory", "laboratories",
    "library", "libraries", "computer", "computers",
    "internet", "technology", "accessibility",
    "school meals", "school lunch", "transportation",
    # Policies and programs
    "fundeb", "bncc", "pne", "pnae", "pnld",
    "policy", "policies", "public policy",
    "program", "programs", "legislation",
    "ministry of education", "mec", "seduc",
    # Financing
    "investment", "budget", "funding", "expenditure",
    "spending", "cost per student", "salary", "wage",
    # ML / model
    "risk", "prediction", "model", "ml", "machine learning",
    "clustering", "score",
    # Comparison / analysis
    "compare", "comparison", "ranking", "rank",
    "trend", "trends", "evolution", "progress",
    "state", "states", "municipality", "municipalities", "city", "cities",
    "region", "regions", "brazil", "brazilian",
    "summary", "resume", "data", "information", "overview", "analysis",
    "report", "scenario",
}

# Merge all keywords into a single set (all lowercase, accent-stripped)
_ALL_KEYWORDS: set[str] = set()


def _strip_accents(text: str) -> str:
    """Remove accents/diacritics from text (e.g., 'educação' → 'educacao')."""
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def _init_keywords() -> None:
    """Build the merged keyword set on first use (lazy init)."""
    if _ALL_KEYWORDS:
        return
    for kw in _KEYWORDS_PT | _KEYWORDS_EN:
        _ALL_KEYWORDS.add(_strip_accents(kw.lower()))


def is_education_related(question: str) -> bool:
    """
    Check whether a user question is related to education.

    Returns True if at least one education keyword is found in the question.
    Returns False otherwise — the caller should return a hardcoded fallback
    instead of calling the LLM.

    The check is accent-insensitive and case-insensitive.
    Multi-word keywords are matched as substrings; single-word keywords
    use word-boundary matching to avoid false positives.
    """
    _init_keywords()

    normalized = _strip_accents(question.lower().strip())
    # Remove punctuation for cleaner matching
    cleaned = re.sub(r"[^\w\s-]", " ", normalized)

    for kw in _ALL_KEYWORDS:
        if " " in kw:
            # Multi-word keyword: substring match
            if kw in cleaned:
                logger.debug("topic_gate PASS keyword=%r question=%r", kw, question[:80])
                return True
        else:
            # Single-word keyword: word-boundary match
            if re.search(rf"\b{re.escape(kw)}\b", cleaned):
                logger.debug("topic_gate PASS keyword=%r question=%r", kw, question[:80])
                return True

    logger.info("topic_gate BLOCKED question=%r", question[:120])
    return False
