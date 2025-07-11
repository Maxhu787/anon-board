create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  joined_at timestamptz default now(),
  user_number serial unique,
  primary key (id)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
for select
  using (true);

create policy "Users can insert their own profile." on profiles 
for insert
  with check (auth.uid () = id);

create policy "Users can update own profile." on profiles
for update
  using (auth.uid () = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    avatar_url, 
    email,
    joined_at
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'email',
    now()
  );

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();