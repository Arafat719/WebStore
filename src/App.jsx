import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import UserState from './context/userState'
import ProtectedRoute from "./components/ProtectedRoute";
import Alert from './components/Alert'
import Footer from './components/Footer'
import AddProducts from './components/AddProducts'
import NotFound from './components/NotFound'
import About from './components/About'
import Loader from './components/Loader'

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
      <UserState>
        <Routes>
          <Route path="/" element={
            <Home showAlert={showAlert} />
          } />
          <Route>
          </Route>
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert} />} />
          <Route path="/about" element={<About/>} />
          <Route path="/addproducts" element={<AddProducts />} />
          <Route path="/loader" element={<Loader/>} />
        </Routes>
      </UserState>
      <Footer />
    </>
  )
}

export default App
