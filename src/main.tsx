import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initializeCasting } from './utils/casting';
import './index.css';

function Root() {
  useEffect(() => {
    initializeCasting().catch(console.error);
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);