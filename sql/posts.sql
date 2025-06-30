create table 
  public.posts (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete set null,
    content text not null,
    created_at timestamptz not null default now(),
    is_anonymous boolean not null default false
  );

alter table public.posts enable row level security;

create policy "Anyone can view posts." on posts for
select
  using (true);

create policy "Users can insert their own posts." on public.posts for insert
with
  check (auth.uid() = user_id);

create policy "Users can update their own posts." on public.posts 
for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts." on public.posts 
for delete
  using (auth.uid() = user_id);
