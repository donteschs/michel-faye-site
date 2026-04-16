import { useState, createContext, useContext } from 'react';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import Toast from './components/ui/Toast';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditor from './pages/admin/AdminEditor';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export default function App() {
  const auth = useAuth();
  const [page, setPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [mobNavOpen, setMobNavOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = (to, data = null) => {
    setPage(to);
    setMobNavOpen(false);
    if (to === 'article') setSelectedArticle(data);
    if (to === 'editor') setEditArticle(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const notify = (message, type = 'success') => setToast({ message, type });

  const renderPage = () => {
    if (auth.loading) return null;
    switch (page) {
      case 'home':     return <Home />;
      case 'articles': return <Articles />;
      case 'article':  return <ArticleDetail />;
      case 'about':    return <About />;
      case 'contact':  return <Contact />;
      case 'login':    return <Login />;
      case 'admin':    return auth.isAdmin ? <AdminDashboard /> : <Login />;
      case 'editor':   return auth.isAdmin ? <AdminEditor /> : <Login />;
      default:         return <Home />;
    }
  };

  return (
    <AppContext.Provider value={{ ...auth, page, navigate, selectedArticle, editArticle, notify }}>
      <div style={{ display:'flex', minHeight:'100dvh', background:'var(--cream)' }}>
        <Sidebar />
        <MobileHeader open={mobNavOpen} onToggle={() => setMobNavOpen(o => !o)} />
        <main style={{ flex:1, marginLeft:240, minHeight:'100dvh', display:'flex', flexDirection:'column' }} className="main-content">
          {renderPage()}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@media(max-width:768px){.main-content{margin-left:0!important;padding-top:64px}}`}</style>
    </AppContext.Provider>
  );
}
