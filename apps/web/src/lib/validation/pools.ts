import { z } from "zod";

export const poolSchema = z.object({
  status: z.enum(["Aberto", "Fechado"]),
  abertura_data: z.string(),
  fechamento_data: z.string().nullable(),
  par: z.string().min(1),
  deposito_usd: z.number().min(0),
  saque_usd: z.number().min(0),
  rede: z.string().nullable(),
  protocolo: z.string().nullable(),
  fee_pct: z.number().nullable(),
  preco_min: z.number().nullable(),
  preco_max: z.number().nullable(),
  taxas_geradas_usd: z.number().min(0),
  custos_usd: z.number().min(0)
});

export type PoolInput = z.infer<typeof poolSchema>;
