create table public.posts (
  id text not null primary key,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null check (char_length(content) <= 2000),
  created_at timestamptz not null default now(),
  is_anonymous boolean not null default false
);

alter table public.posts enable row level security;

create policy "Anyone can view posts." on public.posts
for select
  using (true);

create policy "Users can insert their own posts." on public.posts 
for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts." on public.posts 
for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts." on public.posts 
for delete
  using (auth.uid() = user_id);
