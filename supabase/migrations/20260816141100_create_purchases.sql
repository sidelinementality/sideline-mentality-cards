-- Purchases / Lots Phase 1
-- Creates dealer acquisition records and an optional card link.
-- Does not change existing per-card purchase_price or other acquisition columns.

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purchase_date date,
  source text,
  seller text,
  total_cost numeric(12, 2) not null default 0,
  expected_item_count integer,
  notes text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint purchases_name_not_blank check (length(trim(name)) > 0),
  constraint purchases_total_cost_nonnegative check (total_cost >= 0),
  constraint purchases_expected_item_count_valid check (
    expected_item_count is null or expected_item_count >= 0
  ),
  constraint purchases_status_valid check (
    status in ('open', 'processing', 'complete', 'archived')
  )
);

create index if not exists purchases_purchase_date_idx
  on public.purchases (purchase_date desc nulls last);

create index if not exists purchases_status_idx
  on public.purchases (status);

create index if not exists purchases_created_at_idx
  on public.purchases (created_at desc);

create or replace function public.set_purchases_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists purchases_set_updated_at on public.purchases;

create trigger purchases_set_updated_at
before update on public.purchases
for each row
execute function public.set_purchases_updated_at();

alter table public.cards
  add column if not exists purchase_id uuid references public.purchases (id)
    on delete set null;

create index if not exists cards_purchase_id_idx
  on public.cards (purchase_id);

alter table public.purchases enable row level security;
