import BannerElement from "../components/bannerElement";
import HeroRow from "../components/HeroRow";
import BlockCarousel from "../components/ImageCarousel";
import DemoBlockCarousel from "../components/ImageCarousel";
import ImageTextBlock from "../components/ImageTextBlock";
import TextBlockReveal from "../components/TextBlockReveal";

export default function escola(){
    return(
        <div className="min-h-screen bg-gradient-to-br from-black to-sky-800 text-white">
            <BannerElement className="py-36 mb-24 bg-black/50" img="/images/pioneiros.jpeg" title_big="Escola de Líderes" btn_title="Inscreva-se"  subtitle="le voutraire union pipi"/>

            <TextBlockReveal className="mt-28 mb-10" text="
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. "/>

            {/* <BannerElement title_big="sss" btn_title="Inscreva-se" title="little things" subtitle="le voutraire union pipi"/> */}
            <HeroRow className="mb-28"  title_big="Encontre " title="little things" subtitle="le voutraire union pipi"/>
            
            <ImageTextBlock text="Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você." reverse  />
            <TextBlockReveal className="mb-2" align="start"
             text="
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você.
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. "/>

<ImageTextBlock text="Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você." reverse  />
            {/* talking about skool */}
            <div className="flex flex-col w-full pt-28 bg-black">
            <div className="w-full items-center justify-center flex">
                <h1 className="text-5xl">Formando formas</h1>
            </div>
            <TextBlockReveal text="with a lot of empenhen formating pddf to word like documentos, iuts true"/>

            <BlockCarousel heightClass="h-72" total={6} />
            
            
            <HeroRow title_big="Encontre" subtitle="le voutraire union pipi" btn_title="Conheça" />
            </div>
            {/* end */}

            <div>
                
            </div>
        </div>
    )
}