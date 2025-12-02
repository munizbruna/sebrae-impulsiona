export interface Curso {
    id: number;
    titulo: string;
    areaTecnologica: string; // Verifique se no C# é 'Area' ou 'AreaTecnologica'
    cargaHoraria: number;    // Verifique se no C# é 'CH' ou 'CargaHoraria'
    recursosIds?: number[];  // Para mapear a relação many-to-many
}

// Tipo usado no formulário de criação (sem ID)
export type CursoCreate = Omit<Curso, 'id'>;