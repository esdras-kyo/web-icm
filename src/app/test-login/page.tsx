'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function isSafeInternal(url: string) {
  try { new URL(url); return false; } catch { return url.startsWith('/'); }
}

export default function TestLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const toParam = sp.get('to') ?? '/';

  const safeTo = useMemo(() => {
    let t = toParam;
    try { t = decodeURIComponent(t); } catch {}
    if (!isSafeInternal(t)) return '/';
    const onlyPath = t.split('?')[0];
    if (onlyPath === '/test-login') return '/';
    return t;
  }, [toParam]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/mock-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      // cookie HttpOnly já foi setado pelo servidor
      router.replace(safeTo);
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = async () => {
    // limpa o cookie HttpOnly no server (pode criar um /api/mock-logout se quiser)
    document.cookie = `mock_auth=; path=/; max-age=0`; // fallback client-side
    router.replace('/');
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Mock Login</h1>
      <p className="text-sm text-white/70 text-center">
        Destino após login: <code>{safeTo}</code>
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-white/70">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full rounded-lg px-3 py-2 bg-white/10 text-white ring-1 ring-white/20 focus:outline-none focus:ring-white/40"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/70">Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg px-3 py-2 bg-white/10 text-white ring-1 ring-white/20 focus:outline-none focus:ring-white/40"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/20 cursor-pointer hover:bg-white/20"
        >
          Entrar
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/20 cursor-pointer hover:bg-white/20"
      >
        Sair (mock)
      </button>
    </main>
  );
}