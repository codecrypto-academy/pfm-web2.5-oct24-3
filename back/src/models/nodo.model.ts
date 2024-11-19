import {z} from 'zod'

const NodoEnum = z.enum(["rpc", "miner", "normal"]);
type NodoEnum = z.infer<typeof NodoEnum>;

export const nodoSchema = z.object({
    type: NodoEnum,
    name: z.string(),
    ip: z.string().ip(),
    port: z.number().optional()
});

export type Nodo = z.infer<typeof nodoSchema>;