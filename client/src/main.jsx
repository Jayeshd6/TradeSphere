import { StrictMode } from 'react'
import { Toaster } from "react-hot-toast";
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <Toaster position="top-right" /> 
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
