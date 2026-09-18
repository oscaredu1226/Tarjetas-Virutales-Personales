create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  public_code text not null unique,
  first_name text not null check (char_length(first_name) <= 80),
  last_name text not null check (char_length(last_name) <= 80),
  job_title text not null check (char_length(job_title) <= 120),
  company_name text not null check (char_length(company_name) <= 160),
  bio text not null default '' check (char_length(bio) <= 500),
  profile_photo_path text,
  cover_image_path text,
  phone text not null default '' check (char_length(phone) <= 40),
  email text not null default '' check (email = '' or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  whatsapp text not null default '' check (char_length(whatsapp) <= 40),
  website text not null default '' check (website = '' or website ~* '^https?://'),
  address text not null default '' check (char_length(address) <= 180),
  city text not null default '' check (char_length(city) <= 80),
  country text not null default '' check (char_length(country) <= 80),
  show_phone boolean not null default false,
  show_email boolean not null default false,
  show_whatsapp boolean not null default false,
  show_website boolean not null default false,
  show_address boolean not null default false,
  show_bio boolean not null default true,
  show_city boolean not null default true,
  theme text not null default 'professional' check (theme in ('professional', 'minimal', 'executive', 'technological')),
  primary_color text not null default '#0866ff' check (primary_color ~ '^#[0-9a-fA-F]{6}$'),
  accent_color text not null default '#00d9ff' check (accent_color ~ '^#[0-9a-fA-F]{6}$'),
  button_style text not null default 'rounded' check (button_style in ('rounded', 'square', 'outline')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('linkedin', 'instagram', 'facebook', 'youtube', 'x', 'github', 'tiktok', 'telegram', 'behance', 'dribbble', 'whatsapp', 'website')),
  url text not null check (url ~* '^(https?|mailto|tel):'),
  position integer not null check (position > 0),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, platform)
);

create table if not exists public.custom_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  url text not null check (url ~* '^(https?|mailto|tel):'),
  icon text not null default 'link' check (char_length(icon) <= 40),
  position integer not null check (position > 0),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nfc_cards (
  id uuid primary key default gen_random_uuid(),
  card_code text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE', 'ASSIGNED', 'BLOCKED', 'DISABLED')),
  programmed_at timestamptz,
  assigned_at timestamptz,
  last_read_at timestamptz,
  total_reads integer not null default 0 check (total_reads >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.received_contacts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null check (char_length(first_name) <= 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  company text not null default '' check (char_length(company) <= 160),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text not null default '' check (char_length(phone) <= 40),
  source text not null check (source in ('NFC', 'QR', 'PUBLIC_PROFILE', 'WHATSAPP', 'OTHER')),
  privacy_accepted boolean not null default false,
  privacy_accepted_at timestamptz,
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'RESPONDED', 'SAVED', 'ARCHIVED')),
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('USER', 'ADMIN')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) <= 120),
  resource_type text not null check (char_length(resource_type) <= 80),
  resource_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_profiles_public_code on public.profiles(public_code);
create index if not exists idx_social_links_profile_position on public.social_links(profile_id, position);
create index if not exists idx_custom_links_profile_position on public.custom_links(profile_id, position);
create index if not exists idx_nfc_cards_profile_id on public.nfc_cards(profile_id);
create index if not exists idx_received_contacts_profile_created_at on public.received_contacts(profile_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_social_links_updated_at on public.social_links;
create trigger touch_social_links_updated_at before update on public.social_links
for each row execute function public.touch_updated_at();

drop trigger if exists touch_custom_links_updated_at on public.custom_links;
create trigger touch_custom_links_updated_at before update on public.custom_links
for each row execute function public.touch_updated_at();

drop trigger if exists touch_nfc_cards_updated_at on public.nfc_cards;
create trigger touch_nfc_cards_updated_at before update on public.nfc_cards
for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'ADMIN'
  );
$$;

alter table public.profiles enable row level security;
alter table public.social_links enable row level security;
alter table public.custom_links enable row level security;
alter table public.nfc_cards enable row level security;
alter table public.received_contacts enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_log enable row level security;

