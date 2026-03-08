import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import Signup from './components/Signup'
import NoteState from './context/noteState'
import ProtectedRoute from "./components/ProtectedRoute";
import Alert from './components/Alert'

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <Navbar showAlert={showAlert} />
      <Alert alert={alert} />
      <NoteState>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home showAlert={showAlert} />
            </ProtectedRoute>} />
          <Route path="/about" element={<About showAlert={showAlert}/>} />
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert}/>} />
        </Routes>
      </NoteState>
    </>
  )
}

export default App
