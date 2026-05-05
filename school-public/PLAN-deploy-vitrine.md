# PLAN: Deploy Vitrine Railway + Neo4j Aura

**Status**: Planning Approved (Socratic Gate Cleared)
**Task Slug**: deploy-vitrine-aura

## 🎯 Objetivo
Realizar o deploy da vitrine `tia-public` utilizando o **Neo4j Aura** (SaaS) como banco de dados em nuvem, mantendo o back-end (FastAPI) hospedado no **Railway**, e criar uma visualização pública e segura do Banco de Dados em Grafo para exibição em portfólio.

---

## 🛑 Socratic Gate (Resoluções)

O Socratic Gate foi resolvido com as seguintes diretrizes:
1. **[Resolvido] Estratégia de Banco:** O projeto usará o **Neo4j Aura** (Free Instance: `c25dde0d`). O ambiente no Railway conectará nativamente a esta URI externa.
2. **[Resolvido] Setup Railway:** O plano do Railway suportará a aplicação web em Python (FastAPI). Por usarmos o Banco gerenciado externo, o Railway não necessitará de Volume atrelado nem containers de estado para dados.
3. **[Resolvido] Visibilidade de Grafos:** O banco será exposto publicamente para visualização da vitrine. *Nota Arquitetural: O Neo4j Aura gratuito não suporta o provisionamento de usuários (RBAC) com permissões exclusivas de "Leitura-apenas" p/ expôr o Neo4j Browser aberto ao mundo com credenciais na nuvem*. A solução projetada no plano abaixo é embarcar uma interface visual (ex: Neovis.js, D3.js ou um iframe do Bloom) diretamente em uma rota Front-end ou painel estático dentro do próprio FastAPI.

---

## 📋 Task Breakdown

As etapas de projeto foram reformuladas contemplando nuvem distribuída (Aura + Railway):

### Phase 1: Conexão Local e Ingestão de Dados (Seed Aura)
- `[ ]` **Testar Conexão Aura**: Validar conexão apontando o ambiente local (`.env`) para `neo4j+s://c25dde0d.databases.neo4j.io`.
- `[ ]` **Script de Seeding Cloud**: Em vez de usar volumes `.cypher` do docker original, rodar um script python (`seed_to_aura.py`) para puxar o Neo4j local / arquivos .cypher e injetar todos os nós e relacionamentos no banco online do Aura.
- `[ ]` **Isolar Repositório (`tia-public`)**: Iniciar repositório Git autônomo sem o histórico gigante, configurar origin p/ o Github vitrine para facilitar a integração com o Railway.
- `[ ]` **Commit Inicial (Limpo)**: Subir as alterações e scripts ajustados para o GitHub.

### Phase 2: Deploy Backend ( Railway/FastAPI )
- `[ ]` **Configurar Ambiente Railway**: Fazer deploy de projeto a partir do Github repository isolado.
- `[ ]` **Variáveis de Produção**:
   * `ENVIRONMENT=production`
   * `GEMINI_API_KEY=` (chave no painel do app)
   * `NEO4J_URI=neo4j+s://c25dde0d.databases.neo4j.io`
   * `NEO4J_USERNAME=c25dde0d`
   * `NEO4J_PASSWORD=***` (Preenchida pelo User localmente e pelo Railway nas secrets)
- `[ ]` **Domínio e Health Check**: Gerar domínio unificado `*-vitrine.up.railway.app` e confirmar `/health`.

### Phase 3: Visualizador de Grafo Público (Portfólio UI)
- `[ ]` **Criar Rota `/graph-data` (Read-only)**: Implementar uma rota no FastAPI que extraia um snapshot representativo de conexões `:State` e `:Municipality` no Neo4j e serialize isso em JSON seguro (mascarando credenciais).
- `[ ]` **Página Estática `/viewer`**: Criar uma HTML/JS embarcada na raiz da API ou uma Rota UI que renderize o retorno de `/graph-data` utilizando bibliotecas visuais como `Neovis.js`, ou `Cytoscape.js`, oferecendo a vista pública que interage mas não consegue performar `WRITE` commands no Graph. Desta forma resolve-se o ponto 3 do gate de forma segura e visualmente cativante.

### Phase 4: Validação de Produção
- `[ ]` **Teste de Retorno LLM**: Simular chamadas em `/ask/state` POST com Payload para assegurar que a cadeia `RAG -> Aura -> Gemini` está funcionando via Railway.
- `[ ]` **Teste de Acesso ao Visualizador**: Garantir o render em tela do frontend construído no Phase 3.

---

## 🤖 Agent Assignments
- **orchestrator**: Coordena a execução da implementação, repassando o progresso para o usuário.
- **backend-specialist**: Ajusta as views do FastAPI para devolver o pacote NeoVis, além de fazer a rotina de envio de dados `seed_to_aura.py` para popular a base cloud uma única vez.
- **frontend-specialist**: Projeta o visualizador do Node Graph para tornar o portfólio visualmente excelente (via templates estáticos da FastAPI).
