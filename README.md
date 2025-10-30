## MobiVersite - Setup Guide (Supabase Backend)

This project uses Supabase (Postgres + REST) instead of a local JSON server. Follow this guide to provision the database schema, configure environment variables, and run the app locally.

### 1) Prerequisites
- Node.js 18+
- A Supabase project (Dashboard access)

### 2) Environment Variables
Create a `.env.local` file in the project root with your Supabase credentials. You can find these under Project Settings → API.

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_REST_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Notes:
- The REST URL typically looks like: `https://<project-ref>.supabase.co`
- These keys are used by the frontend to call Supabase REST endpoints via PostgREST.

### 3) Database Schema (Run in Supabase SQL editor)
Paste and run the following SQL to create all required tables and minimal indexes. This schema matches the application’s code exactly.

```sql
-- Drop existing tables (safe for re-creation; remove if you want to keep data)
drop table if exists public.cart cascade;
drop table if exists public.wishlist cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.users cascade;

-- Users
create table public.users (
  name text primary key,
  pass text not null
);

-- Products
create table public.products (
  id bigserial primary key,
  title text not null,
  price float8 not null,
  description text,
  category text,
  image text
);

-- Cart (per-user product entries)
create table public.cart (
  id bigserial primary key,
  product_id int8 not null references public.products(id) on delete cascade,
  user_name text not null references public.users(name) on delete cascade,
  quantity int4 not null default 1
);
create index if not exists idx_cart_user on public.cart(user_name);
create index if not exists idx_cart_user_product on public.cart(user_name, product_id);

-- Wishlist (per-user product entries)
create table public.wishlist (
  id bigserial primary key,
  product_id int8 not null references public.products(id) on delete cascade,
  user_name text not null references public.users(name) on delete cascade
);
create index if not exists idx_wishlist_user on public.wishlist(user_name);

-- Orders (stores purchased items as JSON list)
create table public.orders (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  user_name text references public.users(name),
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  status text not null default 'completed'
);
create index if not exists idx_orders_user on public.orders(user_name);

-- Optional sample seed data -----------------------------------------------
insert into public.users(name, pass) values
  ('demo', 'demo')
on conflict (name) do nothing;

insert into public.products(title, price, description, category, image) values
  ('Sample Product 1', 29.99, 'Description 1', 'category-a', 'https://via.placeholder.com/300'),
  ('Sample Product 2', 19.99, 'Description 2', 'category-b', 'https://via.placeholder.com/300')
on conflict do nothing;
```

### 4) Row Level Security (RLS) Policies
For demos, you can enable permissive policies. Adjust to your security needs.

```sql
alter table public.products enable row level security;
alter table public.users enable row level security;
alter table public.cart enable row level security;
alter table public.wishlist enable row level security;
alter table public.orders enable row level security;

-- Products (read-only for everyone)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_select_all'
  ) then
    create policy products_select_all on public.products for select using (true);
  end if;
end$$;

-- Users (read allowed for demo; tighten in production)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='users' and policyname='users_select_all'
  ) then
    create policy users_select_all on public.users for select using (true);
  end if;
end$$;

-- Cart
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='cart' and policyname='cart_select_all'
  ) then
    create policy cart_select_all on public.cart for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='cart' and policyname='cart_insert_all'
  ) then
    create policy cart_insert_all on public.cart for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='cart' and policyname='cart_update_all'
  ) then
    create policy cart_update_all on public.cart for update using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='cart' and policyname='cart_delete_all'
  ) then
    create policy cart_delete_all on public.cart for delete using (true);
  end if;
end$$;

-- Wishlist
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='wishlist' and policyname='wishlist_select_all'
  ) then
    create policy wishlist_select_all on public.wishlist for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='wishlist' and policyname='wishlist_insert_all'
  ) then
    create policy wishlist_insert_all on public.wishlist for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='wishlist' and policyname='wishlist_delete_all'
  ) then
    create policy wishlist_delete_all on public.wishlist for delete using (true);
  end if;
end$$;

-- Orders
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='orders' and policyname='orders_select_all'
  ) then
    create policy orders_select_all on public.orders for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='orders' and policyname='orders_insert_all'
  ) then
    create policy orders_insert_all on public.orders for insert with check (true);
  end if;
end$$;
```

Production-grade apps should restrict these policies to the authenticated user. For the case assessment, permissive rules keep the focus on features.

### 5) Install and Run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### 6) How Orders Work
- Cart items are stored per user in `cart`.
- On checkout, the app writes one row to `orders` with `items` as a JSONB list and `total` amount, then clears the user’s cart both in Supabase and UI state.
- The Profile page fetches orders by `user_name` and shows a collapsible item list per order.

### 7) API Endpoints Used (Supabase REST)
- `GET /rest/v1/products` → product listing
- `GET /rest/v1/cart?user_name=eq.<name>`; `POST /rest/v1/cart`; `DELETE /rest/v1/cart` with filters
- `GET /rest/v1/wishlist?user_name=eq.<name>`; `POST /rest/v1/wishlist`; `DELETE /rest/v1/wishlist`
- `POST /rest/v1/orders`; `GET /rest/v1/orders?user_name=eq.<name>`

Headers (handled in code):
```http
apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>
Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>
Content-Type: application/json
Prefer: return=representation
```

That’s all you need to run the project with Supabase as the backend datastore.
