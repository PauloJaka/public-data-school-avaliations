/**
 * Brazil state SVG paths (600×680 viewBox) from the T.I.A design system.
 * Full simplified polygons for all 27 UFs.
 */
export const BRAZIL_STATE_PATHS: Record<string, string> = {
  AC: "M 65 180 L 130 180 L 120 225 L 70 220 Z",
  AL: "M 510 198 L 555 195 L 553 215 L 510 218 Z",
  AM: "M 120 110 L 240 85 L 270 145 L 290 175 L 220 195 L 130 180 Z",
  AP: "M 360 55 L 420 50 L 425 95 L 400 95 L 360 75 Z",
  BA: "M 390 220 L 490 210 L 526 230 L 535 310 L 490 360 L 390 360 L 360 310 L 340 250 L 370 265 Z",
  CE: "M 465 120 L 520 115 L 530 170 L 490 185 L 475 155 L 465 120 Z",
  DF: "M 335 295 L 360 295 L 360 315 L 335 315 Z",
  ES: "M 490 355 L 525 360 L 530 420 L 500 430 Z",
  GO: "M 290 265 L 370 265 L 360 310 L 320 345 L 265 340 L 255 295 Z",
  MA: "M 390 95 L 465 100 L 470 165 L 420 165 L 400 155 Z",
  MG: "M 360 310 L 490 360 L 500 430 L 440 455 L 360 450 L 315 415 L 320 345 Z",
  MS: "M 210 355 L 305 345 L 320 345 L 315 415 L 265 430 L 200 420 L 195 380 Z",
  MT: "M 160 250 L 290 265 L 255 295 L 230 350 L 170 355 L 140 310 L 140 250 Z",
  PA: "M 240 85 L 360 75 L 400 95 L 390 155 L 360 175 L 290 175 L 270 145 Z",
  PB: "M 500 152 L 548 150 L 550 175 L 510 178 Z",
  PE: "M 455 175 L 550 170 L 548 200 L 455 205 Z",
  PI: "M 420 165 L 475 155 L 485 220 L 455 235 L 425 255 L 420 165 Z",
  PR: "M 265 505 L 415 500 L 410 555 L 280 558 Z",
  RJ: "M 420 445 L 510 430 L 520 460 L 440 468 Z",
  RN: "M 500 115 L 545 118 L 548 155 L 520 160 L 510 145 Z",
  RO: "M 130 180 L 220 195 L 210 250 L 140 245 Z",
  RR: "M 200 55 L 280 42 L 290 85 L 240 85 L 200 75 Z",
  RS: "M 265 590 L 400 588 L 385 640 L 280 650 L 255 625 Z",
  SC: "M 275 555 L 408 550 L 405 590 L 285 592 Z",
  SE: "M 490 215 L 528 210 L 526 232 L 492 232 Z",
  SP: "M 305 415 L 430 445 L 420 500 L 310 510 L 275 475 L 285 435 Z",
  TO: "M 360 175 L 420 165 L 425 255 L 370 265 L 340 250 Z",
};

/** Label anchor positions [x, y] inside each state polygon */
export const BRAZIL_STATE_LABELS: Record<string, [number, number]> = {
  AC:[90,200],  AL:[530,207], AM:[180,140], AP:[390,72],  BA:[440,285],
  CE:[495,145], DF:[347,305], ES:[508,393], GO:[312,308], MA:[430,135],
  MG:[408,400], MS:[255,390], MT:[215,305], PA:[300,115], PB:[525,163],
  PE:[495,188], PI:[455,195], PR:[340,528], RJ:[460,455], RN:[525,133],
  RO:[175,215], RR:[245,65],  RS:[325,618], SC:[340,572], SE:[508,223],
  SP:[360,465], TO:[380,215],
};

/** Brazilian geographic regions with their state members */
export const BRAZIL_REGIONS: Record<string, string[]> = {
  Norte:          ['AM','PA','AC','RO','RR','AP','TO'],
  Nordeste:       ['MA','PI','CE','RN','PB','PE','AL','SE','BA'],
  Sudeste:        ['MG','ES','RJ','SP'],
  Sul:            ['PR','SC','RS'],
  'Centro-Oeste': ['MT','MS','GO','DF'],
};

/** Region color palette — light and dark theme variants */
export const REGION_COLORS: Record<string, { light: string; dark: string }> = {
  Norte:          { light: '#2dd4bf', dark: '#0d9488' },
  Nordeste:       { light: '#fbbf24', dark: '#d97706' },
  Sudeste:        { light: '#818cf8', dark: '#4f46e5' },
  Sul:            { light: '#f87171', dark: '#e11d48' },
  'Centro-Oeste': { light: '#34d399', dark: '#059669' },
};

/** Derived lookup: state sigla → region name */
export const STATE_REGION: Record<string, string> = Object.entries(BRAZIL_REGIONS)
  .flatMap(([region, states]) => states.map(uf => [uf, region] as [string, string]))
  .reduce<Record<string, string>>((acc, [uf, region]) => ({ ...acc, [uf]: region }), {});

/** Color interpolation helper */
export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

export function lerpColor(fromHex: string, toHex: string, t: number): string {
  const [r1,g1,b1] = hexToRgb(fromHex);
  const [r2,g2,b2] = hexToRgb(toHex);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}
