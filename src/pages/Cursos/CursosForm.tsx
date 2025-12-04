import React, { useState, useEffect } from 'react';
import { Curso } from '../../types/Curso';
import { AreaCurso } from '../../types/AreaCurso';
import { Recurso } from '../../types/Recurso'; // Importar Recurso
import { CursoService } from '../../services/CursoService';
import { AreaCursoService } from '../../services/AreaCursoService';
import { RecursoService } from '../../services/RecursoService'; // Importar Service
import { Button } from '../../components/ui/Button';

interface CursoFormProps {
    initialData?: Curso | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CursoForm: React.FC<CursoFormProps> = ({ initialData, onSuccess, onCancel }) => {
    // Estados do Curso
    const [titulo, setTitulo] = useState(initialData ? initialData.titulo : '');
    const [areaTecnologica, setAreaTecnologica] = useState(initialData ? initialData.areaTecnologica : '');
    const [cargaHoraria, setCargaHoraria] = useState(initialData ? initialData.cargaHoraria : 0);
    
    // Estados de Dados Auxiliares
    const [areasTecnologicas, setAreasTecnologicas] = useState<AreaCurso[]>([]);
    const [recursosDisponiveis, setRecursosDisponiveis] = useState<Recurso[]>([]);
    const [selectedRecursos, setSelectedRecursos] = useState<number[]>(initialData?.recursosIds || []);
    
    const [isLoading, setIsLoading] = useState(false);

    // 1. Carregar Áreas (Inicial)
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await AreaCursoService.getAll();
                setAreasTecnologicas(data);
            } catch (error) { 
                console.error("Erro ao buscar áreas:", error);
            }
        }
        fetchAreas();
    }, []);

    // 2. Carregar Recursos quando a Área mudar
    useEffect(() => {
        if (!areaTecnologica) {
            setRecursosDisponiveis([]);
            return;
        }

        const fetchRecursos = async () => {
            try {
                // Converte para number pois o value do select pode ser string
                const areaId = Number(areaTecnologica);
                const data = await RecursoService.getByArea(areaId);
                setRecursosDisponiveis(data);
            } catch (error) {
                console.error("Erro ao buscar recursos da área:", error);
            }
        }
        fetchRecursos();
    }, [areaTecnologica]);

    // Função para Checkbox
    const toggleRecurso = (id: number) => {
        setSelectedRecursos(prev => 
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {    
        e.preventDefault();
        setIsLoading(true); 
        
        const cursoData: Curso = {
            id: initialData ? initialData.id : 0,
            titulo,
            areaTecnologica: areaTecnologica.toString(), // Garante string p/ interface, mas backend espera int (cuidado com tipagem)
            cargaHoraria,
            recursosIds: selectedRecursos // Envia lista de IDs
        };

        try {
            if (initialData) {
                await CursoService.update(initialData.id, cursoData);
            } else {
                await CursoService.create(cursoData);
            }
            if (onSuccess) onSuccess();
        }
        catch (error) {
            console.error("Erro ao salvar curso:", error);
            alert("Não foi possível salvar o curso.");
        }
        finally {
            setIsLoading(false);
        }
    };

    // Função auxiliar para agrupar recursos por tipo
    const renderRecursosPorTipo = (tipo: string, label: string, cor: string) => {
        const filtrados = recursosDisponiveis.filter(r => r.tipo === tipo);
        if (filtrados.length === 0) return null;

        return (
            <div className="mb-4 border border-gray-100 rounded-lg p-3 bg-gray-50 animate-fade-in">
                <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${cor}`}>
                    {/* Checkbox "Master" visual apenas, ou ícone */}
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {label}
                </h4>
                <div className="space-y-2 ml-2">
                    {filtrados.map(recurso => (
                        <label key={recurso.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input 
                                type="checkbox"
                                checked={selectedRecursos.includes(recurso.id)}
                                onChange={() => toggleRecurso(recurso.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                {recurso.nome} 
                                {recurso.unidadeMedida && <span className="text-xs text-gray-400 ml-1">({recurso.unidadeMedida})</span>}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Título do Curso</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Área Tecnológica</label>
                    <select
                        value={areaTecnologica}
                        onChange={(e) => {
                            setAreaTecnologica(e.target.value);
                            // Opcional: Limpar recursos selecionados ao trocar de área?
                            // setSelectedRecursos([]); 
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="" disabled>Selecione uma área</option>
                        {areasTecnologicas.map((area) => (  
                            <option key={area.id} value={area.id}>
                                {area.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Carga Horária (h)</label> 
                    <input
                        type="number"
                        value={cargaHoraria}
                        onChange={(e) => setCargaHoraria(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                        min={1}
                    />
                </div>
            </div>

            {/* Seção de Recursos (Checklist) */}
            <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-md font-bold text-gray-800 mb-2 flex items-center justify-between">
                    Recursos Necessários
                    {areaTecnologica && recursosDisponiveis.length === 0 && (
                        <span className="text-xs font-normal text-gray-500">Nenhum recurso cadastrado nesta área.</span>
                    )}
                </h3>

                {!areaTecnologica ? (
                    <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded text-center">
                        Selecione uma Área Tecnológica para ver os recursos disponíveis.
                    </div>
                ) : (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {renderRecursosPorTipo('Infraestrutura', 'Infraestrutura', 'text-blue-700')}
                        {renderRecursosPorTipo('Equipamento', 'Equipamentos', 'text-emerald-700')}
                        {renderRecursosPorTipo('Insumo', 'Insumos', 'text-amber-700')}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}