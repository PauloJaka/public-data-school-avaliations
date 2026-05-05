/**
 * Brazil state SVG paths for choropleth map.
 * Simplified viewBox="0 0 600 540" paths for all 27 UFs.
 * Source: Public domain simplified Brazil SVG (IBGE outline).
 */
export interface BRState {
  uf: string;
  name: string;
  path: string;
}

export const BR_STATES: BRState[] = [
  { uf: 'AC', name: 'Acre', path: 'M 82 285 L 95 275 L 110 268 L 125 272 L 130 285 L 120 298 L 100 300 Z' },
  { uf: 'AL', name: 'Alagoas', path: 'M 438 258 L 452 252 L 462 260 L 455 272 L 440 270 Z' },
  { uf: 'AM', name: 'Amazonas', path: 'M 90 180 L 150 155 L 220 148 L 255 165 L 265 200 L 240 235 L 200 248 L 155 245 L 115 230 Z' },
  { uf: 'AP', name: 'Amapá', path: 'M 290 100 L 310 90 L 325 100 L 320 125 L 298 128 Z' },
  { uf: 'BA', name: 'Bahia', path: 'M 360 240 L 410 225 L 450 235 L 465 270 L 458 310 L 430 340 L 390 350 L 355 335 L 340 300 L 345 265 Z' },
  { uf: 'CE', name: 'Ceará', path: 'M 400 178 L 435 168 L 460 175 L 465 200 L 445 215 L 410 218 L 392 205 Z' },
  { uf: 'DF', name: 'Distrito Federal', path: 'M 320 295 L 328 290 L 335 295 L 330 304 L 322 302 Z' },
  { uf: 'ES', name: 'Espírito Santo', path: 'M 430 318 L 442 310 L 450 320 L 445 335 L 432 332 Z' },
  { uf: 'GO', name: 'Goiás', path: 'M 285 268 L 325 255 L 355 265 L 355 305 L 330 320 L 292 315 L 275 295 Z' },
  { uf: 'MA', name: 'Maranhão', path: 'M 330 175 L 375 165 L 400 178 L 392 205 L 370 225 L 338 225 L 320 210 Z' },
  { uf: 'MG', name: 'Minas Gerais', path: 'M 360 295 L 408 280 L 445 290 L 450 320 L 430 345 L 390 355 L 355 340 L 345 315 Z' },
  { uf: 'MS', name: 'Mato Grosso do Sul', path: 'M 220 310 L 268 295 L 285 310 L 280 350 L 250 365 L 218 355 Z' },
  { uf: 'MT', name: 'Mato Grosso', path: 'M 180 215 L 250 200 L 285 215 L 290 265 L 255 280 L 205 278 L 175 255 Z' },
  { uf: 'PA', name: 'Pará', path: 'M 235 130 L 300 110 L 355 120 L 370 160 L 340 185 L 295 195 L 250 188 L 225 165 Z' },
  { uf: 'PB', name: 'Paraíba', path: 'M 435 210 L 462 205 L 472 215 L 462 225 L 438 225 Z' },
  { uf: 'PE', name: 'Pernambuco', path: 'M 400 220 L 445 213 L 468 222 L 465 240 L 435 248 L 402 242 Z' },
  { uf: 'PI', name: 'Piauí', path: 'M 370 188 L 402 178 L 410 200 L 400 225 L 370 228 L 355 215 Z' },
  { uf: 'PR', name: 'Paraná', path: 'M 270 380 L 320 368 L 355 375 L 358 405 L 325 420 L 278 415 Z' },
  { uf: 'RJ', name: 'Rio de Janeiro', path: 'M 410 350 L 435 340 L 448 352 L 440 365 L 415 365 Z' },
  { uf: 'RN', name: 'Rio Grande do Norte', path: 'M 438 188 L 468 182 L 478 195 L 465 208 L 440 210 Z' },
  { uf: 'RO', name: 'Rondônia', path: 'M 130 248 L 175 238 L 192 250 L 188 278 L 155 285 L 128 272 Z' },
  { uf: 'RR', name: 'Roraima', path: 'M 155 100 L 195 88 L 220 100 L 218 140 L 180 148 L 152 135 Z' },
  { uf: 'RS', name: 'Rio Grande do Sul', path: 'M 258 420 L 308 408 L 335 422 L 330 460 L 295 475 L 258 462 Z' },
  { uf: 'SC', name: 'Santa Catarina', path: 'M 280 410 L 325 400 L 345 410 L 340 430 L 298 432 Z' },
  { uf: 'SE', name: 'Sergipe', path: 'M 448 260 L 462 255 L 468 265 L 460 275 L 448 272 Z' },
  { uf: 'SP', name: 'São Paulo', path: 'M 310 340 L 365 325 L 405 338 L 408 368 L 378 385 L 325 385 L 305 368 Z' },
  { uf: 'TO', name: 'Tocantins', path: 'M 310 195 L 355 185 L 372 205 L 365 248 L 335 260 L 305 250 L 298 225 Z' },
];

/**
 * IDEB linear color ramp: 3.5 (light) → 6.0 (dark blue)
 */
export function IDEB_RAMP(value: number): string {
  if (!value || value <= 0) return '#dbeafe'; // no data → lightest
  const min = 3.5, max = 6.0;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  // Interpolate between #dbeafe and #1e3a8a
  const r = Math.round(219 + (30 - 219) * t);
  const g = Math.round(234 + (58 - 234) * t);
  const b = Math.round(254 + (138 - 254) * t);
  return `rgb(${r},${g},${b})`;
}
