"use client";

import Image from "next/image";
import TopBanner from "../components/TopBanner";

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

export default function CellsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-[#0b2a3e] text-white">
      {/* HERO */}
      <TopBanner 
      title="Clopses"
      subtitle="Lorm praesit amet conso tencit adu moris quet uelera mentis nunc."
      />

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

      {/* CTA final */}
      <section className="w-full py-20 flex justify-center">
        <button className="px-8 py-3 rounded-2xl text-white font-medium bg-gradient-to-tl from-[#8B0101] to-black/50 hover:from-[#a30303] hover:to-black/60 transition cursor-pointer">
          Quero participar
        </button>
      </section>
    </main>
  );
}
