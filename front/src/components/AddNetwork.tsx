import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Network } from '../types/Network';

const AddNetwork: React.FC = () => {
  const [network, setNetwork] = useState<Network>({
    id: '',
    chainId: 0,
    subnet: '',
    ipBootnode: '',
    alloc: [''],
    nodos: [{ type: '', name: '', ip: '', port: 0 }],
  });

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<Network>({
    defaultValues: network,
  });

  const { fields: allocFields, append: appendAlloc, remove: removeAlloc } = useFieldArray({
    control,
    name: 'alloc',
  });

  const { fields: nodosFields, append: appendNodo, remove: removeNodo } = useFieldArray({
    control,
    name: 'nodos',
  });

  const allocValues = watch('alloc');
  const nodosValues = watch('nodos');

  const onSubmit = (data: Network) => {
    console.log('Datos de la red:', data);
    reset();  // Limpiar el formulario después de enviar
  };

  return (
    <div className="container">
      <h1>Añadir Red Privada de Ethereum</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos básicos */}
        <div>
          <label>Network ID:</label>
          <input {...register('id', { required: "Network ID es obligatorio" })} placeholder="Network ID" />
          {errors.id && <p className="error">{errors.id.message}</p>}
        </div>
        <div>
          <label>Chain ID:</label>
          <input
            type="number"
            {...register('chainId', { required: "Chain ID es obligatorio", min: { value: 1, message: "Debe ser un número positivo" } })}
            placeholder="Chain ID"
          />
          {errors.chainId && <p className="error">{errors.chainId.message}</p>}
        </div>
        <div>
          <label>Subnet:</label>
          <input {...register('subnet', { required: "Subnet es obligatoria" })} placeholder="Subnet" />
          {errors.subnet && <p className="error">{errors.subnet.message}</p>}
        </div>
        <div>
          <label>IP Bootnode:</label>
          <input
            {...register('ipBootnode', {
              required: "IP Bootnode es obligatoria",
              pattern: {
                value: /^(?:\d{1,3}\.){3}\d{1,3}$/,
                message: "IP no válida",
              },
            })}
            placeholder="IP Bootnode"
          />
          {errors.ipBootnode && <p className="error">{errors.ipBootnode.message}</p>}
        </div>

        {/* Campos de Alloc */}
        <h3>Alloc</h3>
        <button type="button" onClick={() => appendAlloc('')}>Agregar Cuenta</button>
        {allocFields.map((field, index) => (
          <div key={field.id} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              {...register(`alloc.${index}`, {
                required: "La cuenta es obligatoria",
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Dirección Ethereum no válida",
                },
              })}
              placeholder="Cuenta"
              style={{ marginRight: '8px' }}
            />
            {allocValues[index] && allocValues[index].trim() !== '' && (
              <button type="button" onClick={() => removeAlloc(index)}>Eliminar</button>
            )}
            {errors.alloc && errors.alloc[index] && <p className="error">{errors.alloc[index]?.message}</p>}
          </div>
        ))}

        {/* Campos de Nodos */}
        <h3>Nodos</h3>
        <button type="button" onClick={() => appendNodo({ type: '', name: '', ip: '', port: 0 })}>
          Agregar Nodo
        </button>
        {nodosFields.map((field, index) => (
          <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input {...register(`nodos.${index}.type`, { required: "Tipo es obligatorio" })} placeholder="Tipo" />
            <input {...register(`nodos.${index}.name`, { required: "Nombre es obligatorio" })} placeholder="Nombre" />
            <input
              {...register(`nodos.${index}.ip`, {
                required: "IP es obligatoria",
                pattern: {
                  value: /^(?:\d{1,3}\.){3}\d{1,3}$/,
                  message: "IP no válida",
                },
              })}
              placeholder="IP"
            />
            <input
              type="number"
              {...register(`nodos.${index}.port`, {
                required: "Puerto es obligatorio",
                min: { value: 1, message: "Puerto debe ser mayor a 0" },
                max: { value: 65535, message: "Puerto no válido" },
              })}
              placeholder="Puerto"
            />
            {nodosValues[index] &&
              nodosValues[index].type.trim() !== '' &&
              nodosValues[index].name.trim() !== '' &&
              nodosValues[index].ip.trim() !== '' &&
              nodosValues[index].port !== 0 && (
                <button type="button" onClick={() => removeNodo(index)}>Eliminar</button>
              )}
            {errors.nodos && errors.nodos[index] && (
              <div className="error">
                <p>{errors.nodos[index]?.type?.message}</p>
                <p>{errors.nodos[index]?.name?.message}</p>
                <p>{errors.nodos[index]?.ip?.message}</p>
                <p>{errors.nodos[index]?.port?.message}</p>
              </div>
            )}
          </div>
        ))}

        <button type="submit">Añadir Red</button>
      </form>
    </div>
  );
};

export default AddNetwork;
