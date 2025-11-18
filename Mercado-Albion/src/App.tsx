import './App.css'
import { Home } from './pages/Home'
// Hacer llamada a https://west.albion-online-data.com/api/v2/stats/history/T4_BAG para ver todo el historico de precios y poner una gráfica entre franjas, que se puedan poner en 1 día, 7 dias,
function App() {

  return (
    <div>
      <Home />
    </div>
  )
}

export default App
