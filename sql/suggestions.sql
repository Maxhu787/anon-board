create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) <= 1000),
  created_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;

create policy "Anyone can insert suggestions." on public.suggestions
for insert
  with check (true);

create policy "Only admin can read suggestions." on public.suggestions
for select
  using (false);
