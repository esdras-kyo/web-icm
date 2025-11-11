"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CellsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-[#0b2a3e] text-white">
      {/* HERO */}
      <section
        className="relative w-full bg-cover bg-center py-16 px-6 text-center"
        style={{ backgroundImage: "url('/images/bg.jpeg')" }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#0b2a3e]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-sky-200"
          >
            Clopses
          </motion.h1>
          <p className="max-w-2xl mx-auto text-lg text-white/80">
            Lorm praesit amet conso tencit adu moris quet uelera mentis nunc.
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
          </p>
        </div>
      </section>

      {/* O QUE É */}
      <section className="w-full py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="min-w-0">
            <h2 className="text-3xl font-semibold mb-4 text-sky-300">
              What gets new today?
            </h2>
            <p className="text-white/80 leading-relaxed">
              Praesent finibus dolor nec lorem vulputate, vel sodales erat
              posuere. Nunc ac lorem at magna faucibus commodo non id erat.
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              Nullam ornare viverra nisl, eu tincidunt arcu pulvinar ut. Vivamus
              tempus varius turpis, quis dictum nibh vestibulum eget. Sed sit
              amet lacinia mauris.
            </p>
          </div>
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(2,6,23,0.35)] ring-1 ring-white/10 bg-white/5 backdrop-blur">
            <Image
              src="/images/cells-meeting.jpg"
              alt="Encontress"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* VISÃO */}
      <section className="w-full py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(2,6,23,0.35)] ring-1 ring-white/10 bg-white/5 backdrop-blur order-2 md:order-1">
            <Image
              src="/images/cell-vision.jpg"
              alt="Momento"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-semibold mb-4 text-sky-300">
              Vision of Delegons
            </h2>
            <p className="text-white/80 leading-relaxed">
              Aliquam erat volutpat. Integer feugiat mi sit amet lorem aliquet,
              a porta massa facilisis. Vestibulum at ante sed erat hendrerit
              tristique nec eget neque. Curabitur vel felis sit amet justo
              cursus tincidunt.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              Vivamus iaculis libero sit amet mi porta, eget elementum eros
              faucibus. Phasellus sodales, velit vel luctus viverra, lorem
              libero cursus urna, vitae posuere lectus felis vel nunc.
            </p>
          </div>
        </div>
      </section>

      {/* BLOCO DE CARDS */}
      <section className="w-full py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-sky-300">
            Conheça nossos manos
          </h2>
          <p className="text-white/80 mb-10">
            In commodo augue ac velit posuere malesuada. Sed congue viverra
            lacus, ac faucibus lorem euismod sit amet.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(2,6,23,0.35)] ring-1 ring-white/10 bg-white/5 backdrop-blur hover:bg-white/7 transition cursor-pointer"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={`/images/cell-${i}.jpg`}
                    alt={`Berodins ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium text-sky-200">
                    Priles Lorem {i}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    Nunc cursus metus in lorem convallis, vel consequat libero
                    egestas.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full py-20 flex justify-center">
        <button className="px-8 py-3 rounded-2xl text-white font-medium bg-gradient-to-tl from-[#8B0101] to-black/50 hover:from-[#a30303] hover:to-black/60 transition cursor-pointer">
          Quero participar
        </button>
      </section>
    </main>
  );
}
