import React from 'react'

const Hero = () => {
  return (
    <div className="relative mx-[5%] w-auto h-[500px] overflow-hidden rounded-[8px] flex items-center justify-end bg-[url(https://images.unsplash.com/photo-1506485777791-e120681573dd?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-no-repeat bg-cover bg-center">
      <div className="gradient absolute top-0 left-0 w-[100%] h-[100%]"></div>
      <h1 className="z-1 absolute top-[50%] left-[50%] translate-x-[-50%] text-center lg:translate-x-0 lg:left-[55%] lg:text-left translate-y-[-50%] text-white font-semibold text-[40px] lg:mr-[80px] lg:max-w-[400px] uppercase">Dont miss the upcoming events</h1>
    </div>
  )
}

export default Hero
