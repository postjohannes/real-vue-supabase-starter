-- PROFILES
create table profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null default auth.uid(),
    login_provider varchar(50) not null,
    last_login timestamp with time zone default timezone('utc' :: text, now()) not null,
    updated_at timestamp with time zone default timezone('utc' :: text, now()) not null,
    inserted_at timestamp with time zone default timezone('utc' :: text, now()) not null
);

alter table
    profiles enable row level security;

CREATE POLICY user_permits_own_profiles ON profiles
    FOR ALL
    USING (auth.uid() = user_id);

-- SETTINGS
create table settings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null default auth.uid(),
    email varchar(99) not null,
    newsletter_subscribe boolean not null default true,
    updated_at timestamp with time zone default timezone('utc' :: text, now()) not null,
    inserted_at timestamp with time zone default timezone('utc' :: text, now()) not null
);

alter table
    settings enable row level security;

CREATE POLICY user_permits_own_settings ON settings
    FOR ALL
    USING (auth.uid() = user_id);
