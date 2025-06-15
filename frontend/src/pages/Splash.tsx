import React, { useEffect, useState } from 'react'

const Splash = () => {
const [isHide, setIsHide] = useState(false)
useEffect(() => {
    setTimeout(() => {
        setIsHide(true)
    }, 5000);
}, [])
  return (
    <div className={`${isHide ? "hidden" : 'flex'} w-screen items-end justify-center animation-splash2 h-screen fixed top-0 left-0 bg-background text-text dark:bg-backgroundDark dark:text-textDark z-[9999]`}>
        <div className=' w-full items-center justify-center flex text-center h-screen'>
            <h1 className='text-6xl font-bold animation-splash3'>SiMadu</h1>
        </div>
        <div className='bg-primary absolute left-0 w-full animation-splash1'>
        </div>
    </div>
  )
}

export default Splash