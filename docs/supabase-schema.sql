-- Tables
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Journal',
  content text,
  excerpt text,
  status text not null default 'draft' check (status in ('draft','published')),
  important boolean not null default false,
  image_url text, audio_url text,
  tags text[] default '{}',
  date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid references auth.users
);
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text, display_name text, avatar_url text,
  created_at timestamptz not null default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references auth.users,
  parent_id uuid references comments(id),
  content text not null,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references auth.users,
  created_at timestamptz not null default now(),
  unique(comment_id, user_id)
);

-- Trigger: keep comments.likes_count in sync with comment_likes table
create or replace function update_likes_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update comments set likes_count = likes_count + 1 where id = NEW.comment_id;
  elsif TG_OP = 'DELETE' then
    update comments set likes_count = likes_count - 1 where id = OLD.comment_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_like_change on comment_likes;
create trigger on_like_change after insert or delete on comment_likes
  for each row execute function update_likes_count();

-- Auto-create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin insert into profiles (id, email) values (new.id, new.email); return new; end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
-- Note: multiple SELECT policies on same table use OR logic in PostgreSQL.
-- Visitors match "publié lisible" (published only); admin matches "admin tout" (all rows incl. drafts).
alter table articles enable row level security;
create policy "publié lisible" on articles for select using (status='published');
create policy "admin tout" on articles for all using (auth.jwt()->>'email'='michele.fay@sfr.fr');

alter table profiles enable row level security;
create policy "profiles lisibles" on profiles for select using (true);
create policy "own profile" on profiles for all using (auth.uid()=id);

alter table comments enable row level security;
create policy "comments lisibles" on comments for select using (true);
create policy "insert commentaire" on comments for insert with check (auth.uid()=user_id);
create policy "admin delete comment" on comments for delete using (auth.jwt()->>'email'='michele.fay@sfr.fr');
create policy "own delete comment" on comments for delete using (auth.uid()=user_id);

alter table comment_likes enable row level security;
create policy "likes lisibles" on comment_likes for select using (true);
create policy "insert like" on comment_likes for insert with check (auth.uid()=user_id);
create policy "delete like" on comment_likes for delete using (auth.uid()=user_id);

-- Storage buckets (run in Supabase dashboard or via API)
-- Create bucket 'article-images' (public: true)
-- Create bucket 'article-audio' (public: true)
