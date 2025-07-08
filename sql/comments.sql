create table public.comments (
  id text not null primary key,
  post_id text references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  -- parent_id text references public.comments(id) on delete set null,
  content text not null check (char_length(content) <= 2000),
  created_at timestamptz not null default now(),
  is_anonymous boolean not null default false,
  -- is_parent boolean not null default false
);

alter table public.comments enable row level security;

create policy "Anyone can view comments." on public.comments
for select
  using (true);

create policy "Users can insert their own comments." on public.comments
for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments." on public.comments
for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments." on public.comments
for delete
  using (auth.uid() = user_id);
