'use client'
import { AnimatePresence, motion } from "motion/react";
export default function Home() {

  function DivItem(){
    return(
      <div className="w-full p-4 flex-row flex bg-gradient-to-br from-transparent to-orange-500"></div>
    )
  }
  
  return (
    <div className=" items-center flex-col flex px-2 mt-8 pt-8 bg-gradient-to-br from-sky-800 to-black min-h-dvh">
      <motion.h1
      initial={{opacity: 0.2, scale: 0.9}}
      animate={{opacity: 1, scale: 1,  transition: { duration: 1 } } }
       className="mt-2 text-2xl sm:text-3xl lg:text-5xl font-semibold text-gray-100 leading-tight text-balance">
          Igreja de Cristo Maranata
        </motion.h1>

        <div className="mt-3 flex items-center justify-center gap-3 text-gray-300/80">
          <span className="sr-only">Subtítulo</span>

          <h2 className="text-sm sm:text-base font-medium text-center text-pretty">
            #SOMOS1000
          </h2>
        </div>
        <div className="flex flex-col w-1/2 p-2 gap-2 "><DivItem/> <DivItem/> <DivItem/> <DivItem/></div>
        
      
    </div>
  );
}