create policy "owners can read own profile" on public.profiles
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "owners can update own profile" on public.profiles
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "admins can manage profiles" on public.profiles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "owners can manage own social links" on public.social_links
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = social_links.profile_id and p.user_id = auth.uid()) or public.is_admin())
with check (exists (select 1 from public.profiles p where p.id = social_links.profile_id and p.user_id = auth.uid()) or public.is_admin());

create policy "owners can manage own custom links" on public.custom_links
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = custom_links.profile_id and p.user_id = auth.uid()) or public.is_admin())
with check (exists (select 1 from public.profiles p where p.id = custom_links.profile_id and p.user_id = auth.uid()) or public.is_admin());

create policy "owners can read assigned nfc card" on public.nfc_cards
for select to authenticated
using (exists (select 1 from public.profiles p where p.id = nfc_cards.profile_id and p.user_id = auth.uid()) or public.is_admin());

create policy "admins can manage nfc cards" on public.nfc_cards
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "owners can read own received contacts" on public.received_contacts
for select to authenticated
using (exists (select 1 from public.profiles p where p.id = received_contacts.profile_id and p.user_id = auth.uid()) or public.is_admin());

create policy "public can create accepted received contacts" on public.received_contacts
for insert to anon, authenticated
with check (privacy_accepted = true and privacy_accepted_at is not null);

create policy "owners can update own contact status" on public.received_contacts
for update to authenticated
using (exists (select 1 from public.profiles p where p.id = received_contacts.profile_id and p.user_id = auth.uid()) or public.is_admin())
with check (exists (select 1 from public.profiles p where p.id = received_contacts.profile_id and p.user_id = auth.uid()) or public.is_admin());

create policy "admins can read roles" on public.user_roles
for select to authenticated
using (public.is_admin() or user_id = auth.uid());

create policy "admins can manage roles" on public.user_roles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read audit log" on public.audit_log
for select to authenticated
using (public.is_admin());

create policy "admins can create audit log" on public.audit_log
for insert to authenticated
with check (public.is_admin());

create or replace function public.get_public_profile(requested_public_code text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'publicCode', p.public_code,
    'firstName', p.first_name,
    'lastName', p.last_name,
    'jobTitle', p.job_title,
    'companyName', p.company_name,
    'profilePhotoPath', p.profile_photo_path,
    'coverImagePath', p.cover_image_path,
    'phone', case when p.show_phone then p.phone else null end,
    'email', case when p.show_email then p.email else null end,
    'whatsapp', case when p.show_whatsapp then p.whatsapp else null end,
    'website', case when p.show_website then p.website else null end,
    'address', case when p.show_address then p.address else null end,
    'city', case when p.show_city then p.city else null end,
    'bio', case when p.show_bio then p.bio else null end,
    'theme', p.theme,
    'primaryColor', p.primary_color,
    'accentColor', p.accent_color,
    'buttonStyle', p.button_style,
    'socialLinks', coalesce((
      select jsonb_agg(jsonb_build_object('platform', s.platform, 'url', s.url, 'position', s.position) order by s.position)
      from public.social_links s
      where s.profile_id = p.id and s.is_visible = true
    ), '[]'::jsonb),
    'customLinks', coalesce((
      select jsonb_agg(jsonb_build_object('title', c.title, 'url', c.url, 'icon', c.icon, 'position', c.position) order by c.position)
      from public.custom_links c
      where c.profile_id = p.id and c.is_visible = true
    ), '[]'::jsonb)
  )
  from public.profiles p
  where p.public_code = requested_public_code
    and p.is_active = true;
$$;

grant execute on function public.get_public_profile(text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-assets', 'profile-assets', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "owners can read own profile assets" on storage.objects
for select to authenticated
using (bucket_id = 'profile-assets' and owner = auth.uid());

create policy "owners can upload own profile assets" on storage.objects
for insert to authenticated
with check (bucket_id = 'profile-assets' and owner = auth.uid());

create policy "owners can update own profile assets" on storage.objects
for update to authenticated
using (bucket_id = 'profile-assets' and owner = auth.uid())
with check (bucket_id = 'profile-assets' and owner = auth.uid());

create policy "owners can delete own profile assets" on storage.objects
for delete to authenticated
using (bucket_id = 'profile-assets' and owner = auth.uid());
