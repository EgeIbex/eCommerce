import { NextResponse } from 'next/server';

// Basit JWT benzeri token üretimi (HS256 benzeri imza ile)
// Kriptografik olarak güçlü değildir; demo amaçlıdır.
import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'dev-secret';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(data) {
  return base64url(
    crypto
      .createHmac('sha256', SECRET)
      .update(data)
      .digest()
  );
}

function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const signature = sign(`${encHeader}.${encPayload}`);
  return `${encHeader}.${encPayload}.${signature}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    // Supabase üzerinden users tablosunda doğrula
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // Şema: users(name, pass). Sadece bu kolonlara göre doğrula.
    const params = new URLSearchParams();
    params.set('select', '*');
    params.set('limit', '1');
    // name=eq.<u>&pass=eq.<p>
    if (username) params.append('name', `eq.${username}`);
    if (password) params.append('pass', `eq.${password}`);
    const url = `${SUPABASE_URL}/rest/v1/users?${params.toString()}`;

    const supabaseRes = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!supabaseRes.ok) {
      const text = await supabaseRes.text();
      return NextResponse.json({ error: 'Auth servisi hatası', detail: text }, { status: 500 });
    }

    const rows = await supabaseRes.json();
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!user) {
      return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
    }

    // 30 dakikalık son kullanma
    const exp = Math.floor(Date.now() / 1000) + 30 * 60;
    const payload = { sub: user.id, username: user.username, email: user.email, exp };
    const token = createToken(payload);

    const res = NextResponse.json({
      user: { id: user.id ?? null, name: user.name, email: user.email ?? null, username: user.name },
      expiresAt: exp,
    });

    // HttpOnly cookie
    res.cookies.set('auth-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30,
      path: '/',
    });

    // Görsel kullanım için kullanıcı verisini (HttpOnly değil) opsiyonel set etmek istemiyorsak döndürmek yeterli
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


