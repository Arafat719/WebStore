import { useState, useEffect } from 'react'
import './css/App.css'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home'
import VisitorTracker from './components/VisitorTracker'
import Login from './components/Login'
import Signup from './components/Signup'
import UserState from './context/userState'
import ProtectedRoute from "./components/ProtectedRoute";
import Alert from './components/Alert'
import NotificationToast from './components/NotificationToast'
import Footer from './components/Footer'
import AddProducts from './components/AddProducts'
import NotFound from './components/NotFound'
import About from './components/About'
import Loader from './components/Loader'
import ProductDetails from './components/ProductsDetails'
import ProfilePage from './components/ProfilePage';
import TawkToChat from './components/TawkToChat';
import Settings from './pages/Settings';
import MyOrders from './pages/MyOrders/MyOrders';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentFail from './pages/Payment/PaymentFail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicProfile from './pages/PublicProfile';
import Help from './pages/Help/Help';
import SmartOrder from './pages/SmartOrder/SmartOrder';
import Docs from './pages/Docs/Docs';
import TermsOfUse from './pages/Legal/TermsOfUse';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import RefundPolicy from './pages/Legal/RefundPolicy';
// import Github from './components/Github';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type, onOk) => {
    setAlert({
      msg: message,
      type: type,
      onOk: onOk || null,
    })
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }
  
  return (
    <>
      <ScrollToTop />
      <VisitorTracker />
      <Alert alert={alert} setAlert={setAlert} />
      <UserState>
      <Navbar setAlert={setAlert} />
      <NotificationToast />
        <Routes>
          <Route path="/" element={
            <Home />
          } />
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
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/myorders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/seller/:id" element={<PublicProfile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/smart-order" element={
            <ProtectedRoute>
              <SmartOrder />
            </ProtectedRoute>
          } />
          {/* <Route path="/github" element={<Github/>}/> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserState>
      <Footer />
      <TawkToChat />
    </>
  )
}

export default App
