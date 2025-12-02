import { api } from './api';
import { Curso, CursoCreate } from '../types/Curso';

const ENDPOINT = '/Cursos'; // Confirme se sua rota no Controller é [Route("api/[controller]")]

export const CursoService = {
    getAll: async () => {
        const { data } = await api.get<Curso[]>(ENDPOINT);
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<Curso>(`${ENDPOINT}/${id}`);
        return data;
    },

    create: async (curso: CursoCreate) => {
        const { data } = await api.post<Curso>(ENDPOINT, curso);
        return data;
    },

    update: async (id: number, curso: Curso) => {
        await api.put(`${ENDPOINT}/${id}`, curso);
    },

    delete: async (id: number) => {
        await api.delete(`${ENDPOINT}/${id}`);
    }
};