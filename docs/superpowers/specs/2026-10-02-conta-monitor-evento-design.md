# Conta Monitor de Evento — Design

**Data:** 2026-10-02
**Status:** aprovado (design), pendente plano de implementação

## Objetivo

Uma conta fixa compartilhada (`monitor@...`) com usuário + senha que você entrega
a um terceiro para **monitorar um único evento por vez** no painel. A pessoa:

- vê a lista de inscritos + KPIs do evento (read-only),
- marca cada inscrito como pago / não pago,
- exporta CSV,

e **não enxerga mais nada** do painel (outros eventos, área admin, área leader).

Você aponta a conta para o evento atual por um botão na própria página do evento,
e "desativa" quando o evento acaba.

## Não-objetivos (YAGNI)

- **Usuário temporário por pessoa / expiração automática.** Conta é única e reutilizável;
  "desligar" = desativar o apontamento. Expiração só se pedirem.
- **UI de rotação de senha.** Rotaciona pelo dashboard do Clerk por ora.
- **Scope de evento por departamento para LEADER.** Hoje leaders veem todos os eventos;
  isso NÃO muda aqui (ver "Fora de escopo / follow-up").
- **Monitorar 2 eventos ao mesmo tempo.** Conta única aponta para 1 evento.

## Estado atual (o que existe)

- **Telas de evento:** `/offc/events/[id]` (admin, rica: KPIs, inscritos, CSV, editar/deletar)
  e `/leader/events/[id]` (read-only). CSV é construído client-side a partir do `getsubs`.
- **Auth:** Clerk, só self-signup. Claims via JWT `member_jwt` (`extractClaimsFromJwt`).
  Scopes existentes: ORG / DEPARTMENT / CELL. **Não existe EVENT.**
- **Events:** colunas `owner_department_id`, `visibility` ("ORG" | "DEPARTMENT").
- **⚠️ Vulnerabilidade pré-existente:** os 5 endpoints de evento **não têm nenhuma auth**
  (chamam `createSupabaseAdmin()` direto). Qualquer um com um `event_id` lê CPF/telefone/email
  dos inscritos e altera/deleta registros. Fechar isso é parte obrigatória desta feature —
  sem fechar, a tela escondida do monitor não isola nada.

| Endpoint | Hoje | Arquivo |
|---|---|---|
| `GET /api/getsubs?id=` | sem auth | `src/app/api/getsubs/route.ts` |
| `POST /api/events/details` | sem auth | `src/app/api/events/details/route.ts` |
| `POST /api/events/registrations-over-time` | sem auth | `src/app/api/events/registrations-over-time/route.ts` |
| `POST /api/registrations/set-status` | sem auth (só recebe `id`) | `src/app/api/registrations/set-status/route.ts` |
| `POST /api/registrations/delete` | sem auth (só recebe `id`) | `src/app/api/registrations/delete/route.ts` |

## Design

### 1. Tabela `monitor_account` (fonte da verdade do apontamento)

Linha única. Guardar em DB (não em Clerk `publicMetadata`) para não colidir com o
webhook `user.updated` que reescreve metadata.

```
monitor_account
  clerk_user_id  text         -- identifica a conta monitor
  event_id       uuid null    -- evento apontado agora; null = desativado
  updated_at     timestamptz
```

### 2. Conta Clerk monitor (criada 1x)

Um usuário Clerk com e-mail + senha fixa, criado uma vez — via dashboard do Clerk OU
uma action admin única (`clerkClient.users.createUser`). Registrar o `clerk_user_id`
resultante na linha de `monitor_account`. Não precisa de role: a conta fica VISITANT
(default do webhook) e nunca passa pelos gates de ADMIN/LEADER; o acesso dela é decidido
só pelo helper de escopo.

### 3. Helper de autorização compartilhado

`resolveEventAccess(userId): Promise<EventAccess>` em `src/utils/auth/` — usado pelos 5
endpoints. Resolve o chamador uma vez:

```ts
type EventAccess =
  | { kind: "admin" }                       // ADMIN → todos os eventos
  | { kind: "staff" }                       // LEADER/ASSISTANT → todos (comportamento atual)
  | { kind: "monitor"; eventId: string | null } // monitor → só esse evento
  | { kind: "none" };                       // sem acesso
```

