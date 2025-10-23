// src/types/UserClaims.ts
export type UserRole = {
    role: "VISITANT" | "MEMBER" | "LEADER" | "ADMIN";
    scope_type: "ORG" | "DEPARTMENT";
    department_id: string | null;
  };
  
  export type UserClaims = {
    app_user_id: string;
    public_code: string;
    app_meta_version: number;
    roles: UserRole[];
  };
  
  export type JwtEnvelope = {
    sub: string;
    iat?: number;
    exp?: number;
    iss?: string;
    claims?: UserClaims; // 👈 suas custom claims vêm aqui
  };