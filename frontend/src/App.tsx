import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Import } from './pages/Import'
import { Editor } from './pages/Editor'
import { List } from './pages/List'

function App() {
  return (
    <BrowserRouter>
      <nav style={{padding:12,borderBottom:'1px solid #ddd',display:'flex',gap:12}}>
        <Link to="/">Importar</Link>
        <Link to="/cvs">Mis CVs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Import />} />
        <Route path="/cvs" element={<List />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
