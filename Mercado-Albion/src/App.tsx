import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ItemDetails } from './pages/components/itemDetails/ItemDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  )
}

export default App
