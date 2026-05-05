"""
Public retriever — state-level only.
Query adapted from backend-tia: includes pub_* fields (calculated statistics + ML predictions).
"""
import logging
from typing import Any
from neo4j import Driver

logger = logging.getLogger(__name__)

# ── State query with enriched calculated data ─────────────────────────────────
_STATE_CONTEXT = """
MATCH (st:State {sigla: $uf})
MATCH (m:Municipality)-[:BELONGS_TO_STATE]->(st)

WITH st, count(DISTINCT m) AS n_municipios,
     collect({
         municipio:        m.name,
         muni_analf:       m.analf_adulto,
         muni_atraso:      m.atraso_2anos,
         muni_expectativa: m.expectativa_estudo
     }) AS municipios

RETURN
    st.sigla AS uf,
    st.nome  AS nome_estado,
    n_municipios,
    coalesce(st.qedu_total_matriculas, 0) AS total_matriculas,
    st.qedu_ideb_ai AS ideb_ai,
    st.qedu_ideb_af AS ideb_af,
    st.qedu_ideb_em AS ideb_em,
    st.qedu_fluxo_ai AS fluxo_ai,
    st.qedu_fluxo_af AS fluxo_af,
    st.qedu_taxa_abandono AS abandono,
    st.qedu_taxa_reprovacao AS reprovacao,
    st.qedu_distorcao_ef_ai AS distorcao_ai,
    st.qedu_distorcao_ef_af AS distorcao_af,
    st.qedu_pct_fora_escola AS pct_fora_escola,
    st.qedu_lp_adequado_ai AS lp_adequado_ai,
    st.qedu_mt_adequado_ai AS mat_adequado_ai,
    st.qedu_lp_adequado_af AS lp_adequado_af,
    st.qedu_mt_adequado_af AS mat_adequado_af,
    st.qedu_lp_insuficiente_af AS lp_insuf_af,
    st.qedu_mt_insuficiente_af AS mat_insuf_af,
    st.negro_pnad_t_analf25m AS analf_negro,
    st.branco_pnad_t_analf25m AS analf_branco,
    st.negro_pnad_t_atraso_fund AS atraso_negro,
    st.branco_pnad_t_atraso_fund AS atraso_branco,
    st.negro_pnad_t_flfund AS freq_fund_negro,
    st.branco_pnad_t_flfund AS freq_fund_branco,
    st.negro_pnad_t_med18a20 AS med18_negro,
    st.branco_pnad_t_med18a20 AS med18_branco,
    st.negro_pnad_idhm_e AS idhm_e_negro,
    st.branco_pnad_idhm_e AS idhm_e_branco,
    st.homem_pnad_t_analf25m AS analf_homem,
    st.mulher_pnad_t_analf25m AS analf_mulher,
    st.homem_pnad_anosest AS anosest_homem,
    st.mulher_pnad_anosest AS anosest_mulher,
    st.homem_pnad_t_flfund AS freq_fund_homem,
    st.mulher_pnad_t_flfund AS freq_fund_mulher,
    coalesce(st.pub_tem_dados_calculados, false) AS tem_dados_calculados,
    st.pub_total_escolas AS pub_total_escolas,
    st.pub_total_alunos  AS pub_total_alunos,
    st.pub_media_ausencia_pct   AS pub_media_ausencia_pct,
    st.pub_pct_bolsa_familia    AS pub_pct_bolsa_familia,
    st.pub_total_pcd            AS pub_total_pcd,
    st.pub_pct_risco_evasao_baixo   AS pub_risco_baixo,
    st.pub_pct_risco_evasao_medio   AS pub_risco_medio,
    st.pub_pct_risco_evasao_alto    AS pub_risco_alto,
    st.pub_pct_risco_evasao_critico AS pub_risco_critico,
    st.pub_media_score_evasao       AS pub_media_score_evasao,
    st.pub_pct_reprovacao_predita   AS pub_pct_reprovacao_predita,
    st.pub_media_nota_predita       AS pub_media_nota_predita,
    st.pub_modelo_dropout_ref       AS pub_modelo_dropout_ref,
    st.pub_snapshot_data            AS pub_snapshot_data,

    municipios
"""


class Retriever:
    def __init__(self, driver: Driver, database: str = "neo4j"):
        self._driver = driver
        self._database = database

    def get_state_context(self, uf: str) -> dict[str, Any]:
        with self._driver.session(database=self._database) as session:
            res = session.run(_STATE_CONTEXT, uf=uf.upper()).single()
            return dict(res) if res else {}
