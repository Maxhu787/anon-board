create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  vote_type text not null check (vote_type in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

alter table public.votes enable row level security;

create policy "Anyone can view post votes." on public.votes
for select
  using (true);

create policy "Users can insert their own post votes." on public.votes 
for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own post votes." on public.votes
for update
  using (auth.uid() = user_id);

create policy "Users can delete their own post votes." on public.votes
for delete
  using (auth.uid() = user_id);
