export default function PrivacyPolicy() {
    return (
      <main className="min-h-screen w-full bg-[#05070c] text-white">
        <div className="mx-auto max-w-4xl px-6 py-16">

          <h1 className="text-3xl md:text-4xl font-bold mb-10">
            Política de Privacidade
          </h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              1. Quem somos
            </h2>
  
            <p className="text-white/90 leading-relaxed">
              Este site é operado pela <strong>Igreja de Cristo Maranata - Cidade Jardim</strong>, 
              responsável pelo tratamento dos dados pessoais coletados nesta plataforma.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              2. Dados que coletamos
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Coletamos apenas os dados necessários para funcionamento da plataforma, incluindo:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Nome</li>
              <li>E-mail</li>
              <li>Informações de autenticação</li>
              <li>Dados de sessão e preferências</li>
            </ul>
  
            <p className="text-white/90 leading-relaxed mt-4">
              Esses dados são fornecidos diretamente pelo usuário ao criar conta ou realizar login.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              3. Como utilizamos os dados
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Utilizamos os dados para:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Permitir autenticação e login</li>
              <li>Manter a sessão ativa</li>
              <li>Garantir segurança da conta</li>
              <li>Personalizar a experiência do usuário</li>
              <li>Cumprir obrigações legais</li>
            </ul>
  
            <p className="text-white/90 leading-relaxed mt-4">
              Não utilizamos dados para venda ou compartilhamento comercial.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              4. Uso de Cookies
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Utilizamos apenas cookies essenciais, necessários para:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Funcionamento do login</li>
              <li>Segurança de autenticação</li>
              <li>Manutenção de sessão</li>
              <li>Preferências de navegação</li>
            </ul>
  
            <p className="text-white/90 leading-relaxed mt-4">
              Esses cookies não coletam dados para publicidade ou rastreamento.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              5. Compartilhamento de dados
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Utilizamos provedores terceiros confiáveis, incluindo:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Clerk — autenticação de usuários</li>
              <li>Supabase — banco de dados e backend</li>
              <li>AWS S3 — armazenamento de arquivos</li>
            </ul>
  
            <p className="text-white/90 leading-relaxed mt-4">
              Esses provedores tratam dados apenas para execução dos serviços contratados.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              6. Segurança
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Adotamos medidas técnicas e organizacionais para proteger os dados contra:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Acesso não autorizado</li>
              <li>Vazamentos</li>
              <li>Alterações indevidas</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              7. Direitos do titular (LGPD)
            </h2>
  
            <p className="text-white/90 leading-relaxed mb-4">
              Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode:
            </p>
  
            <ul className="list-disc pl-6 space-y-1 text-white/90">
              <li>Solicitar acesso aos dados</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar exclusão</li>
              <li>Revogar consentimento (quando aplicável)</li>
            </ul>
          </section>
  
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">
              8. Contato
            </h2>
  
            <p className="text-white/90 leading-relaxed">
              Para solicitações relacionadas à privacidade:
            </p>
  
            <div className="mt-3 text-white font-medium">
              E-mail: icmaranata.gyn@gmail.com
            </div>
          </section>
  
        </div>
      </main>
    );
  }