import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Marcacao from './Pages/Marcacao/Marcacao'

function App() {

  return (
    <>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marcar/:servicoId" element={<Marcacao />} />
      </Routes>
    </>
  )
}

export default App
