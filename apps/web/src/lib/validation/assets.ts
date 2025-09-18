import { z } from "zod";

export const assetSchema = z.object({
  data: z.string(),
  ativo: z.string().min(1),
  tipo: z.enum(["compra", "venda", "pool", "compound"]),
  preco_compra_usd: z.number().min(0),
  quantidade: z.number().min(0),
  taxas_usd: z.number().min(0),
  total_usd: z.number(),
});

export type AssetInput = z.infer<typeof assetSchema>;
