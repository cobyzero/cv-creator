import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { listCvs } from './lib/api'
import { Editor } from './pages/Editor'
import { Import } from './pages/Import'
import { List } from './pages/List'

function Readout() {
  const [n, setN] = useState<number | null>(null)
  useEffect(() => { listCvs().then((cvs: any[]) => setN(cvs.length)).catch(() => setN(null)) }, [])
  return (
    <div className="readout" aria-live="polite">
      <span><span className="dot">●</span> LOCAL</span>
      <span>{n === null ? '— CVs' : `${n} ${n === 1 ? 'CV' : 'CVs'}`}</span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <header className="masthead">
        <NavLink to="/" className="wordmark">CV<em>·</em>Creator</NavLink>
        <nav className="nav" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Importar</NavLink>
          <NavLink to="/cvs" className={({ isActive }) => (isActive ? 'active' : '')}>Mis CVs</NavLink>
        </nav>
        <Readout />
      </header>
      <Routes>
        <Route path="/" element={<Import />} />
        <Route path="/cvs" element={<List />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
