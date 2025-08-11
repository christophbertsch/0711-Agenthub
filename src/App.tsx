import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import AppStore from './components/AppStore';

function App() {
  const { loading, login, logout, isAuthenticated } = useAuth();

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

  return <AppStore onLogout={logout} />;
}

export default App;