import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import './assets/styles/App.css';

const App = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);

export default App;
