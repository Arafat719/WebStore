import React from 'react'
import { Link } from 'react-router-dom'

const Token = ({ token }) => {
    return (
        <div className='my-4'>
            <div className="card col-3 mx-auto border-0 shadow">
                <div className="card-body">
                    <h5 className="card-title text-success">Congratulations</h5>
                    <p className="card-text">You signedup with WebStore, <strong>This is your Token</strong></p>
                    <div className='shadow border rounded p-2 my-3'>
                        <p className="card-text text-danger text-muted">{token}</p>
                    </div>
                    <Link to="/" className="btn btn-primary">Got it</Link>
                </div>
            </div>
        </div>
    )
}

export default Token
