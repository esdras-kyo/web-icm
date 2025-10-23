"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import type { JwtEnvelope, UserClaims } from "@/types/UserClaims";

function decodeJwt<T = any>(jwt: string): T | null {
    try {
      const base64Url = jwt.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  export function useUserClaims(template: string = "member_jwt") {
    const { isSignedIn, getToken } = useAuth();
    const [claims, setClaims] = useState<UserClaims | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      let cancelled = false;
  
      const fetchClaims = async () => {
        try {
          if (!isSignedIn) return;
          const jwt = await getToken({ template, skipCache: true });
          if (!jwt) return;
  
          const payload = decodeJwt<JwtEnvelope>(jwt);
          console.log("payload:", payload); 
          if (!cancelled) {
            setClaims(payload?.claims ?? null); // 👈 pega de payload.claims
          }
        } catch (err) {
          console.error("Erro ao decodificar claims:", err);
          if (!cancelled) setClaims(null);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
  
      fetchClaims();
      return () => {
        cancelled = true;
      };
    }, [isSignedIn, getToken, template]);
  
    return { claims, loading };
  }