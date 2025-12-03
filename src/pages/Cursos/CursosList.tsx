import { useEffect, useState } from 'react';
import { Curso } from '../../types/Curso';
import { CursoService } from '../../services/CursoService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CursoForm } from './CursosForm'; // O formulário que acabamos de blindar
import { Plus, BookOpen, Clock } from 'lucide-react';

export const CursosList = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
    

    // Carregar dados reais
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await CursoService.getAll();
            setCursos(data);
        } catch (error) {
            console.error("Erro na API:", error);
        } finally {
            setLoading(false);
        }
    };
     const handleCreate = () => {
        console.log("Clicou em criar curso");
        setIsModalOpen(true);
    }


    return (
        <div className="animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Catálogo de Cursos</h2>
                    <p className="text-gray-500">Gerenciamento via API .NET</p>
                </div>
                <Button onClick={handleCreate} variant="primary">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Curso
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Carregando catálogo...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cursos.map((c) => (
                        <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    {c.areaTecnologica}
                                </span>
                                <span className="text-gray-400 text-xs">ID: {c.id}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 truncate" title={c.titulo}>
                                {c.titulo}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {c.cargaHoraria}h
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" /> Presencial
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {/* Integração do Modal + Form */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={selectedCurso ? "Editar Recurso" : "Novo Recurso"}
                >
                    <CursoForm 
                        initialData={selectedCurso}
                       // onSuccess={handleFormSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
        </div>
        
    );
     
};