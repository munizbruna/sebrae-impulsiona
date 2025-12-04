import { useEffect, useState, useMemo } from 'react';
import { Curso } from '../../types/Curso';
import { Recurso } from '../../types/Recurso';
import { CursoService } from '../../services/CursoService';
import { RecursoService } from '../../services/RecursoService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CursoForm } from './CursosForm';
import { Plus, Edit2, Wrench, Box, LayoutTemplate } from 'lucide-react';

export const CursosList = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [recursosMap, setRecursosMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

    // Carregar dados (Cursos e Recursos para mapear os tipos)
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Buscamos Cursos e Recursos em paralelo
            const [cursosData, recursosData] = await Promise.all([
                CursoService.getAll(),
                RecursoService.getAll()
            ]);

            setCursos(cursosData);

            // Cria um Mapa: ID do Recurso -> Tipo do Recurso (para acesso rápido)
            const map = new Map<number, string>();
            recursosData.forEach(r => map.set(r.id, r.tipo));
            setRecursosMap(map);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCurso(null);
        setIsModalOpen(true);
    }

    const handleEdit = (curso: Curso) => {
        setSelectedCurso(curso);
        setIsModalOpen(true);
    }

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        loadData();
    };

    // Função auxiliar para determinar quais categorias o curso exige
    const getCourseCategories = (curso: Curso) => {
        if (!curso.recursosIds || curso.recursosIds.length === 0) return [];

        const tiposEncontrados = new Set<string>();
        
        curso.recursosIds.forEach(id => {
            const tipo = recursosMap.get(id);
            if (tipo) tiposEncontrados.add(tipo);
        });

        return Array.from(tiposEncontrados);
    };

    // Componente auxiliar para renderizar os ícones
    const CategoryIcon = ({ tipo }: { tipo: string }) => {
        switch (tipo) {
            case 'Infraestrutura':
                return (
                    <div title="Infraestrutura" className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <LayoutTemplate className="w-4 h-4" />
                    </div>
                );
            case 'Equipamento':
                return (
                    <div title="Equipamento" className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Wrench className="w-4 h-4" />
                    </div>
                );
            case 'Insumo':
                return (
                    <div title="Insumo" className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Box className="w-4 h-4" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Catálogo de Cursos</h2>
                    <p className="text-gray-500 mt-1">Gerencie o portfólio e checklists de validação.</p>
                </div>
                <Button onClick={handleCreate} variant="primary">
                    <Plus className="w-4 h-4 mr-2" /> Novo Curso
                </Button>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Carregando catálogo...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Título do Curso</th>
                                <th className="p-4 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Área Tecnológica</th>
                                <th className="p-4 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Carga Horária</th>
                                <th className="p-4 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Categorias Exigidas</th>
                                <th className="p-4 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cursos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum curso cadastrado.</td>
                                </tr>
                            ) : (
                                cursos.map((c) => {
                                    const categorias = getCourseCategories(c);
                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="p-4 text-sm font-semibold text-gray-800">
                                                {c.titulo}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {c.areaTecnologica || 'Geral'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {c.cargaHoraria} horas
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {categorias.length > 0 ? (
                                                        categorias.map(cat => <CategoryIcon key={cat} tipo={cat} />)
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Sem requisitos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => handleEdit(c)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                                    title="Editar Curso"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal + Form */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={selectedCurso ? "Editar Curso" : "Novo Curso"}
            >
                <CursoForm 
                    initialData={selectedCurso}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};