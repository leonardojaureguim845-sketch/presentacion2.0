-- Esquema opcional para recibir solicitudes del formulario de contratación.
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase.

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  request_type text,
  description text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

-- Permitir que el frontend anónimo inserte solicitudes.
drop policy if exists "anon can insert contact requests" on public.contact_requests;
create policy "anon can insert contact requests"
  on public.contact_requests
  for insert
  to anon
  with check (true);

-- No se otorga SELECT al rol anon: las solicitudes no son públicas.
-- La lectura se realiza desde el panel de Supabase o con una función protegida.
