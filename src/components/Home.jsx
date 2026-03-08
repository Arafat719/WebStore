import React, {useContext} from 'react'
import Navbar from './Navbar'
import noteContext from '../context/noteContext'

const Home = () => {
  const context = useContext(noteContext)
  const {name} = context
  return (
    <div>
          Hello my name is        
    </div>
  )
}

export default Home
