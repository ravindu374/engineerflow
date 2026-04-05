import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects() {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/v1/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // handle unauthorized
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  // handle other errors
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}