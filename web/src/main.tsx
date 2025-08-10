import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import '@smastrom/react-rating/style.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>  
    <App />
  </StrictMode>
);
