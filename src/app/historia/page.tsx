import { Tally1 } from "lucide-react";

const Vertical =({h}:{h: number})=>{
  return(

      <div style={{ height: `${h}px` }} className={`w-1 bg-gradient-to-b from-transparent  via-sky-200/30 to-transparent `}/>
  )
}
const TitleLined = ({text}:{text: string}) =>{
  return(
  <div className="flex-row gap-12 flex items-center justify-center w-full">
<div className="h-px flex flex-1 bg-gradient-to-r from-transparent via-gray-500 "/>
<h1 className="text-3xl font-bold font-mono">{text}</h1>
<div className="h-px flex flex-1 bg-gradient-to-l from-transparent via-gray-500 "/>
</div>
  )
}

export default function HistorySection() {
  return (
    <div className=" items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="relative w-full h-[800px] flex flex-col items-center justify-center mb-56">
        <img
          src="/images/maoslevantadas.jpeg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-gray-400 text-xl font-mono">Nossa História</h2>
          <h1 className="text-white text-4xl font-bold">
            IGREJA DE CRISTO MARANATA
          </h1>
          <p className="text-gray-300">Um nascimento em oração e simplicidade</p>
        </div>
      </div>
      <div className="w-full px-2 mt-2 items-center flex flex-col justify-center">
        {/* <h1 className="text-white text-4xl font-bold">mega title wo</h1> */}
        <TitleLined text="1999" />
        <h2 className="text-gray-300 text-xl mb-12">Casa da irmã Edia</h2>
        <Vertical h={0}/>

        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12">
          <div className="md:w-1/2 px-2 md:px-12">
            <p className="text-lg text-center text-gray-300 ">
            A história começou em abril de 1999, com reuniões realizadas na casa da irmã Edia, localizada na Rua 11 de Janeiro, no setor Vila Aurora Oeste. Era um tempo de oração, comunhão e esperança. Os irmãos que ali se reuniam sonhavam com uma igreja que refletisse a pureza do Evangelho e a força da comunhão cristã.
            </p>
          </div>
          <div className="flex w-1/2 px-12 justify-center ">
            <img src="images/velhos.jpeg" ></img>
          </div>
        </div>
        <Vertical h={150}/>
        <h1 className="text-4xl  font-bold mt-8 text-gray-300 font-mono">
          2001
        </h1>
        <h2 className="text-gray-300 text-xl mb-12">Tudo era pequeno, mas já carregava algo eterno</h2>

        <div className="flex  justify-between items-center w-full mb-12">
        <div className="flex w-1/2 px-12 justify-center ">
            <img src="images/galpao.jpg" ></img>
          </div>
          <div className="w-1/2 px-16 m">
            <p className="text-lg text-gray-300  text-center">
            No final de 2000, o grupo se mudou para a Rua Leão XIII, no Setor Rodoviário, onde a igreja começou a ganhar corpo e identidade. Em 19 de agosto de 2001, foi oficialmente fundada a Igreja de Cristo Maranata. A consolidação do trabalho veio com a mudança para o galpão na Rua da Imprensa, também no setor Rodoviário, em novembro de 2004 
            </p>
          </div>
        </div>
        <Vertical h={150}/>
        <h1 className="text-4xl  font-bold mt-8 text-gray-300 font-mono">
          2005
        </h1>
        <h2 className="text-gray-300 text-xl mb-12">Um templo para o Senhor</h2>

        <div className="flex  justify-between items-center w-full mb-12">
        
          <div className="w-1/2 px-16 m">
            <p className="text-lg text-gray-300  text-center">
             Em dia tal de tal ano 2000 e alguma coisa a igreja se muda para o seu novo endereço, na Avenida Abel Coimbra, Cidade Jardim, onde permanece até os dias de hoje
            </p>
          </div>
          <div className="flex w-1/2 px-12 justify-center ">
            <img src="images/templo1.jpeg" ></img>
          </div>
        </div>

        <div className="flex  justify-between items-center w-full mb-12">
        <div className="flex w-1/2 px-12 justify-center ">
          <img src="images/templo2.jpeg" ></img>
        </div>
        
        <div className="w-1/2 px-16 m">
          <p className="text-lg text-gray-300  text-center">
          Com a contribuição e propósito de todos os irmãos, em sintonia e unidade, o templo foi erguido, e continuou com melhorias constantes.
          </p>
        </div>

      </div>

      <div className="flex  justify-between items-center w-full mb-12">
        
        <div className="w-1/2 px-16 m">
          <p className="text-lg text-gray-300  text-center">
         Nossa casa, que antes era um galpão, se tornou um templo aconchegante para a melhor experiência de adoração e comunhão. Mas ainda asssim, mantendo a simplicidade e a mensagem do Evangelho.
          </p>
        </div>
        <div className="flex w-1/2 px-12 justify-center ">
          <img src="images/templo-out.jpeg" ></img>
        </div>
      </div>
      <Vertical h={300}/>
      <h1 className="text-4xl  font-bold mt-8 text-gray-300 font-mono">
          Os pioneiros
        </h1>

        <div className="flex  justify-between items-center w-full mt-20">
        <div className="flex w-1/2 px-12 justify-center ">
          <img src="images/icmpioneiros.jpeg" ></img>
        </div>
        <div className="w-1/2 px-16 m">
          <p className="text-lg text-gray-300  text-center">
          Entre os primeiros irmãos que ajudaram a edificar essa obra estavam: Edimar Santos, Geneci Coutinho, Edia Bueno, Roberta Braga, Rones Marques, Meire e Neomarcio, Simone Pinheiro, Gleisson Marcos, Ediberto Camilo, Carmem Pinheiro, Fabiana e Jodeilton, Júnior e Alessandra, Kenia Saraiva, Márcio Moreno, Rosane e suas crianças.
Homens e mulheres que, com fé, coragem e zelo, plantaram as sementes de uma comunidade comprometida com a verdade bíblica, o discipulado relacional e a comunhão entre os santos.
          </p>
        </div>
        <div className="flex w-1/2 px-12 justify-center ">
          <img src="images/pioneiras.jpeg" ></img>
        </div>
       
      </div>
      </div>
    </div>
  );
}
