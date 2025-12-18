"use client";
import Footer from "@/app/components/Footer";
import HeroCenter from "@/app/components/HeroCenter";
import { motion, Variants } from "framer-motion";

type Cell = {
  id: number,
  name: string,
  address: string,
  leader: string
}

const cells: Cell[] = [
  {
    id: 1,
    name: "Célula Resgate de Almas",
    leader: "Sílvia",
    address: "Rua Fleury Curado n. 350, Cidade Jardim"
  },
  {
    id: 2,
    name: "Célula Metanoia",
    leader: "Pr. Márcio",
    address: "Online"
  },
  {
    id: 3,
    name: "Célula 60+",
    leader: "Pr. Edimar",
    address: "Online"
  },
  {
    id: 4,
    name: "Célula Yeshua",
    leader: "Pr. Ilton",
    address: "Rua Antônio Pereira, Quadra 21, Lote 18, Lorena Parque, Goiânia"
  },
  {
    id: 5,
    name: "Célula Adonai",
    leader: "Dalva / Renato",
    address: "Rua 7A, Quadra 7B, Lote 02, Residencial Cidade Verde"
  },
  {
    id: 6,
    name: "Célula Renascer",
    leader: "Cristiane / Nicoly",
    address: "Rua Salinas 7, Quadra 28, Lote 25, Buena Vista 2"
  },
  {
    id: 7,
    name: "Célula Habitar em Cristo",
    leader: "Wilian / Adrielle",
    address: "Rua CP 50, Quadra 04, Lote 18, Casa 2, Carolina Parque Complemento"
  },
  {
    id: 8,
    name: "Célula Maanaim",
    leader: "Wagner",
    address: "Rua Formosa, Quadra 03, Lote 01, Casa 02 - Cidade Jardim, Goiânia - GO, 74425-410"
  },
  {
    id: 9,
    name: "Célula AbbaPai",
    leader: "Cadu / Ju",
    address: "Rua Fuad Rassi, nº 320, Setor Chácara Santa Rita, Parque Goia Condomínio Clube"
  },
  {
    id: 10,
    name: "Célula Kadosh",
    leader: "Ivanneide / Robson",
    address: "Rua Caetano de Franco, Quadra 7, Lote 18, Nº 299, Conjunto Guadalajara, Cidade Jardim"
  },
  {
    id: 11,
    name: "Célula Impactados",
    leader: "Anna Patrícia",
    address: "Rua Caetano de Franco, Quadra 7, Lote 18, Nº 299, Conjunto Guadalajara, Cidade Jardim"
  },
  {
    id: 12,
    name: "Célula Buena Vista",
    leader: "Marco / Idely",
    address: "Rua Juca Rodrigues, Quadra 17, Lote 06, Buena Vista I"
  },
  {
    id: 13,
    name: "Célula Águias Celestiais",
    leader: "Celma",
    address: "Rua CRP-8, Quadra 11, Lote 13 - Residencial Primavera, Goiânia - GO"
  }
]

