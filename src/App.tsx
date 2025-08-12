import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import AppStore from './components/AppStore';
import IconGenerationTool from './components/IconGenerationTool';

function App() {
  const { loading, login, logout, isAuthenticated } = useAuth();
  
  // Check if we should show the icon generation tool
  const urlParams = new URLSearchParams(window.location.search);
  const showIconTool = urlParams.get('tool') === 'icons';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  if (showIconTool) {
    return <IconGenerationTool />;
  }

  return <AppStore onLogout={logout} />;
}

export default App;