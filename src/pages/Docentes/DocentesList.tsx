import { useEffect, useState } from 'react';
import { Docente } from '../../types/Docente';
import { DocenteService } from '../../services/DocenteService';
import { Button } from '../../components/ui/Button'; // Seu componente extraído
import { Edit2, Plus, Trash } from 'lucide-react';
import { Modal } from '../../components/ui/Modal'; // Reaproveitando seu componente de Modal
import { DocenteForm } from './DocenteForm'; // O formulário que acabamos de blindar


export const DocentesList = () => {
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);


    // Carregar dados da API Real
    useEffect(() => {
        loadDocentes();
    }, []);

    const loadDocentes = async () => {
        try {
            const data = await DocenteService.getAll();
            console.log("DADOS RECEBIDOS DA API:", data);
            setDocentes(data);
        } catch (error) {
            console.error("Erro ao buscar docentes:", error);
            alert("Falha ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDocente(null); // Limpa para criar novo
        setIsModalOpen(true);
    };


    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza?")) return;
        try {
            await DocenteService.delete(id);
            setDocentes(prev => prev.filter(d => d.userid !== id));
        } catch (error) {
            alert("Erro ao excluir.");
        }
    }

    if (loading) return <div>Carregando base de dados...</div>;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Base de Docentes</h2>
                    <p className="text-gray-500">Integração via .NET API</p>
                </div>
                {/* Botão de Adicionar chama o Modal (que deve ser gerenciado no componente pai ou via Context) */}
                <Button onClick={() => { }} variant="primary">
                    <Plus className="w-4 h-4 mr-2" /> Novo Docente
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Nome</th>
                            <th className="p-4 font-semibold">Área</th>
                            <th className="p-4 font-semibold">Disponibilidade</th>
                            <th className="p-4 font-semibold">Horário</th>

                            <th className="p-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {docentes.map((d) => (
                            <tr key={d.userid} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{d.user}</td>
                                <td className="p-4 text-gray-600">{d.area}</td>
                                <td className="p-4 text-gray-600">{d.diasSemana}</td>
                                <td className="p-4 text-gray-600">{d.horaInicio} - {d.horaFim}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-blue-600">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(d.userid)}
                                        className="p-1.5 text-gray-500 hover:text-red-600">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};