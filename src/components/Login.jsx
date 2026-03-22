import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import userContext from '../context/userContext'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginSocialButtons from './LoginSocialButtons.jsx';

const Login = () => {
  const [user, setuser] = useState([])
  const [showPassword, setShowPassword] = useState(false);

  const context = useContext(userContext)
  const { login, error } = context

  const handleClick = (e) => {
    const result = login(user.email, user.password)
  }

  const onchange = (e) => {
    setuser({ ...user, [e.target.name]: e.target.value })
  }
  return (
    <div className='container-md my-5'>
      <form className='card p-5 col-md-5 mx-auto shadow border-0'>
        <h2 className='my-3'>Login WebMarketX</h2>
        <div>
          <LoginSocialButtons/>
        </div>
        <div>
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onchange} />
          <p style={{ color: "#D22B2B", fontSize: "80%", fontWeight: "400" }}>{error.email}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className='d-flex justify-content-between border rounded'>
            <input type={showPassword ? "text" : "password"} className="form-control border-0" id="password" name='password' onChange={onchange} />
            <button type='button'
              onClick={() => setShowPassword(!showPassword)}
              className="btn"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <p style={{ color: "#D22B2B", fontSize: "80%", fontWeight: "400" }}>{error.password}</p>
        </div>
        <button type="button" className="btn rounded-pill" style={{ backgroundColor: "#8682fa" }} onClick={() => handleClick()}>Login</button>
        <div className='my-3'>
          Don't Have Any Account
          <Link to='/signup' className='btn-link mx-3' style={{ color: "#8682fa" }}>Create Account</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
