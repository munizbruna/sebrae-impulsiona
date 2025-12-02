import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Box } from 'lucide-react';

// Importação das Pages (ajuste os caminhos conforme cria os arquivos)
import { DocentesList } from './pages/Docentes/DocentesList';
import { CursosList } from './pages/Cursos/CursosList';
import { RecursoForm } from './pages/Recursos/RecursoForm';


// Componente de Layout (Sidebar + Conteúdo)
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
          ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Fixa */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 h-16">
          <div className="bg-blue-700 text-white p-1.5 rounded font-bold text-lg tracking-tighter">SB</div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">SGD-A</h1>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Principal</div>
          <NavItem to="/" icon={LayoutDashboard} label="Gestão de Demandas" />
          
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4 mt-6">Cadastros</div>
          <NavItem to="/docentes" icon={Users} label="Base de Docentes" />
          <NavItem to="/cursos" icon={BookOpen} label="Catálogo de Cursos" />
          <NavItem to="/recursos" icon={Box} label="Gestão de Recursos" />
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">G</div>
              <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Gestor</span>
                  <span className="text-xs text-gray-400">Admin</span>
              </div>
          </div>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Placeholder para rotas ainda não criadas
const EmBreve = ({ title }: { title: string }) => (
  <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl">
    <h2 className="text-xl font-bold text-gray-400">{title}</h2>
    <p className="text-gray-400">Módulo em desenvolvimento</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Rota Raiz (Dashboard) */}
          <Route path="/" element={<EmBreve title="Dashboard de Demandas" />} />
          
          {/* Rotas de Cadastro */}
          <Route path="/docentes" element={<DocentesList />} />
          <Route path="/cursos" element={<CursosList />} />
          <Route path="/recursos" element={<RecursoForm />} />
          
          {/* Fallback 404 */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;