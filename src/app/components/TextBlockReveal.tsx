'use client'
import { motion } from "framer-motion";

export default function TextBlockReveal({
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
      <motion.div
        className="flex text-lg w-full leading-relaxed items-center justify-center text-muted-foreground"
        initial={"hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <p className={` text-${align ?? "center"} text-gray-200`}>{text}</p>
      </motion.div>
      </div>
      </section>


  )
}