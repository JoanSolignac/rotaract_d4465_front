import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter.jsx';
import { AuthProvider } from '../shared/context/AuthContext.jsx';
import '../styles/app-shell.css';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
