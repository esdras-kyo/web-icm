'use client'
import { motion } from "framer-motion";

export default function ImageTextBlock({
  text,
  img,
  reverse = false,
  className
}: {
  text: string;
  img?: string;
  reverse?: boolean; 
  className?: string
}) {
  const fadeUp = {
    hiddenL: { opacity: 0, x: -50 },
    hiddenR: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  return (
    <section className={`${className}flex justify-center relative overflow-hidden py-20 md:py-8 bg-transparent`}>
      <div
        className={`max-w-6xl w-full mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <motion.div
          className="flex-1 text-lg leading-relaxed text-muted-foreground"
          initial={reverse ? "hiddenR" : "hiddenL"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <p className="max-w-prose text-gray-200">{text}</p>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center min-h-[250px] rounded-3xl bg-gradient-to-bl from-amber-600 to-emerald-300 overflow-hidden"
          initial={reverse ? "hiddenL" : "hiddenR"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          {img ? (
            <img
              src={img}
              alt="Ilustração"
              className="rounded-3xl w-full h-full object-cover"
            />
          ) : (
            <h1 className="text-white text-xl font-semibold">Imagem</h1>
          )}
        </motion.div>
      </div>
    </section>
  );
}