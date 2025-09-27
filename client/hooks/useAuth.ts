import { useCallback, useEffect, useState } from "react";
import type { ProfileInput } from "@shared/api";

const PROFILE_KEY = "homeguard_profile";
const LOGGED_IN_KEY = "homeguard_logged_in";

export function getStoredProfile(): ProfileInput | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ProfileInput) : null;
  } catch {
    return null;
  }
}

export function setLoggedIn(v: boolean) {
  localStorage.setItem(LOGGED_IN_KEY, v ? "true" : "false");
}

export function isLoggedIn() {
  return localStorage.getItem(LOGGED_IN_KEY) === "true";
}

export function logout() {
  localStorage.removeItem(LOGGED_IN_KEY);
}

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(isLoggedIn());

  useEffect(() => {
    const handler = () => setAuthed(isLoggedIn());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback((identifier: string, password: string) => {
    const p = getStoredProfile();
    if (!p) return false;
    const idMatch = [p.email?.trim().toLowerCase(), p.phone?.replace(/\D/g, "")]
      .filter(Boolean)
      .some((v) => {
        const cleaned = identifier.trim().toLowerCase();
        if (cleaned.includes("@")) return cleaned === String(p.email).trim().toLowerCase();
        return cleaned.replace(/\D/g, "") === String(p.phone).replace(/\D/g, "");
      });
    const passMatch = p.password === password;
    if (idMatch && passMatch) {
      setLoggedIn(true);
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  return { authed, login, logout: () => { logout(); setAuthed(false); } };
}
