export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("token");

  if (!raw) return null;

  return raw.replace(/^"(.*)"$/, "$1");
}