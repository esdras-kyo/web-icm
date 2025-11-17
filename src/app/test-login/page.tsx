import TestLoginClient from "./test-login-client";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const toRaw = Array.isArray(sp.to) ? sp.to[0] : sp.to;
  const toParam = toRaw ?? "/";

  return <TestLoginClient toParam={toParam} />;
}