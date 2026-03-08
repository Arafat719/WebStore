import React, {useContext} from 'react'
import noteContext from '../context/noteContext'

const About = () => {
  const context = useContext(noteContext);
  const {name} = context
  return (
    <div>
      Hello I am about 
    </div>
  )
}

export default About
