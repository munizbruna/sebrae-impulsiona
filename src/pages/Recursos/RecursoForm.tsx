import React, { useState, useEffect } from 'react';
import { Recurso, RecursoCreate } from '../../types/Recurso';
import { AreaCurso } from '../../types/AreaCurso';
import { RecursoService } from '../../services/RecursoService';
import { AreaCursoService } from '../../services/AreaCursoService';
import { Button } from '../../components/ui/Button';

interface RecursoFormProps {
    initialData?: Recurso | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const RecursoForm: React.FC<RecursoFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [areasTecnologicas, setAreasTecnologicas] = useState<AreaCurso[]>([]);

    const [formData, setFormData] = useState<Partial<Recurso>>({
        tipo: 'Infraestrutura',
        area: 0, // Inicializa vazio para obrigar seleção ou espera carga
        nome: '',
        descricao: '',
        patrimonio: '',
        quantidade: 0,
        unidadeMedida: ''
    });

    // 1. Carregar Áreas da API
    useEffect(() => {
        const loadAreas = async () => {
            try {
                const areas = await AreaCursoService.getAll();
                setAreasTecnologicas(areas);
                console.log("Áreas carregadas:", areas);

            } catch (error) {
                console.error("Erro ao carregar áreas:", error);
                // Fallback silencioso ou alerta
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantidade' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (initialData && initialData.id) {
                await RecursoService.update(initialData.id, formData as Recurso);
            } else {
                await RecursoService.create(formData as RecursoCreate);
            }
            if (onSuccess) {
                onSuccess(); // Se tiver pai (Modal), ele fecha.
            } else {
                // Se for página solta (seu caso atual), avisa e reseta.
                alert("Recurso salvo com sucesso!");
                setFormData({
                    tipo: 'Infraestrutura',
                    area: 0,
                    nome: '',
                    descricao: '',
                    patrimonio: '',
                    quantidade: 0,
                    unidadeMedida: ''
                });
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar recurso. Verifique se a API está online.");
        } finally {
            setIsLoading(false);
        }
    };
    console.log("área selecionada:", formData);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recurso</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ex: Projetor, Cozinha Industrial..."
                    required
                />
            </div>

            {/* Grid: Área e Tipo */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área de Aplicação</label>
                    <select
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    >
                        <option value="">Selecione uma área...</option>
                        {areasTecnologicas.length === 0 && <option value="">Carregando áreas...</option>}
                        {areasTecnologicas.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Infraestrutura">Infraestrutura</option>
                        <option value="Equipamento">Equipamento</option>
                        <option value="Insumo">Insumo</option>
                    </select>
                </div>
            </div>

            {/* Renderização Condicional */}

            {formData.tipo === 'Infraestrutura' && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Especificação</label>
                    <textarea
                        name="descricao"
                        value={formData.descricao || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                        placeholder="Ex: Sala com 30 cadeiras, ar condicionado..."
                    ></textarea>
                </div>
            )}

            {formData.tipo === 'Equipamento' && (
                <div className="animate-fade-in space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NI (Patrimônio)</label>
                            <input
                                type="text"
                                name="patrimonio"
                                value={formData.patrimonio || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ex: 001234"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input
                                type="number"
                                name="quantidade"
                                value={formData.quantidade || 0}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={2}
                            placeholder="Estado de conservação, voltagem..."
                        ></textarea>
                    </div>
                </div>
            )}

            {formData.tipo === 'Insumo' && (
                <div className="animate-fade-in space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                        <input
                            type="text"
                            name="descricao"
                            value={formData.descricao || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Ex: Farinha de Trigo Tipo 1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                            <select
                                name="unidadeMedida"
                                value={formData.unidadeMedida || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                            >
                                <option value="">Selecione...</option>
                                <option value="Unidade">Unidade</option>
                                <option value="Kg">Kg</option>
                                <option value="Litro">Litro</option>
                                <option value="Pacote">Pacote</option>
                                <option value="Caixa">Caixa</option>
                                <option value="Metro">Metro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input
                                type="number"
                                name="quantidade"
                                value={formData.quantidade || 0}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (onCancel) onCancel();
                        else console.log("Cancelar clicado (sem navegação definida)");
                    }}
                    type="button"
                >
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" isLoading={isLoading}>Salvar Recurso</Button>
            </div>
        </form>
    );
};