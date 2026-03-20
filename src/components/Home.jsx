import React, { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import Productcard from './Productcard'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

const Home = () => {
  const context = useContext(userContext)
  const { array, loading } = context;
  const navigate = useNavigate()

  // console.log(array)
  // const MIN_ITEMS = 4;

  // const filledProducts = [...array];

  // while (filledProducts.length < MIN_ITEMS) {
  //   filledProducts.push(null);
  // }
  return (
    <div className='container'>

      <h1 className=' my-4 fw text-white'>Buy and Sell Websites Esily</h1>
      <p className=' fw-bold text-white'>Find The best Website To Buy And Sell, Your Online Business today</p>
      <button className='btn btn-primary me-2 border-0 px-3 fw-bold' style={{ color: "#8682fa", background: "#F3F4F4" }}>Explore Listing</button>
      <button className='btn btn-primary border-0 px-3 fw-bold' onClick={() => navigate('/')} style={{ background: "#3b379c" }}>Sell your Website</button>
      <h3 className='mt-5 text-white'>Featured website for sale.</h3>
      <p className='text-white'>Hot website available now.</p>
      <div className='row g-0 justify-content-around'>
        <div>{loading || <Loader/>}</div>
        {array.map((arr, index) => {
          return <Productcard key={arr?._id || index} arr={arr} />
        })}
      </div>
    </div>
  )
}

export default Home
