// Define os valores fixos permitidos para evitar erros de digitação
export type TipoRecurso = 'Infraestrutura' | 'Equipamento' | 'Insumo';

export interface Recurso {
    id: number;
    nome: string;
    tipo: TipoRecurso; // No C# é string, mas aqui restringimos para segurança
    area: number;      // Ex: "Alimentos", "Metalurgia"
    
    // Campos opcionais (?) pois dependem do Tipo selecionado
    descricao?: string;      // Usado para Infraestrutura
    patrimonio?: string;             // Número de Inventário (Equipamentos)
    quantidade?: number;     // Equipamentos e Insumos
    unidadeMedida?: string;  // Apenas Insumos (Kg, Lt, Unid)
}

// Tipo utilitário para formulários de criação (onde ainda não temos ID)
export type RecursoCreate = Omit<Recurso, 'id'>;