function CellsIntroPremium() {
  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
  
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  };
  
  const fade: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  };
  
  const lineGrow: Variants = {
    hidden: { opacity: 0, scaleY: 0 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.8, ease: EASE_OUT },
    },
  };
  
  const stagger: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };
  
  const subtleFloat: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  };

  return (
    <section className="w-full py-18 md:py-24">
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs md:text-sm tracking-[0.32em] uppercase text-white/60"
          >
            Visão
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white"
          >
            As células sustentam o crescimento
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-7 text-white/80 leading-relaxed md:text-lg"
          >
            As células são o coração que sustenta o crescimento da Igreja de Cristo
            Maranata. Acreditamos que a igreja não é apenas o que acontece no templo,
            mas o que vivemos nos relacionamentos.
          </motion.p>
        </motion.div>
      </div>

      <div className="my-12">
        <div className="relative left-1/2 -translate-x-1/2 w-screen h-dvh flex items-center justify-center bg-black">
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 h-48 w-px bg-linear-to-b from-transparent via-white/30 to-transparent origin-top"
            variants={lineGrow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          />

          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <motion.div
              className="grid gap-3 md:gap-4 text-center"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.p
                variants={fadeUp}
                className="text-sm md:text-lg tracking-wide text-white/70"
              >
                Igreja é o que
              </motion.p>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 18, letterSpacing: "0.02em" },
                  show: {
                    opacity: 1,
                    y: 0,
                    letterSpacing: "0em",
                    transition: { duration: 0.7, ease: "easeOut" },
                  },
                }}
                className="text-2xl md:text-3xl font-semibold tracking-tight uppercase leading-tight"
              >
                Vivemos todos os dias
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-2xl tracking-tight text-white/85 leading-snug"
              >
                nas casas, nos lares e nas ruas.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  show: {
                    opacity: 1,
                    scaleX: 1,
                    transition: { duration: 0.6, ease: "easeOut", delay: 0.05 },
                  },
                }}
                className="mx-auto mt-4 h-px w-24 bg-white/15 origin-center"
              />
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-48 w-px bg-linear-to-b from-transparent via-white/30 to-transparent origin-bottom"
            variants={lineGrow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.p
            variants={fadeUp}
            className="mt-8 text-white/80 leading-relaxed md:text-lg"
          >
            Assim como a igreja do Novo Testamento, reunimo-nos em{" "}
            <motion.span
              variants={{
                hidden: { opacity: 0.7, y: 6 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: "easeOut" },
                },
              }}
              className="text-white font-medium inline-block"
            >
              pequenos grupos
            </motion.span>{" "}
            para orar, aprender a Palavra e compartilhar a vida.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.98 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.65, ease: "easeOut" },
              },
            }}
            className="mt-8 rounded-2xl bg-white/3 px-5 py-4"
          >
            <p className="text-white/85 leading-relaxed md:text-lg">
              E, através disso,{" "}
              <span className="text-white font-medium">
                alcançamos novas pessoas com o Evangelho
              </span>
              .
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-10 md:gap-14"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
            className="max-w-4xl mx-auto text-center md:text-left"
          >
            <motion.p variants={fadeUp} className="mt-4 text-white/80 text-center leading-relaxed md:text-lg">
              Cada célula é um ambiente acolhedor, simples e cheio da presença
              de Deus, onde cada pessoa é vista, cuidada e discipulada.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-4 text-center text-white/80 leading-relaxed md:text-lg">
              É ali que vidas são restauradas e líderes são formados.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      <div className="my-12">
        <div className="relative left-1/2 -translate-x-1/2 w-screen h-dvh flex items-center justify-center bg-black">
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 h-48 w-px bg-linear-to-b from-transparent via-white/30 to-transparent origin-top"
            variants={lineGrow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          />

          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <motion.div
              className="grid gap-3 md:gap-4 text-center"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.p
                variants={fadeUp}
                className="text-base md:text-2xl tracking-tight text-white/85 leading-snug"
              >
                a visão
              </motion.p>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.98 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.75, ease: "easeOut" },
                  },
                }}
                className="text-2xl md:text-4xl font-semibold tracking-tight uppercase leading-tight text-white"
              >
                Somos Mil
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-2xl tracking-tight text-white/85 leading-snug"
              >
                se torna realidade.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  show: {
                    opacity: 1,
                    scaleX: 1,
                    transition: { duration: 0.6, ease: "easeOut", delay: 0.05 },
                  },
                }}
                className="mx-auto mt-4 h-px w-24 bg-white/15 origin-center"
              />
            </motion.div>

            <motion.p
              className="text-center"
              variants={subtleFloat}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
            >
              uma pessoa, uma casa e uma célula de cada vez.
            </motion.p>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-48 w-px bg-linear-to-b from-transparent via-white/30 to-transparent origin-bottom"
            variants={lineGrow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="mt-14 max-w-4xl mx-auto text-center md:text-left"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p variants={fadeUp} className="my-4 text-center text-white/80 leading-relaxed md:text-lg">
            Nossas células seguem um processo bíblico que guia toda a igreja:
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.98 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.65, ease: "easeOut" },
              },
            }}
            className="flex items-center justify-center gap-6 py-4"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              Ganhar • Consolidar • Treinar • Enviar
            </h3>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 text-center text-white/80 leading-relaxed md:text-lg">
            Através desse movimento, crescemos com saúde, fortalecemos nossa fé e ampliamos o alcance do
            Reino em nossa cidade.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-18 md:mt-22 h-px bg-white/10"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        />
      </div>
    </section>
  );
}

export default function CellsPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-black to-[#0b2a3e] text-white">

    <HeroCenter
        mission="A igreja que acontece de casa em casa."
        churchName="Nossas Células"
      />

      <CellsIntroPremium />

      <section className="w-full py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Conheça nossas Células
          </h2>
          <p className="text-white/80 mb-10">
          Encontre uma perto de você
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cells.map((cell) => (
              <div
                key={cell.id}
                className="rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(2,6,23,0.35)] ring-1 ring-white/10 bg-white/5 backdrop-blur hover:bg-white/7 transition cursor-pointer"
              >
                <div className="relative h-48 w-full">
                  {/* <Image
                    src={`/images/cell-${i}.jpg`}
                    alt={`Berodins ${i}`}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium text-sky-200">
                    {cell.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    {cell.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
