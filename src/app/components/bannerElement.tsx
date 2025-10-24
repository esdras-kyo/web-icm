'use client'
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export default function BannerElement({
  img,
  title,
  title_big,
  subtitle,
  btn_title,
  className
}: {
  img?: string;
  title?: string;
  title_big: string;
  subtitle: string;
  btn_title?: string;
  className?: string
}) {

  return (
<section
  className={`flex justify-center relative overflow-hidden bg-cover bg-center before:absolute before:inset-0 
  ${className} before:z-10 `}
   style={{
     backgroundImage: img
       ? `url('${img}')`
       : "",
     minHeight: "70vh",
   }}
>
  <div className="absolute inset-0 -z-10 
  bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)]" />
  <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-20 md:py-28 flex justify-center gap-10 items-center relative z-20">
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {title && <Badge className="mb-4 bg-transparent text-center py-1">{title}</Badge>}
      <motion.h1
        className="text-4xl md:text-7xl text-center font-semibold leading-tight"
      >
        {title_big}
      </motion.h1>
      <p className="text-muted-foreground mt-4 max-w-prose text-center">{subtitle}</p>
      {btn_title && (
        <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
          <Button
            size="lg"
            className="rounded-2xl cursor-pointer bg-gradient-to-tl from-[#8B0101] to-black/20 hover:text-gray-300"
          >
            {btn_title}
          </Button>
        </motion.div>
      )}
    </motion.div>
  </div>
</section>
  );
}
