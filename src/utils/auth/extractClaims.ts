import type { JwtEnvelope, UserClaims } from "@/types/UserClaims";

function b64urlToString(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

function isUserClaims(v: unknown): v is UserClaims {
  if (!v || typeof v !== "object") return false;
  const c = v as UserClaims;
  const rolesOk =
    Array.isArray(c.roles) &&
    c.roles.every(
      (r) =>
        r &&
        (r.role === "VISITANT" ||
          r.role === "MEMBER" ||
          r.role === "LEADER" ||
          r.role === "ADMIN") &&
        (r.scope_type === "ORG" || r.scope_type === "DEPARTMENT" || r.scope_type === "CELL")
    );
  return (
    typeof c.app_user_id === "string" &&
    typeof c.public_code === "string" &&
    typeof c.app_meta_version === "number" &&
    rolesOk
  );
}

export function decodeJwt<T = unknown>(token: string): T | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = b64urlToString(parts[1]);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function extractClaimsFromJwt(token: string): UserClaims | null {
  const decoded = decodeJwt<JwtEnvelope>(token);
  const claims = decoded?.claims;
  if (!claims) return null;

  const raw = claims as { public_code: string | number };

  if (typeof raw.public_code === "number") {
    raw.public_code = String(raw.public_code);
  }

  return isUserClaims(claims) ? claims : null;
}