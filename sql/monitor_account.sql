-- Conta monitor de evento (linha única).
-- Rodar uma vez no Supabase (SQL editor).
create table if not exists monitor_account (
  clerk_user_id text primary key,
  event_id      uuid references events (id) on delete set null,
  updated_at    timestamptz not null default now()
);

-- Setup da conta (após criar o usuário no dashboard do Clerk):
-- 1) crie o usuário monitor no Clerk (email + senha que você vai entregar;
--    marque o email como verified)
-- 2) copie o user id do Clerk (começa com "user_...") e rode:
-- insert into monitor_account (clerk_user_id, event_id)
-- values ('user_XXXXXXXXXXXXXXXX', null);
-- 3) setar a env var na Vercel com o MESMO id (redireciona a conta pra /monitor
--    pós-login e trava ela lá):
--    MONITOR_CLERK_USER_ID=user_XXXXXXXXXXXXXXXX
