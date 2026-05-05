// Static snapshot extracted from school-public/neo4j/seed/ — frozen 2026-04-21.
// Do not edit manually; re-run export_state_snapshot.py + seed to refresh.

export type Region = 'norte' | 'nordeste' | 'sudeste' | 'sul' | 'centro-oeste';

export interface StateData {
  sigla: string;
  nome: string;
  region: Region;
  // IDEB levels (null = no data for that level)
  ideb_ai: number | null;
  ideb_af: number;
  ideb_em: number;
  // Enrollment
  total_matriculas: number;
  // Dropout / repetition rates
  taxa_abandono: number;
  taxa_reprovacao: number;
  // PNAD racial inequality
  idhm_e_negro: number;
  idhm_e_branco: number;
  analf_negro: number;
  analf_branco: number;
  // PNAD gender inequality
  anosest_homem: number;
  anosest_mulher: number;
  // ML predictions (null = state not in inference batch)
  pub_media_score_evasao: number | null;
  pub_pct_risco_critico: number | null;
  pub_snapshot_data: string | null;
}

export const STATE_DATA: Record<string, StateData> = {
  AC: { sigla: 'AC', nome: 'Acre',                   region: 'norte',        ideb_ai: 6.10, ideb_af: 4.70, ideb_em: 3.90, total_matriculas: 561198,   taxa_abandono: 3.99, taxa_reprovacao: 5.26,  idhm_e_negro: 0.680, idhm_e_branco: 0.759, analf_negro: 11.65, analf_branco: 7.72,  anosest_homem: 8.84,  anosest_mulher: 9.75,  pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  AL: { sigla: 'AL', nome: 'Alagoas',                region: 'nordeste',     ideb_ai: 5.50, ideb_af: 4.60, ideb_em: 4.00, total_matriculas: 1641690,  taxa_abandono: 2.82, taxa_reprovacao: 5.37,  idhm_e_negro: 0.702, idhm_e_branco: 0.738, analf_negro: 9.57,  analf_branco: 6.30,  anosest_homem: 9.65,  anosest_mulher: 9.94,  pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  AM: { sigla: 'AM', nome: 'Amazonas',               region: 'norte',        ideb_ai: 5.90, ideb_af: 4.80, ideb_em: 3.70, total_matriculas: 2630624,  taxa_abandono: 3.63, taxa_reprovacao: 5.10,  idhm_e_negro: 0.751, idhm_e_branco: 0.794, analf_negro: 2.35,  analf_branco: 2.13,  anosest_homem: 10.84, anosest_mulher: 11.26, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  AP: { sigla: 'AP', nome: 'Amapá',                  region: 'norte',        ideb_ai: 4.80, ideb_af: 4.10, ideb_em: 3.60, total_matriculas: 481500,   taxa_abandono: 2.81, taxa_reprovacao: 10.16, idhm_e_negro: 0.645, idhm_e_branco: 0.757, analf_negro: 6.42,  analf_branco: 2.33,  anosest_homem: 10.80, anosest_mulher: 10.56, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  BA: { sigla: 'BA', nome: 'Bahia',                  region: 'nordeste',     ideb_ai: 5.10, ideb_af: 4.00, ideb_em: 3.70, total_matriculas: 7035333,  taxa_abandono: 5.10, taxa_reprovacao: 10.69, idhm_e_negro: 0.730, idhm_e_branco: 0.758, analf_negro: 3.18,  analf_branco: 1.10,  anosest_homem: 10.98, anosest_mulher: 11.28, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  CE: { sigla: 'CE', nome: 'Ceará',                  region: 'nordeste',     ideb_ai: 7.70, ideb_af: 5.30, ideb_em: 4.40, total_matriculas: 4279284,  taxa_abandono: 0.98, taxa_reprovacao: 0.56,  idhm_e_negro: 0.788, idhm_e_branco: 0.828, analf_negro: 6.73,  analf_branco: 5.27,  anosest_homem: 10.12, anosest_mulher: 10.18, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  DF: { sigla: 'DF', nome: 'Distrito Federal',       region: 'centro-oeste', ideb_ai: 5.90, ideb_af: 4.60, ideb_em: 3.70, total_matriculas: 1316691,  taxa_abandono: 1.38, taxa_reprovacao: 6.02,  idhm_e_negro: 0.791, idhm_e_branco: 0.862, analf_negro: 2.48,  analf_branco: 1.86,  anosest_homem: 12.22, anosest_mulher: 12.18, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  ES: { sigla: 'ES', nome: 'Espírito Santo',         region: 'sudeste',      ideb_ai: 5.80, ideb_af: 3.80, ideb_em: 3.30, total_matriculas: 1804653,  taxa_abandono: 0.73, taxa_reprovacao: 5.54,  idhm_e_negro: 0.745, idhm_e_branco: 0.842, analf_negro: 3.80,  analf_branco: 2.23,  anosest_homem: 10.87, anosest_mulher: 10.85, pub_media_score_evasao: 0.8263, pub_pct_risco_critico: 82.6, pub_snapshot_data: '2026-04-21' },
  GO: { sigla: 'GO', nome: 'Goiás',                  region: 'centro-oeste', ideb_ai: 6.70, ideb_af: 5.50, ideb_em: 4.80, total_matriculas: 3147846,  taxa_abandono: 0.75, taxa_reprovacao: 2.74,  idhm_e_negro: 0.790, idhm_e_branco: 0.819, analf_negro: 4.51,  analf_branco: 3.33,  anosest_homem: 10.25, anosest_mulher: 10.89, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  MA: { sigla: 'MA', nome: 'Maranhão',               region: 'nordeste',     ideb_ai: 4.10, ideb_af: 4.80, ideb_em: 3.70, total_matriculas: 3943170,  taxa_abandono: 2.38, taxa_reprovacao: 4.56,  idhm_e_negro: 0.800, idhm_e_branco: 0.851, analf_negro: 4.08,  analf_branco: 1.05,  anosest_homem: 10.88, anosest_mulher: 10.86, pub_media_score_evasao: 0.6758, pub_pct_risco_critico: 67.6, pub_snapshot_data: '2026-04-21' },
  MG: { sigla: 'MG', nome: 'Minas Gerais',           region: 'sudeste',      ideb_ai: 6.20, ideb_af: 4.60, ideb_em: 4.00, total_matriculas: 8928189,  taxa_abandono: 2.25, taxa_reprovacao: 4.52,  idhm_e_negro: 0.777, idhm_e_branco: 0.837, analf_negro: 3.13,  analf_branco: 1.49,  anosest_homem: 10.97, anosest_mulher: 11.02, pub_media_score_evasao: 0.8512, pub_pct_risco_critico: 85.1, pub_snapshot_data: '2026-04-21' },
  MS: { sigla: 'MS', nome: 'Mato Grosso do Sul',     region: 'centro-oeste', ideb_ai: 5.40, ideb_af: 4.60, ideb_em: 3.80, total_matriculas: 1417793,  taxa_abandono: 1.48, taxa_reprovacao: 9.05,  idhm_e_negro: 0.722, idhm_e_branco: 0.772, analf_negro: 5.68,  analf_branco: 3.30,  anosest_homem: 9.69,  anosest_mulher: 10.19, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  MT: { sigla: 'MT', nome: 'Mato Grosso',            region: 'centro-oeste', ideb_ai: 5.70, ideb_af: 4.80, ideb_em: 4.20, total_matriculas: 1875546,  taxa_abandono: 2.62, taxa_reprovacao: 5.07,  idhm_e_negro: 0.780, idhm_e_branco: 0.829, analf_negro: 4.17,  analf_branco: 1.35,  anosest_homem: 10.72, anosest_mulher: 11.23, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  PA: { sigla: 'PA', nome: 'Pará',                   region: 'norte',        ideb_ai: 5.70, ideb_af: 4.80, ideb_em: 4.30, total_matriculas: 5039506,  taxa_abandono: 4.79, taxa_reprovacao: 10.64, idhm_e_negro: 0.750, idhm_e_branco: 0.797, analf_negro: 2.28,  analf_branco: 1.04,  anosest_homem: 11.02, anosest_mulher: 11.30, pub_media_score_evasao: 0.5682, pub_pct_risco_critico: 56.8, pub_snapshot_data: '2026-04-21' },
  PB: { sigla: 'PB', nome: 'Paraíba',                region: 'nordeste',     ideb_ai: 5.20, ideb_af: 3.90, ideb_em: 3.60, total_matriculas: 1905730,  taxa_abandono: 4.01, taxa_reprovacao: 5.95,  idhm_e_negro: 0.695, idhm_e_branco: 0.781, analf_negro: 9.62,  analf_branco: 4.91,  anosest_homem: 9.73,  anosest_mulher: 9.96,  pub_media_score_evasao: 0.7322, pub_pct_risco_critico: 73.2, pub_snapshot_data: '2026-04-21' },
  PE: { sigla: 'PE', nome: 'Pernambuco',             region: 'nordeste',     ideb_ai: 6.20, ideb_af: 4.90, ideb_em: 4.50, total_matriculas: 4398698,  taxa_abandono: 0.94, taxa_reprovacao: 4.69,  idhm_e_negro: 0.764, idhm_e_branco: 0.825, analf_negro: 6.52,  analf_branco: 4.37,  anosest_homem: 10.44, anosest_mulher: 10.26, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  PI: { sigla: 'PI', nome: 'Piauí',                  region: 'nordeste',     ideb_ai: 6.40, ideb_af: 5.20, ideb_em: 4.30, total_matriculas: 1669220,  taxa_abandono: 2.89, taxa_reprovacao: 4.28,  idhm_e_negro: 0.689, idhm_e_branco: 0.734, analf_negro: 17.39, analf_branco: 13.83, anosest_homem: 7.51,  anosest_mulher: 8.62,  pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  PR: { sigla: 'PR', nome: 'Paraná',                 region: 'sul',          ideb_ai: 7.10, ideb_af: 5.40, ideb_em: 4.70, total_matriculas: 5139914,  taxa_abandono: 1.22, taxa_reprovacao: 5.16,  idhm_e_negro: 0.768, idhm_e_branco: 0.824, analf_negro: 4.57,  analf_branco: 1.17,  anosest_homem: 11.10, anosest_mulher: 11.04, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  RJ: { sigla: 'RJ', nome: 'Rio de Janeiro',         region: 'sudeste',      ideb_ai: 5.30, ideb_af: 4.50, ideb_em: 3.90, total_matriculas: 6945985,  taxa_abandono: 2.01, taxa_reprovacao: 8.55,  idhm_e_negro: 0.735, idhm_e_branco: 0.834, analf_negro: 2.14,  analf_branco: 1.00,  anosest_homem: 11.48, anosest_mulher: 11.39, pub_media_score_evasao: 0.5583, pub_pct_risco_critico: 55.8, pub_snapshot_data: '2026-04-21' },
  RN: { sigla: 'RN', nome: 'Rio Grande do Norte',    region: 'nordeste',     ideb_ai: 5.00, ideb_af: 3.70, ideb_em: 3.20, total_matriculas: 1612376,  taxa_abandono: 4.12, taxa_reprovacao: 12.50, idhm_e_negro: 0.654, idhm_e_branco: 0.769, analf_negro: 9.83,  analf_branco: 4.29,  anosest_homem: 10.62, anosest_mulher: 10.41, pub_media_score_evasao: 0.8382, pub_pct_risco_critico: 83.8, pub_snapshot_data: '2026-04-21' },
  RO: { sigla: 'RO', nome: 'Rondônia',               region: 'norte',        ideb_ai: 5.80, ideb_af: 4.70, ideb_em: 4.00, total_matriculas: 883198,   taxa_abandono: 2.45, taxa_reprovacao: 4.53,  idhm_e_negro: 0.675, idhm_e_branco: 0.745, analf_negro: 6.76,  analf_branco: 6.26,  anosest_homem: 8.63,  anosest_mulher: 9.35,  pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  RR: { sigla: 'RR', nome: 'Roraima',                region: 'norte',        ideb_ai: null, ideb_af: 4.20, ideb_em: 3.60, total_matriculas: 397667,   taxa_abandono: 3.34, taxa_reprovacao: 5.25,  idhm_e_negro: 0.663, idhm_e_branco: 0.719, analf_negro: 6.88,  analf_branco: 4.56,  anosest_homem: 9.95,  anosest_mulher: 10.96, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  RS: { sigla: 'RS', nome: 'Rio Grande do Sul',      region: 'sul',          ideb_ai: 5.80, ideb_af: 4.70, ideb_em: 3.90, total_matriculas: 4639422,  taxa_abandono: 2.99, taxa_reprovacao: 6.66,  idhm_e_negro: 0.683, idhm_e_branco: 0.768, analf_negro: 1.66,  analf_branco: 1.36,  anosest_homem: 11.18, anosest_mulher: 11.20, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  SC: { sigla: 'SC', nome: 'Santa Catarina',         region: 'sul',          ideb_ai: 5.80, ideb_af: 4.60, ideb_em: 3.80, total_matriculas: 3396693,  taxa_abandono: 1.46, taxa_reprovacao: 6.90,  idhm_e_negro: 0.752, idhm_e_branco: 0.847, analf_negro: 1.99,  analf_branco: 1.84,  anosest_homem: 11.99, anosest_mulher: 11.74, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
  SE: { sigla: 'SE', nome: 'Sergipe',                region: 'nordeste',     ideb_ai: 5.30, ideb_af: 4.20, ideb_em: 3.70, total_matriculas: 1113849,  taxa_abandono: 2.48, taxa_reprovacao: 11.61, idhm_e_negro: 0.734, idhm_e_branco: 0.807, analf_negro: 6.70,  analf_branco: 4.18,  anosest_homem: 10.47, anosest_mulher: 10.74, pub_media_score_evasao: 0.8334, pub_pct_risco_critico: 83.3, pub_snapshot_data: '2026-04-21' },
  SP: { sigla: 'SP', nome: 'São Paulo',              region: 'sudeste',      ideb_ai: 6.20, ideb_af: 5.10, ideb_em: 4.20, total_matriculas: 20074918, taxa_abandono: 1.25, taxa_reprovacao: 2.52,  idhm_e_negro: 0.819, idhm_e_branco: 0.879, analf_negro: 2.03,  analf_branco: 1.37,  anosest_homem: 11.51, anosest_mulher: 11.32, pub_media_score_evasao: 0.6541, pub_pct_risco_critico: 65.4, pub_snapshot_data: '2026-04-21' },
  TO: { sigla: 'TO', nome: 'Tocantins',              region: 'norte',        ideb_ai: 6.20, ideb_af: 4.70, ideb_em: 4.10, total_matriculas: 850244,   taxa_abandono: 1.33, taxa_reprovacao: 3.79,  idhm_e_negro: 0.725, idhm_e_branco: 0.764, analf_negro: 9.85,  analf_branco: 7.82,  anosest_homem: 8.59,  anosest_mulher: 10.08, pub_media_score_evasao: null,   pub_pct_risco_critico: null, pub_snapshot_data: null },
};

const _states = Object.values(STATE_DATA);

// ── IDEB map (UF → ideb_af) for BrazilMap choropleth ──────────────────────────
export const IDEB_MAP: Record<string, number> = Object.fromEntries(
  _states.map(s => [s.sigla, s.ideb_af])
);

// ── National average IDEB (anos finais) ────────────────────────────────────────
export const NATIONAL_IDEB_AF = parseFloat(
  (_states.reduce((sum, s) => sum + s.ideb_af, 0) / _states.length).toFixed(1)
);

// ── Top 5 states by ideb_af ────────────────────────────────────────────────────
export const TOP5_IDEB: StateData[] = [..._states]
  .sort((a, b) => b.ideb_af - a.ideb_af)
  .slice(0, 5);

// ── Regional IDEB averages for SVGLineChart ────────────────────────────────────
export interface RegionAvg {
  region: string;
  ideb_ai: number;
  ideb_af: number;
  ideb_em: number;
  [key: string]: unknown;
}

function regionAvg(siglas: string[]): RegionAvg {
  const s = siglas.map(uf => STATE_DATA[uf]);
  const withAi = s.filter(x => x.ideb_ai !== null);
  return {
    region: '',
    ideb_ai: parseFloat((withAi.reduce((sum, x) => sum + (x.ideb_ai ?? 0), 0) / withAi.length).toFixed(2)),
    ideb_af: parseFloat((s.reduce((sum, x) => sum + x.ideb_af, 0) / s.length).toFixed(2)),
    ideb_em: parseFloat((s.reduce((sum, x) => sum + x.ideb_em, 0) / s.length).toFixed(2)),
  };
}

export const REGIONAL_IDEB: RegionAvg[] = [
  { ...regionAvg(['AC','AM','AP','PA','RO','RR','TO']), region: 'Norte' },
  { ...regionAvg(['AL','BA','CE','MA','PB','PE','PI','RN','SE']), region: 'Nordeste' },
  { ...regionAvg(['ES','MG','RJ','SP']), region: 'Sudeste' },
  { ...regionAvg(['PR','RS','SC']), region: 'Sul' },
  { ...regionAvg(['DF','GO','MS','MT']), region: 'Centro-Oeste' },
];

// ── ML risk ranking (states with inference data, sorted by score desc) ─────────
export const RISK_RANKING: StateData[] = _states
  .filter(s => s.pub_media_score_evasao !== null)
  .sort((a, b) => (b.pub_media_score_evasao ?? 0) - (a.pub_media_score_evasao ?? 0));

// ── National KPI values for KpiGrid ───────────────────────────────────────────
export const NATIONAL_KPI = {
  idebLabel:    NATIONAL_IDEB_AF.toFixed(1),
  statesLabel:  '27/27',
  riskCount:    RISK_RANKING.filter(s => (s.pub_pct_risco_critico ?? 0) > 50).length.toString(),
};

// ── Equity data for SVGRadarChart (derived from PNAD racial/gender fields) ─────
export interface EquityPoint {
  labelKey: string;
  value: number;
}

function avg(vals: number[]) {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export const EQUITY_DATA_NATIONAL: EquityPoint[] = [
  {
    labelKey: 'racial',
    // IDHM-E ratio negro/branco — ideal = 1.0, current < 1 = inequality
    value: parseFloat(avg(_states.map(s => s.idhm_e_negro / s.idhm_e_branco)).toFixed(2)),
  },
  {
    labelKey: 'gender',
    // Symmetric parity: 1.0 = equal, decreases if either gender leads
    value: parseFloat(
      avg(_states.map(s => {
        const ratio = s.anosest_mulher / s.anosest_homem;
        return Math.max(0, 1 - Math.abs(ratio - 1));
      })).toFixed(2)
    ),
  },
  {
    labelKey: 'literacy',
    // Functional literacy ratio: (100 - analf_negro) / (100 - analf_branco)
    value: parseFloat(avg(_states.map(s => (100 - s.analf_negro) / (100 - s.analf_branco))).toFixed(2)),
  },
  {
    labelKey: 'dropout',
    // Inverted abandono: low rate → high equity. Normalize: 1 - (rate / max_rate)
    value: parseFloat((1 - avg(_states.map(s => s.taxa_abandono)) / 10).toFixed(2)),
  },
  { labelKey: 'ruralUrban', value: 0.72 }, // no direct Neo4j source — documented placeholder
  { labelKey: 'income',     value: 0.55 }, // no direct Neo4j source — documented placeholder
];
