import Image from "next/image";

export default function Footer(){
  return(      
  <footer className="border-t">
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8 items-start">
      <div>
        <div className="flex items-center gap-3">
        <div className="flex flex-row items-center">
      <Image src="/images/logo.png" alt="Logo" width={20} height={20} /> 
      <h1 className="ml-2 text-sm md:text-xl">Igreja de Cristo Maranata</h1>
      </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Uma família em missão, anunciando a esperança do Evangelho.</p>
      </div>
      <div>
        <h4 className="font-medium mb-3">Links rápidos</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#eventos" className="hover:underline">Agenda</a></li>
          <li><a href="#contato" className="hover:underline">Contato</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-3">Horários</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Domingo – 9h e 19h</li>
          <li>Quarta – 20h (Células)</li>

        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-muted-foreground pb-10">© {new Date().getFullYear()} Igreja de Cristo Maranata. Todos os direitos reservados.</div>
  </footer>
  )
}