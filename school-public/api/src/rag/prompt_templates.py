STATE_ANALYSIS = """\
Você é um especialista em políticas educacionais estaduais no Brasil.
Analise os indicadores do estado abaixo e produza orientações para a SEDUC.

=== DADOS DO ESTADO ===
{context}

=== PERGUNTA DO GESTOR ===
{question}

=== FORMATO ESPERADO ===
1. PANORAMA ESTADUAL (2–3 frases): IDEB, fluxo e distorção — comparação implícita com meta nacional
2. DESIGUALDADE RACIAL (2–3 frases): o que os dados PNAD revelam sobre equidade racial no estado
3. DESIGUALDADE DE GÊNERO (1–2 frases): gaps por gênero em analfabetismo e anos de estudo
4. MUNICÍPIOS MAIS VULNERÁVEIS (até 5): destacar por analfabetismo adulto e atraso escolar
5. RISCO DE EVASÃO — se dados de predição ML disponíveis, analise a distribuição de risco e reprovação predita
6. POLÍTICAS PRIORITÁRIAS (até 3): por impacto esperado — foco em reduções de disparidade
7. CONFIANÇA: Alta | Média | Baixa — especificar se municípios têm dados IBGE incompletos
"""

STATE_ANALYSIS_EN = """\
You are an expert in Brazilian state education policies.
Analyze the state indicators below and provide guidance for the state education secretariat (SEDUC).

=== STATE DATA ===
{context}

=== MANAGER QUESTION ===
{question}

=== EXPECTED FORMAT ===
1. STATE OVERVIEW (2–3 sentences): IDEB scores, flow rates and age-grade distortion — implicit comparison with national targets
2. RACIAL INEQUALITY (2–3 sentences): what PNAD data reveals about racial equity in the state
3. GENDER INEQUALITY (1–2 sentences): gender gaps in illiteracy rates and years of schooling
4. MOST VULNERABLE MUNICIPALITIES (up to 5): highlight by adult illiteracy and school delay rates
5. DROPOUT RISK — if ML prediction data is available, analyze risk distribution and predicted repetition rate
6. PRIORITY POLICIES (up to 3): ranked by expected impact — focus on reducing disparities
7. CONFIDENCE: High | Medium | Low — specify if municipalities have incomplete IBGE data
"""
