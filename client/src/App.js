import './App.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/app-register' element={<Register />} />
      <Route path='/home' element={<Home />} />
    </Routes>
  )
}
export default App;