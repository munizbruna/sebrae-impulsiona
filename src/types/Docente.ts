// types/Docente.ts
export interface Docente {
    id: number;
    nome: string;
    areaCursoId: number; // Note que aqui é string, diferente do Recurso que era number
    area:string;
    diasDisponiveis?: string[];
    especialidade?: string;
    horaInicio?: string;
    horaFim?: string;
}

export type DocenteCreate = Omit<Docente, 'userid'>;