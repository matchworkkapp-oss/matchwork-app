-- ============================================================
--  MatchWork — Schema inicial
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
--  ENUMS
-- ─────────────────────────────────────────────────────────────
create type user_role      as enum ('candidate', 'recruiter');
create type search_status  as enum ('active', 'open', 'passive');
create type work_mode      as enum ('remote', 'hybrid', 'onsite');
create type skill_level    as enum ('basic', 'intermediate', 'advanced', 'expert');
create type company_size   as enum ('startup', 'small', 'medium', 'large');
create type swipe_dir      as enum ('like', 'pass');

-- ─────────────────────────────────────────────────────────────
--  PROFILES  (uno por usuario, vinculado a auth.users)
-- ─────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null,
  full_name   text not null default '',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
--  CANDIDATE PROFILES
-- ─────────────────────────────────────────────────────────────
create table candidate_profiles (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null unique references profiles(id) on delete cascade,
  headline                text,
  bio                     text,
  location                text,
  availability            text,
  work_mode               work_mode,
  salary_min              integer,
  salary_max              integer,
  salary_currency         text not null default 'USD',
  search_status           search_status not null default 'active',
  video_url               text,
  super_matches_remaining integer not null default 3,
  profile_completion      integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
--  COMPANY PROFILES
-- ─────────────────────────────────────────────────────────────
create table company_profiles (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null unique references profiles(id) on delete cascade,
  company_name            text not null default '',
  about                   text,
  industry                text,
  size                    company_size,
  location                text,
  website                 text,
  logo_url                text,
  verified                boolean not null default false,
  super_matches_remaining integer not null default 3,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
--  SKILLS
-- ─────────────────────────────────────────────────────────────
create table skills (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  category    text,
  created_at  timestamptz not null default now()
);

create table candidate_skills (
  id           uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references candidate_profiles(id) on delete cascade,
  skill_id     uuid not null references skills(id) on delete cascade,
  level        skill_level not null default 'intermediate',
  created_at   timestamptz not null default now(),
  unique(candidate_id, skill_id)
);

-- ─────────────────────────────────────────────────────────────
--  JOB POSTS
-- ─────────────────────────────────────────────────────────────
create table job_posts (
  id               uuid primary key default uuid_generate_v4(),
  company_id       uuid not null references company_profiles(id) on delete cascade,
  title            text not null,
  description      text,
  requirements     text[] not null default '{}',
  work_mode        work_mode not null default 'remote',
  location         text,
  salary_min       integer,
  salary_max       integer,
  salary_currency  text not null default 'USD',
  contract_type    text,
  industry         text,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table job_skills (
  id        uuid primary key default uuid_generate_v4(),
  job_id    uuid not null references job_posts(id) on delete cascade,
  skill_id  uuid not null references skills(id) on delete cascade,
  weight    integer not null default 10 check (weight between 1 and 100),
  required  boolean not null default true,
  unique(job_id, skill_id)
);

-- ─────────────────────────────────────────────────────────────
--  SWIPES
-- ─────────────────────────────────────────────────────────────
create table swipes (
  id          uuid primary key default uuid_generate_v4(),
  swiper_id   uuid not null references profiles(id) on delete cascade,
  target_id   uuid not null,   -- job_id o candidate_id según el rol
  direction   swipe_dir not null,
  is_super    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique(swiper_id, target_id)
);

-- ─────────────────────────────────────────────────────────────
--  MATCHES
-- ─────────────────────────────────────────────────────────────
create table matches (
  id            uuid primary key default uuid_generate_v4(),
  candidate_id  uuid not null references candidate_profiles(id) on delete cascade,
  job_id        uuid not null references job_posts(id) on delete cascade,
  company_id    uuid not null references company_profiles(id) on delete cascade,
  match_score   integer not null default 0 check (match_score between 0 and 100),
  created_at    timestamptz not null default now(),
  unique(candidate_id, job_id)
);

-- ─────────────────────────────────────────────────────────────
--  MESSAGES
-- ─────────────────────────────────────────────────────────────
create table messages (
  id          uuid primary key default uuid_generate_v4(),
  match_id    uuid not null references matches(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete cascade,
  content     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
--  ÍNDICES para performance
-- ─────────────────────────────────────────────────────────────
create index on candidate_profiles(user_id);
create index on company_profiles(user_id);
create index on candidate_skills(candidate_id);
create index on job_skills(job_id);
create index on swipes(swiper_id);
create index on swipes(target_id);
create index on matches(candidate_id);
create index on matches(job_id);
create index on messages(match_id);
create index on messages(sender_id);

-- ─────────────────────────────────────────────────────────────
--  TRIGGER: updated_at automático
-- ─────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_candidate_profiles_updated_at
  before update on candidate_profiles
  for each row execute function set_updated_at();

create trigger trg_company_profiles_updated_at
  before update on company_profiles
  for each row execute function set_updated_at();

create trigger trg_job_posts_updated_at
  before update on job_posts
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
--  TRIGGER: crear profile automáticamente al registrarse
-- ─────────────────────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'candidate'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────────
--  ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
alter table profiles           enable row level security;
alter table candidate_profiles enable row level security;
alter table company_profiles   enable row level security;
alter table skills             enable row level security;
alter table candidate_skills   enable row level security;
alter table job_posts          enable row level security;
alter table job_skills         enable row level security;
alter table swipes             enable row level security;
alter table matches            enable row level security;
alter table messages           enable row level security;

-- profiles: cada uno ve y edita solo el suyo
create policy "profiles: ver propio" on profiles
  for select using (auth.uid() = id);
create policy "profiles: editar propio" on profiles
  for update using (auth.uid() = id);

-- candidate_profiles
create policy "candidate_profiles: ver propio" on candidate_profiles
  for select using (auth.uid() = user_id);
create policy "candidate_profiles: insertar propio" on candidate_profiles
  for insert with check (auth.uid() = user_id);
create policy "candidate_profiles: editar propio" on candidate_profiles
  for update using (auth.uid() = user_id);

-- company_profiles
create policy "company_profiles: ver propio" on company_profiles
  for select using (auth.uid() = user_id);
create policy "company_profiles: insertar propio" on company_profiles
  for insert with check (auth.uid() = user_id);
create policy "company_profiles: editar propio" on company_profiles
  for update using (auth.uid() = user_id);

-- skills: públicas para todos (lectura)
create policy "skills: lectura pública" on skills
  for select using (true);

-- candidate_skills
create policy "candidate_skills: ver propio" on candidate_skills
  for select using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_id and cp.user_id = auth.uid()
    )
  );
create policy "candidate_skills: gestionar propio" on candidate_skills
  for all using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_id and cp.user_id = auth.uid()
    )
  );

-- job_posts: todos los autenticados pueden ver activas; solo el dueño edita
create policy "job_posts: ver activas" on job_posts
  for select using (active = true or
    exists (
      select 1 from company_profiles cp
      where cp.id = company_id and cp.user_id = auth.uid()
    )
  );
create policy "job_posts: gestionar propio" on job_posts
  for all using (
    exists (
      select 1 from company_profiles cp
      where cp.id = company_id and cp.user_id = auth.uid()
    )
  );

-- job_skills: públicas para lectura
create policy "job_skills: lectura pública" on job_skills
  for select using (true);
create policy "job_skills: gestionar propio" on job_skills
  for all using (
    exists (
      select 1 from job_posts jp
      join company_profiles cp on cp.id = jp.company_id
      where jp.id = job_id and cp.user_id = auth.uid()
    )
  );

-- swipes: solo el dueño ve y crea los suyos
create policy "swipes: gestionar propio" on swipes
  for all using (auth.uid() = swiper_id);

-- matches: pueden ver los dos lados del match
create policy "matches: ver propios" on matches
  for select using (
    exists (select 1 from candidate_profiles cp where cp.id = candidate_id and cp.user_id = auth.uid())
    or
    exists (select 1 from company_profiles co where co.id = company_id and co.user_id = auth.uid())
  );

-- messages: pueden ver y escribir los dos lados del match
create policy "messages: ver en match propio" on messages
  for select using (
    exists (
      select 1 from matches m
      join candidate_profiles cp on cp.id = m.candidate_id
      join company_profiles co on co.id = m.company_id
      where m.id = match_id
        and (cp.user_id = auth.uid() or co.user_id = auth.uid())
    )
  );
create policy "messages: enviar en match propio" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches m
      join candidate_profiles cp on cp.id = m.candidate_id
      join company_profiles co on co.id = m.company_id
      where m.id = match_id
        and (cp.user_id = auth.uid() or co.user_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────
--  SKILLS base (seed)
-- ─────────────────────────────────────────────────────────────
insert into skills (name, category) values
  ('JavaScript', 'Programación'),
  ('TypeScript', 'Programación'),
  ('Python', 'Programación'),
  ('Java', 'Programación'),
  ('Go', 'Programación'),
  ('Rust', 'Programación'),
  ('C#', 'Programación'),
  ('PHP', 'Programación'),
  ('Ruby', 'Programación'),
  ('Swift', 'Programación'),
  ('Kotlin', 'Programación'),
  ('React', 'Frontend'),
  ('Next.js', 'Frontend'),
  ('Vue.js', 'Frontend'),
  ('Angular', 'Frontend'),
  ('React Native', 'Mobile'),
  ('Flutter', 'Mobile'),
  ('Node.js', 'Backend'),
  ('Express', 'Backend'),
  ('FastAPI', 'Backend'),
  ('Django', 'Backend'),
  ('PostgreSQL', 'Base de datos'),
  ('MySQL', 'Base de datos'),
  ('MongoDB', 'Base de datos'),
  ('Redis', 'Base de datos'),
  ('SQL', 'Base de datos'),
  ('AWS', 'Cloud'),
  ('GCP', 'Cloud'),
  ('Azure', 'Cloud'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('Terraform', 'DevOps'),
  ('Linux', 'DevOps'),
  ('Git', 'DevOps'),
  ('CI/CD', 'DevOps'),
  ('Airflow', 'Data'),
  ('dbt', 'Data'),
  ('Spark', 'Data'),
  ('Kafka', 'Data'),
  ('ETL', 'Data'),
  ('Power BI', 'Data'),
  ('Tableau', 'Data'),
  ('Figma', 'Diseño'),
  ('UX/UI', 'Diseño'),
  ('Scrum', 'Management'),
  ('Product Management', 'Management'),
  ('Liderazgo', 'Soft skills'),
  ('Comunicación', 'Soft skills'),
  ('Inglés', 'Idiomas'),
  ('Portugués', 'Idiomas');
