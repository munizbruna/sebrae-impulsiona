import { api } from './api';
import { AreaCurso } from '../types/AreaCurso';

const ENDPOINT = '/AreaCursos';

export const AreaCursoService = {
    getAll: async () => {
        const { data } = await api.get<AreaCurso[]>(ENDPOINT);
        return data;
    }
};