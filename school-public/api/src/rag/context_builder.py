"""
Public context builder — extends the original with pub_* fields (calculated statistics + ML predictions).
"""
import logging
from typing import Any

logger = logging.getLogger(__name__)
_MAX_CHARS = 16_000


def _truncate(text: str) -> str:
    _SUFFIX = "\n[context truncated due to token limit]"
    if len(text) > _MAX_CHARS:
        logger.warning("Context truncated from %d to %d chars", len(text), _MAX_CHARS)
        return text[:_MAX_CHARS - len(_SUFFIX)] + _SUFFIX
    return text


def build_state_context(s: dict[str, Any]) -> str:
    if not s:
        return "[ESTADO] não encontrado"

    municipios = [m for m in (s.get("municipios") or []) if m.get("muni_analf") is not None]
    municipios_sorted = sorted(municipios, key=lambda m: m.get("muni_analf", 0), reverse=True)

    parts = [
        f"[ESTADO] {s.get('nome_estado','?')} — UF {s.get('uf','?')}",
        f"[ESCOPO] {s.get('n_municipios','?')} municípios | {s.get('total_matriculas','?')} matrículas",
        f"[IDEB] AI={s.get('ideb_ai','?')}, AF={s.get('ideb_af','?')}, EM={s.get('ideb_em','?')}",
        f"[FLUXO] fluxo_AI={s.get('fluxo_ai','?')}, fluxo_AF={s.get('fluxo_af','?')}",
        f"[DISTORÇÃO] EF_AI={s.get('distorcao_ai','?')}%, EF_AF={s.get('distorcao_af','?')}%",
        f"[ABANDONO/REPROVAÇÃO] abandono={s.get('abandono','?')}%, reprovação={s.get('reprovacao','?')}%, "
        f"fora_escola={s.get('pct_fora_escola','?')}%",
        f"[PROFICIÊNCIA] LP_adequado_AI={s.get('lp_adequado_ai','?')}%, Mat_adequado_AI={s.get('mat_adequado_ai','?')}%, "
        f"LP_adequado_AF={s.get('lp_adequado_af','?')}%, Mat_adequado_AF={s.get('mat_adequado_af','?')}%, "
        f"LP_insuf_AF={s.get('lp_insuf_af','?')}%, Mat_insuf_AF={s.get('mat_insuf_af','?')}%",
        f"[PNAD RACIAL] analf_negro={s.get('analf_negro','?')}% vs analf_branco={s.get('analf_branco','?')}% | "
        f"atraso_negro={s.get('atraso_negro','?')}% vs atraso_branco={s.get('atraso_branco','?')}% | "
        f"IDHM_e_negro={s.get('idhm_e_negro','?')} vs IDHM_e_branco={s.get('idhm_e_branco','?')} | "
        f"freq_fund_negro={s.get('freq_fund_negro','?')}% vs freq_fund_branco={s.get('freq_fund_branco','?')}% | "
        f"médio_completo(18–20)_negro={s.get('med18_negro','?')}% vs branco={s.get('med18_branco','?')}%",
        f"[PNAD GÊNERO] analf_homem={s.get('analf_homem','?')}% vs analf_mulher={s.get('analf_mulher','?')}% | "
        f"anos_estudo_homem={s.get('anosest_homem','?')} vs mulher={s.get('anosest_mulher','?')} | "
        f"freq_fund_homem={s.get('freq_fund_homem','?')}% vs mulher={s.get('freq_fund_mulher','?')}%",
    ]

    # ── Calculated network statistics (only if available) ─────────────────────
    if s.get("tem_dados_calculados"):
        parts.append(
            f"[REDE ANALISADA] escolas={s.get('pub_total_escolas','?')} | "
            f"alunos={s.get('pub_total_alunos','?')} | "
            f"ausência_média={s.get('pub_media_ausencia_pct','?')}% | "
            f"bolsa_família={s.get('pub_pct_bolsa_familia','?')}% | "
            f"PCDs={s.get('pub_total_pcd','?')}"
        )

        # ML predictions (only included if present on the node)
        if s.get("pub_risco_alto") is not None:
            dist = (
                f"baixo={s.get('pub_risco_baixo','?')}% | "
                f"médio={s.get('pub_risco_medio','?')}% | "
                f"alto={s.get('pub_risco_alto','?')}% | "
                f"crítico={s.get('pub_risco_critico','?')}%"
            )
            parts.append(
                f"[RISCO DE EVASÃO — predição ML ({s.get('pub_modelo_dropout_ref','modelo')})] "
                f"distribuição: {dist} | "
                f"score_médio={s.get('pub_media_score_evasao','?')} | "
                f"reprovação_predita={s.get('pub_pct_reprovacao_predita','?')}% | "
                f"nota_média_predita={s.get('pub_media_nota_predita','?')} | "
                f"snapshot={s.get('pub_snapshot_data','?')}"
            )
    else:
        parts.append("[REDE ANALISADA] Dados calculados não disponíveis para este estado.")

    # ── Vulnerable municipalities ──────────────────────────────────────────────
    if municipios_sorted:
        muni_lines = [
            f"  {m.get('municipio','?')}: analf={m.get('muni_analf','?')}%, "
            f"atraso={m.get('muni_atraso','?')}%, expectativa={m.get('muni_expectativa','?')} anos"
            for m in municipios_sorted[:5]
        ]
        parts.append(
            "[MUNICÍPIOS COM MAIOR FRAGILIDADE (top 5 por analfabetismo adulto)]\n"
            + "\n".join(muni_lines)
        )

    return _truncate("\n".join(parts))
