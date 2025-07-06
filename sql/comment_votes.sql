create table public.comment_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment_id text not null references public.comments(id) on delete cascade,
  vote_type text not null check (vote_type in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (user_id, comment_id)
);

alter table public.comment_votes enable row level security;

create policy "Anyone can view comment votes." on public.comment_votes
for select
  using (true);

create policy "Users can insert their own comment votes." on public.comment_votes 
for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comment votes." on public.comment_votes
for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comment votes." on public.comment_votes
for delete
  using (auth.uid() = user_id);
