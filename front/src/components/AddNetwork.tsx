import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

interface Nodo {
  type: string;
  name: string;
  ip: string;
  port: number; // Cambiado a `number` para consistencia
}

interface Network {
  id: string;
  chainId: string; // Cambiado a `string` porque en el formulario es un texto
  subnet: string;
  ipBootnode: string;
  alloc: string[]; // Arreglo de direcciones Ethereum
  nodos: Nodo[]; // Arreglo de nodos
}

interface AddNetworkProps {
  onClose: () => void;
  onNetworkAdded: (newNetwork: Network) => void;
}

const AddNetwork: React.FC<AddNetworkProps> = ({ onClose, onNetworkAdded }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Network>({
    defaultValues: {
      id: "",
      chainId: "",
      subnet: "",
      ipBootnode: "",
      alloc: [""], // Default de `alloc`
      nodos: [{ type: "", name: "", ip: "", port: 0 }], // Default de `nodos`
    },
  });

  // Configuración de `alloc` (arreglo de cadenas)
  const { fields: allocFields, append: appendAlloc, remove: removeAlloc } = useFieldArray({
    control,
    name: "alloc", // Correctamente asociado al campo `alloc`
  });

  // Configuración de `nodos` (arreglo de objetos)
  const { fields: nodosFields, append: appendNodo, remove: removeNodo } = useFieldArray({
    control,
    name: "nodos", // Correctamente asociado al campo `nodos`
  });

  // Manejo de envío del formulario
  const onSubmit = (data: Network) => {
    console.log("Datos enviados:", data);
    onNetworkAdded(data); // Agregamos la nueva red
    reset(); // Limpiamos el formulario
    onClose(); // Cerramos el formulario
  };

  return (
    <div className="add-network-form">
      <h2>Añadir Red</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos básicos */}
        <label>Network ID:</label>
        <input {...register("id", { required: "Network ID es obligatorio" })} />
        {errors.id && <p className="error">{errors.id.message}</p>}

        <label>Chain ID:</label>
        <input {...register("chainId", { required: "Chain ID es obligatorio" })} />
        {errors.chainId && <p className="error">{errors.chainId.message}</p>}

        <label>Subnet:</label>
        <input {...register("subnet", { required: "Subnet es obligatoria" })} />
        {errors.subnet && <p className="error">{errors.subnet.message}</p>}

        <label>IP Bootnode:</label>
        <input
          {...register("ipBootnode", {
            required: "IP Bootnode es obligatoria",
            pattern: {
              value: /^(?:\d{1,3}\.){3}\d{1,3}$/,
              message: "IP no válida",
            },
          })}
        />
        {errors.ipBootnode && <p className="error">{errors.ipBootnode.message}</p>}

        {/* Alloc */}
        <h3>Alloc</h3>
        {allocFields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`alloc.${index}` as const, {
                required: "La dirección es obligatoria",
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Dirección Ethereum no válida",
                },
              })}
            />
            <button type="button" onClick={() => removeAlloc(index)}>
              Eliminar
            </button>
            {errors.alloc && errors.alloc[index] && (
              <p className="error">{errors.alloc[index]?.message}</p>
            )}
          </div>
        ))}
        <button type="button" onClick={() => appendAlloc("")}>
          Agregar Alloc
        </button>

        {/* Nodos */}
        <h3>Nodos</h3>
        {nodosFields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`nodos.${index}.type` as const)} placeholder="Tipo" />
            <input {...register(`nodos.${index}.name` as const)} placeholder="Nombre" />
            <input
              {...register(`nodos.${index}.ip` as const, {
                required: "IP es obligatoria",
                pattern: {
                  value: /^(?:\d{1,3}\.){3}\d{1,3}$/,
                  message: "IP no válida",
                },
              })}
              placeholder="IP"
            />
            <input
              {...register(`nodos.${index}.port` as const, {
                required: "Puerto es obligatorio",
                min: { value: 1, message: "Puerto debe ser mayor a 0" },
                max: { value: 65535, message: "Puerto no válido" },
              })}
              type="number"
              placeholder="Puerto"
            />
            <button type="button" onClick={() => removeNodo(index)}>
              Eliminar Nodo
            </button>
            {errors.nodos && errors.nodos[index] && (
              <div className="error">
                {errors.nodos[index]?.ip && <p>{errors.nodos[index]?.ip.message}</p>}
                {errors.nodos[index]?.port && <p>{errors.nodos[index]?.port.message}</p>}
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={() => appendNodo({ type: "", name: "", ip: "", port: 0 })}>
          Agregar Nodo
        </button>

        <button type="submit">Añadir Red</button>
      </form>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default AddNetwork;
