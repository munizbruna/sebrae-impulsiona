// Espelho do seu Model C#
export interface Docente {
    userid: number; // No C# é int
    user: string;
    area: string;
    diasSemana?: string[]; // Precisa verificar como o C# retorna isso (List<string> ou string separada por vírgula)
    horaInicio?: string; // TimeSpan ou String no C#
    horaFim?: string;
}

// Interface para criação (sem ID)
export type DocenteCreate = Omit<Docente, 'id'>;