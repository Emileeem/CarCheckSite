import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App