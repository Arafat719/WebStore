import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
// import Token from './Token';
import { Link, useNavigate } from 'react-router-dom';
import LoginSocialButtons from './LoginSocialButtons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
    const context = useContext(userContext)
    const { signUP, error } = context;
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const [user, setuser] = useState([])

    const handleClick = async () => {
        signUP(user.name, user.email, user.password)
    }

    const onchange = (e) => {
        setuser({ ...user, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const token = localStorage.getItem("token"); // Token check
        if (token) {
            navigate("/");
        }
    }, []);
    return (
        <div className='container-md my-5'>
            <form className='card p-5 col-md-5 mx-auto shadow border-0'>
                <h2 className='my-3'>Sign up WebMarketX</h2>
                <div className='my-2'>
                    <LoginSocialButtons />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">User Name</label>
                    <input type="text" className="form-control" id="name" name='name' onChange={onchange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onchange} aria-describedby="emailHelp" />
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
                <button type="button" className="btn btn-primary rounded-pill" onClick={() => { handleClick() }} style={{ backgroundColor: "#8682fa" }}>Sign up</button>
                <div className='my-3'>
                    Already have an Account
                    <Link to='/login' className='btn-link mx-3' style={{ color: "#8682fa" }}>Login</Link>
                </div>
            </form>
            {/* {token ? <Token token={token} /> : ''} */}
        </div>
    )
}

export default Signup
