import { api } from './api';
import { Docente, DocenteCreate } from '../types/Docente';

const ENDPOINT = '/Docentes';

export const DocenteService = {
    getAll: async () => {
        const { data } = await api.get<Docente[]>(ENDPOINT);
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<Docente>(`${ENDPOINT}/${id}`);
        return data;
    },

    create: async (docente: DocenteCreate) => {
        const { data } = await api.post<Docente>(ENDPOINT, docente);
        return data;
    },

    update: async (id: number, docente: Docente) => {
        await api.put(`${ENDPOINT}/${id}`, docente);
    },

    delete: async (id: number) => {
        await api.delete(`${ENDPOINT}/${id}`);
    }
};