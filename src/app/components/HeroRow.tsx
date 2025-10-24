'use client'
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function HeroRow( {
    img,
    title,
    title_big,
    subtitle,
    btn_title,
    className,
    href,
    trigger = "view",
  }: {
    img?: string;
    title?: string;
    title_big: string;
    subtitle: string;
    btn_title?: string;
    className?: string
    href?: string
    trigger?: "mount" | "view"
  }) {
    const fadeUp = {
        hiddenR: { opacity: 0, x: 50 },
        hidden: { opacity: 0, x: -50 },
        show: { opacity: 1, x: 0, transition: { duration: 1 } },
        showDelay: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.3 } },
        hover: { y: 10, opacity: 0.6, transition: { duration: 0.6 } },
      };

    const route = useRouter()
    return (
  <section
    className={`flex justify-center relative overflow-hidden bg-cover bg-center before:absolute before:inset-0 

     before:z-10 ${className}`}
     style={{
     //  backgroundImage: ,
    //     ? `url('${img}')`
    //     : "linear-gradient(to bottom right, #0f172a, #1e293b)",
      minHeight: "40vh",
     }}
  >
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)]" />
    <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-20 md:py-8 flex justify-start gap-32 items-center relative z-20">
      <motion.div
        className="flex flex-col items-start"
        initial="hidden"
        {...(trigger === "view"
          ? { whileInView: "show", viewport: { once: true, amount: 0.4 } }
          : { animate: "show" })}
        variants={fadeUp}
        transition={{ duration: 1 }}
      >
        {title && <Badge className="mb-4 bg-transparent text-center py-1">{title}</Badge>}
        <motion.h1
          className="text-4xl md:text-6xl text-start font-semibold leading-tight"
        >
          {title_big}
        </motion.h1>
        <p className="text-muted-foreground mt-4 max-w-prose text-center">{subtitle}</p>
        {btn_title && (
          <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
            <Button
               onClick={()=>route.push(`${href}`)}
              size="lg"
              className="rounded-2xl cursor-pointer bg-gradient-to-tl from-[#8B0101] to-black/20 hover:text-gray-300"
            >
              {btn_title}
            </Button>
          </motion.div>
        )}
      </motion.div>
      <motion.div
        initial="hiddenR"
        {...(trigger === "view"
            ? { whileInView: "show", viewport: { once: true, amount: 0.4 } }
            : { animate: "show" })}
        variants={fadeUp}
        className="max-w-3xl max-h-60 rounded-3xl bg-gradient-to-bl from-amber-600 to-emerald-300 items-center flex justify-center "> 
         {img ? (
                <img
                src={img}
                alt="Imagem"
                className="object-contain
                 w-full h-full rounded-3xl"
                />
            ) : (
                null
            )}
      </motion.div>
    </div>
  </section>
    );
  }
  