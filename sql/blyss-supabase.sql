create table if not exists public.blyss_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  order_date timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  shipping_address text not null,
  fit_type text not null,
  standard_size text,
  bust numeric,
  under_bust numeric,
  waist numeric,
  shoulder numeric,
  armhole numeric,
  blouse_length numeric,
  sleeve_length numeric,
  sleeve_round numeric,
  front_neck text not null,
  back_neck text not null,
  sleeves text not null,
  lining text not null,
  padding text not null,
  fabric_type text not null,
  fabric_name text,
  reference_image text,
  special_instructions text,
  quantity integer not null default 1,
  stitching_price numeric not null default 4800,
  fabric_price numeric not null default 0,
  shipping_fee numeric not null default 0,
  total_amount numeric not null default 4800,
  currency text not null default 'INR',
  payment_status text not null default 'Pending',
  order_status text not null default 'Order Received',
  estimated_delivery date,
  tracking_number text,
  payment_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blyss_orders enable row level security;

drop policy if exists "Allow public order inserts" on public.blyss_orders;
create policy "Allow public order inserts"
  on public.blyss_orders for insert
  to anon, authenticated
  with check (true);