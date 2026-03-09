import React, {useContext} from 'react'
import userContext from '../context/userContext'

const About = () => {
  const context = useContext(userContext);
  const {name} = context
  return (
    <div>
      Hello I am about 
    </div>
  )
}

export default About
