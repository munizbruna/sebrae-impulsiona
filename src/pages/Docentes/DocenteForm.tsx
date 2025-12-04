import React, { useState, useEffect } from 'react';
import { Docente, DocenteCreate } from '../../types/Docente';
import { AreaCurso } from '../../types/AreaCurso';
import { DocenteService } from '../../services/DocenteService';
import { AreaCursoService } from '../../services/AreaCursoService';
import { Button } from '../../components/ui/Button';

interface DocenteFormProps {
    initialData?: Docente | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DIAS_SEMANA_OPCOES = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export const DocenteForm: React.FC<DocenteFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [areasTecnologicas, setAreasTecnologicas] = useState<AreaCurso[]>([]);

    // Estado local mantendo diasDisponiveis como Array [] para facilitar a UI dos checkboxes
    const [formData, setFormData] = useState<Partial<Docente>>({
        nome: '',
        areaCursoId: 0,
        diasDisponiveis: [], 
        especialidade: '',
        horaInicio: '',
        horaFim: ''
    });

    // 1. Carregar Áreas da API
    useEffect(() => {
        const loadAreas = async () => {
            try {
                const areas = await AreaCursoService.getAll();
                setAreasTecnologicas(areas);
            } catch (error) {
                console.error("Erro ao carregar áreas:", error);
            }
        };
        loadAreas();
    }, []);

    // 2. Popula o formulário se for edição
    useEffect(() => {
        if (initialData) {
            // Lógica de segurança: Se vier do banco como String ("Seg, Ter"), converte para Array
            let diasFormatados = initialData.diasDisponiveis;
            
            if (typeof initialData.diasDisponiveis === 'string') {
                diasFormatados = (initialData.diasDisponiveis as string).split(', ');
            }

            setFormData({
                ...initialData,
                diasDisponiveis: diasFormatados
            });
        }
    }, [initialData]);

    // Handler genérico
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler Checkboxes
    const handleDiaChange = (dia: string) => {
        setFormData(prev => {
            // Garante que é um array antes de manipular
            const diasAtuais = Array.isArray(prev.diasDisponiveis) ? prev.diasDisponiveis : [];
            
            if (diasAtuais.includes(dia)) {
                return { ...prev, diasDisponiveis: diasAtuais.filter(d => d !== dia) };
            } else {
                return { ...prev, diasDisponiveis: [...diasAtuais, dia] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // --- APLICAÇÃO DA SUGESTÃO 1 AQUI ---
        // Criamos um payload (cópia) para não quebrar o estado da tela
        // Se for array, converte para string separado por vírgulas.
        const payload = {
            ...formData,
            diasDisponiveis: Array.isArray(formData.diasDisponiveis) 
                ? formData.diasDisponiveis.join(', ') 
                : formData.diasDisponiveis
        };

        try {
            if (initialData && initialData.id) {
                // Update - Enviando o payload convertido
                // Cast 'as any' ou 'as Docente' dependendo de como sua interface Docente está tipada para string vs array
                await DocenteService.update(initialData.id, payload as unknown as Docente);
            } else {
                // Create - Enviando o payload convertido
                console.log("PAYLOAD COM STRING ENVIADO:", payload);
                await DocenteService.create(payload as unknown as DocenteCreate);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                alert("Docente salvo com sucesso!");
                setFormData({
                    nome: '',
                    areaCursoId: 0,
                    diasDisponiveis: [],
                    especialidade: '',
                    horaInicio: '',
                    horaFim: ''
                });
            }
        } catch (error) {
            console.error("Erro ao salvar docente:", error);
            alert("Erro ao salvar docente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do Docente */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Docente</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: João da Silva"
                    required
                />
            </div>

            {/* Área de Atuação */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                <select
                    name="areaCursoId"
                    value={formData.areaCursoId || 0 }
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                >
                    <option value="">Selecione uma área...</option>
                    {areasTecnologicas.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <input
                    type="text"
                    name="especialidade"
                    value={formData.especialidade || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: UX Front"
                    required
                />
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Início</label>
                    <input
                        type="time"
                        name="horaInicio"
                        value={formData.horaInicio || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fim</label>
                    <input
                        type="time"
                        name="horaFim"
                        value={formData.horaFim || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Dias da Semana (Checkboxes) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias Disponíveis</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                    {DIAS_SEMANA_OPCOES.map(dia => (
                        <div key={dia} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`dia-${dia}`}
                                checked={Array.isArray(formData.diasDisponiveis) && formData.diasDisponiveis.includes(dia)}
                                onChange={() => handleDiaChange(dia)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`dia-${dia}`} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
                                {dia}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (onCancel) onCancel();
                    }}
                    type="button"
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" isLoading={isLoading}>
                    {initialData ? 'Atualizar Docente' : 'Salvar Docente'}
                </Button>
            </div>
        </form>
    );
};