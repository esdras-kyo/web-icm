'use client'
import { motion } from "framer-motion";
import Image from "next/image";

export default function CardReveal({
  text,
  className,
  align
}: {
  text: string;
  img?: string;
  className?: string
  align?: string
}) {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    hiddenR: { opacity: 0, x: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return(

    <section className={`flex justify-center relative overflow-hidden py-20 md:py-12 bg-transparent ${className}`}>
    <div
      className={`max-w-6xl w-full mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10 
      }`}
    >
              <ul className="space-y-4">
        {cells.map((cell) => (
              
          <li
           key={cell.id} 
            className=""
          >
            <motion.div  initial={{ opacity: 0, y: 30 }} whileHover={{ opacity: 0.8, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                    className="relative rounded-xl border border-white/10 flex w-full md:w-1/2 bg-black/50 hover:bg-transparent cursor-pointer">
                        {cell.image_key && ( <div className="absolute inset-0 z-0">
                <Image 
                  src={`https://worker-1.esdrascamel.workers.dev/${encodeURIComponent(cell.image_key)}`}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-100 rounded-2xl"
                  priority={false}
                />
                {/* Scrim leve só embaixo para legibilidade */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/70 via-transparent to-transparent" />
              </div>
)}
            <button  className="relative z-10 cursor-pointer bg-black/50 hover:bg-black/30 p-4 w-full flex items-end justify-between">
              <div className="items-start flex justify-start flex-col ">
                <p className="text-2xl font-semibold text-white mb-4">
                  {cell.name || "Sem nome"}
                </p>
                <p className="text-sm font-semibold text-gray-300 mb-16">
                  {cell.address|| "Sem descrição"}
                </p>

              </div>


            </button>
            </motion.div>
          </li>
        ))}
          </ul>
          
      </div>
      </section>


  )
}