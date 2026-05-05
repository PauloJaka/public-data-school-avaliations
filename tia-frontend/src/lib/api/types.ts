import { z } from 'zod';

export const AskRequestSchema = z.object({
  question: z.string().min(2).max(2000),
  uf:       z.string().min(2).max(2),
  locale:   z.enum(['pt-BR', 'en']).default('pt-BR'),
});
export type AskRequest = z.infer<typeof AskRequestSchema>;

export const SourceSchema = z.object({
  id: z.number().int(),
  label: z.string(),
  url: z.string().url().optional(),
});

export const AskResponseSchema = z.object({
  id:      z.string(),
  answer:  z.string(),
  sources: z.array(SourceSchema),
});
export type AskResponse = z.infer<typeof AskResponseSchema>;

export const KpiSchema = z.object({
  ideb: z.number(),
  states: z.string(),
  risk: z.number(),
});
export type Kpi = z.infer<typeof KpiSchema>;

export const StateValuesSchema = z.record(z.string().length(2), z.number());
export type StateValues = z.infer<typeof StateValuesSchema>;
