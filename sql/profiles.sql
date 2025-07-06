create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  joined_at timestamptz default now(),
  user_number integer,
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
declare
  next_user_number integer;
begin
  -- Get the next user number
  select count(*) + 1 into next_user_number from public.profiles;

  -- Insert into profiles with additional fields
  insert into public.profiles (
    id, 
    full_name, 
    avatar_url, 
    email,
    user_number, 
    joined_at
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'email',
    next_user_number,
    now()
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();