import React, { useEffect, useState } from 'react';
import { Curso } from '../../types/Curso';
import { CursoService } from '../../services/CursoService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal'; // <--- 1. Importar o Modal
import { CursoForm } from './CursosForm'; // <--- 2. Importar o Form
import { Edit2, Plus, Trash } from 'lucide-react';

export const CursosList: React.FC = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

    const loadCursos = async () => {
        try {
            const data = await CursoService.getAll();
            setCursos(data);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar cursos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCursos();
    }, []);

    // Handlers
    const handleCreate = () => {
        setSelectedCurso(null);
        setIsModalOpen(true);
    };

    const handleEdit = (curso: Curso) => {
        setSelectedCurso(curso);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja excluir este curso?')) {
            await CursoService.delete(id);
            loadCursos();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Catálogo de Cursos</h2>
                <Button variant="primary" onClick={handleCreate}>
                    + Novo Curso
                </Button>
            </div>
            

            {/* Tabela... */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Título</th>
                            <th className="p-4">Área</th>
                            <th className="p-4">Carga Horária</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {cursos.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{c.titulo}</td>
                                <td className="p-4 text-gray-600">{c.areaTecnologica}</td>
                                <td className="p-4 text-gray-600">{c.cargaHoraria}h</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-500 hover:text-blue-600">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(c.id!)} className="p-1.5 text-gray-500 hover:text-red-600">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação/Edição */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCurso ? "Editar Curso" : "Novo Curso"}
            >
                <CursoForm
                    initialData={selectedCurso}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        loadCursos();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};