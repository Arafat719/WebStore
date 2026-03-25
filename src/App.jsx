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
import ProductDetails from './components/ProductsDetails'

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
  console.log("hello iwrd", import.meta.env.VITE_GOOGLE_CLIENT_ID)
  return (
    <>
      <Navbar />
      <Alert alert={alert} />
      <UserState>
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/about" element={<About />} />
          <Route path="/addproducts" element={<AddProducts showAlert={showAlert} />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/products" element={<ProductDetails/>}/>
        </Routes>
      </UserState>
      <Footer />
    </>
  )
}

export default App
