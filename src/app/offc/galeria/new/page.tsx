import { NewGallerySectionForm } from "./NewGallerySectionForm";

export default function NewGallerySectionPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Nova seção da galeria</h1>
        <p className="mt-1 text-sm text-slate-400">
          Crie um novo agrupamento (álbum) para organizar as fotos da galeria.
        </p>
      </header>

      <NewGallerySectionForm />
    </div>
  );
}