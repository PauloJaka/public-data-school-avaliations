# PLAN: Refatoração de Arquitetura, Segurança e Suporte Internacional

**Status**: Planning
**Task Slug**: api-security-english

## 🛑 Socratic Gate

Como exigido pelo nosso protocolo, peço que me responda/valide esses 3 pontos antes que eu escreva qualquer código:

1. **UX de Idioma (Inglês)**: Para oferecer o RAG também em inglês, a melhor arquitetura de API é criarmos um campo opcional `language: str` (default `pt-BR`) no modelo Pydantic do Payload JSON? O modelo LLM receberia as referências locais e formartaria a saída no idioma pedido.
2. **Defesa de LLM contra Injeções**: Você aprova que troquemos a checagem ingênua de palavras ("ignore instruções") por um conjunto de System Prompts extremamente restritivos via Engenharia de Prompt associado a um bloqueio Regex para símbolos perigosos?
3. **Controle de Redes CORS**: Concorda em trancarmos a API removendo o `allow_origins=["*"]` e deixando restrito para liberar apenas os IPs e URLs que vierem definidos na variável de ambiente de `FRONTEND_URL` que você configurará no Railway?

---

## 📋 Task Breakdown

As etapas abaixo consistem da nossa arquitetura pós-refatoração (já adequadas à hospedagem das keys diretamente no Painel do Railway, conforme aprovado):

### Phase 1: Segurança Estrutural
- `[ ]` **Middleware de Proxy**: Injetar o `ProxyHeadersMiddleware` do uvicorn/werkzeug para proteger o Rate Limiter. Isso assegura que 5 requests/min funcionem mesmo mascarados pelo roteador do Railway.
- `[ ]` **Blindagem do CORS**: Substituir configuração Wildcard para uma amarrada através da nova env _(`FRONTEND_URL`)_.
- `[ ]` **Gestão Pydantic-Settings**: Eliminar os longos e soltos `os.environ.get()` e consolidá-los num arquivo de Config global validado em start time. O `GEMINI_API_KEY` irá ser obrigatório neste passo, caso falte, a API recusa ligar por segurança.

### Phase 2: Injeção de Dependências e RAG
- `[ ]` **Refatorar Dependency Injection**: Mover lógica da Rota `/ask/state` aplicando o padrão de dependência nativo FastAPI `Depends(get_pipeline)`.
- `[ ]` **Trava de Prompt Injection**: Adicionar regras estritas no _system prompt_ ao cliente LLM impedido contaminações de dados educacionais que você vai rodar e vazar o comportamento para o publico.

### Phase 3: Expansão Global (Inglês)
- `[ ]` **Adicionar Lang Payload**: Atualizar payload do Request `AskStateRequest` para receber campos de idioma.
- `[ ]` **Tradução no Template de Prompt**: Parametrizar a requisição interna do Retriever e ContextBuilder. Os templates do LLM precisarão saber atuar num sistema RAG multilingue usando a engine do Gemini, que tem excelente absorção sem perdas.

---

## 🤖 Agent Assignments
- **orchestrator**: Coordena a execução da integração multilingue em parceria com a refatoração.
- **backend-specialist**: Executa o código Python para _Pydantic Settings_, adaptação do _Depends()_ e novos payloads na API.
- **security-auditor**: Cuida da arquitetura de Limitação por Proxy, configuração estrita do CORS e injeções de prompt no `llm_client.py`.
