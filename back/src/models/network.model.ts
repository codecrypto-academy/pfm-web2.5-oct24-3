import { z } from "zod"
import { nodoSchema } from "./nodo.model"

export const networkSchema = z.object({
    id: z.string(),
    chainId: z.number(),
    subnet: z.string(),
    ipBootnode: z.string().ip(),
    alloc: z.array(z.string()),
    nodos: z.array(nodoSchema)
});

export type Network = z.infer<typeof networkSchema>;