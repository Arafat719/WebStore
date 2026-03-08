import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({showAlert}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        showAlert("You are login out", 'warning')
        navigate("/login");
    };
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">WebMarket</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/About">About</Link>
                            </li>
                        </ul>
                        <form className="d-flex">{token ? (<button type='button' className='btn btn-primary mx-1' onClick={handleLogout}>Logout</button>) : (<>
                            <Link className="btn btn-primary mx-1" type="submit" to="/login">Login</Link>
                            <Link className="btn btn-primary mx-1" type="submit" to="signup">Signup</Link>
                        </>
                        )}
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
