import React, { useContext } from 'react'
import Navbar from './Navbar'
import userContext from '../context/userContext'
import AddProducts from './AddProducts'

const Home = () => {
  const context = useContext(userContext)
  const { array } = context
  return (
    <div className='container'>
      <h1 className='text-light my-4 fw'>Buy and Sell Websites Esily</h1>
      <p className='text-light fw-bold'>Find The best Website To Buy And Sell, Your Online Business today</p>
      <button className='btn btn-primary me-2 border-0 px-3 fw-bold' style={{ color: "#8682fa", background: "white" }}>Explore Listing</button>
      <button className='btn btn-primary border-0 px-3 fw-bold' style={{ background: "#3b379c" }}>Sell your Website</button>
      <h3 className='mt-5 text-white'>All Cetagories</h3>
      <p className='text-white'>Discover Website by Cetagories</p>
      <div className='row row-cols-4 gx-3 my-3'>
        {array.map((arr) => {
          return <AddProducts key={arr.id} arr={arr} />
        })}
      </div>
    </div>
  )
}

export default Home
