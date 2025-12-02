import { api } from './api';
import { Recurso, RecursoCreate } from '../types/Recurso';

// Endpoint base deve bater com o [Route("api/[controller]")] do C#
const ENDPOINT = '/Recursos'; 

export const RecursoService = {
    // GET: Listar todos
    getAll: async () => {
        const { data } = await api.get<Recurso[]>(ENDPOINT);
        return data;
    },

    // GET: Buscar um por ID
    getById: async (id: number) => {
        const { data } = await api.get<Recurso>(`${ENDPOINT}/${id}`);
        return data;
    },

    // POST: Criar novo
    create: async (recurso: RecursoCreate) => {
        const { data } = await api.post<Recurso>(ENDPOINT, recurso);
        return data;
    },

    // PUT: Atualizar existente
    update: async (id: number, recurso: Recurso) => {
        await api.put(`${ENDPOINT}/${id}`, recurso);
    },

    // DELETE: Remover
    delete: async (id: number) => {
        await api.delete(`${ENDPOINT}/${id}`);
    }
};