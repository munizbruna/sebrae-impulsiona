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
    const [titulo, setTitulo] = useState(initialData ? initialData.titulo : '');
    const [areaTecnologica, setAreaTecnologica] = useState(initialData ? initialData.areaTecnologica : '');
    const [cargaHoraria, setCargaHoraria] = useState(initialData ? initialData.cargaHoraria : 0);
    const [areasTecnologicas, setAreasTecnologicas] = useState<AreaCurso[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await AreaCursoService.getAll();
                setAreasTecnologicas(data);
            }       catch (error) { 
                console.error("Erro ao buscar áreas tecnológicas:", error);
            }
        }
        fetchAreas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {    
        e.preventDefault();
        setIsLoading(true); 
        const cursoData: Curso = {
            id: initialData ? initialData.id : 0,
            titulo,
            areaTecnologica,
            cargaHoraria,
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
            alert("Não foi possível salvar o curso. Verifique os dados e tente novamente.");
        }
        finally {
            setIsLoading(false);
        }
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
            <div>
                <label className="block text-sm font-medium text-gray-700">Área Tecnológica</label>
                <select
                    value={areaTecnologica}
                    onChange={(e) => setAreaTecnologica(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">Carga Horária (em horas)</label> 
                <input
                    type="number"
                    value={cargaHoraria}
                    onChange={(e) => setCargaHoraria(Number(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    min={1}
                />
            </div>
            <div className="flex justify-end gap-2">
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