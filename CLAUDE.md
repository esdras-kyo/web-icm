# Projeto Next.js — Regras e Convenções

## Stack
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilo:** Tailwind CSS
- **Animações:** Framer Motion (complexas/orquestradas)
- **Imagens:** next/image | **Fontes:** next/font

---

## TypeScript
- Zero tolerância a `any`. Tipar tudo explicitamente.
- Preferir `interface` para objetos, `type` para unions/intersections.
- Nunca usar `as SomeType` para contornar erros — corrigir a tipagem na raiz.

---

## Estilo e UI
- **Sempre Tailwind.** Nunca `style={{}}` ou CSS inline.
- Todos os botões e elementos clicáveis: `cursor-pointer`.
- Animações simples (fade, slide): Tailwind (`transition`, `animate-`).
- Animações complexas ou orquestradas (sequências, scroll-triggered, layout): Framer Motion.
- Sempre responsivo: **mobile-first** com breakpoints `sm` / `md` / `lg` / `xl`.

---

## Arquitetura e Componentização
- Nunca hardcodar lógica ou markup repetido diretamente na página.
- Extrair componentes reutilizáveis em `components/` ou `features/`.
- Páginas devem ser compostas por componentes — não monolíticas.
- Dados estáticos (listas, configs) ficam em `lib/` ou `constants/`, nunca inline.
- Props com mais de 3 campos: criar interface nomeada para o tipo.

---

## Next.js — Server vs. Client
- **Padrão: Server Component.** Usar `"use client"` só quando estritamente necessário.
- Nunca criar páginas puramente client-side sem justificativa clara.
- Buscas de dados simples: `async/await` direto no Server Component é suficiente.
- Evitar `useEffect` para fetch — substituir por Server Components ou SWR/React Query.

## API Routes (`app/api/`)
- Usar Route Handlers (`app/api/[rota]/route.ts`) quando houver **lógica + transformação de dados**:
  banco de dados, APIs externas com tratamento, agregação, autenticação, etc.
- Fetch simples sem tratamento pode ficar direto no Server Component — não criar rota de API à toa.
- Padrão de arquivo: `app/api/nome-da-rota/route.ts` exportando `GET`, `POST`, etc.
- Sempre tipar o retorno da rota com `NextResponse.json<TipoEsperado>(...)`.
- Erros: retornar `NextResponse.json({ error: '...' }, { status: 4xx/5xx })` — nunca deixar sem tratamento.

---

## Roteamento e Build Safety
- `useRouter`, `useParams`, `useSearchParams` em rotas dinâmicas (`/[id]`, `/[slug]`):
  **sempre encapsular em componente filho com `<Suspense>`** para não quebrar o build.
- Nunca acessar `params` ou `searchParams` sem checar se estão disponíveis.
- Testar `npm run build` antes de considerar qualquer feature concluída.

---

## Performance (LCP / CLS / Core Web Vitals)
- Imagens: **sempre `next/image`**, nunca `<img>` nativo. Definir `width` + `height` ou `fill` + `sizes`.
- Imagens de domínios externos: adicionar o domínio em `next.config.ts` na chave `images.remotePatterns`.
  Se a config não existir no projeto, criá-la. Exemplo:
  ```ts
  // next.config.ts
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'exemplo.com' }],
  }
  ```
- Fontes: sempre `next/font` — nunca `<link>` externo para Google Fonts.
- Evitar layout shift: reservar espaço para imagens, skeletons para conteúdo dinâmico.
- Componentes pesados ou abaixo do fold: usar `dynamic(() => import(...), { ssr: false })`.
- Não bloquear o thread principal com lógica pesada no cliente.

---

## Convenções de Arquivos
```
app/
  (routes)/
    page.tsx              ← Server Component por padrão
    layout.tsx
  api/
    nome-da-rota/
      route.ts            ← Route Handler (GET, POST, etc.)
components/
  ui/                     ← componentes genéricos (Button, Input, Modal...)
  features/               ← componentes de domínio específico
lib/
  utils.ts
  constants.ts
types/
  index.ts
next.config.ts            ← incluir remotePatterns se usar imagens externas
```

---

## O que NÃO fazer
- ❌ `any` no TypeScript
- ❌ `style={{}}` ou CSS inline
- ❌ Páginas monolíticas sem componentização
- ❌ `useRouter` / `useSearchParams` fora de `<Suspense>` em rotas dinâmicas
- ❌ `<img>` nativo (usar `next/image`)
- ❌ Google Fonts via `<link>` (usar `next/font`)
- ❌ `"use client"` desnecessário em componentes que não precisam de interatividade