Resolução:
1. `const { userId } = await auth()` — sem userId → `none`.
2. Se `userId` == `monitor_account.clerk_user_id` → `monitor` com `eventId` da linha.
3. Senão, lê claims (`member_jwt`): ADMIN → `admin`; LEADER/ASSISTANT → `staff`; resto → `none`.

> **Nota:** `staff` = acesso amplo, igual ao de hoje. Não introduz filtro por departamento
> (ver follow-up). Mantém o diff pequeno e não quebra `/leader`.

### 4. Hardening dos 5 endpoints

Cada endpoint chama `resolveEventAccess` e aplica:

| Endpoint | admin | staff | monitor | none |
|---|---|---|---|---|
| `getsubs` (precisa `event_id` da query) | ✅ | ✅ | ✅ sse `event_id == access.eventId` | ❌ 401 |
| `events/details` | ✅ | ✅ | ✅ sse igual | ❌ |
| `registrations-over-time` | ✅ | ✅ | ✅ sse igual | ❌ |
| `registrations/set-status` | ✅ | ✅ | ✅ sse igual* | ❌ |
| `registrations/delete` | ✅ | ✅ | ❌ (monitor não deleta) | ❌ |

\* `set-status`/`delete` só recebem `id` do inscrito. Para checar o escopo do monitor,
buscar primeiro o `event_id` do registro e comparar com `access.eventId`.
(Para admin/staff não precisa dessa busca — acesso amplo.)

Resposta padrão de negação: `NextResponse.json({ error: "Não autorizado" }, { status: 401 })`.

### 5. Botão "Ativar monitor" na página do evento

Em `/offc/events/[id]` (admin), um botão:
- Se `monitor_account.event_id != id` → **"Ativar monitor neste evento"** → server action
  `UPDATE monitor_account SET event_id = id, updated_at = now()`.
- Se `== id` → mostra **"Monitor ativo aqui — Desativar"** → server action seta `event_id = null`.

Server action é admin-only (checa ADMIN via claims). Mostra claramente qual evento está ativo.

### 6. Rota `(monitor)/monitor`

Novo route group isolado dos gates de offc/leader.

- `layout.tsx`: `const { userId } = await auth()`. Se `userId` não for o `clerk_user_id`
  da `monitor_account` → `redirect("/conta")`. (Isola: só a conta monitor entra.)
- `page.tsx`: lê `event_id` da linha.
  - `null` → tela "Nenhum evento ativo no momento".
  - senão → view read-only do evento: KPIs + lista de inscritos + toggle pago/não-pago + CSV.

**Reúso:** o componente de card de inscrito (`InscritoCard`/`CardIns`) já faz update de status
via `set-status`; reusar com prop escondendo o botão de delete. CSV reusa a função client-side
existente (puxa do `getsubs`). KPIs/timeline reusam `events/details` + `registrations-over-time`.

**Handoff:** você entrega `site.com/monitor` + e-mail/senha. "Desativar" é o botão de desligar.

## Modelo de segurança (resumo)

- Isolamento do monitor é **server-side**, no helper + nos 5 endpoints — não depende de esconder UI.
- Monitor só lê/muda-status do evento apontado; nunca deleta; nunca vê outro evento mesmo batendo na API direto.
- Fechar os endpoints também elimina o acesso 100% público a PII (CPF/telefone/email) e a mutação/delete de inscritos — correção da vuln pré-existente.

## Fora de escopo / follow-up

- **Scope de evento por departamento para LEADER/ASSISTANT.** Hoje leaders veem todos os eventos
  e podem abrir qualquer `event_id` (risco de visibilidade cross-departamento). O data model já suporta
  (`owner_department_id` + `visibility`). Fechar isso é melhoria separada — não entra nesta feature
  para não mudar comportamento existente nem inflar o diff.
- Expiração automática do apontamento; UI de rotação de senha; múltiplos eventos simultâneos.

## Testes

- `resolveEventAccess`: monitor com `eventId` X só autoriza X; `staff`/`admin` autorizam qualquer;
  `none` para anônimo/VISITANT. (self-check com asserts.)
- `set-status` como monitor: permite no evento apontado, 401 em inscrito de outro evento.
- `delete` como monitor: sempre 401.
- Layout `/monitor`: não-monitor é redirecionado.
- `npm run build` antes de concluir (regra do projeto).

## Questões em aberto

- Criar a conta monitor via dashboard do Clerk ou via action admin única? (decidir no plano)
- UX de pouso pós-login: entregar só a URL `/monitor`, ou redirecionar a conta monitor de `/conta` → `/monitor`?
