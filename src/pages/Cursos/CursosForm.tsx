import React, { useState, useEffect } from 'react';
import { Curso, CursoCreate } from '../../types/Curso';
import { AreaCurso } from '../../types/AreaCurso';
import { CursoService } from '../../services/CursoService';
import { AreaCursoService } from '../../services/AreaCursoService';
import { Button } from '../../components/ui/Button';

interface CursoFormProps {
    initialData?: Curso | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CursoForm: React.FC<CursoFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [areasTecnologicas, setAreasTecnologicas] = useState<AreaCurso[]>([]);

    // Inicialização do estado seguindo o padrão do RecursoForm
    const [formData, setFormData] = useState<Partial<Curso>>({
        titulo: '',
        areaTecnologica: 0,
        cargaHoraria: 0,
        recursosIds: [] // Inicializa array vazio caso precise no futuro
    });

    // 1. Carregar Áreas da API
    useEffect(() => {
        const loadAreas = async () => {
            try {
                const areas = await AreaCursoService.getAll();
                setAreasTecnologicas(areas);
            } catch (error) {
                console.error("Erro ao carregar áreas tecnológicas:", error);
            }
        };
        loadAreas();
    }, []);

    // 2. Popula o formulário se for edição
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Lógica para converter campos numéricos, similar ao 'quantidade' do exemplo anterior
        const isNumericField = name === 'cargaHoraria' || name === 'areaTecnologica';

        setFormData(prev => ({
            ...prev,
            [name]: isNumericField ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (initialData && initialData.id) {
                // Update
                await CursoService.update(initialData.id, formData as Curso);
            } else {
                // Create
                await CursoService.create(formData as CursoCreate);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                // Fallback para uso fora de modal
                alert("Curso salvo com sucesso!");
                setFormData({
                    titulo: '',
                    areaTecnologica: 0,
                    cargaHoraria: 0,
                    recursosIds: []
                });
            }
        } catch (error) {
            console.error("Erro ao salvar curso:", error);
            alert("Erro ao salvar curso. Verifique se a API está online.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Curso</label>
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ex: Desenvolvimento de Sistemas"
                    required
                />
            </div>

            {/* Grid: Área e Carga Horária */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área Tecnológica</label>
                    <select
                        name="areaTecnologica"
                        value={formData.areaTecnologica}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    >
                        <option value="">Selecione uma área...</option>
                        {areasTecnologicas.length === 0 && <option value="" disabled>Carregando áreas...</option>}
                        {areasTecnologicas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária (horas)</label>
                    <input
                        type="number"
                        name="cargaHoraria"
                        value={formData.cargaHoraria || 0}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                        min={1}
                    />
                </div>
            </div>

            {/* Footer de Ações */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                        if (onCancel) onCancel();
                    }}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading}
                >
                    {initialData ? 'Atualizar Curso' : 'Salvar Curso'}
                </Button>
            </div>
        </form>
    );
};