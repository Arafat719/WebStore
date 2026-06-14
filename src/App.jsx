import { useState } from 'react'
import viteLogo from '/vite.svg'
import './css/App.css'
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
import ProfilePage from './components/ProfilePage';
// import Github from './components/Github';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }
  
  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />
      <UserState>
      <Navbar setAlert={setAlert} />
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/about" element={<About />} />
          <Route path="/addproducts" element={
            <ProtectedRoute role="seller" showAlert={showAlert}>
              <AddProducts showAlert={showAlert} />
            </ProtectedRoute>
          } />
          <Route path="/loader" element={<Loader />} /> 
          <Route path="/products/:id" element={<ProductDetails showAlert={showAlert}/>}/>
          <Route path="/profile/:id" element={<ProfilePage showAlert={showAlert}/>}/>
          {/* <Route path="/github" element={<Github/>}/> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserState>
      <Footer />
    </>
  )
}

export default App
