import React, { useEffect, useState } from 'react';
import { Recurso } from '../../types/Recurso';
import { RecursoService } from '../../services/RecursoService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal'; // Reaproveitando seu componente de Modal
import { RecursoForm } from './RecursoForm'; // O formulário que acabamos de blindar

export const RecursoList: React.FC = () => {
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para controle do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);

    // 1. Carga Inicial
    const loadRecursos = async () => {
        setIsLoading(true);
        try {
            const data = await RecursoService.getAll();
            setRecursos(data);
        } catch (error) {
            console.error("Erro ao buscar recursos:", error);
            alert("Não foi possível carregar a lista de recursos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRecursos();
    }, []);

    // 2. Ações do Usuário
    const handleEdit = (recurso: Recurso) => {
        setSelectedRecurso(recurso);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedRecurso(null); // Limpa para criar novo
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este recurso?')) {
            try {
                await RecursoService.delete(id);
                loadRecursos(); // Recarrega a lista
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir. Verifique se o recurso está alocado em algum curso.");
            }
        }
    };

    // 3. Callbacks do Formulário
    const handleFormSuccess = () => {
        setIsModalOpen(false);
        loadRecursos(); // Atualiza a lista automaticamente
    };

    return (
        <div className="p-6">
            {/* Header da Página */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciar Recursos</h1>
                <Button variant="primary" onClick={handleCreate}>
                    + Novo Recurso
                </Button>
            </div>

            {/* Tabela de Listagem */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Carregando...</td>
                            </tr>
                        ) : recursos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nenhum recurso cadastrado.</td>
                            </tr>
                        ) : (
                            recursos.map((recurso) => (
                                <tr key={recurso.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{recurso.nome}</div>
                                        {recurso.descricao && (
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{recurso.descricao}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${recurso.tipo === 'Infraestrutura' ? 'bg-blue-100 text-blue-800' : 
                                              recurso.tipo === 'Equipamento' ? 'bg-green-100 text-green-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {recurso.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {recurso.area}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {recurso.quantidade} {recurso.unidadeMedida}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(recurso)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(recurso.id!)} // ! garante que id existe no contexto da lista
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Integração do Modal + Form */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={selectedRecurso ? "Editar Recurso" : "Novo Recurso"}
            >
                <RecursoForm 
                    initialData={selectedRecurso}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};