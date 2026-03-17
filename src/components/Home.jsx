import React, { useContext } from 'react'
import Navbar from './Navbar'
import userContext from '../context/userContext'
import AddProducts from './AddProducts'

const Home = () => {
  const context = useContext(userContext)
  const { array } = context
  return (
    <div className='container'>
     
      <h1 className=' my-4 fw text-white'>Buy and Sell Websites Esily</h1>
      <p className=' fw-bold text-white'>Find The best Website To Buy And Sell, Your Online Business today</p>
      <button className='btn btn-primary me-2 border-0 px-3 fw-bold' style={{ color: "#8682fa", background: "#F3F4F4" }}>Explore Listing</button>
      <button className='btn btn-primary border-0 px-3 fw-bold' style={{ background: "#3b379c" }}>Sell your Website</button>
      <h3 className='mt-5 text-white'>All Cetagories</h3>
      <p className='text-white'>Discover Website by Cetagories</p>
      <div className='row g-0' style={{ justifyContent: "space-between" }}>
        {array.map((arr) => {
          return <AddProducts key={arr.id} arr={arr} />
        })}
      </div>
    </div>
  )
}

export default Home
