import BannerElement from "../components/bannerElement";
import HeroRow from "../components/HeroRow";
import ImageTextBlock from "../components/ImageTextBlock";
import TextBlockReveal from "../components/TextBlockReveal";

export default function cells(){
    return(
        <div className="min-h-screen bg-gradient-to-br from-black to-sky-800 text-white">
            <BannerElement className="bg-black/50" title_big="Encontre " title="little things" subtitle="le voutraire union pipi"/>

            <HeroRow className="mt-12 mb-10"  img="/images/sonicpray.jpg" title_big="Encontre News novas" title="little things" subtitle="le voutraire union pipi"/>
            <TextBlockReveal className="mb-28" text="
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. "/>

            <ImageTextBlock text="Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você." reverse  />
            <TextBlockReveal className="mb-28" align="start"
             text="
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você.
            Deixe nossa equipe de especialistas criar seu site do WordPress.com. Não importa se você quer apenas uma página de entrada ou um site de eCommerce completo, podemos criar para você. "/>

            {/* talking about skool */}
            <div className="flex flex-col w-full pt-28 bg-black">
            <div className="w-full items-center justify-center flex">
                <h1 className="text-5xl">Formando formas</h1>
            </div>
            <TextBlockReveal text="with a lot of empenhen formating pddf to word like documentos, iuts true"/>
            
            <HeroRow href="/escola" title_big="Encontre" subtitle="le voutraire union pipi" btn_title="Conheça" />
            </div>
            {/* end */}

            <div>

            </div>
        </div>
    )
}