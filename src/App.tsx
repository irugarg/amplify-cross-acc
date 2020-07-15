import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';
import { AuthProvider } from './hooks/AuthContext';
import { ToastProvider } from './hooks/ToastContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <Header />
          <Routes />
          <GlobalStyle />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  </>
);

export default App;
