import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { localStorageImpl } from './storage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App storage={localStorageImpl} />
  </StrictMode>,
)
