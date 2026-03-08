import { useContext, useState } from 'react'
import noteContext from '../context/noteContext'
import Token from './Token';
import { Link } from 'react-router-dom';

const Signup = ({ showAlert }) => {
    const [token, settoken] = useState(null)
    const context = useContext(noteContext)
    const { signUP } = context;

    const [user, setuser] = useState([])

    const handleClick = async () => {
        const response = await signUP(user.name, user.email, user.password)
        settoken(response)
        showAlert("Congratulations you have been our user", 'success')
    }

    const onchange = (e) => {
        setuser({ ...user, [e.target.name]: e.target.value })
    }
    return (
        <div className='container-md my-5'>
            <form className='card p-5 col-md-5 mx-auto shadow border-0'>
                <h2 className='my-3'>Sign up WebStore</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">User Name</label>
                    <input type="text" className="form-control" id="name" name='name' onChange={onchange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onchange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onchange} />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => { handleClick() }}>Submit</button>
                <div className='my-3'>
                    Already have an Account
                    <Link to='/login' className='btn-link mx-3'>Login</Link>
                </div>
            </form>
            {token ? <Token token={token} /> : ''}
        </div>
    )
}

export default Signup
