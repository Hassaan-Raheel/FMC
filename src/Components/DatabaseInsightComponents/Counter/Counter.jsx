import React from 'react'
import CountUp from 'react-countup'


const Counter = ({ target, speed, dynamicClass }) => {
  return (
    <CountUp 
        start={0}
        end={target}
        duration={speed}
        className={dynamicClass}
    />
  )
}

export default Counter
