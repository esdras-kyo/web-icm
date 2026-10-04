-- Preço da camiseta, independente do preço do evento.
-- NULL ou 0 = camisa grátis (só coleta tamanho). > 0 = camisa paga via Pix.
ALTER TABLE events ADD COLUMN IF NOT EXISTS shirt_price numeric;
