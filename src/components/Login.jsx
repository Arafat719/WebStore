import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='container-md my-5'>
      <form className='card p-5 col-md-5 mx-auto shadow border-0'>
        <h2 className='my-3'>Login WebStore</h2>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <div className='my-3'>
          Don't Have Any Account
          <Link to='/signup' className='btn-link mx-3'>Create Account</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
